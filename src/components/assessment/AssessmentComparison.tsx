import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, DollarSign, Briefcase, Shield, Zap, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { calculateCategoryScores, calculatePercentage } from "@/data/thermostatTypes";

const categoryIcons: Record<string, React.ElementType> = {
  love: Heart,
  money: DollarSign,
  career: Briefcase,
  boundaries: Shield,
  action: Zap,
};

const categoryLabels: Record<string, string> = {
  love: "Love",
  money: "Money",
  career: "Career",
  boundaries: "Boundaries",
  action: "Action",
};

interface ScoreRow {
  total_score: number;
  percentage_score: number;
  category_scores: Record<string, number>;
  answers: Record<string, number>;
}

export function AssessmentComparison() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [day1, setDay1] = useState<ScoreRow | null>(null);
  const [day7, setDay7] = useState<ScoreRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      // Day 1: earliest 'initial' (or any earliest row)
      const { data: initialRows } = await supabase
        .from("assessment_results")
        .select("total_score, percentage_score, category_scores, answers, retake_type, completed_at")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: true })
        .limit(5);

      const initialRow = initialRows?.find((r: any) => r.retake_type === "initial") ?? initialRows?.[0];

      // Day 7: most recent 'day7'
      const { data: day7Rows } = await (supabase as any)
        .from("assessment_results")
        .select("total_score, percentage_score, category_scores, answers")
        .eq("user_id", user.id)
        .eq("retake_type", "day7")
        .order("completed_at", { ascending: false })
        .limit(1);

      if (initialRow) {
        const cs = (initialRow as any).category_scores;
        setDay1({
          total_score: (initialRow as any).total_score,
          percentage_score: (initialRow as any).percentage_score,
          category_scores: typeof cs === "string" ? JSON.parse(cs) : cs ?? calculateCategoryScores((initialRow as any).answers ?? {}),
          answers: (initialRow as any).answers ?? {},
        });
      }
      if (day7Rows && day7Rows[0]) {
        const cs = (day7Rows[0] as any).category_scores;
        setDay7({
          total_score: (day7Rows[0] as any).total_score,
          percentage_score: (day7Rows[0] as any).percentage_score,
          category_scores: typeof cs === "string" ? JSON.parse(cs) : cs ?? calculateCategoryScores((day7Rows[0] as any).answers ?? {}),
          answers: (day7Rows[0] as any).answers ?? {},
        });
      }
      setLoading(false);
    })();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" />
      </div>
    );
  }

  if (!day1 || !day7) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="font-serif text-2xl text-foreground">Comparison not available</h2>
          <p className="text-muted-foreground text-sm">
            We need both your Day 1 and Day 7 scores to show the comparison.
          </p>
          <Button onClick={() => navigate("/home")} variant="outline">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const overallDelta = day7.percentage_score - day1.percentage_score;
  const improved = overallDelta > 0;
  const flat = overallDelta === 0;

  return (
    <div className="min-h-screen bg-[#06060e] py-12 px-4 md:px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] font-semibold mb-3">
            Your 7-Day Reset Results
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#F9F6F0] leading-tight">
            See how far you've come.
          </h1>
        </motion.div>

        {/* Column headers */}
        <div className="grid grid-cols-[auto_1fr_1fr] gap-3 md:gap-4 mb-4 px-1">
          <div />
          <p className="text-[10px] uppercase tracking-wider text-[#F9F6F0]/40 font-semibold text-center">Day 1</p>
          <p className="text-[10px] uppercase tracking-wider text-[#C9A84C] font-semibold text-center">Day 7</p>
        </div>

        {/* Per-category bars */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-[#C9A84C]/20 bg-[#0d0d18] p-5 md:p-6 mb-8 space-y-5"
        >
          {Object.keys(categoryLabels).map((cat, i) => {
            const Icon = categoryIcons[cat];
            const d1 = day1.category_scores[cat] ?? 0;
            const d7 = day7.category_scores[cat] ?? 0;
            const max = 25;
            const d1pct = (d1 / max) * 100;
            const d7pct = (d7 / max) * 100;
            const delta = d7 - d1;
            return (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-[#C9A84C]" />
                  <span className="text-sm text-[#F9F6F0]/90 font-medium flex-1">{categoryLabels[cat]}</span>
                  <span
                    className={
                      delta > 0
                        ? "text-xs font-bold text-emerald-400"
                        : delta < 0
                        ? "text-xs font-bold text-rose-400/80"
                        : "text-xs font-medium text-[#F9F6F0]/40"
                    }
                  >
                    {delta > 0 ? `+${delta} points` : delta < 0 ? `${delta} points` : "Same"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-2.5 rounded-full bg-[#1a1426] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${d1pct}%` }}
                      transition={{ delay: 0.4 + i * 0.08, duration: 0.6 }}
                      className="h-full rounded-full bg-[#3D1A6E]"
                    />
                  </div>
                  <div className="h-2.5 rounded-full bg-[#1a1426] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${d7pct}%` }}
                      transition={{ delay: 0.5 + i * 0.08, duration: 0.6 }}
                      className="h-full rounded-full bg-[#C9A84C]"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Overall delta */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 180 }}
          className="text-center mb-10"
        >
          <p className="text-[#F9F6F0]/60 text-sm mb-2">Your worth thermostat</p>
          <p className="font-serif text-5xl md:text-6xl font-bold text-[#C9A84C] mb-2">
            {improved ? `+${overallDelta}` : flat ? "—" : overallDelta}
            {!flat && <span className="text-2xl md:text-3xl"> pts</span>}
          </p>
          <p className="text-[#F9F6F0]/70 text-sm">
            {flat ? (
              <>You held steady through 7 days.</>
            ) : (
              <>
                {day1.percentage_score}% → <span className="text-[#C9A84C] font-semibold">{day7.percentage_score}%</span> in 7 days
              </>
            )}
          </p>
        </motion.div>

        {/* CTA block — branches on result */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="rounded-2xl border-2 border-[#C9A84C]/50 bg-[#0d0d18] p-6 md:p-8 text-center space-y-5"
        >
          {improved ? (
            <>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#F9F6F0] leading-snug">
                This is what 7 days of reset looks like.
              </h2>
              <p className="font-serif text-lg text-[#C9A84C] italic">
                Imagine what 30 days does.
              </p>
              <Button
                onClick={() => navigate("/upgrade")}
                size="lg"
                className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-serif font-bold text-base py-6 rounded-xl"
              >
                Make This Permanent →
              </Button>
            </>
          ) : (
            <>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#F9F6F0] leading-snug">
                You showed up.<br />That's the shift that matters most.
              </h2>
              <p className="text-[#F9F6F0]/75 text-sm md:text-base leading-relaxed">
                The deeper work begins in the full reset.
              </p>
              <Button
                onClick={() => navigate("/upgrade")}
                size="lg"
                className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-serif font-bold text-base py-6 rounded-xl"
              >
                Start My Full Reset →
              </Button>
            </>
          )}
        </motion.div>

        <button
          onClick={() => navigate("/home")}
          className="mt-6 w-full text-center text-sm text-[#F9F6F0]/40 hover:text-[#F9F6F0]/70 transition-colors"
        >
          ← Back to home
        </button>
      </div>
    </div>
  );
}
