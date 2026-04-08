import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { trigger, emotion } = await req.json();
    if (!trigger || !emotion) {
      return new Response(JSON.stringify({ error: "trigger and emotion are required" }), {
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
            content: `You are a compassionate trauma-informed therapist and emotional intelligence coach. A user is exploring an emotional trigger. Analyze their situation and provide healing insights. Respond using the provided tool.`,
          },
          {
            role: "user",
            content: `I was triggered by this situation: "${trigger}"\nThe primary emotion I felt was: ${emotion}\n\nHelp me understand the body-mind connection, where this might come from, and how to process it.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_trigger_analysis",
              description: "Provide a structured analysis of the emotional trigger",
              parameters: {
                type: "object",
                properties: {
                  bodySensation: {
                    type: "string",
                    description: "Where this emotion commonly shows up in the body and why (2-3 sentences)",
                  },
                  rootReflection: {
                    type: "string",
                    description: "A compassionate reflection on where this trigger pattern may originate from — childhood, past relationships, or cultural conditioning (3-4 sentences). Do NOT diagnose. Speak gently.",
                  },
                  healingPrompt: {
                    type: "string",
                    description: "A single powerful journaling question to help the user go deeper into this trigger",
                  },
                },
                required: ["bodySensation", "rootReflection", "healingPrompt"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_trigger_analysis" } },
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
    console.error("analyze-trigger error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
