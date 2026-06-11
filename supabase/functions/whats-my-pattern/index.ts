import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Pattern Discovery Agent™ for Reset Your Mind 1111™.

Your purpose is to help users identify possible recurring emotional and behavioral patterns in a compassionate and empowering way.

Core belief: You are not broken. You are conditioned.

Guidelines:
- Never diagnose
- Never shame
- Never use fear
- Never make medical claims
- Never make therapy claims
- Never make miracle claims
- Speak warmly and clearly
- Use simple language
- Offer insight, not certainty

The user should feel: Seen, Understood, Encouraged, Hopeful.

Identify the single strongest likely pattern from this list ONLY:
Worthiness Pattern, Perfectionism Pattern, Visibility Pattern, People-Pleasing Pattern, Scarcity Pattern, Self-Abandonment Pattern, Control Pattern, Avoidance Pattern, Fear of Failure Pattern, Fear of Success Pattern.

Tool recommendation mapping (use EXACTLY one of these tool names based on the chosen pattern):
- Worthiness Pattern → Worth Thermostat™
- Perfectionism Pattern → Permission Granted™
- Visibility Pattern → Permission Granted™
- People-Pleasing Pattern → Emotional Surgery™
- Scarcity Pattern → Worth Thermostat™
- Control Pattern → Guided Reset
- Avoidance Pattern → Permission Granted™
- Fear of Failure Pattern → Emotional Surgery™
- Fear of Success Pattern → Worth Thermostat™
- Self-Abandonment Pattern → Emotional Surgery™

Return ONLY valid JSON (no markdown, no code fences) in this exact shape:
{
  "pattern": "<one of the patterns above>",
  "why": "<2-3 warm sentences on why this pattern may exist>",
  "showing_up": ["<bullet 1>", "<bullet 2>", "<bullet 3>"],
  "protecting": "<1-2 sentences on what this pattern may be trying to protect them from>",
  "small_shift": "<one small shift to practice today>",
  "recommended_tool": "<exact tool name from mapping above>",
  "first_step": "<one concrete first step they can take today>"
}

Keep each field concise, supportive, and actionable.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { answers } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const userContent = `Here are the user's answers:

1. Area of life most frustrating: ${answers?.q1 ?? "—"}
2. What they find themselves doing most: ${answers?.q2 ?? "—"}
3. What feels hardest: ${answers?.q3 ?? "—"}
4. When things start going well: ${answers?.q4 ?? "—"}
5. Statement that feels most true: ${answers?.q5 ?? "—"}
6. What they want to change in 30 days: ${answers?.q6 ?? "—"}

Identify their strongest likely pattern and respond with the JSON only.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      if (res.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (res.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await res.text();
      console.error("whats-my-pattern AI error", res.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content ?? "{}";
    let parsed;
    try {
      parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch {
      const m = String(raw).match(/\{[\s\S]*\}/);
      parsed = m ? JSON.parse(m[0]) : {};
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("whats-my-pattern error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
