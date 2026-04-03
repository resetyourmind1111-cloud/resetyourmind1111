import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { TRIAL_TOOL_MAP } from "@/hooks/useTrialStatus";

interface TrialWelcomeFlowProps {
  onComplete: () => void;
}

const onboardingOptions = [
  { emoji: "🧠", label: "I feel stuck and don't know why", value: "stuck" },
  { emoji: "💰", label: "I want to grow but keep self-sabotaging", value: "sabotage" },
  { emoji: "💔", label: "My relationships aren't reflecting my worth", value: "relationships" },
  { emoji: "🔥", label: "I'm ready to level up — I just need the tools", value: "levelup" },
];

export function TrialWelcomeFlow({ onComplete }: TrialWelcomeFlowProps) {
  const { user } = useAuth();
  const [screen, setScreen] = useState<1 | 2>(1);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleStartPreview = () => setScreen(2);

  const handleSelectReason = async (reason: string) => {
    if (!user) return;
    setSelectedReason(reason);
    setSaving(true);

    const tools = TRIAL_TOOL_MAP[reason] || TRIAL_TOOL_MAP["stuck"];

    await supabase
      .from("profiles")
      .update({
        onboarding_reason: reason,
        trial_tool_1: tools[0],
        trial_tool_2: tools[1],
        welcome_banner_dismissed: false,
      } as any)
      .eq("user_id", user.id);

    setSaving(false);
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#06060e] flex items-center justify-center p-6 overflow-y-auto">
      <AnimatePresence mode="wait">
        {screen === 1 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md w-full text-center space-y-8"
          >
            <div className="space-y-4">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#C9A84C]">
                Your reset begins now.
              </h1>
              <p className="text-[#F9F6F0]/80 text-lg leading-relaxed">
                You have 7 days to experience what's possible.<br />
                No pressure. No perfection. Just begin.
              </p>
            </div>

            <div className="bg-[#3D1A6E]/30 border border-[#3D1A6E]/50 rounded-2xl p-6 text-left space-y-3">
              <p className="text-[#C9A84C] font-serif font-semibold text-sm uppercase tracking-wider">
                Your 7-Day Preview Includes:
              </p>
              <div className="space-y-2.5">
                {[
                  "Worth Thermostat™ Assessment",
                  "Days 1–3 of the 30-Day Experience",
                  "3 Guided Meditations",
                  "2 Reset Tools — selected for you based on your answers",
                  "A daily Permission Slip — one for each day",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#C9A84C] mt-0.5 shrink-0" />
                    <span className="text-[#F9F6F0]/80 text-sm">{item}</span>
                  </div>
                ))}
                <div className="flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-[#C9A84C]/50 mt-0.5 shrink-0" />
                  <span className="text-[#F9F6F0]/50 text-sm">Full app unlocks when you upgrade</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                size="lg"
                onClick={handleStartPreview}
                className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-serif font-bold text-lg py-6"
              >
                Start My Preview →
              </Button>
              <p className="text-[#F9F6F0]/40 text-xs">
                7-day preview · No credit card required · Upgrade anytime
              </p>
            </div>
          </motion.div>
        )}

        {screen === 2 && (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md w-full text-center space-y-8"
          >
            <div className="space-y-3">
              <p className="text-[#F9F6F0]/60 text-sm">Before we begin — one question.</p>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#F9F6F0]">
                What brought you here today?
              </h1>
            </div>

            <div className="space-y-3">
              {onboardingOptions.map((opt) => (
                <motion.button
                  key={opt.value}
                  whileTap={{ scale: 0.97 }}
                  disabled={saving}
                  onClick={() => handleSelectReason(opt.value)}
                  className={`
                    w-full flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all
                    ${selectedReason === opt.value
                      ? "border-[#C9A84C] bg-[#C9A84C]/10"
                      : "border-[#3D1A6E]/40 bg-[#3D1A6E]/10 hover:border-[#C9A84C]/40"}
                    disabled:opacity-60
                  `}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="text-[#F9F6F0] font-medium text-sm">{opt.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
