import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface MilestoneCardData {
  day: number;
  key: string;
  eyebrow: string;
  headline: string;
  body: string;
  buttonText: string;
  nextDay: number;
}

const milestoneCards: MilestoneCardData[] = [
  {
    day: 7, key: "day7", eyebrow: "DAY 7",
    headline: "One week.\nMost people never make it here.\nYou did.",
    body: "Seven days of showing up for yourself. Seven times you chose the reset over the pattern. That is not small. That is the work.",
    buttonText: "Keep going — Day 8 is waiting →",
    nextDay: 8,
  },
  {
    day: 14, key: "day14", eyebrow: "DAY 14",
    headline: "Halfway.\nThe pattern has been interrupted\n14 times now.\nThat's not nothing.",
    body: "Two weeks ago you started something. You're still here. The version of you that keeps stopping — she's losing ground. Keep going.",
    buttonText: "Continue to Day 15 →",
    nextDay: 15,
  },
  {
    day: 21, key: "day21", eyebrow: "DAY 21",
    headline: "21 days.\nThis is where a habit forms.\nYou're there.",
    body: "Neuroscience says it takes 21 days to begin rewiring a pattern. You just did that. Nine more days and it becomes part of who you are. Don't stop now.",
    buttonText: "9 more days — let's finish this →",
    nextDay: 22,
  },
];

interface WeeklyMilestoneCardProps {
  currentDay: number;
  onNavigateToDay: (day: number) => void;
}

export function WeeklyMilestoneCard({ currentDay, onNavigateToDay }: WeeklyMilestoneCardProps) {
  const { user } = useAuth();
  const [visibleCard, setVisibleCard] = useState<MilestoneCardData | null>(null);

  useEffect(() => {
    if (!user) return;
    const card = milestoneCards.find((c) => currentDay >= c.day);
    if (!card) return;

    supabase
      .from("profiles")
      .select("milestone_cards_shown")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        const shown = (data as any)?.milestone_cards_shown || {};
        // Show the highest applicable card that hasn't been shown
        const applicable = milestoneCards
          .filter((c) => currentDay >= c.day && !shown[c.key])
          .sort((a, b) => b.day - a.day);
        if (applicable.length > 0) {
          setVisibleCard(applicable[0]);
        }
      });
  }, [user, currentDay]);

  const handleDismiss = async (navigateToDay: number) => {
    if (!user || !visibleCard) return;
    const { data } = await supabase
      .from("profiles")
      .select("milestone_cards_shown")
      .eq("user_id", user.id)
      .single();
    const shown = (data as any)?.milestone_cards_shown || {};
    shown[visibleCard.key] = true;
    await supabase
      .from("profiles")
      .update({ milestone_cards_shown: shown } as any)
      .eq("user_id", user.id);
    setVisibleCard(null);
    onNavigateToDay(navigateToDay);
  };

  if (!visibleCard) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="relative p-5 bg-[#2A1F3D] border-t-2 border-t-[#C9A84C] border-[#2A1F3D]">
        <motion.div
          className="absolute top-3 right-3 text-[#C9A84C] font-serif text-sm font-bold"
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          1111
        </motion.div>

        <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold mb-2">
          {visibleCard.eyebrow}
        </p>

        <h3 className="font-serif text-lg font-bold text-[#F9F6F0] leading-relaxed mb-3 whitespace-pre-line">
          {visibleCard.headline}
        </h3>

        <p className="text-[#F9F6F0]/60 text-sm leading-relaxed mb-5">
          {visibleCard.body}
        </p>

        <Button
          onClick={() => handleDismiss(visibleCard.nextDay)}
          className="bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-semibold text-sm"
        >
          {visibleCard.buttonText}
        </Button>
      </Card>
    </motion.div>
  );
}
