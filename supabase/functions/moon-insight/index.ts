import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { phase, journal } = await req.json();
    if (!phase || !journal) {
      return new Response(JSON.stringify({ error: "phase and journal are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a mystical lunar guide and spiritual coach who understands the energetic significance of moon phases. You help people align their inner work with the lunar cycle. Your tone is poetic, wise, and grounding. Respond using the provided tool.`,
          },
          {
            role: "user",
            content: `I journaled during the ${phase} phase. Here's what I wrote:\n\n"${journal}"\n\nHelp me understand the lunar significance and what my soul is telling me.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_moon_insight",
              description: "Provide lunar-aligned spiritual insight on the journal entry",
              parameters: {
                type: "object",
                properties: {
                  lunarMessage: {
                    type: "string",
                    description: "What this journal entry reveals in the context of the current moon phase — the energetic significance (2-3 sentences). Poetic and wise.",
                  },
                  soulPattern: {
                    type: "string",
                    description: "A deeper pattern or theme the moon is illuminating in their life right now (2-3 sentences). Compassionate and insightful.",
                  },
                  ritualSuggestion: {
                    type: "string",
                    description: "A specific ritual, practice, or intention they can do before the next phase shift to honor what came up. Concrete and actionable.",
                  },
                },
                required: ["lunarMessage", "soulPattern", "ritualSuggestion"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_moon_insight" } },
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
    console.error("moon-insight error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
