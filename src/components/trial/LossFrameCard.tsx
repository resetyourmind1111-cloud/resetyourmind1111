import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { supabase } from "@/integrations/supabase/client";

const STAYS_FREE = [
  "Your Worth Thermostat score",
  "Your identity pattern result",
  "Your Day 1–3 journal entries",
  "Your permission slips received",
];

const UPGRADE_KEEPS = [
  "Your full streak + history",
  "Your reset map progress",
  "All saved tools + sessions",
  "Everything you build in Days 7–30",
  "Your pattern reset — complete",
];

/**
 * Day 6 Loss Frame card — appears after Day6GiftCard interaction on Day 6 only.
 * Honest, warm framing of what stays vs. what's preserved by upgrading.
 * Shown exactly once.
 */
export function LossFrameCard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isTrialActive, trialDay, trialExpired } = useTrialStatus();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!user || !isTrialActive || trialExpired) return;
    if (trialDay !== 5) return; // Day 6 = index 5

    let cancelled = false;
    supabase
      .from("profiles")
      .select("loss_frame_shown, day6_gift_shown")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (cancelled || !data) return;
        const p = data as any;
        // Only show after Day 6 gift has been interacted with
        if (p.day6_gift_shown && !p.loss_frame_shown) {
          setShow(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [user, isTrialActive, trialExpired, trialDay]);

  const markShown = async () => {
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ loss_frame_shown: true } as any)
      .eq("user_id", user.id);
  };

  const handleUpgrade = async () => {
    await markShown();
    setShow(false);
    navigate("/upgrade");
  };

  const handleDismiss = async () => {
    await markShown();
    setShow(false);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <Card
          className="p-6 md:p-7 rounded-xl border-0 overflow-hidden"
          style={{
            backgroundColor: "#3D1A6E",
            borderTop: "3px solid #C9A84C",
          }}
        >
          <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[#C9A84C] mb-3">
            Tomorrow Is Day 7
          </p>

          <h3 className="font-serif text-[17px] md:text-[18px] leading-snug text-[#F9F6F0] font-bold mb-5">
            Here's what happens when your preview ends.
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-[#F9F6F0]/60 font-semibold mb-3">
                Stays free forever
              </p>
              <ul className="space-y-2">
                {STAYS_FREE.map((item) => (
                  <li
                    key={item}
                    className="text-[13px] text-[#F9F6F0]/85 leading-snug flex gap-2"
                  >
                    <span className="text-[#C9A84C]">✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-wide text-[#C9A84C] font-semibold mb-3">
                Yours when you upgrade
              </p>
              <ul className="space-y-2">
                {UPGRADE_KEEPS.map((item) => (
                  <li
                    key={item}
                    className="text-[13px] text-[#C9A84C] leading-snug flex gap-2"
                  >
                    <span>✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-[13px] text-[#F9F6F0]/75 text-center leading-relaxed mb-5">
            You've built something real in 6 days.<br />
            Upgrading means it stays yours.<br />
            Cancelling means starting over.
          </p>

          <Button
            onClick={handleUpgrade}
            className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-serif font-bold rounded-xl py-5"
          >
            Keep everything I've built →
          </Button>

          <button
            onClick={handleDismiss}
            className="w-full mt-3 text-[12px] text-[#F9F6F0]/55 hover:text-[#F9F6F0]/80 transition-colors"
          >
            I'll decide tomorrow
          </button>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
