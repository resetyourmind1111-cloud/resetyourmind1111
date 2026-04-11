import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Diamond, Heart, Flame, Crown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ResetPlanCards } from "@/components/onboarding/ResetPlanCards";

const woundMeta: Record<string, { label: string; icon: typeof Diamond }> = {
  wealth: { label: "Money & Wealth", icon: Diamond },
  love: { label: "Love & Relationships", icon: Heart },
  health: { label: "Health & Body", icon: Flame },
  identity: { label: "Identity & Leadership", icon: Crown },
};

export default function ResetPlan() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [redoing, setRedoing] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile-reset-plan", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const onboardingComplete = (profile as any)?.onboarding_complete;
  const primaryWound = (profile as any)?.primary_wound as string | null;
  const resetGoal = (profile as any)?.reset_goal as string | null;
  const firstName = (profile as any)?.full_name?.split(" ")[0] || null;
  const wound = primaryWound ? woundMeta[primaryWound] : null;

  // Treat as incomplete if onboarding_complete but no primary_wound
  const planReady = onboardingComplete && primaryWound;

  const handleRedo = async () => {
    if (!user) return;
    setRedoing(true);
    await supabase
      .from("profiles")
      .update({ onboarding_complete: false, reset_plan_generated: false } as any)
      .eq("user_id", user.id);
    navigate("/onboarding");
  };

  return (
    <AuthenticatedLayout title="My Reset Plan">
      <div className="container mx-auto px-4 md:px-6 max-w-2xl py-8">
        {!planReady ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <p className="text-[11px] uppercase tracking-[0.18em] text-primary font-semibold mb-4">
              YOUR PERSONAL RESET PLAN
            </p>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
              Let's find out exactly<br />where you need to begin.
            </h1>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6 leading-relaxed">
              Your reset plan is built around your primary wound — the area of your life where patterns have been running longest.
            </p>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-2">
              It takes 3 minutes. And it tells you exactly where to start.
            </p>

            <div className="text-left max-w-sm mx-auto my-8 space-y-2">
              <p className="text-muted-foreground text-sm">
                <span className="text-primary mr-2">—</span>Your primary identity pattern
              </p>
              <p className="text-muted-foreground text-sm">
                <span className="text-primary mr-2">—</span>Your 3 recommended starting points
              </p>
              <p className="text-muted-foreground text-sm">
                <span className="text-primary mr-2">—</span>A personalized path through the app
              </p>
            </div>

            <Link to="/onboarding">
              <Button className="w-full max-w-sm bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 py-6 rounded-xl text-base">
                Build My Reset Plan →
              </Button>
            </Link>
            <p className="text-muted-foreground/50 text-xs mt-4 max-w-sm mx-auto">
              Already done this? Your plan saves automatically. If it's not showing, tap above to redo it.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[11px] uppercase tracking-[0.18em] text-primary font-semibold text-center mb-2">
              YOUR RESET PLAN
            </p>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
              {firstName ? `${firstName}, here's` : "Here's"} where you begin.
            </h1>

            {wound && (
              <div className="flex items-center justify-center gap-2 mb-2">
                <wound.icon className="w-5 h-5 text-primary" />
                <span className="text-primary font-semibold">
                  Your reset is built around: {wound.label}
                </span>
              </div>
            )}

            {resetGoal && (
              <p className="text-muted-foreground text-sm text-center italic mb-8">
                "{resetGoal}"
              </p>
            )}

            <ResetPlanCards primaryWound={primaryWound || "wealth"} />

            <p className="text-muted-foreground/60 text-xs text-center mt-8">
              Your plan updates as you grow. Retake the quiz anytime in Settings.
            </p>

            <div className="mt-8 text-center">
              <Button
                variant="ghost"
                onClick={handleRedo}
                disabled={redoing}
                className="text-muted-foreground hover:text-foreground gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                {redoing ? "Resetting…" : "Redo my reset plan →"}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
