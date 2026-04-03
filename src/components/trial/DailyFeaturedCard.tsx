import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import { useTrialStatus, TRIAL_TOOL_NAMES } from "@/hooks/useTrialStatus";
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

  if (!isTrialActive || trialExpired) return null;

  const tool1Name = trialTool1 ? (TRIAL_TOOL_NAMES[trialTool1] || trialTool1) : "Nervous System Reset";
  const tool2Name = trialTool2 ? (TRIAL_TOOL_NAMES[trialTool2] || trialTool2) : "Limiting Belief Rewriter";

  const toolCopy: Record<string, string> = {
    stuck: `🛠 Your tools are ready. Try the ${tool1Name} or ${tool2Name} today.`,
    sabotage: `🛠 Your tools are ready. Try the ${tool1Name} or ${tool2Name} today.`,
    relationships: `🛠 Your tools are ready. Try the ${tool1Name} or ${tool2Name} today.`,
    levelup: `🛠 Your tools are ready. Try the ${tool1Name} or ${tool2Name} today.`,
  };

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

  const cards: Record<number, { emoji: string; copy: string; button: string; action: () => void }> = {
    0: {
      emoji: "🌡",
      copy: "Start here. Take the Worth Thermostat™ — discover exactly where your worth is set.",
      button: "Take Assessment →",
      action: () => navigate("/assessment"),
    },
    1: {
      emoji: "🧠",
      copy: "Day 2. Go deeper. You've seen where you are. Now let's start moving.",
      button: "Start Day 1 of 30-Day Experience →",
      action: () => navigate("/30-day-experience"),
    },
    2: {
      emoji: "💧",
      copy: "Day 3. Feel the shift. Something is already different. Let's name it.",
      button: "Open Today's Reset →",
      action: () => navigate("/30-day-experience"),
    },
    3: {
      emoji: "🛠",
      copy: toolCopy[onboardingReason || "stuck"] || toolCopy.stuck,
      button: "Open My Tools →",
      action: () => navigate("/healing-tools"),
    },
    4: {
      emoji: "🎧",
      copy: "Day 5. Your mind is ready. Listen to one of your 3 preview meditations.",
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
      copy: "Last day of your preview. Make it count.",
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
          <p className="font-serif text-[#F9F6F0] text-lg font-semibold">
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
            <p className="text-[#C9A84C] text-sm font-medium">
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
      <Card className={`p-5 bg-card/80 ${dayIndex === 6 ? "border-2 border-[#C9A84C]" : "border-border/50"}`}>
        <p className="text-lg mb-1">{card.emoji}</p>
        <p className="text-[#F9F6F0] font-medium text-sm mb-3">{card.copy}</p>
        <Button onClick={card.action} variant="gold" size="sm">
          {card.button}
        </Button>
      </Card>
    </motion.div>
  );
}
