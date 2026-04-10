import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";
import { LockedContent } from "@/components/LockedContent";
import { getEncouragementText } from "@/data/identityTrapData";

interface ProgressData {
  self_trust_streak: number;
  total_interrupts: number;
  honest_nos: number;
  actions_before_certainty: number;
  recodes_completed: number;
}

export function PatternProgressDashboard() {
  const { user } = useAuth();
  const { effectiveTier } = useSubscription();
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [weeklyInterrupts, setWeeklyInterrupts] = useState(0);

  useEffect(() => {
    if (!user) return;

    supabase
      .from("pattern_progress")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setProgress(data as ProgressData);
      });

    // Count this week's interrupts
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    supabase
      .from("pattern_interrupts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", weekAgo.toISOString())
      .then(({ count }) => setWeeklyInterrupts(count ?? 0));
  }, [user]);

  const stats = [
    { label: "This Week", value: weeklyInterrupts, sub: "Pattern interrupts" },
    { label: "Streak", value: progress?.self_trust_streak ?? 0, sub: "Self-trust days" },
    { label: "Total Resets", value: progress?.total_interrupts ?? 0, sub: "Completed" },
    { label: "Honest No's", value: progress?.honest_nos ?? 0, sub: "Practiced" },
    { label: "Actions", value: progress?.actions_before_certainty ?? 0, sub: "Before certainty" },
    { label: "Recodes", value: progress?.recodes_completed ?? 0, sub: "Completed" },
  ];

  const streak = progress?.self_trust_streak ?? 0;

  const dashboard = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">Your Progress</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4 bg-card/80 border-border/30 text-center">
            <p className="text-2xl font-bold text-primary">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{stat.sub}</p>
          </Card>
        ))}
      </div>

      <Card className="p-4 bg-card/80 border-primary/20">
        <p className="text-sm text-foreground/80 italic text-center">
          {getEncouragementText(streak)}
        </p>
      </Card>
    </motion.div>
  );

  return (
    <LockedContent requiredTier="reset" currentTier={effectiveTier}>
      {dashboard}
    </LockedContent>
  );
}
