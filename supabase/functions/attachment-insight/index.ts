import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { primary, secondary, scores } = await req.json();
    if (!primary) {
      return new Response(JSON.stringify({ error: "primary attachment style is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const scoreText = scores ? `Scores — Secure: ${scores[0]}, Anxious: ${scores[1]}, Avoidant: ${scores[2]}, Disorganized: ${scores[3]}` : "";

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
            content: `You are a compassionate attachment theory expert and relationship coach. You help women understand their attachment patterns with warmth, depth, and zero judgment. You understand that attachment styles are adaptive — they were survival strategies, not flaws. Use the provided tool to respond.`,
          },
          {
            role: "user",
            content: `My attachment style assessment results:\nPrimary: ${primary}${secondary ? `\nSecondary: ${secondary}` : ""}\n${scoreText}\n\nGive me a personalized, compassionate deep-dive into what this means for my love life and healing journey.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_attachment_insight",
              description: "Provide personalized attachment style insight and healing guidance",
              parameters: {
                type: "object",
                properties: {
                  personalInsight: {
                    type: "string",
                    description: "A deeply personal 3-4 sentence reflection on what this attachment combination reveals about their love story. Speak directly to them. Name the survival strategy with compassion. If they have a secondary style, explain how the two interact.",
                  },
                  coreWound: {
                    type: "string",
                    description: "Name the core wound driving this attachment pattern in 1-2 sentences. Be gentle but honest. E.g., 'Your core wound is the belief that you are too much and not enough simultaneously.'",
                  },
                  dailyPractice: {
                    type: "string",
                    description: "One specific daily practice they can start today to begin healing this attachment pattern. Be concrete and actionable. 2-3 sentences.",
                  },
                  affirmation: {
                    type: "string",
                    description: "A powerful healing affirmation specifically for this attachment style. Written in first person. 1-2 sentences. Should feel like medicine for their specific wound.",
                  },
                },
                required: ["personalInsight", "coreWound", "dailyPractice", "affirmation"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_attachment_insight" } },
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
    console.error("attachment-insight error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
