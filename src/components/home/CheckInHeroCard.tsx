import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface StateOption {
  label: string;
  emoji: string;
  module: string;
}

interface CheckInHeroCardProps {
  firstName: string | null;
  options: StateOption[];
  onSelect: (index: number) => void;
  disabled?: boolean;
}

/**
 * Single, obvious primary action for new/unactivated users:
 * "Take your 30-second check-in" — one tap → activation.
 *
 * Reuses the existing state-selector flow so there are zero
 * changes to backend, routing, or business rules.
 */
export function CheckInHeroCard({ firstName, options, onSelect, disabled }: CheckInHeroCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6"
    >
      <Card className="p-6 bg-[#06060e] border-2 border-[#C9A84C]/40 shadow-[0_0_30px_hsl(var(--primary)/0.12)]">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#C9A84C]" />
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#C9A84C] font-semibold">
            Start here
          </p>
        </div>
        <h2 className="font-serif text-xl md:text-2xl font-bold text-[#F9F6F0] mb-1">
          {firstName ? `${firstName}, take your 30-second check-in.` : "Take your 30-second check-in."}
        </h2>
        <p className="text-[#F9F6F0]/65 text-sm mb-5">
          One tap. We'll meet you exactly where you are right now.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {options.map((opt, i) => (
            <button
              key={opt.label}
              onClick={() => onSelect(i)}
              disabled={disabled}
              className="flex items-center gap-3 w-full p-3 rounded-lg border border-[#C9A84C]/20 bg-[#0A0A0A]/60 hover:border-[#C9A84C]/60 hover:bg-[#0A0A0A] transition-all text-left disabled:opacity-50"
            >
              <span className="text-xl">{opt.emoji}</span>
              <span className="text-sm text-[#F9F6F0]/90 font-medium">{opt.label}</span>
            </button>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
