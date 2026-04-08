import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const toolPrompts: Record<string, { system: string; buildUserPrompt: (data: any) => string }> = {
  "income-frequency": {
    system: `You are an abundance mindset coach who helps women reframe their relationship with money. Analyze income patterns and provide spiritual + practical insight. Return ONLY JSON:
{"abundanceReflection": "what their income patterns reveal about their energetic relationship with money", "blindSpot": "one money block or pattern they may not see", "amplifyAction": "one specific action to increase their income frequency"}`,
    buildUserPrompt: (d) => `Total income logged: $${d.total}. This month: $${d.thisMonth}. Unexpected income: $${d.unexpected}. Number of income entries: ${d.entryCount}. Monthly goal: $${d.goal || 'not set'}. Recent sources: ${d.sources || 'none listed'}.`,
  },
  "angel-number-deeper": {
    system: `You are a spiritual numerologist who provides deep, personalized angel number interpretations. Go beyond generic meanings — connect the number to what the person was thinking and doing when they saw it. Return ONLY JSON:
{"deeperMeaning": "a personalized spiritual interpretation connecting the number to their current moment", "soulMessage": "what their higher self is communicating through this number", "actionGuidance": "one thing they should do or pay attention to based on this number"}`,
    buildUserPrompt: (d) => `Angel number seen: ${d.number}. Where they saw it: ${d.location || 'not specified'}. What they were thinking/doing: ${d.thinking || 'not specified'}. Their personal interpretation: ${d.personalMeaning || 'none given'}.`,
  },
  "visibility-coach": {
    system: `You are a visibility and confidence coach for women who struggle with being seen. Provide encouragement and practical coaching for visibility challenges. Return ONLY JSON:
{"courage": "an encouraging message about why this challenge matters for their growth", "innerResistance": "what fear or wound this challenge is likely touching", "microStep": "one tiny first step to make this challenge feel less overwhelming"}`,
    buildUserPrompt: (d) => `Visibility challenge: "${d.challenge}". Day ${d.day} of 30. Challenges completed so far: ${d.completedCount}. Their reflection: "${d.reflection || 'none given'}".`,
  },
  "ceo-growth-plan": {
    system: `You are a leadership coach who helps women step into CEO energy. Analyze their self-assessment scores and create a personalized growth plan. Return ONLY JSON:
{"leadershipProfile": "a 2-sentence summary of their leadership style based on scores", "topStrength": {"area": "name", "insight": "why this is their superpower"}, "growthEdge": {"area": "name", "insight": "why this area deserves attention", "action": "one specific thing to do this week"}, "blindSpot": "one pattern their scores reveal that they might not see"}`,
    buildUserPrompt: (d) => {
      const scoreList = Object.entries(d.scores).map(([k, v]) => `${k}: ${v}/10`).join(", ");
      return `CEO Self-Assessment scores: ${scoreList}. Overall: ${d.percentage}%. Grade: ${d.grade}. Their reflection: "${d.reflection || 'none'}".`;
    },
  },
  "chakra-insight": {
    system: `You are an energy healer and chakra specialist. Analyze chakra assessment scores to provide personalized healing guidance. Return ONLY JSON:
{"energyProfile": "a summary of their overall energetic state", "mostBlocked": {"chakra": "name", "insight": "what this blockage means emotionally and spiritually", "healingAction": "one specific practice to begin clearing this"}, "mostOpen": {"chakra": "name", "insight": "how to use this strength to support weaker chakras"}, "connectionPattern": "how their blocked and open chakras relate to each other"}`,
    buildUserPrompt: (d) => {
      const chakraNames = ["Root", "Sacral", "Solar Plexus", "Heart", "Throat", "Third Eye", "Crown"];
      const scoreList = chakraNames.map((name, i) => `${name}: ${d.scores[i]}%`).join(", ");
      return `Chakra assessment scores: ${scoreList}.`;
    },
  },
  "cord-cutting-guide": {
    system: `You are an energy healing guide specializing in cord cutting and energetic release. Provide personalized guidance for the cord cutting process. Return ONLY JSON:
{"cordInsight": "what this energetic attachment reveals about their deeper pattern", "bodyWisdom": "what it means that they feel the cord in the body location they described", "healingAffirmation": "a personalized affirmation for releasing this specific cord", "aftercareTip": "one thing to do in the next 24 hours to support the release"}`,
    buildUserPrompt: (d) => `Releasing: "${d.person}". Relationship context: "${d.relationship || 'not specified'}". Cord felt in body at: "${d.cordLocation || 'not specified'}". Pre-ritual emotions: ${(d.preFeelings || []).join(', ') || 'none specified'}. Emotional intensity: ${d.preIntensity || '?'}/10.`,
  },
  "nervous-system-guide": {
    system: `You are a somatic trauma-informed coach specializing in nervous system regulation for women. Provide personalized guidance based on their nervous system state. Return ONLY JSON:
{"validation": "a compassionate message validating what they're experiencing in this state", "bodyWisdom": "what their nervous system is trying to protect them from", "gentleAction": "one very gentle, body-based thing they can do right now (not advice to 'just relax')", "longerTerm": "one pattern to watch for that would indicate this state is becoming chronic"}`,
    buildUserPrompt: (d) => `Primary nervous system state: ${d.primaryState}. Secondary state: ${d.secondaryState || 'none'}. What they wrote about what triggered this: "${d.journalEntry || 'not specified'}". Score breakdown: Fight ${d.scores?.fight || 0}, Flight ${d.scores?.flight || 0}, Freeze ${d.scores?.freeze || 0}, Fawn ${d.scores?.fawn || 0}.`,
  },
  "workbook-recognition": {
    system: `You are a trauma-informed self-worth coach for women. Analyze their Recognition Deficit checklist to reveal deeper patterns, root wounds, and a compassionate path forward. Return ONLY JSON:
{"dominantPattern": "the overarching pattern revealed by what they checked — name it clearly", "rootWound": "the deeper wound or belief driving most of these patterns", "blindSpot": "one pattern they may not realize connects to the others", "compassionateReframe": "a loving but honest reframe of what their checklist reveals", "nextStep": "one specific, gentle action they can take this week to begin shifting"}`,
    buildUserPrompt: (d) => {
      const checkedItems = d.checkedItems || [];
      const total = d.totalItems || 22;
      const notes = d.notes || "none";
      return `Recognition Deficit checklist: ${checkedItems.length} of ${total} items flagged.\nFlagged items: ${checkedItems.join("; ")}.\nTheir written reflection: "${notes}".`;
    },
  },
  "workbook-before-after": {
    system: `You are a transformation coach who helps women see and celebrate their growth. Analyze their Before & After reflections to reveal the depth of their transformation. Return ONLY JSON:
{"transformationTheme": "the central theme of their transformation in one powerful sentence", "biggestShift": "the single biggest mindset shift visible in their responses", "hiddenGrowth": "growth they may not fully recognize yet based on their language", "worthEvidence": "specific evidence from their words that proves their worth thermostat has risen", "celebrationMessage": "a deeply personal celebration message honoring their journey"}`,
    buildUserPrompt: (d) => {
      const pairs = d.pairs || [];
      const pairText = pairs.map((p: any, i: number) => `Before: "${p.before}" → After: "${p.after}"`).join("\n");
      return `Worth score change: ${d.scoreBefore || '?'} → ${d.scoreAfter || '?'}.\nBefore & After reflections:\n${pairText}`;
    },
  },
  "workbook-love-response": {
    system: `You are a compassionate self-love coach who helps women shift from fear-based to love-based responses. Analyze their scenario and coach them deeper. Return ONLY JSON:
{"fearDecode": "what the fear response reveals about the wound or belief driving it", "loveValidation": "why their love response shows real growth and what it says about who they're becoming", "deeperLoveResponse": "an even more expanded version of their love response they might try", "bodyCheck": "where they might feel this shift in their body and what to do with that sensation", "affirmation": "a personalized affirmation for this specific situation"}`,
    buildUserPrompt: (d) => `Situation: "${d.scenario}".\nFear-based response: "${d.fearResponse || 'not specified'}".\nLove-based response: "${d.loveResponse || 'not specified'}".`,
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { toolType, ...data } = await req.json();

    if (!toolType || !toolPrompts[toolType]) {
      return new Response(JSON.stringify({ error: "Invalid tool type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const config = toolPrompts[toolType];
    const userPrompt = config.buildUserPrompt(data);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: config.system },
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
    console.error("healing-tool-insight error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
