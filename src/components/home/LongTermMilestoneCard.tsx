import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { AnthemPlayer } from "@/components/anthem/AnthemPlayer";
import html2canvas from "html2canvas";
import { useRef } from "react";

interface MilestoneData {
  day: number;
  key: string;
  eyebrow: string;
  headline: string;
  body: string;
  ctaText: string;
  ctaRoute: string;
  showShare?: boolean;
}

const milestones: MilestoneData[] = [
  {
    day: 60, key: "day60", eyebrow: "DAY 60",
    headline: "Two months.\nYou are in the top 5% of people\nwho start a reset and actually continue.",
    body: "Most people stop before they feel it. You stayed until you did. That is not luck. That is identity.",
    ctaText: "Keep going →",
    ctaRoute: "/patterns/check-in",
  },
  {
    day: 90, key: "day90", eyebrow: "DAY 90",
    headline: "Three months.\nYour nervous system has been\nrecalibrating for 90 days.",
    body: "This is no longer a program. This is no longer something you're trying. This is who you are.\n\nThe pattern that brought you here is not gone — but it is no longer in charge.",
    ctaText: "Continue my reset →",
    ctaRoute: "/patterns/check-in",
  },
  {
    day: 180, key: "day180", eyebrow: "DAY 180",
    headline: "Six months.\nYou didn't just reset.\nYou rebuilt.",
    body: "Half a year ago you showed up. You've shown up every week since. What you've built here — the awareness, the patterns interrupted, the truths you've honored — nobody can take that from you.\n\nThis is your life now.",
    ctaText: "Share how far I've come",
    ctaRoute: "",
    showShare: true,
  },
];

export function LongTermMilestoneCard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [visibleCard, setVisibleCard] = useState<MilestoneData | null>(null);
  const [showAnthem, setShowAnthem] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("trial_start_date, longterm_cards_shown")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (!data) return;
        const startDate = (data as any).trial_start_date;
        if (!startDate) return;
        const daysSinceStart = Math.floor((Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
        const shown = ((data as any).longterm_cards_shown || {}) as Record<string, boolean>;

        const applicable = milestones
          .filter((m) => daysSinceStart >= m.day && !shown[m.key])
          .sort((a, b) => b.day - a.day);

        if (applicable.length > 0) {
          setVisibleCard(applicable[0]);
        }
      });
  }, [user]);

  const handleDismiss = async () => {
    if (!user || !visibleCard) return;
    const { data } = await supabase.from("profiles").select("longterm_cards_shown").eq("user_id", user.id).single();
    const shown = ((data as any)?.longterm_cards_shown || {}) as Record<string, boolean>;
    shown[visibleCard.key] = true;
    await supabase.from("profiles").update({ longterm_cards_shown: shown } as any).eq("user_id", user.id);

    if (visibleCard.showShare) {
      if (navigator.share) {
        await navigator.share({
          title: "6 months of Reset Your Mind 1111™",
          text: "6 months of Reset Your Mind 1111™. Permission granted. ✦\n#ResetYourMind1111 #180Days",
        });
      }
    } else {
      navigate(visibleCard.ctaRoute);
    }
    setVisibleCard(null);
  };

  if (!visibleCard) return null;

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
      <Card className="relative p-5 bg-[#2A1F3D] border-t-2 border-t-[#C9A84C] border-[#2A1F3D]">
        <motion.div
          className="absolute top-3 right-3 text-[#C9A84C] font-serif text-sm font-bold"
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          1111
        </motion.div>

        <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold mb-2">{visibleCard.eyebrow}</p>
        <h3 className="font-serif text-lg font-bold text-[#F9F6F0] leading-relaxed mb-3 whitespace-pre-line">{visibleCard.headline}</h3>
        <p className="text-[#F9F6F0]/60 text-sm leading-relaxed mb-4 whitespace-pre-line">{visibleCard.body}</p>

        {showAnthem ? (
          <div className="mb-4">
            <AnthemPlayer />
            <p className="text-[#F9F6F0]/40 text-xs italic mt-2 text-center">
              "This song means something different at {visibleCard.day} days than it did on Day 1."
            </p>
          </div>
        ) : (
          <button
            onClick={() => setShowAnthem(true)}
            className="text-sm text-[#C9A84C] hover:text-[#C9A84C]/80 transition-colors mb-4 block"
          >
            ▶ Play my reset anthem
          </button>
        )}

        <Button onClick={handleDismiss} className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-semibold text-sm">
          {visibleCard.ctaText}
        </Button>
      </Card>
    </motion.div>
  );
}
