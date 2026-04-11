import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const checkinMessages: Record<number, { text: string; button: string }> = {
  4: { text: "Hey — you've been here 4 days. I want to check in. Is your pattern still loud, or has something shifted?", button: "Talk to AI →" },
  8: { text: "One week in. How are you feeling? Sometimes week 2 is when the pattern fights back.", button: "Talk to AI →" },
  12: { text: "You're 12 days in. What's one thing that feels different than it did when you started?", button: "Tell the AI →" },
  16: { text: "Halfway through the month. What pattern has shown up most for you?", button: "Reflect with AI →" },
  20: { text: "20 days. That's real commitment. What do you want to work on in the final stretch?", button: "Talk to AI →" },
  24: { text: "Almost there. What would completing this month mean to you?", button: "Tell the AI →" },
  28: { text: "Two days from 30. What's the pattern saying right now?", button: "Talk to AI →" },
};

export function AiCheckinCard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [visibleDay, setVisibleDay] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;

    supabase
      .from("profiles")
      .select("total_sessions, ai_checkin_days_shown")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (!data) return;
        const sessions = (data as any).total_sessions || 0;
        const shown = ((data as any).ai_checkin_days_shown || {}) as Record<string, boolean>;

        // Find the highest checkin day <= sessions that hasn't been shown
        const days = [4, 8, 12, 16, 20, 24, 28];
        for (const d of days.reverse()) {
          if (sessions >= d && !shown[String(d)]) {
            setVisibleDay(d);
            break;
          }
        }
      });
  }, [user]);

  const handleTalk = async () => {
    if (!user || !visibleDay) return;
    // Mark as shown
    const { data: profile } = await supabase
      .from("profiles")
      .select("ai_checkin_days_shown")
      .eq("user_id", user.id)
      .single();

    const current = ((profile as any)?.ai_checkin_days_shown || {}) as Record<string, boolean>;
    await supabase
      .from("profiles")
      .update({ ai_checkin_days_shown: { ...current, [String(visibleDay)]: true } } as any)
      .eq("user_id", user.id);

    navigate("/patterns");
    setVisibleDay(null);
  };

  if (!visibleDay) return null;
  const msg = checkinMessages[visibleDay];
  if (!msg) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="p-5 bg-[#2D1B4E] border-primary/30">
        <div className="flex items-start gap-3">
          <MessageCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-foreground leading-relaxed mb-3">
              {msg.text}
            </p>
            <Button
              onClick={handleTalk}
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {msg.button}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
