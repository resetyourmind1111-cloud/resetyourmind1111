import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface WeeklyQuestionCardProps {
  prompt: string;
  onAnswer: () => void;
}

export function WeeklyQuestionCard({ prompt, onAnswer }: WeeklyQuestionCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-5 border-2 border-accent/40 bg-accent/5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold mb-2">
          THIS WEEK'S RESET QUESTION
        </p>
        <p className="font-serif text-lg text-foreground italic leading-relaxed mb-4">
          "{prompt}"
        </p>
        <Button onClick={onAnswer} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-xs">
          <MessageCircle className="w-3 h-3 mr-1.5" />
          Share your answer
        </Button>
      </Card>
    </motion.div>
  );
}
