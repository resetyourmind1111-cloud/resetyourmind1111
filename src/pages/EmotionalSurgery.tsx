import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useSubscription } from "@/hooks/useSubscription";
import { TrialLockedContent } from "@/components/TrialLockedContent";
import { useTrialStatus } from "@/hooks/useTrialStatus";

interface ModuleInfo {
  phase: number;
  title: string;
  description: string;
  route: string;
  badge?: string;
}

const modules: ModuleInfo[] = [
  { phase: 1, title: "Recognition", description: "You can't change what you won't see.", route: "/module/recognition" },
  { phase: 2, title: "Release", description: "Let go of what is no longer true.", route: "/module/release" },
  { phase: 3, title: "The Quiet Phase™", description: "The space between who you were and who you're becoming.", route: "/module/quiet-phase", badge: "✨ NEW" },
  { phase: 4, title: "Recalibration", description: "Reset your internal standard.", route: "/module/recalibration" },
  { phase: 5, title: "Embodiment", description: "Become it. Live it. Prove it.", route: "/module/embodiment" },
];

// Tier gating per module
// Free → nothing; Reset → Module 1 full + Module 2 partial; Expand → 1-4; Embody → all 5
const MODULE_TIER_REQUIRED: Record<number, string> = {
  1: "reset",
  2: "reset",
  3: "expand",
  4: "expand",
  5: "embody",
};

const TIER_LEVEL: Record<string, number> = {
  free: 0,
  reset: 1,
  expand: 2,
  embody: 3,
  founding_full_access: 3,
};

function hasTierAccess(userTier: string, requiredTier: string): boolean {
  return (TIER_LEVEL[userTier.toLowerCase()] ?? 0) >= (TIER_LEVEL[requiredTier] ?? 0);
}

export default function EmotionalSurgery() {
  const { user } = useAuth();
  const { effectiveTier, isLoading: tierLoading } = useSubscription();
  const { isTrialActive, trialExpired } = useTrialStatus();
  const isTrialUser = isTrialActive || trialExpired;
  const navigate = useNavigate();

  // Track completions per lesson_number across all tracks (4 tracks total)
  const [phaseCompletions, setPhaseCompletions] = useState<Record<number, number>>({});
  const totalTracks = 4;

  useEffect(() => {
    if (!user) return;
    supabase
      .from("lesson_completions")
      .select("lesson_number, completed_at")
      .eq("user_id", user.id)
      .not("completed_at", "is", null)
      .then(({ data }) => {
        if (data) {
          const counts: Record<number, number> = {};
          data.forEach((r: any) => {
            counts[r.lesson_number] = (counts[r.lesson_number] || 0) + 1;
          });
          setPhaseCompletions(counts);
        }
      });
  }, [user]);

  // Determine the user's current active phase (first incomplete one)
  const getActivePhase = () => {
    for (let i = 1; i <= 5; i++) {
      if ((phaseCompletions[i] || 0) < totalTracks) return i;
    }
    return 5;
  };
  const activePhase = getActivePhase();

  const handleModuleClick = (mod: ModuleInfo) => {
    const required = MODULE_TIER_REQUIRED[mod.phase];
    if (!hasTierAccess(effectiveTier, required)) {
      navigate("/#pricing");
      return;
    }
    navigate(mod.route);
  };

  return (
    <AuthenticatedLayout title="Emotional Surgery™">
      <div className="min-h-screen pt-24 pb-32 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
              Emotional Surgery™ Experience
            </h1>
            <p className="text-muted-foreground text-sm">
              Reset your mind. Rewire your identity. Reclaim your life.
            </p>
          </motion.div>

          {/* Module Cards */}
          <div className="space-y-4 mb-12">
            {modules.map((mod, idx) => {
              const completed = phaseCompletions[mod.phase] || 0;
              const progress = Math.round((completed / totalTracks) * 100);
              const required = MODULE_TIER_REQUIRED[mod.phase];
              const unlocked = hasTierAccess(effectiveTier, required);
              const isActive = mod.phase === activePhase;

              return (
                <motion.div
                  key={mod.phase}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <button
                    onClick={() => handleModuleClick(mod)}
                    className={`w-full text-left rounded-2xl border-l-4 border transition-all p-5 md:p-6 relative overflow-hidden group ${
                      unlocked
                        ? "border-l-primary border-border/40 bg-card hover:border-primary/60 hover:scale-[1.01]"
                        : "border-l-muted-foreground/30 border-border/20 bg-muted/30"
                    }`}
                  >
                    {/* Locked overlay */}
                    {!unlocked && (
                      <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-2xl">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Lock className="w-5 h-5" />
                          <span className="text-sm font-medium">Upgrade to unlock</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Phase label + badge */}
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
                            Phase {mod.phase}
                          </span>
                          {mod.badge && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-semibold flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              {mod.badge}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="font-serif text-lg md:text-xl font-bold text-foreground mb-1">
                          {mod.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                          {mod.description}
                        </p>

                        {/* Progress bar */}
                        <div className="flex items-center gap-3">
                          <Progress value={progress} className="h-1.5 flex-1 bg-muted [&>[data-state]]:bg-secondary" />
                          <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                            {completed}/{totalTracks}
                          </span>
                        </div>
                      </div>

                      {/* Right side: button */}
                      <div className="flex-shrink-0 mt-1">
                        {unlocked ? (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary hover:text-primary/80 font-semibold text-sm px-3"
                              tabIndex={-1}
                            >
                              {completed > 0 ? "Continue" : "Begin"}
                              <ChevronRight className="w-4 h-4 ml-0.5" />
                            </Button>
                          </div>
                        ) : (
                          <Lock className="w-5 h-5 text-muted-foreground/40" />
                        )}
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Framework Visual */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="px-4"
          >
            <h2 className="text-xs uppercase tracking-[0.25em] text-muted-foreground text-center mb-6 font-semibold">
              Your Transformation Journey
            </h2>
            <div className="flex items-center justify-between gap-0 relative">
              {/* Gold connector line */}
              <div className="absolute top-4 left-6 right-6 h-0.5 bg-border/40 z-0" />
              <div
                className="absolute top-4 left-6 h-0.5 bg-primary z-[1] transition-all duration-700"
                style={{ width: `${Math.max(0, ((activePhase - 1) / 4) * 100)}%`, maxWidth: "calc(100% - 48px)" }}
              />

              {modules.map((mod) => {
                const completed = (phaseCompletions[mod.phase] || 0) >= totalTracks;
                const isCurrent = mod.phase === activePhase;

                return (
                  <div key={mod.phase} className="flex flex-col items-center z-10 relative">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        completed
                          ? "bg-primary text-primary-foreground shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
                          : isCurrent
                          ? "bg-primary/20 text-primary border-2 border-primary shadow-[0_0_8px_hsl(var(--primary)/0.3)]"
                          : "bg-muted text-muted-foreground border border-border/40"
                      }`}
                    >
                      {mod.phase}
                    </div>
                    <span
                      className={`text-[10px] mt-2 text-center leading-tight max-w-[60px] ${
                        isCurrent ? "text-primary font-semibold" : "text-muted-foreground"
                      }`}
                    >
                      {mod.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
