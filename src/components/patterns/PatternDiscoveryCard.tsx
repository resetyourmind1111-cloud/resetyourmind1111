import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function PatternDiscoveryCard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasQuiz, setHasQuiz] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("identity_trap_results")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) setHasQuiz(true);
      });
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.25 }}
      className="mb-8 p-6 rounded-2xl border-l-4 border-l-primary"
      style={{ backgroundColor: "#2A1F3D" }}
    >
      <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-2">
        Your Patterns
      </p>
      <h3 className="font-serif text-xl font-bold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        You may also be running a hidden identity pattern.
      </h3>
      <p className="text-sm text-[#F9F6F0]/70 mb-4 leading-relaxed">
        Your Worth Thermostat shows where you are. Your Identity Pattern shows why you keep returning there.
      </p>
      {hasQuiz ? (
        <Button
          variant="gold"
          className="w-full"
          onClick={() => navigate("/patterns")}
        >
          View My Pattern Result →
        </Button>
      ) : (
        <>
          <Button
            variant="gold"
            className="w-full"
            onClick={() => navigate("/patterns/quiz")}
          >
            Discover My Pattern
          </Button>
          <p className="text-xs text-[#F9F6F0]/40 text-center mt-2">Takes 2 minutes</p>
        </>
      )}
    </motion.div>
  );
}
