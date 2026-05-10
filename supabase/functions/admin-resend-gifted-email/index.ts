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

// Admin-only. Resends Day 15 or Day 21 gifted milestone email to a chosen user.
// Body: { user_id: string, milestone: "day15" | "day21" }
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing auth" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY missing");

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid auth" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);

    const { data: callerProfile } = await admin
      .from("profiles").select("is_admin").eq("user_id", userData.user.id).single();
    if (!callerProfile?.is_admin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const userId = String(body.user_id || "");
    const milestone = body.milestone === "day21" ? "day21" : body.milestone === "day15" ? "day15" : null;
    if (!userId || !milestone) {
      return new Response(JSON.stringify({ error: "user_id and milestone (day15|day21) required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: profile, error: pErr } = await admin
      .from("profiles")
      .select("user_id, full_name, user_source, access_expires_at")
      .eq("user_id", userId)
      .single();
    if (pErr || !profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: targetUser } = await admin.auth.admin.getUserById(userId);
    const email = targetUser?.user?.email;
    if (!email) {
      return new Response(JSON.stringify({ error: "User has no email" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const expiresMs = profile.access_expires_at ? new Date(profile.access_expires_at).getTime() : Date.now();
    const dayMs = 1000 * 60 * 60 * 24;
    const daysRemaining = Math.max(0, Math.ceil((expiresMs - Date.now()) / dayMs));

    const firstName = (profile.full_name || "").split(" ")[0] || "friend";
    const subject = milestone === "day15"
      ? "You're halfway through ✨"
      : "Day 21 — your founding rate is waiting";
    const html = milestone === "day15"
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
      const text = await resp.text();
      console.error("Resend failure", milestone, userId, text);
      return new Response(JSON.stringify({ error: `Resend failed: ${text}` }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sentAt = new Date().toISOString();
    const updateField = milestone === "day15"
      ? { day15_email_sent_at: sentAt }
      : { day21_email_sent_at: sentAt };
    await admin.from("profiles").update(updateField).eq("user_id", userId);

    return new Response(JSON.stringify({ status: "ok", email, milestone, sent_at: sentAt }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("admin-resend-gifted-email error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
