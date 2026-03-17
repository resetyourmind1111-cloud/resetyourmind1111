import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const THERMOSTAT_DESCRIPTIONS: Record<string, { description: string; goodNews: string; whatYouNeed: string }> = {
  "The Settler": {
    description: "Your thermostat is set very low. You have been conditioned to accept crumbs when you deserve celebration. Recognition is the first step — and you just took it.",
    goodNews: "Your worth is not determined by your circumstances — it is your birthright.",
    whatYouNeed: "Radical permission to take up space, want things, and stop apologizing for your existence.",
  },
  "The Seeker": {
    description: "Your thermostat is set below what you deserve but you are aware something needs to change. You are searching for validation outside yourself.",
    goodNews: "You are in the perfect position for transformation.",
    whatYouNeed: "Boundary work, nervous system regulation and permission to choose yourself without guilt.",
  },
  "The Boundary Builder": {
    description: "Your thermostat is improving. You know your worth intellectually but embodying it fully is still a work in progress.",
    goodNews: "You are doing the work. Now fine-tune it.",
    whatYouNeed: "Shadow work, honest self-reflection and a community that holds you to your worth.",
  },
  "The Rising Queen / King": {
    description: "Your thermostat is set to celebration. You still have moments of doubt but they are becoming less frequent.",
    goodNews: "Your work now is to expand your capacity for receiving.",
    whatYouNeed: "Tools to expand visibility and step fully into leadership.",
  },
  "The Unapologetic": {
    description: "Your thermostat is set to FULL celebration. You demand what you deserve and accept nothing less.",
    goodNews: "You have done the work.",
    whatYouNeed: "Tools to expand your impact and help others raise their thermostats.",
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");

    const { firstName, email, thermostatType, totalScore, percentage, categoryScores } = await req.json();

    if (!firstName || !email || !thermostatType || totalScore == null) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const typeInfo = THERMOSTAT_DESCRIPTIONS[thermostatType] || THERMOSTAT_DESCRIPTIONS["The Settler"];

    // Build email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Georgia,'Times New Roman',serif;color:#e0e0e0;">
<div style="max-width:600px;margin:0 auto;padding:40px 24px;">
  <div style="text-align:center;margin-bottom:32px;">
    <p style="color:#D4AF37;font-size:14px;letter-spacing:3px;text-transform:uppercase;margin:0;">Reset Your Mind 1111™</p>
  </div>
  
  <p style="font-size:18px;line-height:1.6;">Hi ${firstName},</p>
  
  <p style="font-size:16px;line-height:1.8;">You just did something most people never do.</p>
  
  <p style="font-size:16px;line-height:1.8;">You looked honestly at where you are — in health, wealth, love and leadership — and you told the truth.</p>
  
  <p style="font-size:16px;line-height:1.8;">That takes courage. And it is the first act of choosing yourself.</p>
  
  <div style="background:#1a1a2e;border:1px solid #D4AF37;border-radius:12px;padding:24px;margin:32px 0;text-align:center;">
    <p style="color:#D4AF37;font-size:24px;font-weight:bold;margin:0 0 8px 0;">${thermostatType}</p>
    <p style="font-size:36px;font-weight:bold;color:#D4AF37;margin:0 0 8px 0;">${totalScore}/125 — ${percentage}%</p>
  </div>
  
  <div style="margin:24px 0;">
    <p style="font-size:16px;font-weight:bold;color:#D4AF37;margin-bottom:12px;">Your scores across 4 pillars:</p>
    <p style="margin:6px 0;font-size:15px;">✦ Love & Relationships (Love Pillar): ${categoryScores?.love || 0}/25</p>
    <p style="margin:6px 0;font-size:15px;">✦ Money & Abundance (Wealth Pillar): ${categoryScores?.money || 0}/25</p>
    <p style="margin:6px 0;font-size:15px;">✦ Career & Purpose (Wealth Pillar): ${categoryScores?.career || 0}/25</p>
    <p style="margin:6px 0;font-size:15px;">✦ Self-Care & Boundaries (Health Pillar): ${categoryScores?.boundaries || 0}/25</p>
    <p style="margin:6px 0;font-size:15px;">✦ Action & Manifestation (Leadership Pillar): ${categoryScores?.action || 0}/25</p>
  </div>
  
  <div style="margin:24px 0;">
    <p style="font-size:16px;line-height:1.8;">${typeInfo.description}</p>
    <p style="font-size:16px;line-height:1.8;"><strong style="color:#D4AF37;">Good News:</strong> ${typeInfo.goodNews}</p>
    <p style="font-size:16px;line-height:1.8;"><strong style="color:#D4AF37;">What You Need:</strong> ${typeInfo.whatYouNeed}</p>
  </div>
  
  <div style="background:#1a1a2e;border-radius:12px;padding:24px;margin:32px 0;">
    <p style="font-size:16px;line-height:1.8;">Want your FULL personalized results tracked over time — and the exact tools to raise your thermostat across health, wealth, love and leadership?</p>
    <p style="font-size:16px;line-height:1.8;">That is what <strong>Reset Your Mind 1111™</strong> was built for.</p>
    <p style="font-size:16px;line-height:1.8;">Founding Member spots are open now — <strong style="color:#D4AF37;">$44/month locked in for as long as you stay active</strong>. Only 111 spots ever.</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="https://forms.gle/veohns8QVRKubMCm9" style="display:inline-block;background:#D4AF37;color:#0a0a0a;font-weight:bold;font-size:16px;padding:14px 32px;border-radius:8px;text-decoration:none;">Join the Waitlist →</a>
    </div>
  </div>
  
  <p style="font-size:16px;line-height:1.8;">Permission granted ${firstName}. You are worthy of the life you just described wanting.</p>
  
  <div style="margin-top:40px;border-top:1px solid #333;padding-top:24px;">
    <p style="font-size:14px;color:#999;margin:4px 0;">With love,</p>
    <p style="font-size:16px;font-weight:bold;color:#D4AF37;margin:4px 0;">Lorie Wu</p>
    <p style="font-size:14px;color:#999;margin:4px 0;">The Emotional Surgeon™</p>
    <p style="font-size:14px;color:#999;margin:4px 0;">CEO of Reset Your Mind 1111™</p>
    <p style="font-size:14px;color:#999;margin:4px 0;">Author of The Emotional Surgeon</p>
    <p style="font-size:14px;color:#999;margin:4px 0;">resetyourmind1111@gmail.com</p>
  </div>
  
  <p style="font-size:13px;color:#666;margin-top:24px;">P.S. — The 111 Founding Member spots are the only time this offer will ever exist at this price. When they are gone the price goes to $111/month. <a href="https://forms.gle/veohns8QVRKubMCm9" style="color:#D4AF37;">Join the waitlist now.</a></p>
</div>
</body>
</html>`;

    // Send results email to subscriber
    const subscriberRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Reset Your Mind 1111™ <onboarding@resend.dev>",
        to: [email],
        subject: "Your Worth Thermostat Result is inside 🌡️",
        html: emailHtml,
      }),
    });

    if (!subscriberRes.ok) {
      const err = await subscriberRes.text();
      console.error("Failed to send subscriber email:", err);
    }

    // Send notification to Lorie
    const notificationHtml = `
<h2>New Assessment Lead</h2>
<p><strong>Name:</strong> ${firstName}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Thermostat Type:</strong> ${thermostatType}</p>
<p><strong>Score:</strong> ${totalScore}/125 (${percentage}%)</p>
<h3>Category Scores:</h3>
<ul>
  <li>Love & Relationships: ${categoryScores?.love || 0}/25</li>
  <li>Money & Abundance: ${categoryScores?.money || 0}/25</li>
  <li>Career & Purpose: ${categoryScores?.career || 0}/25</li>
  <li>Self-Care & Boundaries: ${categoryScores?.boundaries || 0}/25</li>
  <li>Action & Manifestation: ${categoryScores?.action || 0}/25</li>
</ul>`;

    const lorieRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Reset Your Mind 1111™ <onboarding@resend.dev>",
        to: ["resetyourmind1111@gmail.com"],
        subject: `New Assessment: ${firstName} — ${thermostatType} (${percentage}%)`,
        html: notificationHtml,
      }),
    });

    if (!lorieRes.ok) {
      const err = await lorieRes.text();
      console.error("Failed to send notification email:", err);
    }

    // Save lead to database
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    await supabaseAdmin.from("leads").insert({
      first_name: firstName,
      email: email,
      source: "assessment",
    });

    await supabaseAdmin.from("assessment_results").insert({
      first_name: firstName,
      email: email,
      total_score: totalScore,
      percentage_score: percentage,
      thermostat_type: thermostatType,
      category_scores: categoryScores,
      answers: {},
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-assessment-email:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
