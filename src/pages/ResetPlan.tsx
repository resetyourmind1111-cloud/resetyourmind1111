import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Diamond, Heart, Flame, Crown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
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
  const wound = primaryWound ? woundMeta[primaryWound] : null;

  const handleRedo = async () => {
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ onboarding_complete: false, reset_plan_generated: false } as any)
      .eq("user_id", user.id);
    navigate("/onboarding");
  };

  return (
    <AuthenticatedLayout title="My Reset Plan">
      <div className="container mx-auto px-4 md:px-6 max-w-2xl py-8">
        {!onboardingComplete ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <h1 className="font-serif text-2xl font-bold text-foreground mb-3">
              You haven't built your reset plan yet.
            </h1>
            <p className="text-muted-foreground text-sm mb-8">
              Take 3 minutes to discover exactly where to start.
            </p>
            <Link to="/onboarding">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 py-6 rounded-xl text-base">
                Build My Plan
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
              My Reset Plan
            </h1>

            {wound && (
              <div className="flex items-center justify-center gap-2 mb-2">
                <wound.icon className="w-5 h-5 text-primary" />
                <span className="text-primary font-semibold">{wound.label}</span>
              </div>
            )}

            {resetGoal && (
              <p className="text-muted-foreground text-sm text-center italic mb-8">
                "{resetGoal}"
              </p>
            )}

            <ResetPlanCards primaryWound={primaryWound || "wealth"} />

            <div className="mt-12 text-center">
              <Button
                variant="ghost"
                onClick={handleRedo}
                className="text-muted-foreground hover:text-foreground gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Redo my reset plan
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
