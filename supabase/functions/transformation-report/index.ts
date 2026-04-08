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
    const body = await req.json();
    const {
      profile,
      recognitionDeficit,
      beforeAfter,
      loveResponses,
      journeyProgress,
      toolsUsed,
      checkinStates,
      assessmentScores,
      healingInsights,
    } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build a comprehensive user context prompt
    const sections: string[] = [];

    // Profile summary
    if (profile) {
      sections.push(`PROFILE: Name: ${profile.fullName || "Unknown"}. Streak: ${profile.streak || 0} days. Total points: ${profile.points || 0}. Journey day: ${profile.journeyDay || 0}/30.`);
    }

    // Recognition deficit
    if (recognitionDeficit) {
      sections.push(`RECOGNITION DEFICIT: ${recognitionDeficit.checkedCount} of ${recognitionDeficit.totalItems} areas flagged. Categories most affected: ${recognitionDeficit.topCategories || "unknown"}. Items: ${recognitionDeficit.checkedItems?.join("; ") || "none"}.`);
    }

    // Before & After
    if (beforeAfter) {
      const pairs = (beforeAfter.pairs || [])
        .filter((p: any) => p.before || p.after)
        .map((p: any) => `Before: "${p.before}" → After: "${p.after}"`)
        .join("\n");
      sections.push(`BEFORE & AFTER: Worth score: ${beforeAfter.scoreBefore || "?"} → ${beforeAfter.scoreAfter || "?"}.\n${pairs}`);
    }

    // Love responses
    if (loveResponses && loveResponses.length > 0) {
      const entries = loveResponses.slice(0, 5).map((e: any) =>
        `Situation: "${e.scenario}" | Fear: "${e.fearResponse}" | Love: "${e.loveResponse}"`
      ).join("\n");
      sections.push(`LOVE RESPONSE PRACTICES (${loveResponses.length} total):\n${entries}`);
    }

    // Journey progress
    if (journeyProgress) {
      sections.push(`30-DAY JOURNEY: ${journeyProgress.completedDays} of 30 days completed. Phase: ${journeyProgress.currentPhase || "unknown"}.`);
    }

    // Tools used
    if (toolsUsed && toolsUsed.length > 0) {
      sections.push(`HEALING TOOLS USED (${toolsUsed.length} unique): ${toolsUsed.join(", ")}.`);
    }

    // Emotional check-in patterns
    if (checkinStates && checkinStates.length > 0) {
      const stateCounts: Record<string, number> = {};
      checkinStates.forEach((s: string) => { stateCounts[s] = (stateCounts[s] || 0) + 1; });
      const stateStr = Object.entries(stateCounts).map(([k, v]) => `${k}: ${v}`).join(", ");
      sections.push(`EMOTIONAL CHECK-IN PATTERNS (${checkinStates.length} check-ins): ${stateStr}.`);
    }

    // Assessment history
    if (assessmentScores && assessmentScores.length > 0) {
      const scoreStr = assessmentScores.map((s: any) => `${s.score}% (${s.type}, ${s.date})`).join(", ");
      sections.push(`WORTH THERMOSTAT SCORES: ${scoreStr}.`);
    }

    // Healing tool insights summary
    if (healingInsights && healingInsights.length > 0) {
      sections.push(`KEY HEALING INSIGHTS FROM TOOLS:\n${healingInsights.join("\n")}`);
    }

    const userPrompt = sections.join("\n\n");

    const systemPrompt = `You are a master transformation coach analyzing a woman's complete healing journey data. Create a deeply personal, comprehensive transformation report that celebrates her growth, identifies patterns across ALL her data, and provides strategic guidance for her next chapter.

You have access to data from her Recognition Deficit checklist, Before & After reflections, Love Response practices, 30-day journey progress, healing tools usage, emotional check-ins, and assessment scores.

Return ONLY valid JSON with this structure:
{
  "reportTitle": "A poetic, personalized title for her transformation report (e.g., 'The Woman Who Stopped Shrinking')",
  "transformationSummary": "A 3-4 sentence powerful summary of her overall transformation arc — who she was, what shifted, who she is becoming",
  "topInsights": [
    {"title": "short title", "insight": "deep observation connecting data from multiple sources"},
    {"title": "short title", "insight": "deep observation connecting data from multiple sources"},
    {"title": "short title", "insight": "deep observation connecting data from multiple sources"}
  ],
  "growthEvidence": "Specific, concrete evidence of growth pulled from her actual data — quote her own words when possible",
  "blindSpot": "One pattern she may not see that connects across multiple areas of her journey",
  "strengthProfile": "What her data reveals about her core strength — the thread that runs through everything she's done",
  "nextChapter": {
    "focus": "The one area that would create the biggest shift if she focused on it next",
    "action": "A specific, actionable step for the coming week",
    "affirmation": "A personalized affirmation that captures where she is now"
  },
  "celebrationMessage": "A deeply personal closing message celebrating her courage and transformation — make it feel like a letter from her future self"
}`;

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

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content;
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
    console.error("transformation-report error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
