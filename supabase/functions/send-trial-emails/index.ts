import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { TRIAL_EMAILS } from "../_shared/trial-emails.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FROM = "Reset Your Mind 1111 <onboarding@resend.dev>";

// Drains due trial emails. Triggered by pg_cron hourly.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY missing");

    const admin = createClient(supabaseUrl, serviceKey);

    // Pull all due, unsent rows (cap at 200 per run for safety)
    const nowIso = new Date().toISOString();
    // notifications_schedule is exclusively used for trial emails (days 1-7 + day 12 = Day 2 morning nudge).
    // The earlier `.like("message_body","trial_email_day_%")` filter never matched any rows because
    // enqueue-trial-emails writes human-readable copy, not a marker. Filter by day_number instead.
    const { data: due, error: dueErr } = await admin
      .from("notifications_schedule")
      .select("id, user_id, day_number, scheduled_time")
      .eq("sent", false)
      .lte("scheduled_time", nowIso)
      .in("day_number", [1, 2, 3, 4, 5, 6, 7, 8, 12])
      .limit(200);


    if (dueErr) throw dueErr;
    if (!due || due.length === 0) {
      return new Response(JSON.stringify({ status: "no_due" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let sent = 0, skipped = 0, failed = 0;

    for (const row of due) {
      try {
        // Get profile (email + name + reason). We need email from auth.users.
        const { data: profile } = await admin
          .from("profiles")
          .select("user_id, full_name, onboarding_reason, subscription_tier")
          .eq("user_id", row.user_id)
          .single();

        // If user upgraded out of free, skip remaining sends (mark sent so we don't retry)
        if (!profile || (profile.subscription_tier && profile.subscription_tier !== "free")) {
          await admin.from("notifications_schedule").update({ sent: true }).eq("id", row.id);
          skipped++;
          continue;
        }

        const { data: userRes } = await admin.auth.admin.getUserById(row.user_id);
        const email = userRes?.user?.email;
        if (!email) {
          await admin.from("notifications_schedule").update({ sent: true }).eq("id", row.id);
          skipped++;
          continue;
        }

        const tpl = TRIAL_EMAILS.find(t => t.day === row.day_number);
        if (!tpl) {
          await admin.from("notifications_schedule").update({ sent: true }).eq("id", row.id);
          skipped++;
          continue;
        }

        const firstName = (profile.full_name || "").split(" ")[0] || "friend";
        const html = tpl.html(firstName, profile.onboarding_reason ?? null);

        const resp = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: FROM,
            to: [email],
            subject: tpl.subject,
            html,
          }),
        });

        if (!resp.ok) {
          const txt = await resp.text();
          console.error(`Resend failed for ${email} day ${row.day_number}:`, resp.status, txt);
          failed++;
          continue;
        }

        await admin.from("notifications_schedule").update({ sent: true }).eq("id", row.id);
        sent++;
      } catch (rowErr) {
        console.error(`Row ${row.id} error:`, rowErr);
        failed++;
      }
    }

    return new Response(JSON.stringify({ status: "ok", sent, skipped, failed, total: due.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-trial-emails error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
