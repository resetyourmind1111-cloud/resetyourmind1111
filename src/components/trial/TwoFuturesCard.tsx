import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const REASON_MAP: Record<string, string> = {
  stuck: "Felt stuck and didn't know why",
  sabotage: "Kept self-sabotaging",
  relationships: "Relationships weren't reflecting your worth",
  levelup: "Ready to level up — needed the tools",
};

interface TwoFuturesCardProps {
  onUpgrade: () => void;
}

/**
 * Two Futures card — drops inside Day7CompletionModal to show the gap
 * between Day 1 (their actual data) and Day 30 (their possible future).
 */
export function TwoFuturesCard({ onUpgrade }: TwoFuturesCardProps) {
  const { user } = useAuth();
  const [reason, setReason] = useState<string | null>(null);
  const [worthScore, setWorthScore] = useState<number | null>(null);
  const [trapName, setTrapName] = useState<string | null>(null);
  const [earliestEntry, setEarliestEntry] = useState<string | null>(null);
  const [worthSnapshotTaken, setWorthSnapshotTaken] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const load = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_reason, primary_wound")
        .eq("user_id", user.id)
        .single();

      const raw: string | null = (profile as any)?.onboarding_reason ||
        (profile as any)?.primary_wound || null;
      if (raw && REASON_MAP[raw] && !cancelled) setReason(REASON_MAP[raw]);

      const { data: assessment } = await supabase
        .from("assessment_results")
        .select("percentage_score")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (!cancelled) {
        if (assessment?.percentage_score != null) {
          setWorthScore(assessment.percentage_score);
        } else if (assessment) {
          setWorthSnapshotTaken(true);
        }
      }

      const { data: trap } = await supabase
        .from("identity_trap_results")
        .select("primary_trap")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (!cancelled && trap?.primary_trap) setTrapName(trap.primary_trap);

      const { data: shifts } = await supabase
        .from("daily_shifts")
        .select("response")
        .eq("user_id", user.id)
        .order("entry_date", { ascending: true })
        .limit(1);
      if (!cancelled && shifts?.[0]?.response) {
        const words = shifts[0].response.split(/\s+/);
        const truncated =
          words.length > 12 ? words.slice(0, 12).join(" ") + "…" : shifts[0].response;
        setEarliestEntry(truncated);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="text-left"
    >
      <div className="rounded-2xl border border-[#C9A84C]/30 bg-[#06060e]/60 overflow-hidden">
        <div className="grid grid-cols-2 relative">
          {/* LEFT — Day 1 */}
          <div className="p-5 pr-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#F9F6F0]/55 font-semibold mb-3">
              Day 1
            </p>
            <ul className="space-y-2 text-[13px] text-[#F9F6F0]/70 leading-relaxed">
              {reason && <li>{reason}</li>}
              {worthScore != null ? (
                <li>{worthScore}% worth score</li>
              ) : worthSnapshotTaken ? (
                <li>Your worth snapshot was taken</li>
              ) : null}
              {trapName && <li>Pattern: {trapName}</li>}
              {earliestEntry && (
                <li className="italic text-[#F9F6F0]/55">"{earliestEntry}"</li>
              )}
            </ul>
          </div>

          {/* Gold divider */}
          <div className="absolute left-1/2 top-4 bottom-4 w-px bg-[#C9A84C]/40 -translate-x-1/2" />

          {/* RIGHT — Day 30 */}
          <div className="p-5 pl-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#C9A84C] font-semibold mb-3">
              Day 30
            </p>
            <ul className="space-y-2 text-[13px] text-[#F9F6F0] leading-relaxed">
              <li>Pattern interrupting daily</li>
              <li>Worth score rising</li>
              <li>Full Emotional Surgery™ complete</li>
              <li>30 days of proof you can keep</li>
            </ul>
          </div>
        </div>

        <div className="px-5 pb-5 pt-2">
          <p className="font-serif text-[15px] md:text-base text-[#F9F6F0] text-center leading-snug mb-4">
            One decision separates these two versions of you.
          </p>
          <Button
            onClick={onUpgrade}
            size="lg"
            className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-serif font-bold rounded-xl py-5"
          >
            I choose Day 30 →
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
