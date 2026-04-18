import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { useSubscription } from "@/hooks/useSubscription";
import { useFoundingMode } from "@/hooks/useFoundingMode";

interface ShiftEntry {
  prompt: string;
  response: string;
}

export function Day7CompletionModal() {
  const { user } = useAuth();
  const { trialDay, isTrialActive } = useTrialStatus();
  const { effectiveTier } = useSubscription();
  const { foundingMode, spotsRemaining } = useFoundingMode();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [stats, setStats] = useState({ interrupts: 0, resets: 0, streak: 0 });
  const [shifts, setShifts] = useState<ShiftEntry[]>([]);

  useEffect(() => {
    if (!user || effectiveTier !== "free") return;
    if (!isTrialActive || trialDay < 7) return;

    const checkModal = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("shown_day7_modal")
        .eq("user_id", user.id)
        .single();

      if (profile && !(profile as any).shown_day7_modal) {
        const { count: interruptCount } = await supabase
          .from("pattern_interrupts")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);

        const { data: progress } = await supabase
          .from("pattern_progress")
          .select("total_interrupts, self_trust_streak")
          .eq("user_id", user.id)
          .maybeSingle();

        setStats({
          interrupts: interruptCount ?? 1,
          resets: (progress as any)?.total_interrupts ?? 1,
          streak: (progress as any)?.self_trust_streak ?? 1,
        });

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const { data: shiftData } = await (supabase.from("daily_shifts" as any) as any)
          .select("prompt, response")
          .eq("user_id", user.id)
          .gte("entry_date", weekAgo.toISOString().split("T")[0])
          .order("entry_date", { ascending: false })
          .limit(3);

        if (shiftData) setShifts(shiftData);

        setShow(true);
      }
    };

    checkModal();
  }, [user, trialDay, isTrialActive, effectiveTier]);

  const handleDismiss = async (route: string) => {
    if (user) {
      await supabase
        .from("profiles")
        .update({ shown_day7_modal: true } as any)
        .eq("user_id", user.id);
    }
    setShow(false);
    navigate(route);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-[#06060e] flex items-center justify-center p-6 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-md w-full text-center space-y-6"
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] font-semibold">
              Your 7-Day Reset Is Complete
            </p>

            <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#F9F6F0] leading-relaxed">
              You interrupted a pattern this week.{"\n"}That is not small.
            </h1>

            <p className="text-[#F9F6F0]/60 text-sm leading-relaxed">
              But one week isn't enough to change a pattern that's been running for years.
              <br /><br />
              You've felt the shift. Now you need the system.
            </p>

            <div className="w-16 h-px bg-[#C9A84C]/30 mx-auto" />

            <div className="flex flex-wrap gap-2 justify-center">
              {[
                `${Math.max(stats.interrupts, 1)} Pattern interrupt${stats.interrupts !== 1 ? "s" : ""}`,
                `${Math.max(stats.resets, 1)} Reset${stats.resets !== 1 ? "s" : ""} completed`,
                `${Math.max(stats.streak, 1)} Day streak`,
              ].map((s) => (
                <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#C9A84C]/30 text-xs text-[#C9A84C] font-medium">
                  ✦ {s}
                </span>
              ))}
            </div>

            {/* Day 7 Shift Reveal */}
            {shifts.length > 0 ? (
              <div className="text-left space-y-3">
                <div className="w-16 h-px bg-[#C9A84C]/30 mx-auto" />
                <h2 className="font-serif text-lg font-bold text-[#F9F6F0] text-center">
                  Here's what shifted this week.<br />In your own words.
                </h2>
                {shifts.map((s, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#F9F6F0]/5 border border-[#C9A84C]/15">
                    <p className="text-[#C9A84C] text-lg leading-none mb-1">❝</p>
                    <p className="text-[#F9F6F0]/80 text-sm italic">{s.response}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-px bg-[#C9A84C]/30 mx-auto mb-3" />
                <p className="text-[#F9F6F0]/50 text-sm italic">
                  You were here every day.<br />That's the shift that matters most.
                </p>
              </div>
            )}

            <div className="w-16 h-px bg-[#C9A84C]/30 mx-auto" />

            <div className="p-5 rounded-xl bg-[#3D1A6E]/15 border border-[#3D1A6E]/30 text-left">
              <p className="text-xs uppercase tracking-wider text-[#C9A84C] font-semibold mb-3">
                What's waiting inside full access
              </p>
              {[
                "Full 30-Day Reset Experience (Days 1–30)",
                "All 5 Identity Trap Modules + Resets",
                "Complete Emotional Surgery™ Sessions",
                "Full Meditation Library",
                "AI Support — available anytime",
                "Self-Trust Streak + Progress Dashboard",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 mb-1.5">
                  <Check className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                  <span className="text-[#F9F6F0]/70 text-sm">{item}</span>
                </div>
              ))}
            </div>

            {foundingMode ? (
              <>
                <Button
                  size="lg"
                  onClick={() => handleDismiss("/upgrade")}
                  className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-serif font-bold text-base py-6 rounded-xl"
                >
                  Lock In My Founding Rate
                </Button>
                <button onClick={() => handleDismiss("/home")} className="text-sm text-[#F9F6F0]/40 hover:text-[#F9F6F0]/60 transition-colors underline">
                  I'll decide later
                </button>
                <button onClick={() => handleDismiss("/home")} className="text-sm text-[#F9F6F0]/40 hover:text-[#F9F6F0]/60 transition-colors underline">
                  I'll decide later
                </button>
                <p className="text-xs text-[#F9F6F0]/40">
                  {spotsRemaining} spots remaining. When they're gone, they're gone.
                </p>
              </>
            ) : (
              <>
                <Button
                  size="lg"
                  onClick={() => handleDismiss("/upgrade")}
                  className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-serif font-bold text-base py-6 rounded-xl"
                >
                  I'm Ready — Continue My Transformation
                </Button>
                <button onClick={() => handleDismiss("/upgrade")} className="text-sm text-[#F9F6F0]/40 hover:text-[#F9F6F0]/60 transition-colors underline">
                  See all access options
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
