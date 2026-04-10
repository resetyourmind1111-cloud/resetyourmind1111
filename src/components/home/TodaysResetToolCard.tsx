import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";

const TIER_LEVEL: Record<string, number> = {
  free: 0, reset: 1, expand: 2, embody: 3, founding_full_access: 3,
};

export function TodaysResetToolCard() {
  const navigate = useNavigate();
  const { effectiveTier } = useSubscription();
  const hasAccess = (TIER_LEVEL[effectiveTier?.toLowerCase() ?? "free"] ?? 0) >= 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="mb-4"
    >
      <Card className="p-5 bg-card/80 border-border/50 relative overflow-hidden">
        {!hasAccess && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-lg">
            <div className="flex items-center gap-2 text-primary">
              <Lock className="w-5 h-5" />
              <span className="text-sm font-medium">Expand tier required</span>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-primary font-semibold">Today's Reset Tool</p>
            <p className="text-sm font-semibold text-foreground">Releasing Resistance</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          What you fight, you feed. What you feel, you free.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-xs"
          onClick={() => hasAccess ? navigate("/releasing-resistance") : navigate("/upgrade")}
        >
          {hasAccess ? "Start Lesson →" : "Upgrade to Unlock"}
        </Button>
      </Card>
    </motion.div>
  );
}