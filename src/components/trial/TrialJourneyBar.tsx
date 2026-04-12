import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTrialStatus, TRIAL_TOOL_NAMES, getTrialAllowedTools } from "@/hooks/useTrialStatus";
import { TrialResumeStepInfo } from "@/hooks/useTrialResume";
import { Clock } from "lucide-react";

interface TrialJourneyBarProps {
  loading?: boolean;
  step?: TrialResumeStepInfo | null;
}

export function TrialJourneyBar({ loading = false, step = null }: TrialJourneyBarProps) {
  const { isTrialActive, trialDay, onboardingReason, trialTool1, trialTool2 } = useTrialStatus();
  const navigate = useNavigate();

  if (!isTrialActive || loading || !step) return null;

  const allowedTools = getTrialAllowedTools(onboardingReason, trialTool1, trialTool2);
  const tool1Name = TRIAL_TOOL_NAMES[allowedTools[0]] || allowedTools[0];
  const tool2Name = TRIAL_TOOL_NAMES[allowedTools[1]] || allowedTools[1];

  const progressPercent = (Math.min(trialDay + 1, 7) / 7) * 100;
  const dayLabel = Math.min(trialDay + 1, 7);

  const unlocked = [
    "Worth Thermostat™",
    "Days 1–3 of 30-Day Experience",
    "3 Meditations",
    `${tool1Name} & ${tool2Name}`,
    "Identity Trap Quiz + Resets",
  ];

  const afterReset = [
    "Full Emotional Surgery™",
    "Complete 30-Day Experience",
    "All Tools + Oracle Cards",
    "Sacred Circle Community",
    "AI Support",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mb-6 space-y-4"
    >
      {/* Progress bar */}
      <div className="px-1">
        <p className="text-xs text-primary font-semibold mb-2">
          Day {dayLabel} of 7 — Your Free Preview
        </p>
        <Progress value={progressPercent} className="h-1.5 bg-muted [&>[data-state]]:bg-primary" />
      </div>

      {/* Guided action card */}
      <Card className="p-5 bg-[#2A1F3D] border-primary/30 border-t-2 border-t-primary">
        <p className="text-[10px] uppercase tracking-[0.15em] text-primary font-semibold mb-2">
          {step.eyebrow}
        </p>
        <h3 className="font-serif text-lg font-bold text-foreground mb-1">
          {step.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
          {step.body}
        </p>
        {step.time && (
          <div className="flex items-center gap-1.5 mb-3">
            <Clock className="w-3.5 h-3.5 text-muted-foreground/60" />
            <span className="text-xs text-muted-foreground/60">{step.time}</span>
          </div>
        )}
        <Button
          onClick={() => navigate(step.route)}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl"
        >
          {step.buttonText}
        </Button>
      </Card>

      {/* What's in your preview — compact */}
      <div className="grid grid-cols-2 gap-4 px-1">
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium mb-2">
            UNLOCKED THIS WEEK
          </p>
          {unlocked.map((item) => (
            <p key={item} className="text-xs text-muted-foreground mb-1">
              <span className="text-primary mr-1.5">✦</span>{item}
            </p>
          ))}
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-medium mb-2">
            AFTER YOUR RESET
          </p>
          {afterReset.map((item) => (
            <p key={item} className="text-xs text-muted-foreground/50 italic mb-1">
              <span className="mr-1.5">✦</span>{item}
            </p>
          ))}
        </div>
      </div>

      <p className="text-primary/70 text-[11px] text-center">
        Day 7 unlocks your full reset — or upgrade anytime.
      </p>
    </motion.div>
  );
}
