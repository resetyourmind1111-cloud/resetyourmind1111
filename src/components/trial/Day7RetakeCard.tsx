import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { supabase } from "@/integrations/supabase/client";

/**
 * Day 7 Worth Thermostat retake invitation.
 * Renders only on Day 7 (trialDay === 6) AFTER the Day7CompletionModal has been shown,
 * and only if a `retake_type='day7'` row does not yet exist.
 */
export function Day7RetakeCard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isTrialActive, trialDay } = useTrialStatus();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!user || !isTrialActive || trialDay !== 6) {
      setShow(false);
      return;
    }
    let cancelled = false;
    (async () => {
      // Only show after the Day 7 celebration modal has been dismissed
      const { data: profile } = await supabase
        .from("profiles")
        .select("shown_day7_modal")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (!profile || !(profile as any).shown_day7_modal) return;

      const { count } = await (supabase as any)
        .from("assessment_results")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("retake_type", "day7");
      if (cancelled) return;

      if ((count ?? 0) === 0) setShow(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, isTrialActive, trialDay]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card className="p-6 bg-[#06060e] border-2 border-[#C9A84C]/60 shadow-[0_0_30px_rgba(201,168,76,0.18)] rounded-xl text-center">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] font-semibold mb-3">
            Your 7-Day Reset Results
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#F9F6F0] leading-tight mb-3">
            See how far you've come.
          </h2>
          <p className="text-[#F9F6F0]/75 text-sm md:text-base leading-relaxed mb-6">
            You took the Worth Thermostat on Day 1.<br />
            Seven days later — let's see what shifted.
          </p>
          <Button
            onClick={() => navigate("/assessment?retake=day7")}
            className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-serif font-semibold rounded-xl py-6 text-base"
          >
            Retake My Assessment →
          </Button>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
