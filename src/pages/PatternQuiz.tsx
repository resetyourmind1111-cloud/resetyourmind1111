import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { TRAP_QUESTIONS, scoreTrap } from "@/data/identityTrapData";
import { TrialBackButton } from "@/components/TrialBackButton";

export default function PatternQuiz() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isRetake = searchParams.get("retake") === "true";

  const [checking, setChecking] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  // Guard: if a saved result already exists and they didn't ask to retake,
  // route them to /patterns (which shows their saved pattern + progress).
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      if (!user || isRetake) {
        setChecking(false);
        return;
      }
      const { data } = await supabase
        .from("identity_trap_results")
        .select("primary_trap, secondary_trap")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);
      if (cancelled) return;
      if (data && data.length > 0) {
        navigate("/patterns/result", {
          replace: true,
          state: { primary: data[0].primary_trap, secondary: data[0].secondary_trap },
        });
        return;
      }
      setChecking(false);
    };
    check();
    return () => { cancelled = true; };
  }, [user, isRetake, navigate]);

  const question = TRAP_QUESTIONS[current];
  const progress = ((current) / TRAP_QUESTIONS.length) * 100;

  const handleAnswer = async (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (current < TRAP_QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      // Score and save (upsert latest result for this user)
      const { primary, secondary } = scoreTrap(newAnswers);

      if (user) {
        await supabase.from("identity_trap_results").insert({
          user_id: user.id,
          primary_trap: primary,
          secondary_trap: secondary,
          quiz_answers: newAnswers,
        });
      }

      navigate("/patterns/result", { replace: true, state: { primary, secondary } });
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Back + Progress */}
      <div className="p-4 space-y-2">
        <TrialBackButton fallbackPath="/patterns" label="Back" />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{current + 1} of {TRAP_QUESTIONS.length}</span>
        </div>
        <Progress value={progress} className="h-1.5 bg-muted [&>[data-state]]:bg-primary" />
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg space-y-8"
          >
            <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground text-center leading-relaxed">
              {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((opt) => (
                <motion.button
                  key={opt.value}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAnswer(opt.value)}
                  className="w-full p-4 rounded-xl border-2 border-border/50 bg-card/60 hover:border-primary/60 hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)] text-left transition-all duration-200"
                >
                  <span className="text-sm text-foreground">{opt.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
