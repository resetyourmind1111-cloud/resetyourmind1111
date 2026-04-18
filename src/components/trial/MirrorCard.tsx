import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { supabase } from "@/integrations/supabase/client";

const REASON_MAP: Record<string, string> = {
  stuck: "you said you felt stuck and didn't know why",
  sabotage: "you said you kept self-sabotaging",
  relationships: "you said your relationships weren't reflecting your worth",
  levelup: "you said you were ready to level up but needed the tools",
};

const FALLBACK_REASON = "you came here ready for something different";

interface JournalEntry {
  text: string;
  day: number;
}

/**
 * Day 4/5 Mirror Card — reflects the user's own words, score, and pattern back at them.
 * Conversion-critical. Shown once on Day 4; re-shown on Day 5 if dismissed; never again.
 */
export function MirrorCard() {
  const { user } = useAuth();
  const { isTrialActive, trialDay, trialExpired } = useTrialStatus();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [reason, setReason] = useState<string>(FALLBACK_REASON);
  const [worthScore, setWorthScore] = useState<number | null>(null);
  const [trapName, setTrapName] = useState<string | null>(null);
  const [journalEntry, setJournalEntry] = useState<JournalEntry | null>(null);
  const [daysIn, setDaysIn] = useState<number>(0);

  useEffect(() => {
    if (!user || !isTrialActive || trialExpired) return;
    // Only Day 4 (index 3) and Day 5 (index 4)
    if (trialDay < 3 || trialDay > 4) return;

    let cancelled = false;

    const load = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select(
          "mirror_card_shown, mirror_card_dismissed, onboarding_reason, primary_wound, trial_start_date"
        )
        .eq("user_id", user.id)
        .single();

      if (!profile || cancelled) return;
      const p = profile as any;

      // On Day 4: show only if never shown. On Day 5: show only if dismissed but not shown twice.
      const shouldShow =
        (trialDay === 3 && !p.mirror_card_shown) ||
        (trialDay === 4 && p.mirror_card_dismissed && !p.mirror_card_shown);
      // Simpler rule per spec: Day 4 first attempt, Day 5 retry if dismissed, never after.
      // Track shown_at_day in a simple way: if shown_shown is true, never again.
      const finalShow =
        !p.mirror_card_shown
          ? trialDay === 3 || (trialDay === 4 && p.mirror_card_dismissed)
          : false;

      if (!finalShow && !shouldShow) return;

      // Onboarding reason → human language
      const rawReason: string | null = p.onboarding_reason || p.primary_wound || null;
      if (rawReason && REASON_MAP[rawReason]) {
        setReason(REASON_MAP[rawReason]);
      }

      // Days since trial start
      if (p.trial_start_date) {
        const start = new Date(p.trial_start_date);
        const diff = Math.max(
          1,
          Math.floor((Date.now() - start.getTime()) / 86400000)
        );
        setDaysIn(diff);
      } else {
        setDaysIn(trialDay);
      }

      // Worth score (Day 1 / earliest assessment)
      const { data: assessment } = await supabase
        .from("assessment_results")
        .select("percentage_score, completed_at, retake_type")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (assessment?.percentage_score != null) {
        setWorthScore(assessment.percentage_score);
      }

      // Identity trap
      const { data: trap } = await supabase
        .from("identity_trap_results")
        .select("primary_trap")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (trap?.primary_trap) setTrapName(trap.primary_trap);

      // Most recent journal entry
      const { data: shifts } = await supabase
        .from("daily_shifts")
        .select("response, day_number, entry_date")
        .eq("user_id", user.id)
        .order("entry_date", { ascending: false })
        .limit(1);
      if (shifts && shifts[0]?.response) {
        setJournalEntry({
          text: shifts[0].response,
          day: (shifts[0] as any).day_number ?? trialDay,
        });
      }

      if (!cancelled) setShow(true);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user, isTrialActive, trialExpired, trialDay]);

  const markShown = async () => {
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ mirror_card_shown: true } as any)
      .eq("user_id", user.id);
  };

  const handleRetake = async () => {
    await markShown();
    setShow(false);
    navigate("/assessment?retake=true");
  };

  const handleDismiss = async () => {
    if (!user) return;
    // On Day 4 dismiss: mark dismissed only (so Day 5 re-shows). On Day 5: mark fully shown.
    if (trialDay === 3) {
      await supabase
        .from("profiles")
        .update({ mirror_card_dismissed: true } as any)
        .eq("user_id", user.id);
    } else {
      await markShown();
    }
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
          className="p-6 md:p-7 bg-[#06060e] border-0 border-l-4 border-l-[#C9A84C] rounded-xl"
          style={{ borderLeft: "4px solid #C9A84C" }}
        >
          <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[#C9A84C] mb-3">
            Your Reset So Far
          </p>

          <h3 className="font-serif text-[18px] md:text-[19px] leading-snug text-[#F9F6F0] font-bold mb-4">
            {daysIn} {daysIn === 1 ? "day" : "days"} ago, {reason}.
          </h3>

          <div className="text-[14px] leading-relaxed text-[#F9F6F0]/80 space-y-1 mb-5">
            {worthScore != null && <p>Your worth score was {worthScore}%.</p>}
            {trapName && <p>Your pattern: {trapName}.</p>}
            <p className="pt-3">Look at what you've done since then.</p>
            <p className="pt-2">
              You showed up.<br />
              You named the pattern.<br />
              You interrupted it.
            </p>
            <p className="pt-3 text-[#C9A84C] italic">That is not small.</p>
          </div>

          {journalEntry && (
            <div className="mb-5 p-4 rounded-lg bg-[#F9F6F0]/[0.04] border-l-2 border-[#C9A84C]">
              <p className="text-[#C9A84C] text-2xl leading-none mb-1">❝</p>
              <p className="text-[#F9F6F0]/85 text-[13px] italic leading-relaxed">
                {journalEntry.text}
              </p>
              <p className="text-[#C9A84C]/70 text-[11px] mt-2 not-italic">
                — You, Day {journalEntry.day}
              </p>
            </div>
          )}

          <Button
            onClick={handleRetake}
            className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-serif font-bold rounded-xl py-5"
          >
            See how far I've come →
          </Button>

          <button
            onClick={handleDismiss}
            className="w-full mt-3 text-[12px] text-[#F9F6F0]/45 hover:text-[#F9F6F0]/65 transition-colors"
          >
            Keep going →
          </button>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
