import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { track } from "@/lib/analytics";
import { toast } from "sonner";
import { Sparkles, ArrowLeft, Loader2, Check } from "lucide-react";

type Step = "intro" | "questions" | "loading" | "result";

type Answers = {
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string;
  q6?: string;
};

type PatternResult = {
  pattern: string;
  why: string;
  showing_up: string[];
  protecting: string;
  small_shift: string;
  recommended_tool: string;
  first_step: string;
};

const QUESTIONS: { key: keyof Answers; question: string; options?: string[]; freeText?: boolean }[] = [
  {
    key: "q1",
    question: "What area of life feels most frustrating right now?",
    options: ["Health", "Relationships", "Money", "Career", "Business", "Confidence", "Purpose"],
  },
  {
    key: "q2",
    question: "What do you find yourself doing most often?",
    options: [
      "Overthinking",
      "Procrastinating",
      "Avoiding",
      "People pleasing",
      "Trying to control everything",
      "Starting but not finishing",
      "Doubting myself",
    ],
  },
  {
    key: "q3",
    question: "What feels hardest right now?",
    options: [
      "Taking action",
      "Trusting myself",
      "Setting boundaries",
      "Being consistent",
      "Being visible",
      "Receiving support",
      "Believing I deserve more",
    ],
  },
  {
    key: "q4",
    question: "When things start going well, what usually happens?",
    options: [
      "I pull back",
      "I get overwhelmed",
      "I overthink",
      "I lose consistency",
      "I sabotage it",
      "I'm not sure",
    ],
  },
  {
    key: "q5",
    question: "Which statement feels most true?",
    options: [
      "I never feel good enough",
      "I don't trust myself",
      "I feel responsible for everyone",
      "I fear failure",
      "I fear success",
      "I need certainty before acting",
      "I struggle to receive",
    ],
  },
  {
    key: "q6",
    question: "If one thing could change in the next 30 days, what would you want it to be?",
    freeText: true,
  },
];

// Map pattern → in-app route for "Start My Reset"
const PATTERN_TO_RESET_ROUTE: Record<string, string> = {
  "Worthiness Pattern": "/assessment",
  "Perfectionism Pattern": "/manifesto",
  "Visibility Pattern": "/manifesto",
  "People-Pleasing Pattern": "/emotional-surgery",
  "Scarcity Pattern": "/assessment",
  "Control Pattern": "/support-flow",
  "Avoidance Pattern": "/manifesto",
  "Fear of Failure Pattern": "/emotional-surgery",
  "Fear of Success Pattern": "/assessment",
  "Self-Abandonment Pattern": "/emotional-surgery",
};

export default function WhatsMyPattern() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [freeTextValue, setFreeTextValue] = useState("");
  const [result, setResult] = useState<PatternResult | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hydrating, setHydrating] = useState(true);

  // Load most recent saved result on mount
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!user) {
        setHydrating(false);
        return;
      }
      const { data } = await supabase
        .from("whats_my_pattern_results")
        .select("pattern, why, showing_up, protecting, small_shift, recommended_tool, first_step, answers")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cancelled) return;
      if (data?.pattern) {
        setResult({
          pattern: data.pattern,
          why: data.why ?? "",
          showing_up: (data.showing_up as string[]) ?? [],
          protecting: data.protecting ?? "",
          small_shift: data.small_shift ?? "",
          recommended_tool: data.recommended_tool ?? "",
          first_step: data.first_step ?? "",
        });
        setAnswers((data.answers as Answers) ?? {});
        setSaved(true);
        setStep("result");
      }
      setHydrating(false);
    };
    load();
    return () => { cancelled = true; };
  }, [user]);

  const persistResult = async (r: PatternResult, finalAnswers: Answers) => {
    if (!user) return false;
    const { error } = await supabase.from("whats_my_pattern_results").insert({
      user_id: user.id,
      pattern: r.pattern,
      why: r.why,
      showing_up: r.showing_up,
      protecting: r.protecting,
      small_shift: r.small_shift,
      recommended_tool: r.recommended_tool,
      first_step: r.first_step,
      answers: finalAnswers,
    });
    if (error) {
      console.error("Failed to save pattern result", error);
      return false;
    }
    return true;
  };

  const start = () => {
    track("pattern_started");
    setSaved(false);
    setStep("questions");
  };

  const submitAll = async (finalAnswers: Answers) => {
    setStep("loading");
    try {
      const { data, error } = await supabase.functions.invoke("whats-my-pattern", {
        body: { answers: finalAnswers },
      });
      if (error) throw error;
      if (!data?.pattern) throw new Error("No pattern returned");
      const r = data as PatternResult;
      setResult(r);
      track("pattern_completed", { pattern: r.pattern });
      track("pattern_result_viewed", { pattern: r.pattern });
      setStep("result");
      // Auto-save result + recommendations
      const ok = await persistResult(r, finalAnswers);
      if (ok) setSaved(true);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Something went wrong. Please try again.");
      setStep("questions");
    }
  };

  const handleSaveClick = async () => {
    if (!result) return;
    if (!user) {
      toast.error("Please sign in to save your results.");
      return;
    }
    setSaving(true);
    const ok = await persistResult(result, answers);
    setSaving(false);
    if (ok) {
      setSaved(true);
      toast.success("Results saved");
    } else {
      toast.error("Could not save. Please try again.");
    }
  };

  const handleAnswer = (value: string) => {
    const q = QUESTIONS[current];
    const next = { ...answers, [q.key]: value };
    setAnswers(next);
    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
      setFreeTextValue("");
    } else {
      submitAll(next);
    }
  };

  const reset = () => {
    setStep("intro");
    setCurrent(0);
    setAnswers({});
    setFreeTextValue("");
    setResult(null);
    setSaved(false);
  };

  const progress = ((current) / QUESTIONS.length) * 100;

  // --- HYDRATING ---
  if (hydrating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }


  // --- INTRO ---
  if (step === "intro") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight">
              What's My Pattern?<span className="text-primary">™</span>
            </h1>
            <p className="text-primary text-sm uppercase tracking-[0.2em] font-semibold">
              Discover the hidden pattern keeping you stuck
            </p>
          </div>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Sometimes what keeps us stuck isn't a lack of motivation.
            <br />
            It's a pattern.
            <br />
            <span className="text-foreground">Let's discover yours.</span>
          </p>
          <Button variant="gold" size="lg" className="w-full text-base py-6" onClick={start}>
            Discover My Pattern
          </Button>
          <p className="text-xs text-muted-foreground/70 italic">
            You are not broken. You are conditioned.
          </p>
        </motion.div>
      </div>
    );
  }

  // --- LOADING ---
  if (step === "loading") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-6" />
        <p className="font-serif text-xl text-foreground">Reading your pattern…</p>
        <p className="text-sm text-muted-foreground mt-2">This takes just a moment.</p>
      </div>
    );
  }

  // --- RESULT ---
  if (step === "result" && result) {
    const resetRoute = PATTERN_TO_RESET_ROUTE[result.pattern] ?? "/home";
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to home
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <Card className="p-6 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
              <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-semibold mb-2">
                Your Current Pattern
              </p>
              <h2 className="font-serif text-3xl font-bold text-foreground">{result.pattern}</h2>
            </Card>

            <Card className="p-6">
              <h3 className="font-serif text-lg font-semibold mb-2">Why This Pattern May Exist</h3>
              <p className="text-muted-foreground leading-relaxed">{result.why}</p>
            </Card>

            <Card className="p-6">
              <h3 className="font-serif text-lg font-semibold mb-3">How It May Be Showing Up</h3>
              <ul className="space-y-2">
                {result.showing_up?.map((b, i) => (
                  <li key={i} className="flex gap-3 text-muted-foreground">
                    <span className="text-primary mt-1">•</span>
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-serif text-lg font-semibold mb-2">
                What This Pattern May Be Trying To Protect You From
              </h3>
              <p className="text-muted-foreground leading-relaxed">{result.protecting}</p>
            </Card>

            <Card className="p-6">
              <h3 className="font-serif text-lg font-semibold mb-2">One Small Shift To Practice</h3>
              <p className="text-muted-foreground leading-relaxed">{result.small_shift}</p>
            </Card>

            <Card className="p-6 border-primary/20">
              <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-semibold mb-1">
                Recommended Reset Tool
              </p>
              <p className="font-serif text-xl font-semibold text-foreground">
                {result.recommended_tool}
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-serif text-lg font-semibold mb-2">Your First Step Today</h3>
              <p className="text-muted-foreground leading-relaxed">{result.first_step}</p>
            </Card>

            <div className="space-y-3 pt-2">
              <Button
                variant="gold"
                size="lg"
                className="w-full text-base py-6"
                onClick={() => {
                  track("pattern_reset_started", { pattern: result.pattern });
                  navigate(resetRoute);
                }}
              >
                Start My Reset
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => toast("Coming soon")}
              >
                Explore Recommended Tool
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleSaveClick}
                disabled={saving || saved}
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</>
                ) : saved ? (
                  <><Check className="w-4 h-4 mr-2" /> Saved</>
                ) : (
                  "Save My Results"
                )}
              </Button>
              <Button variant="ghost" className="w-full" onClick={reset}>
                Retake Quiz
              </Button>
            </div>

            <p className="text-xs text-muted-foreground/70 italic text-center px-4 pt-4">
              This experience is designed for self-reflection and personal growth. It is not intended
              to diagnose, treat, cure, or replace professional medical, mental health, or
              therapeutic support.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // --- QUESTIONS ---
  const q = QUESTIONS[current];
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-4 space-y-2">
        <button
          onClick={() => (current === 0 ? setStep("intro") : setCurrent(current - 1))}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>
            {current + 1} of {QUESTIONS.length}
          </span>
        </div>
        <Progress value={progress} className="h-1.5 bg-muted [&>[data-state]]:bg-primary" />
      </div>

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
              {q.question}
            </h2>

            {q.freeText ? (
              <div className="space-y-4">
                <Textarea
                  value={freeTextValue}
                  onChange={(e) => setFreeTextValue(e.target.value)}
                  placeholder="In your own words…"
                  rows={5}
                  className="text-base"
                />
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full text-base py-6"
                  disabled={!freeTextValue.trim()}
                  onClick={() => handleAnswer(freeTextValue.trim())}
                >
                  Reveal My Pattern
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {q.options!.map((opt) => (
                  <motion.button
                    key={opt}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAnswer(opt)}
                    className="w-full p-4 rounded-xl border-2 border-border/50 bg-card/60 hover:border-primary/60 hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)] text-left transition-all duration-200"
                  >
                    <span className="text-sm text-foreground">{opt}</span>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
