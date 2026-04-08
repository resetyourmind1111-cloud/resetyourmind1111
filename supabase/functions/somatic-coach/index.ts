import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { exercise, cycles, notes, intention } = await req.json();
    if (!exercise) {
      return new Response(JSON.stringify({ error: "exercise is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const context = [
      `Breathing exercise completed: "${exercise}"`,
      cycles ? `Cycles completed: ${cycles}` : null,
      notes ? `How my body feels: "${notes}"` : null,
      intention ? `My intention for this session: "${intention}"` : null,
    ].filter(Boolean).join("\n");

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
            content: `You are a somatic healing expert and breathwork coach. You help women reconnect with their bodies through breathwork, nervous system regulation, and embodied awareness. Your tone is warm, grounded, and wise. You understand that the body keeps the score — and breathwork is medicine. Use the provided tool to respond.`,
          },
          {
            role: "user",
            content: `I just completed a breathwork session:\n\n${context}\n\nGive me personalized somatic guidance based on this session.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_somatic_guidance",
              description: "Provide personalized somatic guidance after a breathwork session",
              parameters: {
                type: "object",
                properties: {
                  bodyMessage: {
                    type: "string",
                    description: "A compassionate 2-3 sentence interpretation of what their body is communicating through this breathwork session. If they shared body sensations, reflect on what those signals mean. If not, offer general guidance based on the exercise they chose.",
                  },
                  nervousSystemState: {
                    type: "string",
                    description: "A 1-2 sentence assessment of their likely nervous system state (sympathetic/parasympathetic/dorsal vagal) based on the exercise chosen and sensations described. Explain in accessible language.",
                  },
                  somaticPractice: {
                    type: "string",
                    description: "A specific follow-up somatic practice they can do right now to deepen the benefit of this session. Be concrete — include body positioning, timing, and what to notice. 2-3 sentences.",
                  },
                  emotionalRelease: {
                    type: "string",
                    description: "A gentle 1-2 sentence acknowledgment of any emotions that may surface after this breathwork. Normalize and validate whatever comes up.",
                  },
                  closingAffirmation: {
                    type: "string",
                    description: "A powerful body-centered affirmation in first person. Should connect breath to safety, power, or healing. 1 sentence.",
                  },
                },
                required: ["bodyMessage", "nervousSystemState", "somaticPractice", "emotionalRelease", "closingAffirmation"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_somatic_guidance" } },
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
    console.error("somatic-coach error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
