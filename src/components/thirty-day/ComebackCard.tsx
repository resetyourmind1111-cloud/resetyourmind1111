import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ComebackCardProps {
  currentDay: number;
  onContinue: (day: number) => void;
}

export function ComebackCard({ currentDay, onContinue }: ComebackCardProps) {
  const { user } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("last_30day_activity, comeback_card_shown")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (!data) return;
        const lastActivity = (data as any).last_30day_activity;
        const alreadyShown = (data as any).comeback_card_shown;
        if (alreadyShown) return;
        if (!lastActivity) return;
        const hoursSince = (Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60);
        if (hoursSince >= 48) {
          setShow(true);
        }
      });
  }, [user]);

  const handleContinue = async () => {
    if (!user) return;
    await supabase
      .from("profiles")
      .update({
        comeback_card_shown: true,
        last_30day_activity: new Date().toISOString(),
      } as any)
      .eq("user_id", user.id);
    setShow(false);
    onContinue(currentDay);
  };

  const handleDismiss = async () => {
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ comeback_card_shown: true } as any)
      .eq("user_id", user.id);
    setShow(false);
  };

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="p-5 border-2 border-[#C9A84C]/40 bg-card shadow-[0_0_20px_hsl(45_70%_50%/0.08)]">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold mb-2">
          Welcome Back
        </p>

        <h3 className="font-serif text-lg font-bold text-foreground leading-relaxed mb-3">
          You missed a couple of days.{"\n"}
          That's the pattern doing{"\n"}
          what patterns do.
        </h3>

        <p className="text-muted-foreground text-sm leading-relaxed mb-5">
          You are not behind. You are not starting over. You are right on time.
          <br /><br />
          Pick up exactly where you left off.
        </p>

        <Button
          onClick={handleContinue}
          className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-semibold mb-2"
        >
          Continue from Day {currentDay} →
        </Button>

        <p className="text-xs text-muted-foreground/60 italic text-center mb-3">
          Your streak resets but your progress doesn't. Everything you've done still counts.
        </p>

        <button
          onClick={handleDismiss}
          className="text-xs text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors w-full text-center"
        >
          I'll come back later
        </button>
      </Card>
    </motion.div>
  );
}
