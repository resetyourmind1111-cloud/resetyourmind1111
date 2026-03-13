import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { bodyArea, sensation, emotion } = await req.json();
    if (!bodyArea || !sensation) {
      return new Response(JSON.stringify({ error: "bodyArea and sensation are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const emotionContext = emotion ? `\nThe connected emotion I feel is: ${emotion}` : "";

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
            content: `You are a compassionate somatic therapist and body-mind connection expert. A user is doing a body check-in and exploring where they hold tension, pain, or sensation. Help them understand the emotional and energetic meaning of what their body is telling them. Speak gently and warmly. Do NOT diagnose medical conditions. Respond using the provided tool.`,
          },
          {
            role: "user",
            content: `I'm feeling ${sensation.toLowerCase()} in my ${bodyArea.toLowerCase()}.${emotionContext}\n\nHelp me understand what my body might be trying to tell me, what emotional pattern this could be connected to, and what I can do to release it.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_body_insight",
              description: "Provide a structured somatic insight about the body sensation",
              parameters: {
                type: "object",
                properties: {
                  bodyMessage: {
                    type: "string",
                    description: "What this body area and sensation combination often represents emotionally and energetically. Include what the body might be 'saying' if it could speak. 3-4 sentences, warm and insightful.",
                  },
                  triggerInsight: {
                    type: "string",
                    description: "A compassionate reflection on what kinds of experiences, memories, or patterns commonly create this sensation in this body area. 2-3 sentences.",
                  },
                  releaseAction: {
                    type: "string",
                    description: "2-3 specific, actionable somatic release practices the user can try right now — e.g., breathwork, gentle movement, self-touch, vocalization, or visualization. Be specific and practical.",
                  },
                },
                required: ["bodyMessage", "triggerInsight", "releaseAction"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_body_insight" } },
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
    console.error("body-map-insight error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
