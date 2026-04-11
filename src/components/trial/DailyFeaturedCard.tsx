import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useTrialStatus, TRIAL_TOOL_NAMES, getTrialAllowedTools } from "@/hooks/useTrialStatus";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function DailyFeaturedCard() {
  const { isTrialActive, trialDay, trialExpired, onboardingReason, trialTool1, trialTool2 } = useTrialStatus();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [journalText, setJournalText] = useState("");
  const [showJournal, setShowJournal] = useState(false);
  const [journalSaved, setJournalSaved] = useState(false);
  const [hasAssessment, setHasAssessment] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("assessment_results")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .then(({ data }) => setHasAssessment((data?.length ?? 0) > 0));
  }, [user]);

  if (!isTrialActive || trialExpired) return null;

  const allowedTools = getTrialAllowedTools(onboardingReason, trialTool1, trialTool2);
  const tool1Name = TRIAL_TOOL_NAMES[allowedTools[0]] || allowedTools[0];
  const tool2Name = TRIAL_TOOL_NAMES[allowedTools[1]] || allowedTools[1];

  const handleSaveJournal = async () => {
    if (!user || !journalText.trim()) return;
    await supabase.from("healing_tool_entries").insert({
      user_id: user.id,
      tool_id: "trial-reflection",
      entry_data: { text: journalText, tags: ["trial", "reflection"], day: 6 },
    });
    await supabase.from("profiles").update({ trial_reflection_saved: true } as any).eq("user_id", user.id);
    setJournalSaved(true);
    toast.success("✨ You wrote your truth. That's not nothing. That's everything.");
  };

  // Day 0: If assessment already done, send to 30-day experience instead
  const day0Card = hasAssessment
    ? {
        emoji: "🌟",
        copy: "You've already taken your assessment. Now start your 30-Day Experience — Days 1–3 are unlocked for you.",
        button: "Start Day 1 →",
        action: () => navigate("/30-day-experience"),
      }
    : {
        emoji: "🌡",
        copy: "Start here. Take the Worth Thermostat™ — discover exactly where your worth is set.",
        button: "Take Assessment →",
        action: () => navigate("/assessment"),
      };

  const cards: Record<number, { emoji: string; copy: string; button: string; action: () => void }> = {
    0: day0Card,
    1: {
      emoji: "🧠",
      copy: `Day 2. Your 30-Day Experience (Days 1–3) and two healing tools are ready: ${tool1Name} & ${tool2Name}.`,
      button: "Open 30-Day Experience →",
      action: () => navigate("/30-day-experience"),
    },
    2: {
      emoji: "💧",
      copy: "Day 3. You have 3 meditations unlocked. Try one — even 5 minutes can shift everything.",
      button: "Open Meditations →",
      action: () => navigate("/meditations"),
    },
    3: {
      emoji: "🛠",
      copy: `Day 4. Try your personalized tools: ${tool1Name} & ${tool2Name}. They're built for exactly where you are.`,
      button: "Open My Tools →",
      action: () => navigate("/healing-tools"),
    },
    4: {
      emoji: "🎧",
      copy: "Day 5. Revisit your meditations or continue the 30-Day Experience. Every session builds on the last.",
      button: "Open Meditations →",
      action: () => navigate("/meditations"),
    },
    5: {
      emoji: "📓",
      copy: "Day 6. Reflect. What has shifted in 6 days?",
      button: "Write it down →",
      action: () => setShowJournal(true),
    },
    6: {
      emoji: "⏳",
      copy: "Last day of your preview. Make it count — use every tool you have access to.",
      button: "Continue My Reset →",
      action: () => navigate("/30-day-experience"),
    },
  };

  const dayIndex = Math.min(Math.max(trialDay, 0), 6);
  const card = cards[dayIndex];

  if (showJournal && dayIndex === 5) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-5 bg-card/80 border-[#C9A84C]/20 space-y-4">
          <p className="font-serif text-foreground text-lg font-semibold">
            What is different about me compared to 6 days ago?
          </p>
          {!journalSaved ? (
            <>
              <Textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="Write your reflection here..."
                className="min-h-[120px]"
              />
              <Button onClick={handleSaveJournal} variant="gold" disabled={!journalText.trim()}>
                Save Reflection
              </Button>
            </>
          ) : (
            <p className="text-primary text-sm font-medium">
              ✨ You wrote your truth. That's not nothing. That's everything.
            </p>
          )}
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className={`p-5 bg-card/80 ${dayIndex === 6 ? "border-2 border-primary" : "border-border/50"}`}>
        <p className="text-lg mb-1">{card.emoji}</p>
        <p className="text-foreground font-medium text-sm mb-3">{card.copy}</p>
        <Button onClick={card.action} variant="gold" size="sm">
          {card.button}
        </Button>
      </Card>
    </motion.div>
  );
}
