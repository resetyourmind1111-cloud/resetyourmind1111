import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const woundLabels: Record<string, string> = {
  wealth: "Money & Wealth",
  love: "Love & Relationships",
  health: "Health & Body",
  identity: "Identity & Leadership",
};

const firstCardByWound: Record<string, string> = {
  wealth: "Worth Thermostat Assessment",
  love: "Worth Thermostat Assessment",
  health: "Nervous System Diagnostic",
  identity: "Worth Thermostat Assessment",
};

export function ResetPlanWidget() {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile-widget", user?.id],
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

  if (!profile) return null;

  const onboardingComplete = (profile as any)?.onboarding_complete;
  const primaryWound = (profile as any)?.primary_wound as string | null;

  if (onboardingComplete && primaryWound) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <Card className="p-5 bg-card/80 border-border/50">
          <p className="text-[10px] uppercase tracking-[0.15em] text-primary font-semibold mb-1">
            Your Reset Plan
          </p>
          <p className="text-sm text-foreground mb-0.5">
            Primary focus: <span className="text-primary font-medium">{woundLabels[primaryWound]}</span>
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            Recommended start: {firstCardByWound[primaryWound]}
          </p>
          <Link to="/reset-plan" className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1">
            View full plan <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mb-6"
    >
      <Card className="p-5 bg-card/80 border-primary/30">
        <h3 className="font-serif font-semibold text-foreground mb-1">
          Build your personal reset plan
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          3 minutes. Tells you exactly where to start.
        </p>
        <Link to="/onboarding">
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Start Here
          </Button>
        </Link>
      </Card>
    </motion.div>
  );
}
