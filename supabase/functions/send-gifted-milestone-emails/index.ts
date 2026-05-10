import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FROM = "Reset Your Mind 1111 <onboarding@resend.dev>";
const APP_URL = "https://resetyourmind1111.lovable.app";
const BRAND_DARK = "#06060e";
const BRAND_GOLD = "#C9A84C";
const BRAND_CREAM = "#F9F6F0";

function shell(innerHtml: string, ctaText: string, ctaPath: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${BRAND_DARK};font-family:Georgia,serif;color:${BRAND_CREAM};">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND_DARK};padding:40px 16px;">
<tr><td align="center">
<table width="100%" style="max-width:560px;background:#0a0a14;border:1px solid rgba(201,168,76,0.2);border-radius:12px;padding:40px 32px;">
<tr><td>
<div style="text-align:center;font-size:13px;letter-spacing:3px;color:${BRAND_GOLD};margin-bottom:32px;">RESET YOUR MIND 1111&trade;</div>
${innerHtml}
<div style="text-align:center;margin:36px 0 8px;">
<a href="${APP_URL}${ctaPath}" style="display:inline-block;background:${BRAND_GOLD};color:${BRAND_DARK};text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-family:Arial,sans-serif;letter-spacing:0.5px;">${ctaText}</a>
</div>
<p style="text-align:center;font-size:12px;color:rgba(249,246,240,0.5);margin-top:32px;font-family:Arial,sans-serif;">
Reset Your Mind 1111&trade; &middot; <a href="${APP_URL}/account" style="color:rgba(249,246,240,0.5);">Notification settings</a>
</p>
</td></tr></table>
</td></tr></table></body></html>`;
}

function day15Html(firstName: string, daysRemaining: number): string {
  const inner = `
    <h1 style="font-family:Georgia,serif;font-size:28px;color:${BRAND_GOLD};text-align:center;margin:0 0 24px;">You're halfway through, ${firstName}.</h1>
    <p style="font-size:16px;line-height:1.7;color:${BRAND_CREAM};">Fifteen days in. Fifteen days remaining of your gifted access to Reset Your Mind 1111&trade;.</p>
    <p style="font-size:16px;line-height:1.7;color:${BRAND_CREAM};">Whatever shifted in the last two weeks &mdash; the resets, the tools, the small breakthroughs &mdash; that momentum is yours. The question now is whether you let it continue past day 30.</p>
    <p style="font-size:16px;line-height:1.7;color:${BRAND_CREAM};">Founding members lock in <strong style="color:${BRAND_GOLD};">$11 for the first month</strong>, then $44/month as long as they stay. No pressure &mdash; just an open door.</p>
    <p style="font-size:14px;line-height:1.6;color:rgba(249,246,240,0.7);font-style:italic;">${daysRemaining} day${daysRemaining === 1 ? "" : "s"} remaining in your gifted experience.</p>`;
  return shell(inner, "Continue for $11 →", "/upgrade");
}

function day21Html(firstName: string, daysRemaining: number): string {
  const inner = `
    <h1 style="font-family:Georgia,serif;font-size:28px;color:${BRAND_GOLD};text-align:center;margin:0 0 24px;">${firstName}, you've come further than you think.</h1>
    <p style="font-size:16px;line-height:1.7;color:${BRAND_CREAM};">Day 21 of 30. You're in the final stretch of your gifted access.</p>
    <p style="font-size:16px;line-height:1.7;color:${BRAND_CREAM};">By now you know what this work feels like in your body &mdash; the weight that lifts after a reset, the clarity that comes from a tool used at the right moment. That's the version of you we want to keep building.</p>
    <p style="font-size:16px;line-height:1.7;color:${BRAND_CREAM};">In ${daysRemaining} day${daysRemaining === 1 ? "" : "s"} your access pauses. Lock in your founding rate now &mdash; <strong style="color:${BRAND_GOLD};">$11 first month</strong>, then $44/month as long as you stay &mdash; and keep your momentum.</p>
    <p style="font-size:14px;line-height:1.6;color:rgba(249,246,240,0.7);font-style:italic;">Open your dashboard to see your full 30-day progress.</p>`;
  return shell(inner, "Continue My Journey — $11 →", "/upgrade");
}

interface ProfileRow {
  user_id: string;
  full_name: string | null;
  user_source: string | null;
  subscription_tier: string | null;
  access_expires_at: string | null;
  day15_email_sent_at: string | null;
  day21_email_sent_at: string | null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY missing");

    const admin = createClient(supabaseUrl, serviceKey);

    // Pull all gifted, free-tier, unexpired users who might be due
    const nowIso = new Date().toISOString();
    const { data: profiles, error } = await admin
      .from("profiles")
      .select(
        "user_id, full_name, user_source, subscription_tier, access_expires_at, day15_email_sent_at, day21_email_sent_at"
      )
      .eq("user_source", "gifted")
      .eq("subscription_tier", "free")
      .gt("access_expires_at", nowIso)
      .limit(500);

    if (error) throw error;
    if (!profiles || profiles.length === 0) {
      return new Response(JSON.stringify({ status: "no_due", sent: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let sent = 0, skipped = 0, failed = 0;
    const dayMs = 1000 * 60 * 60 * 24;

    for (const p of profiles as ProfileRow[]) {
      try {
        if (!p.access_expires_at) { skipped++; continue; }
        const msRemaining = new Date(p.access_expires_at).getTime() - Date.now();
        const daysRemaining = Math.max(0, Math.ceil(msRemaining / dayMs));
        const daysElapsed = 30 - daysRemaining;

        // Day 15 trigger: elapsed >= 15 and not yet sent
        // Day 21 trigger: elapsed >= 21 and not yet sent
        let template: "day15" | "day21" | null = null;
        if (daysElapsed >= 21 && !p.day21_email_sent_at) template = "day21";
        else if (daysElapsed >= 15 && !p.day15_email_sent_at) template = "day15";

        if (!template) { skipped++; continue; }

        const { data: userRes } = await admin.auth.admin.getUserById(p.user_id);
        const email = userRes?.user?.email;
        if (!email) { skipped++; continue; }

        const firstName = (p.full_name || "").split(" ")[0] || "friend";
        const subject = template === "day15"
          ? "You're halfway through ✨"
          : "Day 21 — your founding rate is waiting";
        const html = template === "day15"
          ? day15Html(firstName, daysRemaining)
          : day21Html(firstName, daysRemaining);

        const resp = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ from: FROM, to: [email], subject, html }),
        });

        if (!resp.ok) {
          failed++;
          console.error("Resend failure", template, p.user_id, await resp.text());
          continue;
        }

        const updateField = template === "day15"
          ? { day15_email_sent_at: new Date().toISOString() }
          : { day21_email_sent_at: new Date().toISOString() };
        await admin.from("profiles").update(updateField).eq("user_id", p.user_id);
        sent++;
      } catch (e) {
        failed++;
        console.error("Per-user error", p.user_id, e);
      }
    }

    return new Response(JSON.stringify({ status: "ok", sent, skipped, failed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
