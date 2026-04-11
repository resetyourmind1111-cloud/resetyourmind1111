import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTrialStatus, TRIAL_TOOL_NAMES, getTrialAllowedTools } from "@/hooks/useTrialStatus";
import { Calendar, Headphones, Wrench, ArrowRight } from "lucide-react";

export function TrialJourneyBar() {
  const { isTrialActive, trialDay, onboardingReason, trialTool1, trialTool2 } = useTrialStatus();
  const navigate = useNavigate();

  if (!isTrialActive) return null;

  const allowedTools = getTrialAllowedTools(onboardingReason, trialTool1, trialTool2);
  const tool1Name = TRIAL_TOOL_NAMES[allowedTools[0]] || allowedTools[0];
  const tool2Name = TRIAL_TOOL_NAMES[allowedTools[1]] || allowedTools[1];

  const progressPercent = (Math.min(trialDay, 7) / 7) * 100;

  const sections = [
    {
      icon: Calendar,
      label: "30-Day Experience",
      sub: "Days 1–3 unlocked",
      route: "/30-day-experience",
    },
    {
      icon: Headphones,
      label: "Meditations",
      sub: "3 sessions unlocked",
      route: "/meditations",
    },
    {
      icon: Wrench,
      label: "Healing Tools",
      sub: `${tool1Name} & ${tool2Name}`,
      route: "/healing-tools",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mb-6 space-y-3"
    >
      {/* Progress header */}
      <div className="px-1">
        <p className="text-xs text-primary font-semibold mb-2">
          Day {Math.min(trialDay, 7)} of 7 — Your Free Preview
        </p>
        <Progress value={progressPercent} className="h-1.5 bg-muted [&>[data-state]]:bg-primary" />
      </div>

      {/* Unlocked content cards */}
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium px-1">
          Your unlocked content
        </p>
        {sections.map((s, i) => (
          <motion.div
            key={s.route}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
          >
            <Card
              className="p-4 bg-card/80 border-border/50 hover:border-primary/40 transition-all cursor-pointer active:scale-[0.98]"
              onClick={() => navigate(s.route)}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                  <s.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{s.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{s.sub}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/50 shrink-0" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
