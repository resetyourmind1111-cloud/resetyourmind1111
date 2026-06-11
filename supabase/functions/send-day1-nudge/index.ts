// Day-1 no-activity nudge.
// Runs hourly via pg_cron. Finds free-tier users whose trial started 22-26h ago
// who have NOT yet activated (no daily_shifts / lessons / cards / slips / assessment).
// Sends one email and writes a sentinel row (day_number=11) to prevent re-sends.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { TRIAL_EMAILS } from "../_shared/trial-emails.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FROM = "Reset Your Mind 1111 <onboarding@resend.dev>";

const ACTIVATION_TABLES = [
  "daily_shifts",
  "lesson_completions",
  "card_pulls",
  "permission_slips_accepted",
  "assessment_results",
];

async function isActivated(admin: any, userId: string): Promise<boolean> {
  for (const table of ACTIVATION_TABLES) {
    const { count } = await admin
      .from(table)
      .select("user_id", { count: "exact", head: true })
      .eq("user_id", userId);
    if ((count ?? 0) > 0) return true;
  }
  return false;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY missing");

    const admin = createClient(supabaseUrl, serviceKey);

    // Window: trial started between 22 and 26 hours ago (loose for hourly cron drift)
    const now = Date.now();
    const windowStart = new Date(now - 26 * 60 * 60 * 1000).toISOString();
    const windowEnd = new Date(now - 22 * 60 * 60 * 1000).toISOString();

    const { data: users, error: usersErr } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (usersErr) throw usersErr;

    let sent = 0, skipped = 0, failed = 0;

    for (const u of users.users ?? []) {
      const created = u.created_at;
      if (!created) continue;
      if (created < windowStart || created > windowEnd) continue;

      // Idempotency: already nudged?
      const { count: already } = await admin
        .from("notifications_schedule")
        .select("id", { count: "exact", head: true })
        .eq("user_id", u.id)
        .eq("day_number", 11);
      if ((already ?? 0) > 0) { skipped++; continue; }

      // Skip paid users
      const { data: profile } = await admin
        .from("profiles")
        .select("subscription_tier, full_name")
        .eq("user_id", u.id)
        .single();
      if (profile?.subscription_tier && profile.subscription_tier !== "free") {
        skipped++; continue;
      }

      // Skip already-activated users
      if (await isActivated(admin, u.id)) { skipped++; continue; }

      const tpl = TRIAL_EMAILS.find((t) => t.day === 11);
      if (!tpl || !u.email) { skipped++; continue; }

      const firstName = (profile?.full_name || "").split(" ")[0] || "friend";
      const html = tpl.html(firstName, null);

      const resp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM,
          to: [u.email],
          subject: tpl.subject,
          html,
        }),
      });

      if (!resp.ok) {
        console.error(`day1-nudge failed for ${u.email}:`, resp.status, await resp.text());
        failed++;
        continue;
      }

      // Write sentinel
      await admin.from("notifications_schedule").insert({
        user_id: u.id,
        day_number: 11,
        scheduled_time: new Date().toISOString(),
        message_title: "Day 1 no-activity nudge",
        message_body: "sentinel — sent",
        sent: true,
      });
      sent++;
    }

    return new Response(JSON.stringify({ status: "ok", sent, skipped, failed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-day1-nudge error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
