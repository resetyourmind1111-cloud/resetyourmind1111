import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { TrialResumeAction } from "@/hooks/useTrialResume";

interface WelcomeBackCardProps {
  loading?: boolean;
  nextAction?: TrialResumeAction | null;
}

export function WelcomeBackCard({ loading = false, nextAction = null }: WelcomeBackCardProps) {
  const { isTrialActive, trialDay } = useTrialStatus();
  const dayLabel = Math.min(trialDay + 1, 7);

  // Don't show on Day 1 (Lorie welcome shows instead) or if not trial
  if (!isTrialActive || dayLabel <= 1 || loading || !nextAction) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <div className="rounded-2xl border border-[#C9A84C]/30 overflow-hidden" style={{ background: "linear-gradient(135deg, #2A1F3D, #1a1230)" }}>
        <div className="h-1 bg-gradient-to-r from-[#C9A84C] to-[#C9A84C]/60" />
        <div className="p-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold mb-2">
            {dayLabel === 7 ? `Day 7 of 7` : `Welcome Back`}
          </p>
          <h3 className="font-serif text-xl text-[#F9F6F0] mb-1">
            {dayLabel === 7 ? `Your preview ends today.` : `Day ${dayLabel} of 7. Your reset continues.`}
          </h3>
          <p className="text-[#F9F6F0]/50 text-sm mb-4">
            {dayLabel === 7 ? `Make it permanent before midnight.` : `Pick up where you left off.`}
          </p>
          {nextAction && (
            <Link to={nextAction.href}>
              <Button className="bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#0A0A0A] font-semibold rounded-xl">
                {nextAction.label}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
