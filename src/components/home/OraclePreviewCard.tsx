import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { useSubscription } from "@/hooks/useSubscription";

export function OraclePreviewCard() {
  const { user } = useAuth();
  const { isTrialActive } = useTrialStatus();
  const { effectiveTier } = useSubscription();
  const [pullsUsed, setPullsUsed] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("oracle_preview_pulls_used")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setPullsUsed((data as any).oracle_preview_pulls_used || 0);
      });
  }, [user]);

  const isTrialUser = isTrialActive && effectiveTier === "free";
  if (!isTrialUser || pullsUsed === null || pullsUsed >= 3) return null;

  const remaining = 3 - pullsUsed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="mb-6"
    >
      <Link to="/oracle">
        <Card className="p-5 bg-card/80 border-[#C9A84C]/30 hover:border-[#C9A84C]/60 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#C9A84C]" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#C9A84C] font-semibold">Oracle Preview</p>
              <p className="text-sm text-muted-foreground">
                {pullsUsed === 0 ? "3 free pulls waiting" : `${remaining} pull${remaining !== 1 ? "s" : ""} remaining`}
              </p>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
