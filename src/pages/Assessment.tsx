import { useState } from "react";
import { AssessmentWelcome } from "@/components/assessment/AssessmentWelcome";
import { AssessmentQuestion } from "@/components/assessment/AssessmentQuestion";
import { AssessmentResults } from "@/components/assessment/AssessmentResults";
import { assessmentQuestions } from "@/data/assessmentQuestions";
import { getThermostatType, calculateTotalScore, calculatePercentage, calculateCategoryScores } from "@/data/thermostatTypes";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type AssessmentStep = "welcome" | "questions" | "results";

export default function Assessment() {
  const [step, setStep] = useState<AssessmentStep>("welcome");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  
  const { user } = useAuth();

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
