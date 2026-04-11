import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface CheckinCardData {
  day: number;
  key: string;
  headline: string;
  body: string;
  buttonText: string;
  route: string; // "check-in" or "primary" (resolved at runtime)
  dismissText: string;
}

const checkinCards: CheckinCardData[] = [
  {
    day: 5, key: "day5",
    headline: "Which pattern showed up for you this week?",
    body: "Five days of doing the work — and patterns don't go quietly. Which one tried to pull you back?",
    buttonText: "Check in with my pattern →",
    route: "/patterns/check-in",
    dismissText: "I'm good",
  },
  {
    day: 10, key: "day10",
    headline: "Your pattern has had 10 days to fight back. Has it?",
    body: "Halfway to the two-week mark. This is when patterns get loud. Check in and interrupt it.",
    buttonText: "Do a pattern reset →",
    route: "primary",
    dismissText: "Not today",
  },
  {
    day: 15, key: "day15",
    headline: "Halfway through. Time to check your pattern.",
    body: "15 days in. The nervous system is starting to feel the shift. Give it another reset.",
    buttonText: "Open my pattern reset →",
    route: "primary",
    dismissText: "I'll do it later",
  },
  {
    day: 20, key: "day20",
    headline: "Four days from the finish line. What is your pattern doing right now?",
    body: "This close to completion, patterns often make their loudest move. Don't let it win here.",
    buttonText: "Check in now →",
    route: "/patterns/check-in",
    dismissText: "I'm staying strong",
  },
  {
    day: 25, key: "day25",
    headline: "Almost there.\nThis is where the pattern\nmakes its last stand.",
    body: "Five days left. You've come too far to hand it back now. One quick reset and keep going.",
    buttonText: "Do my final reset →",
    route: "primary",
    dismissText: "I've got this",
  },
];

interface PatternCheckinCardProps {
  completedDay: number; // the day just completed
}

export function PatternCheckinCard({ completedDay }: PatternCheckinCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [card, setCard] = useState<CheckinCardData | null>(null);
  const [primaryTrap, setPrimaryTrap] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const match = checkinCards.find((c) => c.day === completedDay);
    if (!match) return;

    const check = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("pattern_checkin_cards_shown, primary_wound")
        .eq("user_id", user.id)
        .single();
      const shown = (data as any)?.pattern_checkin_cards_shown || {};
      setPrimaryTrap((data as any)?.primary_wound || null);
      if (!shown[match.key]) {
        setCard(match);
      }
    };
    check();
  }, [user, completedDay]);

  const dismiss = async () => {
    if (!user || !card) return;
    const { data } = await supabase
      .from("profiles")
      .select("pattern_checkin_cards_shown")
      .eq("user_id", user.id)
      .single();
    const shown = (data as any)?.pattern_checkin_cards_shown || {};
    shown[card.key] = true;
    await supabase
      .from("profiles")
      .update({ pattern_checkin_cards_shown: shown } as any)
      .eq("user_id", user.id);
    setCard(null);
  };

  const handleAction = async () => {
    await dismiss();
    if (card?.route === "primary" && primaryTrap) {
      // Map wound to trap slug
      const trapMap: Record<string, string> = {
        wealth: "scarcity-loop",
        love: "over-giver",
        health: "burnout-cycle",
        identity: "i-know-but",
      };
      navigate(`/patterns/${trapMap[primaryTrap] || "scarcity-loop"}`);
    } else {
      navigate(card?.route || "/patterns/check-in");
    }
  };

  if (!card) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4"
    >
      <Card className="p-5 bg-[#2A1F3D] border-[#2A1F3D]">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold mb-2">
          Your Pattern Check-In
        </p>

        <h3 className="font-serif text-base font-bold text-[#F9F6F0] leading-relaxed mb-2 whitespace-pre-line">
          {card.headline}
        </h3>

        <p className="text-[#F9F6F0]/60 text-sm leading-relaxed mb-4">
          {card.body}
        </p>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleAction}
            size="sm"
            className="bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-semibold text-xs"
          >
            {card.buttonText}
          </Button>
          <button
            onClick={dismiss}
            className="text-xs text-[#F9F6F0]/40 hover:text-[#F9F6F0]/60 transition-colors"
          >
            {card.dismissText}
          </button>
        </div>
      </Card>
    </motion.div>
  );
}
