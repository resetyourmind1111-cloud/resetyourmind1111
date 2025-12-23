import { motion, AnimatePresence } from "framer-motion";
import { AssessmentQuestion as QuestionType, categoryColors } from "@/data/assessmentQuestions";
import { cn } from "@/lib/utils";

interface AssessmentQuestionProps {
  question: QuestionType;
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  onSelectAnswer: (points: number) => void;
}

export function AssessmentQuestion({
  question,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
}: AssessmentQuestionProps) {
  const progress = ((currentQuestion) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentQuestion} of {totalQuestions}
            </span>
            <span className={cn(
              "text-sm font-semibold px-3 py-1 rounded-full text-primary-foreground",
              categoryColors[question.category]
            )}>
              {question.categoryLabel}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-8"
          >
            {/* Question Text */}
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-8 leading-relaxed">
              {question.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === option.points;
                const letters = ['A', 'B', 'C', 'D', 'E'];
                
                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => onSelectAnswer(option.points)}
                    className={cn(
                      "w-full p-4 rounded-xl text-left transition-all duration-200 flex items-start gap-4 group",
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                        : "bg-secondary/50 hover:bg-secondary text-foreground hover:scale-[1.01]"
                    )}
                  >
                    <span
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 transition-colors",
                        isSelected
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-primary/10 text-primary group-hover:bg-primary/20"
                      )}
                    >
                      {letters[index]}
                    </span>
                    <span className="text-base md:text-lg leading-relaxed">
                      {option.text}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-muted-foreground text-sm mt-6"
        >
          Click an option to continue
        </motion.p>
      </div>
    </div>
  );
}
