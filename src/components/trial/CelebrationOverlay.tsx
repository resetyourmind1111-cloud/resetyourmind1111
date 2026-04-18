import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHaptic } from "@/hooks/useHaptic";

interface CelebrationOverlayProps {
  message: string;
  show: boolean;
  onDone?: () => void;
}

export function CelebrationOverlay({ message, show, onDone }: CelebrationOverlayProps) {
  const [visible, setVisible] = useState(show);
  const { vibrate } = useHaptic();

  useEffect(() => {
    if (show) {
      setVisible(true);
      vibrate("success");
      const timer = setTimeout(() => {
        setVisible(false);
        onDone?.();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onDone, vibrate]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => { setVisible(false); onDone?.(); }}
          className="fixed inset-0 z-[70] bg-[#06060e]/95 flex items-center justify-center p-6 cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="text-center space-y-4 max-w-sm"
          >
            <p className="text-4xl">✨</p>
            <p className="font-serif text-xl md:text-2xl text-[#C9A84C] font-bold leading-relaxed">
              {message}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
