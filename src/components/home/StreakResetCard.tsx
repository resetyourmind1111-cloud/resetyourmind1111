import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface StreakResetCardProps {
  show: boolean;
  onDismiss: () => void;
}

/**
 * Compassionate streak-reset notice. No "failure" language.
 */
export function StreakResetCard({ show, onDismiss }: StreakResetCardProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mb-4"
        >
          <Card className="relative p-5 bg-card/80 border-l-4 border-l-[#3D1A6E] border-y border-r border-border/40">
            <button
              onClick={onDismiss}
              aria-label="Dismiss"
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-foreground/10 transition-colors text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-serif text-lg font-bold text-foreground mb-2 pr-8">
              Your streak reset. That's okay.
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 whitespace-pre-line">
              {`Every reset is a new beginning.\nThe most powerful thing you can do right now\nis start again. Today.`}
            </p>
            <Link to="/30-day" onClick={onDismiss}>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl">
                Start again →
              </Button>
            </Link>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
