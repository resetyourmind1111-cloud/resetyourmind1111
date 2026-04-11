import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Sparkles, Shield } from "lucide-react";
import { Link } from "react-router-dom";

interface StreakCardProps {
  streak: number;
  totalSessions: number;
  longestStreak: number;
  lastModule: string | null;
  isStreakAtRisk?: boolean;
}

function getStreakMessage(streak: number): string {
  if (streak === 0) return "Your streak starts today.";
  if (streak === 1) return "Day 1. You showed up. That's everything.";
  if (streak === 2) return "Two days. The pattern is noticing.";
  if (streak === 3) return "Three days. Keep going.";
  if (streak === 5) return "Five days. Your nervous system is learning.";
  if (streak === 7) return "One week. You are different than you were.";
  if (streak === 10) return "10 days. This is becoming who you are.";
  if (streak === 14) return "Two weeks. The old pattern is losing.";
  if (streak === 21) return "21 days. Neuroscience says this is where habits form. You're there.";
  if (streak === 30) return "30 days. This is no longer a streak. This is your life.";
  if (streak === 60) return "Two months. You didn't quit when it got hard.";
  if (streak >= 90) return "Three months. You are the proof.";
  return `Day ${streak}. Keep going.`;
}

export function StreakCard({ streak, totalSessions, longestStreak, lastModule, isStreakAtRisk }: StreakCardProps) {
  const message = getStreakMessage(streak);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Streak Protection Card */}
      {isStreakAtRisk && streak > 0 && (
        <Card className="p-4 mb-3 border-primary/40 bg-primary/5">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Flame className="w-6 h-6 text-primary" />
            </motion.div>
            <div className="flex-1">
              <p className="font-serif text-sm font-semibold text-foreground">
                Your {streak}-day streak ends tonight.
              </p>
              <p className="text-xs text-muted-foreground">
                One reset. One permission slip. One minute. That's all it takes.
              </p>
            </div>
            <Link to="/permission-slips">
              <Button size="sm" className="bg-primary text-primary-foreground">
                Protect my streak →
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Streak Break Welcome Back */}
      {streak === 0 && totalSessions > 1 && (
        <Card className="p-4 mb-3 border-border/50 bg-card/80">
          <p className="text-[10px] uppercase tracking-[0.15em] text-primary font-semibold mb-1">
            Welcome Back
          </p>
          <p className="text-xs text-muted-foreground">
            Your streak reset. But your {totalSessions} total sessions never go away. Every day you showed up still counts.
          </p>
        </Card>
      )}

      {/* Main Streak Card */}
      <Card className="p-5 bg-card/80 border-border/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Flame className="w-4 h-4 text-primary" />
          </div>
          <div>
            <motion.p
              key={streak}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-sm font-semibold text-foreground"
            >
              {streak > 0 ? `${streak}-day streak` : "Start your streak today"}
            </motion.p>
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span>Total sessions: {totalSessions}</span>
              <span>Longest streak: {longestStreak}</span>
            </div>
            {lastModule && (
              <p className="text-xs text-muted-foreground">
                Last module: {lastModule}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-start gap-2 pt-3 border-t border-border/50">
          <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground italic leading-relaxed">
            "{message}"
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
