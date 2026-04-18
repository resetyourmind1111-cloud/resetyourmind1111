import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTrialStatus } from "@/hooks/useTrialStatus";

interface DayCurriculum {
  eyebrow: string;
  theme: string;
  headline: string;
  buttonText: string;
  route: string;
}

const CURRICULUM: Record<number, DayCurriculum> = {
  1: {
    eyebrow: "Day 1 of 7 — See yourself clearly",
    theme: "See yourself clearly",
    headline: "Before anything changes, you have to see where you are.",
    buttonText: "Start Worth Thermostat →",
    route: "/assessment",
  },
  2: {
    eyebrow: "Day 2 of 7 — Name the pattern",
    theme: "Name the pattern",
    headline: "Now we name what's been running the show.",
    buttonText: "Discover your pattern →",
    route: "/patterns/quiz",
  },
  3: {
    eyebrow: "Day 3 of 7 — Your first interrupt",
    theme: "Your first interrupt",
    headline: "Knowing the pattern is step one. This is step two.",
    buttonText: "Do your first reset →",
    route: "/patterns",
  },
  4: {
    eyebrow: "Day 4 of 7 — Begin the journey",
    theme: "Begin the journey",
    headline: "The daily practice starts today.",
    buttonText: "Start Day 1 Experience →",
    route: "/30-day-experience",
  },
  5: {
    eyebrow: "Day 5 of 7 — Go deeper",
    theme: "Go deeper",
    headline: "Patterns don't break in a day. You're right on time.",
    buttonText: "Continue Day 2 →",
    route: "/30-day-experience",
  },
  6: {
    eyebrow: "Day 6 of 7 — Notice what shifted",
    theme: "Notice what shifted",
    headline: "Six days ago you didn't know any of this.",
    buttonText: "Your gift is waiting →",
    route: "/oracle",
  },
  7: {
    eyebrow: "Day 7 of 7 — Choose yourself",
    theme: "Choose yourself",
    headline: "This is the last day of your preview. Make it count.",
    buttonText: "See what's waiting →",
    route: "/upgrade",
  },
};

export function TrialDayCurriculumCard() {
  const navigate = useNavigate();
  const { trialDay, isTrialActive } = useTrialStatus();

  if (!isTrialActive) return null;

  // useTrialStatus returns trialDay 0-indexed (Day 1 = 0, Day 7 = 6).
  // Convert to 1-indexed display day, clamp to 1–7.
  const day = Math.min(Math.max(trialDay + 1, 1), 7);
  const content = CURRICULUM[day];
  if (!content) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-6"
    >
      <Card className="p-6 bg-[#1a1426] border-t-2 border-t-[#C9A84C] border-x-0 border-b-0 rounded-xl">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold mb-3">
          {content.eyebrow}
        </p>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#F9F6F0] leading-tight mb-5">
          {content.headline}
        </h2>
        <Button
          onClick={() => navigate(content.route)}
          className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-serif font-semibold rounded-xl py-6 text-base"
        >
          {content.buttonText}
        </Button>
      </Card>
    </motion.div>
  );
}
