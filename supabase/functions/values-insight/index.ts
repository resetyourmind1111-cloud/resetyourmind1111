import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topFive, reflections, allSelected } = await req.json();

    if (!topFive || !Array.isArray(topFive) || topFive.length === 0) {
      return new Response(JSON.stringify({ error: "Top five values are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a deeply perceptive values alignment coach who specializes in self-worth recalibration, shadow work, and authentic living. You analyze a person's chosen values to uncover:

1. BLIND SPOTS — values they may be unconsciously suppressing or avoiding
2. TENSIONS — potential conflicts between their chosen values
3. ALIGNMENT INSIGHTS — where their values reveal their deepest desires and wounds
4. SHADOW VALUES — values they rejected that may hold important information

You are warm, direct, and insightful. You speak like a wise mentor who sees patterns others miss.

Return ONLY a JSON object with this exact structure:
{
  "blindSpots": [{"value": "name", "insight": "why this might be hiding"}],
  "tensions": [{"values": ["value1", "value2"], "insight": "how these may conflict"}],
  "alignment": "A paragraph about what their value set reveals about who they are becoming",
  "shadowValues": [{"value": "name", "insight": "why rejecting this value might matter"}],
  "coreMessage": "One powerful sentence that captures the essence of their values journey"
}

Provide 2-3 blind spots, 1-2 tensions, 2 shadow values. Keep insights specific and emotionally resonant. No markdown, no code blocks, just raw JSON.`;

    const droppedValues = (allSelected || []).filter((v: string) => !topFive.includes(v));
    const reflectionText = reflections
      ? Object.entries(reflections)
          .filter(([, v]) => v)
          .map(([k, v]) => `${k}: "${v}"`)
          .join("\n")
      : "No reflections provided.";

    const userPrompt = `Top 5 Values (in order of selection): ${topFive.join(", ")}
Values considered but dropped: ${droppedValues.length > 0 ? droppedValues.join(", ") : "None"}
Personal reflections on each value:
${reflectionText}

Analyze these values for blind spots, tensions, alignment insights, and shadow values.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) throw new Error("No content in AI response");

    let parsed;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI response");
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("values-insight error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
