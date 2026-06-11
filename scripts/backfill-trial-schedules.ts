/**
 * One-off admin script: backfill trial email schedules for users who signed up
 * before `enqueue-trial-emails` existed (or who bounced before it fired).
 *
 * SAFE BY DESIGN:
 *   - Dry-run by default. Pass --apply to actually write rows.
 *   - Skips any user who already has *any* row in notifications_schedule.
 *   - Skips paid users (subscription_tier != 'free').
 *   - Only enqueues *future* days — past days are silently skipped.
 *   - Never touches auth, profiles, subscription, or trial-status fields.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *     bun run scripts/backfill-trial-schedules.ts          # dry run
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *     bun run scripts/backfill-trial-schedules.ts --apply  # actually write
 */
import { createClient } from "@supabase/supabase-js";

const APPLY = process.argv.includes("--apply");
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.");
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_KEY);

// MUST match enqueue-trial-emails/index.ts curriculum exactly.
const CURRICULUM = [
  { title: "Day 1 — See yourself clearly",   body: "Before anything changes, you have to see where you are." },
  { title: "Day 2 — Name the pattern",       body: "Now we name what's been running the show." },
  { title: "Day 3 — Your first interrupt",   body: "Knowing the pattern is step one. This is step two." },
  { title: "Day 4 — Begin the journey",      body: "The daily practice starts today." },
  { title: "Day 5 — Go deeper",              body: "Patterns don't break in a day. You're right on time." },
  { title: "Day 6 — Notice what shifted",    body: "Six days ago you didn't know any of this." },
  { title: "Day 7 — Choose yourself",        body: "This is the last day of your preview. Make it count." },
];

async function main() {
  console.log(`Mode: ${APPLY ? "APPLY (writes will happen)" : "DRY RUN"}`);

  // 1. All free / trial-eligible profiles
  const { data: profiles, error: profErr } = await admin
    .from("profiles")
    .select("user_id, subscription_tier")
    .or("subscription_tier.is.null,subscription_tier.eq.free");
  if (profErr) throw profErr;
  console.log(`Found ${profiles?.length ?? 0} free/null-tier profiles.`);

  // 2. Filter to those with zero scheduled rows
  const candidates: { user_id: string; created_at: string }[] = [];
  for (const p of profiles ?? []) {
    const { count } = await admin
      .from("notifications_schedule")
      .select("id", { count: "exact", head: true })
      .eq("user_id", p.user_id);
    if ((count ?? 0) > 0) continue;

    const { data: u } = await admin.auth.admin.getUserById(p.user_id);
    if (!u?.user?.created_at) continue;
    candidates.push({ user_id: p.user_id, created_at: u.user.created_at });
  }
  console.log(`Backfill candidates: ${candidates.length}`);

  // 3. Build rows anchored to each user's signup date, future days only
  const now = Date.now();
  let totalRowsPlanned = 0;
  for (const c of candidates) {
    const start = new Date(c.created_at);
    const rows: Array<Record<string, unknown>> = [];

    CURRICULUM.forEach((cur, i) => {
      const sendAt = new Date(start);
      sendAt.setDate(sendAt.getDate() + i);
      sendAt.setUTCHours(15, 0, 0, 0);
      if (sendAt.getTime() <= now) return; // skip past days
      rows.push({
        user_id: c.user_id,
        day_number: i + 1,
        scheduled_time: sendAt.toISOString(),
        message_title: cur.title,
        message_body: cur.body,
        sent: false,
      });
    });

    // Day 2 morning nudge (day_number = 12), only if still future
    const day2morning = new Date(start);
    day2morning.setDate(day2morning.getDate() + 1);
    day2morning.setUTCHours(12, 0, 0, 0);
    if (day2morning.getTime() > now) {
      rows.push({
        user_id: c.user_id,
        day_number: 12,
        scheduled_time: day2morning.toISOString(),
        message_title: "A 5-minute nudge for your Day 2",
        message_body: "Day 2 is open in your app. Five minutes is all today asks.",
        sent: false,
      });
    }

    if (rows.length === 0) {
      console.log(`  • ${c.user_id}: all curriculum days in the past — skipping.`);
      continue;
    }
    totalRowsPlanned += rows.length;
    console.log(`  • ${c.user_id}: would insert ${rows.length} rows.`);

    if (APPLY) {
      const { error } = await admin.from("notifications_schedule").insert(rows);
      if (error) {
        console.error(`    ✗ insert failed for ${c.user_id}:`, error.message);
      } else {
        console.log(`    ✓ inserted.`);
      }
    }
  }

  console.log(`\nTotal rows ${APPLY ? "inserted" : "planned"}: ${totalRowsPlanned}`);
  if (!APPLY) console.log("Re-run with --apply to commit.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
