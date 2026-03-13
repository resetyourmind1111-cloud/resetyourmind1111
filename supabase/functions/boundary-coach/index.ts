import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { who, why, block } = await req.json();
    if (!who) {
      return new Response(JSON.stringify({ error: "who is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const context = [
      `Person/situation needing a boundary: "${who}"`,
      why ? `What I'm protecting: "${why}"` : null,
      block ? `What's stopped me before: "${block}"` : null,
    ].filter(Boolean).join("\n");

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
            content: `You are a boundaries expert and empowerment coach. You help women set firm, loving boundaries without guilt. Your tone is direct, warm, and unapologetic. You understand that boundary-setting is an act of self-love, not selfishness. Use the provided tool to respond.`,
          },
          {
            role: "user",
            content: `I need help building a boundary:\n\n${context}\n\nHelp me understand why this boundary matters and give me the words to set it.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_boundary_coaching",
              description: "Provide boundary coaching with scripts and encouragement",
              parameters: {
                type: "object",
                properties: {
                  whyItMatters: {
                    type: "string",
                    description: "A compassionate 2-3 sentence explanation of why this boundary is important and what it protects. Validate their need. Name the cost of NOT setting it.",
                  },
                  blockInsight: {
                    type: "string",
                    description: "A 1-2 sentence insight about why they may have struggled to set this boundary before (guilt, fear, conditioning). Normalize it.",
                  },
                  directScript: {
                    type: "string",
                    description: "A clear, direct boundary script they can use. Written as a quote they can say verbatim. Firm but not aggressive. 1-2 sentences.",
                  },
                  gentleScript: {
                    type: "string",
                    description: "A gentler version of the boundary script for when the relationship is delicate. Written as a quote. 1-2 sentences.",
                  },
                  practiceWords: {
                    type: "string",
                    description: "A personalized version in their own voice — more casual and natural. Written as a quote. 2-3 sentences.",
                  },
                },
                required: ["whyItMatters", "blockInsight", "directScript", "gentleScript", "practiceWords"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_boundary_coaching" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const result = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("boundary-coach error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
