import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

interface StreakGraceBannerProps {
  show: boolean;
  onDismiss: () => void;
  continueTo?: string;
}

/**
 * Gold "life happened" banner shown at top of Home when grace day fires.
 * Dismissible — does NOT affect grace logic (already persisted).
 */
export function StreakGraceBanner({
  show,
  onDismiss,
  continueTo = "/home",
}: StreakGraceBannerProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mb-4 rounded-2xl bg-[#C9A84C] text-[#06060e] p-4 relative shadow-[0_0_24px_rgba(201,168,76,0.25)]"
          role="status"
          aria-live="polite"
        >
          <button
            onClick={onDismiss}
            aria-label="Dismiss"
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#06060e]/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <p className="font-serif text-base font-bold leading-snug pr-8">
            Life happened. Your streak is protected.
          </p>
          <p className="text-sm leading-relaxed mt-1 opacity-80">
            You get one reset per month. Use today to come back.
          </p>
          <Link
            to={continueTo}
            onClick={onDismiss}
            className="inline-block mt-3 text-sm font-semibold underline underline-offset-2"
          >
            Continue my streak →
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
