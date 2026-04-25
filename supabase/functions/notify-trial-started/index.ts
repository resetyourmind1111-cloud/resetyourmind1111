import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FROM = "Reset Your Mind 1111 <onboarding@resend.dev>";
const ADMIN_EMAIL = "resetyourmind1111@gmail.com";

const REASON_LABEL: Record<string, string> = {
  stuck: "I feel stuck and don't know why",
  sabotage: "I want to grow but keep self-sabotaging",
  relationships: "My relationships aren't reflecting my worth",
  levelup: "I'm ready to level up — I just need the tools",
};

function welcomeHtml(firstName: string) {
  const name = firstName || "friend";
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#06060e;font-family:Georgia,serif;color:#F9F6F0;">
  <div style="max-width:560px;margin:0 auto;padding:40px 28px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:11px;letter-spacing:3px;color:#C9A84C;text-transform:uppercase;">Reset Your Mind 1111&trade;</div>
    </div>
    <h1 style="font-size:28px;color:#C9A84C;margin:0 0 20px;text-align:center;font-weight:bold;">
      Welcome, ${name}.
    </h1>
    <p style="font-size:16px;line-height:1.7;color:#F9F6F0;opacity:.9;margin:0 0 18px;">
      Your 7-day preview of Reset Your Mind 1111&trade; just began.
    </p>
    <p style="font-size:15px;line-height:1.7;color:#F9F6F0;opacity:.8;margin:0 0 28px;">
      No pressure. No perfection. Just begin.
    </p>
    <div style="background:#1a0f3a;border-left:3px solid #C9A84C;padding:20px 22px;border-radius:8px;margin:0 0 28px;">
      <div style="font-size:11px;letter-spacing:2px;color:#C9A84C;text-transform:uppercase;margin-bottom:12px;">What's inside your 7 days</div>
      <ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.8;color:#F9F6F0;opacity:.9;">
        <li>Your Worth Thermostat&trade; assessment</li>
        <li>Days 1&ndash;3 of the 30-Day Experience</li>
        <li>3 guided meditations</li>
        <li>2 reset tools chosen for you</li>
        <li>A daily Permission Slip</li>
      </ul>
    </div>
    <div style="text-align:center;margin:32px 0;">
      <a href="https://resetyourmind1111.lovable.app/home"
         style="display:inline-block;background:#C9A84C;color:#06060e;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;font-family:Georgia,serif;">
        Open Day 1 &rarr;
      </a>
    </div>
    <p style="font-size:13px;line-height:1.6;color:#F9F6F0;opacity:.5;margin:32px 0 0;text-align:center;">
      Day 1 is waiting on your home screen. See you there.<br/>
      &mdash; Lorie
    </p>
  </div>
</body></html>`;
}

function adminHtml(firstName: string, email: string, reasonKey: string | null, primaryWound: string | null) {
  const reason = reasonKey ? (REASON_LABEL[reasonKey] || reasonKey) : "(not provided)";
  return `<!doctype html>
<html><body style="font-family:-apple-system,Helvetica,Arial,sans-serif;background:#fff;color:#111;padding:24px;">
  <div style="max-width:520px;margin:0 auto;border:1px solid #eee;border-radius:8px;padding:24px;">
    <div style="font-size:11px;letter-spacing:2px;color:#888;text-transform:uppercase;margin-bottom:8px;">New Trial Started</div>
    <h2 style="margin:0 0 16px;font-size:20px;">${firstName || "(no name)"} just started their 7-day trial</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:6px 0;color:#666;width:120px;">Name</td><td style="padding:6px 0;">${firstName || "&mdash;"}</td></tr>
      <tr><td style="padding:6px 0;color:#666;">Email</td><td style="padding:6px 0;"><a href="mailto:${email}">${email}</a></td></tr>
      <tr><td style="padding:6px 0;color:#666;">Reason</td><td style="padding:6px 0;">${reason}</td></tr>
      <tr><td style="padding:6px 0;color:#666;">Primary wound</td><td style="padding:6px 0;">${primaryWound || "&mdash;"}</td></tr>
      <tr><td style="padding:6px 0;color:#666;">Started at</td><td style="padding:6px 0;">${new Date().toUTCString()}</td></tr>
    </table>
  </div>
</body></html>`;
}

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
    const userId = userData.user.id;
    const userEmail = userData.user.email;

    const admin = createClient(supabaseUrl, serviceKey);

    const { data: profile } = await admin
      .from("profiles")
      .select("full_name, onboarding_reason, primary_wound, trial_start_date")
      .eq("user_id", userId)
      .single();

    const firstName = (profile?.full_name || "").split(" ")[0] || "";
    const reasonKey = (profile as any)?.onboarding_reason ?? null;
    const primaryWound = (profile as any)?.primary_wound ?? null;

    // Idempotency — only send once per user. We mark trial_start_date the first
    // time this fires; if it's already set we treat the welcome email as sent.
    const alreadySent = !!profile?.trial_start_date;

    const send = async (to: string, subject: string, html: string) => {
      const resp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from: FROM, to: [to], subject, html }),
      });
      if (!resp.ok) {
        const txt = await resp.text();
        console.error(`Resend failed for ${to}:`, resp.status, txt);
        return false;
      }
      return true;
    };

    const results = { welcome: false, admin: false, skipped: alreadySent };

    if (!alreadySent) {
      if (userEmail) {
        results.welcome = await send(
          userEmail,
          "Welcome to Reset Your Mind 1111™ — your 7 days begin now",
          welcomeHtml(firstName),
        );
      }
      results.admin = await send(
        ADMIN_EMAIL,
        `🌟 New trial: ${firstName || userEmail || "user"}`,
        adminHtml(firstName, userEmail || "(no email)", reasonKey, primaryWound),
      );

      // Mark trial start so we don't resend on retry
      await admin
        .from("profiles")
        .update({ trial_start_date: new Date().toISOString() } as any)
        .eq("user_id", userId)
        .is("trial_start_date", null);
    }

    return new Response(JSON.stringify({ status: "ok", ...results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("notify-trial-started error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
