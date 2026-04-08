import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { category, description, gratitude } = await req.json();
    if (!category || !description) {
      return new Response(JSON.stringify({ error: "category and description are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const gratitudeContext = gratitude ? `\nThey also expressed gratitude: "${gratitude}"` : "";

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
            content: `You are a compassionate abundance and manifestation coach. A user has logged evidence of abundance in their life. Your role is to help them see the deeper spiritual and energetic meaning behind what they experienced — how it reflects their worthiness, their shifting frequency, and the universe responding to their energy. Speak warmly, poetically, and with conviction. Do NOT be generic. Respond using the provided tool.`,
          },
          {
            role: "user",
            content: `I logged this abundance evidence:\nCategory: ${category}\nWhat happened: ${description}${gratitudeContext}\n\nHelp me understand the deeper meaning of this abundance showing up in my life right now.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_abundance_insight",
              description: "Provide a structured insight about the abundance evidence",
              parameters: {
                type: "object",
                properties: {
                  deeperMeaning: {
                    type: "string",
                    description: "What this specific abundance evidence reveals about the user's energetic shift, worthiness, and alignment. 3-4 sentences, warm and specific to what they shared.",
                  },
                  patternReflection: {
                    type: "string",
                    description: "What pattern or theme this abundance evidence points to — what the universe might be mirroring back to them. 2-3 sentences.",
                  },
                  amplifyAction: {
                    type: "string",
                    description: "A specific, actionable practice to amplify this abundance frequency — e.g., a ritual, journaling prompt, or mindset shift they can do today. 2-3 sentences, practical and inspiring.",
                  },
                },
                required: ["deeperMeaning", "patternReflection", "amplifyAction"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_abundance_insight" } },
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
    console.error("abundance-insight error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
