import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { TRAP_SLUGS } from "@/data/identityTrapData";

interface DayAction {
  label: string;
  buttonText: string;
  route: string;
  subText?: string;
}

export function TrialJourneyBar() {
  const { user } = useAuth();
  const { isTrialActive, trialDay } = useTrialStatus();
  const navigate = useNavigate();
  const [primaryTrap, setPrimaryTrap] = useState<string | null>(null);
  const [hasQuiz, setHasQuiz] = useState(false);
  const [hasReset, setHasReset] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("identity_trap_results")
      .select("primary_trap")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setPrimaryTrap(data[0].primary_trap);
          setHasQuiz(true);
        }
      });
    supabase
      .from("pattern_interrupts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .then(({ count }) => setHasReset((count ?? 0) > 0));
  }, [user]);

  if (!isTrialActive) return null;

  const trapSlug = primaryTrap ? TRAP_SLUGS[primaryTrap] : null;

  const getDayAction = (): DayAction => {
    const day = Math.max(1, Math.min(trialDay, 7));
    switch (day) {
      case 1:
        return { label: "Start here → Take your Worth Thermostat Assessment", buttonText: "Open Assessment", route: "/assessment" };
      case 2:
        if (hasQuiz && trapSlug) return { label: "Today → Do Your First Pattern Reset", buttonText: "Start Reset", route: `/patterns/${trapSlug}` };
        return { label: "Today → Discover your Identity Pattern", buttonText: "Take the Quiz", route: "/patterns/quiz" };
      case 3:
        if (hasReset) return { label: "Today → Try a Meditation", buttonText: "Open Meditations", route: "/meditations" };
        return { label: "Today → Complete your first Pattern Reset", buttonText: "Open My Patterns", route: "/patterns" };
      case 4:
        return { label: "Today → Check in with your pattern", buttonText: "Daily Check-In", route: "/patterns/check-in" };
      case 5:
        return { label: "Today → Do your second Pattern Reset", buttonText: "Continue Reset", route: trapSlug ? `/patterns/${trapSlug}` : "/patterns" };
      case 6:
        return { label: "Tomorrow your preview ends", buttonText: "Use Your Final Free Tool", route: "/patterns/check-in", subText: "Your full reset is one tap away after Day 7." };
      case 7:
      default:
        return { label: "Today is your last free day.", buttonText: "Complete Your Reset Journey", route: trapSlug ? `/patterns/${trapSlug}` : "/patterns", subText: "Don't lose your momentum — continue with full access." };
    }
  };

  const action = getDayAction();
  const progressPercent = (Math.min(trialDay, 7) / 7) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mb-6 p-5 rounded-xl border border-primary/30 bg-card/80"
    >
      <p className="text-xs text-primary font-semibold mb-2">
        Day {Math.min(trialDay, 7)} of 7 — Your Free Reset Experience
      </p>
      <Progress value={progressPercent} className="h-1.5 mb-4 bg-muted [&>[data-state]]:bg-primary" />

      <p className="text-sm text-foreground mb-3">{action.label}</p>
      <Button
        variant="gold"
        size="sm"
        className="w-full"
        onClick={() => navigate(action.route)}
      >
        {action.buttonText}
      </Button>
      {action.subText && (
        <p className="text-[11px] text-muted-foreground/60 text-center mt-2">{action.subText}</p>
      )}
    </motion.div>
  );
}
