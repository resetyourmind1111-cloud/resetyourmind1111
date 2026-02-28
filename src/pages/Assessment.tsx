import { useState } from "react";
import { AssessmentWelcome } from "@/components/assessment/AssessmentWelcome";
import { AssessmentQuestion } from "@/components/assessment/AssessmentQuestion";
import { EmailCapture } from "@/components/assessment/EmailCapture";
import { AssessmentResults } from "@/components/assessment/AssessmentResults";
import { assessmentQuestions } from "@/data/assessmentQuestions";
import { getThermostatType, calculateTotalScore, calculatePercentage, calculateCategoryScores } from "@/data/thermostatTypes";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type AssessmentStep = "welcome" | "questions" | "email" | "results";

export default function Assessment() {
  const [step, setStep] = useState<AssessmentStep>("welcome");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [userData, setUserData] = useState({ firstName: "", email: "" });
  const [isSaving, setIsSaving] = useState(false);
  
  const { user } = useAuth();

  const handleStart = () => setStep("questions");

  const handleSelectAnswer = (points: number) => {
    const questionId = assessmentQuestions[currentQuestionIndex].id;
    setAnswers((prev) => ({ ...prev, [questionId]: points }));
    
    setTimeout(() => {
      if (currentQuestionIndex < assessmentQuestions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setStep("email");
      }
    }, 300);
  };

  const saveResultsToDatabase = async (firstName: string, email: string) => {
    const totalScore = calculateTotalScore(answers);
    const percentage = calculatePercentage(totalScore);
    const thermostatType = getThermostatType(totalScore);
    const categoryScores = calculateCategoryScores(answers);

    try {
      // Save lead first
      await supabase.from("leads").insert({
        first_name: firstName,
        email: email,
        source: "assessment",
      });

      // Save assessment results
      const { error } = await supabase.from("assessment_results").insert({
        first_name: firstName,
        email: email,
        total_score: totalScore,
        percentage_score: percentage,
        thermostat_type: thermostatType.name,
        category_scores: categoryScores,
        answers: answers,
        user_id: user?.id || null,
      });

      if (error) {
        if (import.meta.env.DEV) {
          console.error("Error saving results:", error);
        }
        toast.error("Failed to save results, but you can still view them.");
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error saving to database:", error);
      }
    }
  };

  const handleEmailSubmit = async (firstName: string, email: string) => {
    setIsSaving(true);
    setUserData({ firstName, email });
    
    await saveResultsToDatabase(firstName, email);
    
    setIsSaving(false);
    setStep("results");
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

  if (step === "email") return <EmailCapture onSubmit={handleEmailSubmit} isLoading={isSaving} />;

  const handleRetake = () => {
    setStep("welcome");
    setCurrentQuestionIndex(0);
    setAnswers({});
    setUserData({ firstName: "", email: "" });
  };

  return (
    <AssessmentResults
      firstName={userData.firstName}
      totalScore={totalScore}
      percentage={percentage}
      thermostatType={thermostatType}
      answers={answers}
      onRetake={handleRetake}
    />
  );
}
