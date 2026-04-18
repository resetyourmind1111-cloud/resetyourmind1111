import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { useSubscription } from "@/hooks/useSubscription";

export function Day7CompletionModal() {
  const { user } = useAuth();
  const { trialDay } = useTrialStatus();
  const { effectiveTier } = useSubscription();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [stats, setStats] = useState({ meditations: 1, tools: 1, interrupts: 1, streak: 1 });
  const [day6Entry, setDay6Entry] = useState<string | null>(null);

  useEffect(() => {
    if (!user || effectiveTier !== "free") return;
    // Fire on Day 7 OR after (Day 7+) so the celebration always plays before paywall
    if (trialDay < 7) return;

    const checkModal = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("shown_day7_modal, current_streak")
        .eq("user_id", user.id)
        .single();

      if (!profile || (profile as any).shown_day7_modal) return;

      const [{ count: medCount }, { count: toolCount }, { count: interruptCount }] = await Promise.all([
        supabase.from("meditation_completions").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("healing_tool_entries").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("pattern_interrupts").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);

      setStats({
        meditations: Math.max(medCount ?? 0, 1),
        tools: Math.max(toolCount ?? 0, 1),
        interrupts: Math.max(interruptCount ?? 0, 1),
        streak: Math.max((profile as any).current_streak ?? 0, 1),
      });

      // Pull Day 6 journal entry from daily_shifts
      const { data: shifts } = await (supabase.from("daily_shifts" as any) as any)
        .select("response, prompt, day_number")
        .eq("user_id", user.id)
        .order("entry_date", { ascending: false })
        .limit(20);

      if (shifts && Array.isArray(shifts)) {
        const day6 = shifts.find(
          (s: any) =>
            s.day_number === 6 ||
            (s.prompt && /different about me/i.test(s.prompt))
        );
        if (day6?.response) setDay6Entry(day6.response);
      }

      setShow(true);
    };

    checkModal();
  }, [user, trialDay, effectiveTier]);

  const markShown = async () => {
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ shown_day7_modal: true } as any)
      .eq("user_id", user.id);
  };

  const handleUpgrade = async () => {
    await markShown();
    setShow(false);
    navigate("/upgrade");
  };

  const handleDecideLater = async () => {
    await markShown();
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          /* z-[90] sits above TrialExpiredOverlay (z-50) so the celebration always plays first */
          className="fixed inset-0 z-[90] bg-[#06060e] flex items-center justify-center p-6 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-md w-full text-center space-y-6 py-8"
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] font-semibold">
              Your 7-Day Reset Is Complete
            </p>

            <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#F9F6F0] leading-relaxed">
              You did 7 days of seeing<br />yourself clearly.
            </h1>

            <p className="font-serif text-xl md:text-2xl text-[#C9A84C] italic leading-relaxed">
              The next 30 are where you become her.
            </p>

            <div className="w-16 h-px bg-[#C9A84C]/30 mx-auto" />

            <div className="grid grid-cols-2 gap-3 text-left">
              {[
                { n: stats.meditations, label: `Meditation${stats.meditations !== 1 ? "s" : ""} completed` },
                { n: stats.tools, label: `Tool${stats.tools !== 1 ? "s" : ""} used` },
                { n: stats.interrupts, label: `Pattern interrupt${stats.interrupts !== 1 ? "s" : ""}` },
                { n: stats.streak, label: `Day streak` },
              ].map((s) => (
                <div
                  key={s.label}
                  className="p-4 rounded-xl border border-[#C9A84C]/30 bg-[#C9A84C]/5"
                >
                  <p className="font-serif text-2xl font-bold text-[#C9A84C]">✦ {s.n}</p>
                  <p className="text-[#F9F6F0]/70 text-xs mt-1 leading-snug">{s.label}</p>
                </div>
              ))}
            </div>

            {day6Entry && (
              <div className="text-left">
                <div className="w-16 h-px bg-[#C9A84C]/30 mx-auto mb-4" />
                <div className="p-5 rounded-xl bg-[#F9F6F0]/5 border-l-2 border-[#C9A84C]">
                  <p className="text-[#C9A84C] text-2xl leading-none mb-2">❝</p>
                  <p className="text-[#F9F6F0]/85 text-sm italic leading-relaxed">{day6Entry}</p>
                  <p className="text-[#C9A84C]/70 text-xs mt-3 not-italic">— You, Day 6</p>
                </div>
              </div>
            )}

            <div className="w-16 h-px bg-[#C9A84C]/30 mx-auto" />

            <Button
              size="lg"
              onClick={handleUpgrade}
              className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-serif font-bold text-base py-6 rounded-xl"
            >
              Start My Full Reset →
            </Button>

            <button
              onClick={handleDecideLater}
              className="text-sm text-[#F9F6F0]/40 hover:text-[#F9F6F0]/60 transition-colors underline"
            >
              Remind me in 24 hours
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
