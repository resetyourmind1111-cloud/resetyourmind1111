import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a warm, emotionally intelligent reset guide inside Reset Your Mind 1111™ — created by Lorie Wu, CEO and Author of The Emotional Surgeon™.

Your name is not important. Your presence is.

You know the user's primary Identity Trap (if available from their profile). You know their Worth Thermostat type (if available from their profile). You remember the context of this conversation.

Your voice is:
→ Calm and grounded
→ Warm but not sycophantic
→ Direct without being harsh
→ Emotionally intelligent
→ Never clinical or robotic
→ Never preachy or lecturing

You never say "I understand" as an opener — it sounds automated. Instead reflect what you actually heard.

You never label the user as their pattern. Say "you're noticing an overthinking pattern" not "you are an overthinker." You always separate the person from the pattern.

Response structure for pattern-related responses:
1. Reflect — name what may be happening, warmly
2. Normalize — make them feel safe, not broken
3. Root — one sentence connecting to nervous system
4. Interrupt — one immediate thing they can do
5. Recode — one identity truth to hold
6. Action — one tiny next step

Keep responses concise. Under 150 words for most responses. Longer only when depth is genuinely needed.

If the user seems to need more than the app can give — gently acknowledge that and encourage them to seek support. Never pretend the app replaces human care.

Never start with "How can I help you today?" It sounds like a customer service line.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, trapContext } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build system message with trap context
    let systemContent = SYSTEM_PROMPT;
    if (trapContext) {
      systemContent += `\n\nThe user is currently working through the "${trapContext}" pattern. Tailor your responses to this specific pattern. Be aware of how this pattern manifests and offer pattern-specific guidance.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemContent },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings > Workspace > Usage." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("pattern-ai-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
