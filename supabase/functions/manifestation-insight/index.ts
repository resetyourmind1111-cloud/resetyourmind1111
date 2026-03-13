import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { intention, feeling, status, evidence } = await req.json();
    if (!intention) {
      return new Response(JSON.stringify({ error: "intention is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const evidenceList = (evidence || []).map((e: any) => e.text).join(", ");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a manifestation coach and spiritual guide. A user is working on manifesting an intention. Analyze their intention, emotional alignment, current status, and any synchronicities they've noticed. Provide deep, encouraging insight. Respond using the provided tool.`,
          },
          {
            role: "user",
            content: `My intention: "${intention}"\nHow I'll feel when it arrives: "${feeling || "not specified"}"\nCurrent status: ${status || "Calling In"}\nSigns & synchronicities I've noticed: ${evidenceList || "none yet"}\n\nHelp me understand my energetic alignment and what to focus on next.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_manifestation_insight",
              description: "Provide structured manifestation coaching insight",
              parameters: {
                type: "object",
                properties: {
                  energeticAlignment: {
                    type: "string",
                    description: "Assessment of their current energetic alignment with this intention — what's working and what might be blocking (2-3 sentences)",
                  },
                  hiddenPattern: {
                    type: "string",
                    description: "A deeper pattern or belief that may be influencing this manifestation, spoken with compassion (2-3 sentences)",
                  },
                  nextStep: {
                    type: "string",
                    description: "One specific, actionable step they can take today to accelerate this manifestation — be concrete and practical",
                  },
                },
                required: ["energeticAlignment", "hiddenPattern", "nextStep"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_manifestation_insight" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const result = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("manifestation-insight error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
