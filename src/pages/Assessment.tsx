import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AssessmentWelcome } from "@/components/assessment/AssessmentWelcome";
import { AssessmentQuestion } from "@/components/assessment/AssessmentQuestion";
import { AssessmentResults } from "@/components/assessment/AssessmentResults";
import { assessmentQuestions } from "@/data/assessmentQuestions";
import { getThermostatType, calculateTotalScore, calculatePercentage, calculateCategoryScores } from "@/data/thermostatTypes";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle } from "lucide-react";

type AssessmentStep = "loading" | "already-done" | "welcome" | "questions" | "results";

export default function Assessment() {
  const [step, setStep] = useState<AssessmentStep>("loading");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [existingResult, setExistingResult] = useState<any>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if user already has assessment results
  useEffect(() => {
    if (!user) {
      setStep("welcome");
      return;
    }
    const check = async () => {
      const { data } = await supabase
        .from("assessment_results")
        .select("total_score, percentage_score, thermostat_type, answers")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })
        .limit(1);
      if (data && data.length > 0) {
        setExistingResult(data[0]);
        setStep("already-done");
      } else {
        setStep("welcome");
      }
    };
    check();
  }, [user]);

  const handleStart = () => setStep("questions");

  const handleSelectAnswer = (points: number) => {
    const questionId = assessmentQuestions[currentQuestionIndex].id;
    setAnswers((prev) => ({ ...prev, [questionId]: points }));
    
    setTimeout(() => {
      if (currentQuestionIndex < assessmentQuestions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setStep("results");
      }
    }, 300);
  };

  const totalScore = calculateTotalScore(answers);
  const percentage = calculatePercentage(totalScore);
  const thermostatType = getThermostatType(totalScore);

  if (step === "loading") {
    return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading…</p></div>;
  }

  if (step === "already-done" && existingResult) {
    const handleBack = () => {
      if (window.history.length > 1) navigate(-1);
      else navigate("/home");
    };
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <button onClick={handleBack} className="absolute top-4 left-4 flex items-center gap-1 text-sm text-foreground/65 hover:text-foreground/90 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground">You've already completed this</h2>
          <p className="text-muted-foreground text-sm">
            Your Worth Thermostat score: <span className="font-bold text-foreground">{existingResult.percentage_score}%</span> — {existingResult.thermostat_type}
          </p>
          <div className="space-y-3 pt-2">
            <Button variant="gold" className="w-full" onClick={() => navigate("/patterns/quiz")}>
              Continue — Discover Your Pattern →
            </Button>
            <Button variant="outline" className="w-full" onClick={() => { setStep("welcome"); }}>
              Retake Assessment
            </Button>
            <button onClick={handleBack} className="text-foreground/40 text-[13px] hover:text-foreground/60 transition-colors mt-2">
              ← Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "welcome") return <AssessmentWelcome onStart={handleStart} />;
  
  if (step === "questions") {
    const question = assessmentQuestions[currentQuestionIndex];
    return (
      <AssessmentQuestion
        question={question}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={assessmentQuestions.length}
        selectedAnswer={answers[question.id] || null}
        onSelectAnswer={handleSelectAnswer}
      />
    );
  }

  const handleRetake = () => {
    setStep("welcome");
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  return (
    <AssessmentResults
      firstName=""
      totalScore={totalScore}
      percentage={percentage}
      thermostatType={thermostatType}
      answers={answers}
      onRetake={handleRetake}
    />
  );
}
