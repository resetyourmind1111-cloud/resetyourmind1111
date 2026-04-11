import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { useNavigate } from "react-router-dom";

export function Day3AcknowledgmentCard() {
  const { user } = useAuth();
  const { isTrialActive, trialDay } = useTrialStatus();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!user || !isTrialActive || trialDay !== 3) return;

    const check = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("day3_card_shown")
        .eq("user_id", user.id)
        .single();
      if (data && !(data as any).day3_card_shown) {
        setShow(true);
      }
    };
    check();
  }, [user, isTrialActive, trialDay]);

  const dismiss = async () => {
    setShow(false);
    if (user) {
      await supabase
        .from("profiles")
        .update({ day3_card_shown: true } as any)
        .eq("user_id", user.id);
    }
  };

  const handleContinue = async () => {
    await dismiss();
    navigate("/patterns/check-in");
  };

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-6"
    >
      <Card className="relative p-5 bg-[#2A1F3D] border-t-2 border-t-[#C9A84C] border-[#2A1F3D]">
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-[#F9F6F0]/40 hover:text-[#F9F6F0]/70 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold mb-2">
          Day 3
        </p>

        <h3 className="font-serif text-lg font-bold text-[#F9F6F0] leading-relaxed mb-3">
          Three days in.<br />
          Most people have already stopped.<br />
          You haven't.
        </h3>

        <p className="text-[#F9F6F0]/60 text-sm leading-relaxed mb-5">
          That matters more than you know.
          Every time you come back, you're building something
          the pattern can't take from you.
        </p>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleContinue}
            className="bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-semibold text-sm"
          >
            Continue my reset →
          </Button>
          <button
            onClick={dismiss}
            className="text-sm text-[#F9F6F0]/40 hover:text-[#F9F6F0]/60 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </Card>
    </motion.div>
  );
}
