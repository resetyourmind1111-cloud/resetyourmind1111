import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { category, prompt, response } = await req.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: "prompt is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userContext = response
      ? `The shadow work prompt is: "${prompt}" (Category: ${category})\n\nHere is what I wrote:\n"${response}"\n\nHelp me go deeper with this shadow work.`
      : `The shadow work prompt is: "${prompt}" (Category: ${category})\n\nI haven't started writing yet. Help me begin exploring this shadow.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
            content: `You are a compassionate shadow work facilitator trained in Jungian psychology and somatic awareness. You help people explore the parts of themselves they have hidden, denied, or suppressed. Your tone is warm but unflinching — you hold space without avoiding the truth. Never diagnose. Always empower. Use the provided tool to respond.`,
          },
          { role: "user", content: userContext },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_shadow_guidance",
              description: "Provide shadow work guidance and deeper exploration prompts",
              parameters: {
                type: "object",
                properties: {
                  insight: {
                    type: "string",
                    description: "A compassionate 2-3 sentence reflection on what this shadow might be protecting or revealing. Speak directly to the person. Name the possible wound gently.",
                  },
                  deeperPrompt: {
                    type: "string",
                    description: "A powerful follow-up journaling question that takes them one layer deeper into this shadow. Should feel like it unlocks something.",
                  },
                  integration: {
                    type: "string",
                    description: "A 1-2 sentence integration statement or affirmation they can use. Written in first person, present tense. Should feel like reclaiming the disowned part.",
                  },
                },
                required: ["insight", "deeperPrompt", "integration"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_shadow_guidance" } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, t);
      throw new Error("AI gateway error");
    }

    const data = await aiResponse.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const result = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("shadow-work-guide error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
