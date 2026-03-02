import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { bodyTypeQuestions, bodyTypeProfiles, calculateBodyType } from "@/data/bodyTypeData";
import { BodyTypeQuestion } from "./BodyTypeQuestion";
import { BodyTypeResults } from "./BodyTypeResults";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Sparkles, Lock } from "lucide-react";

interface BodyTypeAssessmentProps {
  onNavigateTab: (tab: string) => void;
}

type Step = "welcome" | "questions" | "results";

export function BodyTypeAssessment({ onNavigateTab }: BodyTypeAssessmentProps) {
  const [step, setStep] = useState<Step>("welcome");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [savedType, setSavedType] = useState<string | null>(null);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Check for existing result
  useEffect(() => {
    async function checkExisting() {
      if (!user) { setLoading(false); return; }
      const { data } = await supabase
        .from("profiles")
        .select("body_type, body_type_completed_at")
        .eq("user_id", user.id)
        .single();
      if (data?.body_type) {
        setSavedType(data.body_type);
        setCompletedAt(data.body_type_completed_at);
      }
      setLoading(false);
    }
    checkExisting();
  }, [user]);

  const canRetake = () => {
    if (!completedAt) return true;
    const daysSince = (Date.now() - new Date(completedAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysSince >= 30;
  };

  const handleSelectAnswer = (type: string) => {
    const qId = bodyTypeQuestions[currentIndex].id;
    setAnswers((prev) => ({ ...prev, [qId]: type }));
    setTimeout(() => {
      if (currentIndex < bodyTypeQuestions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Calculate and save
        const finalAnswers = { ...answers, [qId]: type };
        const result = calculateBodyType(finalAnswers);
        setSavedType(result);
        saveResult(result);
        setStep("results");
      }
    }, 300);
  };

  const saveResult = async (bodyType: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ body_type: bodyType, body_type_completed_at: new Date().toISOString() })
      .eq("user_id", user.id);
    if (error) {
      console.error("Error saving body type:", error);
      toast.error("Could not save your result.");
    } else {
      setCompletedAt(new Date().toISOString());
      toast.success("Body type saved to your profile!");
    }
  };

  const handleRetake = () => {
    if (!canRetake()) {
      const daysLeft = Math.ceil(30 - (Date.now() - new Date(completedAt!).getTime()) / (1000 * 60 * 60 * 24));
      toast.error(`You can retake this assessment in ${daysLeft} days.`);
      return;
    }
    setStep("welcome");
    setCurrentIndex(0);
    setAnswers({});
    setSavedType(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show saved results if they exist and user isn't retaking
  if (savedType && step === "welcome") {
    const profile = bodyTypeProfiles[savedType];
    return <BodyTypeResults profile={profile} onRetake={handleRetake} onNavigateTab={onNavigateTab} />;
  }

  if (step === "welcome") {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Discover Your <span className="text-primary">Body Type</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto leading-relaxed">
            Answer 10 questions to uncover your unique body type — Igniter, Builder, Nurturer, or Transformer — and get personalized nutrition, movement, and supplement plans.
          </p>
          {!user ? (
            <div className="glass-card p-6 inline-flex flex-col items-center gap-3">
              <Lock className="w-6 h-6 text-muted-foreground" />
              <p className="text-muted-foreground">Sign in to take the assessment</p>
              <Button variant="gold" asChild>
                <a href="/auth">Sign In</a>
              </Button>
            </div>
          ) : (
            <Button variant="hero" onClick={() => setStep("questions")} size="xl">
              Begin Assessment
            </Button>
          )}
        </motion.div>
      </div>
    );
  }

  if (step === "questions") {
    const question = bodyTypeQuestions[currentIndex];
    return (
      <BodyTypeQuestion
        question={question}
        currentQuestion={currentIndex + 1}
        totalQuestions={bodyTypeQuestions.length}
        selectedAnswer={answers[question.id] || null}
        onSelectAnswer={handleSelectAnswer}
      />
    );
  }

  if (savedType) {
    const profile = bodyTypeProfiles[savedType];
    return <BodyTypeResults profile={profile} onRetake={handleRetake} onNavigateTab={onNavigateTab} />;
  }

  return null;
}
