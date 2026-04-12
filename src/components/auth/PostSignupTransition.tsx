import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface PostSignupTransitionProps {
  firstName: string;
}

export function PostSignupTransition({ firstName }: PostSignupTransitionProps) {
  const navigate = useNavigate();
  const [showSub, setShowSub] = useState(false);

  useEffect(() => {
    const subTimer = setTimeout(() => setShowSub(true), 500);
    const navTimer = setTimeout(() => navigate("/onboarding"), 2000);
    return () => {
      clearTimeout(subTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0A] flex flex-col items-center justify-center px-6">
      {/* Animated 1111 pulse */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 0.6, 1], scale: [0.8, 1.1, 1] }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-[#C9A84C] font-display text-6xl font-bold mb-8 tracking-widest"
      >
        1111
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="font-display text-3xl md:text-4xl text-[#F9F6F0] text-center mb-4"
      >
        Welcome, {firstName}.
      </motion.h1>

      <AnimatePresence>
        {showSub && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="font-sans text-[#F9F6F0]/60 text-center text-lg"
          >
            Let's find out exactly where you need to begin.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
