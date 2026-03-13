import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { answers, questions } = await req.json();
    if (!answers || !Array.isArray(answers)) {
      return new Response(JSON.stringify({ error: "answers array is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const qaText = questions.map((q: string, i: number) => `Q: ${q}\nA: ${answers[i] || "(not answered)"}`).join("\n\n");

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
            content: `You are a financial healing coach who specializes in money mindset transformation. You help women rewrite their money stories from scarcity to abundance. Your tone is empowering, warm, and direct. You speak with authority and compassion. Use the provided tool to respond.`,
          },
          {
            role: "user",
            content: `Here are my answers to a Money Story Audit:\n\n${qaText}\n\nBased on my answers, help me understand my old money story pattern and write a powerful new money story I can embody.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_money_story_rewrite",
              description: "Provide an analysis and new money story",
              parameters: {
                type: "object",
                properties: {
                  pattern: {
                    type: "string",
                    description: "A compassionate 2-3 sentence summary of the old money story pattern you see in their answers. Name the core wound without shaming.",
                  },
                  newStory: {
                    type: "string",
                    description: "A powerful new money story written in first person, present tense, 4-6 sentences. It should directly counter the old patterns. Start with 'Money flows to me...' or 'I am...' or 'My relationship with money...' Make it feel like a declaration of sovereignty.",
                  },
                },
                required: ["pattern", "newStory"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_money_story_rewrite" } },
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
    console.error("rewrite-money-story error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
