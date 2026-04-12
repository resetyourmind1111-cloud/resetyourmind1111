import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useTrialStatus } from "@/hooks/useTrialStatus";

export function WelcomeBackCard() {
  const { user } = useAuth();
  const { isTrialActive, trialDay } = useTrialStatus();
  const [nextAction, setNextAction] = useState<{ label: string; href: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isTrialActive) {
      setLoading(false);
      return;
    }

    async function determineNextAction() {
      // Check assessment (Worth Thermostat)
      const { data: assessment } = await supabase
        .from("assessment_results")
        .select("id")
        .eq("user_id", user!.id)
        .limit(1);

      if (!assessment || assessment.length === 0) {
        setNextAction({ label: "Continue — Worth Thermostat →", href: "/assessment" });
        setLoading(false);
        return;
      }

      // Check Identity Trap quiz
      const { data: trapResult } = await supabase
        .from("identity_trap_results")
        .select("id")
        .eq("user_id", user!.id)
        .limit(1);

      if (!trapResult || trapResult.length === 0) {
        setNextAction({ label: "Continue — Discover Your Pattern →", href: "/patterns/quiz" });
        setLoading(false);
        return;
      }

      // Check nervous system checkin (first reset)
      const { data: checkins } = await supabase
        .from("nervous_system_checkins")
        .select("id")
        .eq("user_id", user!.id)
        .limit(1);

      if (!checkins || checkins.length === 0) {
        setNextAction({ label: "Continue — Your First Reset →", href: "/healing-tools/nervous-system-diagnostic" });
        setLoading(false);
        return;
      }

      setNextAction({ label: `Continue — Day ${trialDay} Check In →`, href: "/patterns/check-in" });
      setLoading(false);
    }

    determineNextAction();
  }, [user, isTrialActive, trialDay]);

  // Don't show on Day 1 (Lorie welcome shows instead) or if not trial
  if (!isTrialActive || trialDay <= 1 || loading) return null;

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
            Welcome Back
          </p>
          <h3 className="font-serif text-xl text-[#F9F6F0] mb-1">
            Day {trialDay} of 7. Your reset continues.
          </h3>
          <p className="text-[#F9F6F0]/50 text-sm mb-4">
            Pick up where you left off.
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
