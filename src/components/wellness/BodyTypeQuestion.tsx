import { motion, AnimatePresence } from "framer-motion";
import { BodyTypeQuestion as QuestionType } from "@/data/bodyTypeData";
import { cn } from "@/lib/utils";

interface BodyTypeQuestionProps {
  question: QuestionType;
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onSelectAnswer: (type: string) => void;
}

export function BodyTypeQuestion({
  question,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
}: BodyTypeQuestionProps) {
  const progress = (currentQuestion / totalQuestions) * 100;
  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentQuestion} of {totalQuestions}
            </span>
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-primary text-primary-foreground">
              Body Type
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-8"
          >
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-8 leading-relaxed">
              {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === option.type;
                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => onSelectAnswer(option.type)}
                    className={cn(
                      "w-full p-4 rounded-xl text-left transition-all duration-200 flex items-start gap-4 group",
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                        : "bg-muted/50 hover:bg-muted text-foreground hover:scale-[1.01]"
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
