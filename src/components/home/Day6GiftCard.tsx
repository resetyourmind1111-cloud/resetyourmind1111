import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Day6GiftCardProps {
  trialDay: number;
  isTrialActive: boolean;
}

/**
 * Day 6 surprise unlock — bonus oracle pull + bonus permission slip.
 * Fires once per user and is permanently dismissed after.
 */
export function Day6GiftCard({ trialDay, isTrialActive }: Day6GiftCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!user || !isTrialActive || trialDay !== 6) return;
    let cancelled = false;
    supabase
      .from("profiles")
      .select("day6_gift_shown")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (!cancelled && data && !(data as any).day6_gift_shown) {
          setShow(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [user, trialDay, isTrialActive]);

  const markShown = async () => {
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ day6_gift_shown: true } as any)
      .eq("user_id", user.id);
  };

  const handleOpen = async () => {
    if (!user) return;
    // Reset bonus flag so the next oracle pull doesn't count against the cap.
    await supabase
      .from("profiles")
      .update({
        day6_gift_shown: true,
        day6_bonus_oracle_used: false,
      } as any)
      .eq("user_id", user.id);
    setShow(false);
    navigate("/oracle?bonus=1");
  };

  const handleDismiss = async () => {
    setShow(false);
    await markShown();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-6"
        >
          <Card className="relative p-6 bg-card border-2 border-[#C9A84C] shadow-[0_0_30px_rgba(201,168,76,0.15)]">
            <button
              onClick={handleDismiss}
              aria-label="Dismiss gift"
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-foreground/10 transition-colors text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>

            <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold mb-3">
              A Gift For Showing Up
            </p>
            <h3 className="font-serif text-2xl font-bold text-foreground mb-3 leading-tight">
              You made it to Day 6.
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 whitespace-pre-line">
              {`Most people don't get here.\nThe pattern said stop. You didn't.\nHere's something extra — just for you.`}
            </p>

            <ul className="space-y-2 mb-5">
              <li className="flex items-start gap-2 text-sm text-foreground/90">
                <Check className="w-4 h-4 text-[#C9A84C] mt-0.5 shrink-0" />
                <span>One bonus Permission Granted oracle pull</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-foreground/90">
                <Check className="w-4 h-4 text-[#C9A84C] mt-0.5 shrink-0" />
                <span>One bonus Permission Slip draw</span>
              </li>
            </ul>

            <Button
              onClick={handleOpen}
              className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-semibold rounded-xl py-6"
            >
              Open My Gift →
            </Button>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
