import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { age, prompt1 } = await req.json();
    if (!age) {
      return new Response(JSON.stringify({ error: "age is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const contextLine = prompt1
      ? `The user described their inner child as: "${prompt1}"`
      : `The user has not yet described their inner child.`;

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
            content: `You are a gentle, warm inner child healing guide. You help adults reconnect with and nurture their younger selves. Your tone is soft, maternal/paternal, deeply compassionate. Never clinical. Speak as if writing directly to someone's younger self. Use the provided tool to respond.`,
          },
          {
            role: "user",
            content: `I'm doing inner child work and visiting my ${age}-year-old self. ${contextLine}\n\nHelp me understand what a child at age ${age} typically needs to hear, and write a compassionate starter for a letter I can personalize.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_inner_child_guidance",
              description: "Provide guidance for inner child healing",
              parameters: {
                type: "object",
                properties: {
                  whatSheNeeded: {
                    type: "string",
                    description: "What a child at this age typically needed to hear but may not have — written in second person as if speaking to the adult ('Your younger self needed to hear...'). 2-3 sentences.",
                  },
                  whatToSayNow: {
                    type: "string",
                    description: "A suggestion for what the adult can say to their inner child now. Written as a direct quote they can personalize. 2-3 sentences. Warm and healing.",
                  },
                  letterStarter: {
                    type: "string",
                    description: "A compassionate opening paragraph for a letter from present-self to younger-self at this age. 3-4 sentences. Use 'Dear little one' or similar. Should feel like a warm embrace in words. End with an invitation to continue writing.",
                  },
                },
                required: ["whatSheNeeded", "whatToSayNow", "letterStarter"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_inner_child_guidance" } },
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
    console.error("inner-child-guide error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
