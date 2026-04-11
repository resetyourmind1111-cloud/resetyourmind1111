import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Share2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function TransformationCard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: results } = useQuery({
    queryKey: ["assessment-results-transform", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("assessment_results")
        .select("total_score, percentage_score, thermostat_type, completed_at")
        .eq("user_id", user!.id)
        .order("completed_at", { ascending: true });
      return data || [];
    },
    enabled: !!user,
  });

  if (!results || results.length < 2) {
    if (results && results.length === 1) {
      return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Card className="p-5 bg-card/80 border-border/50 text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-2">
              Your Transformation
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              Retake the Worth Thermostat next month to see your transformation.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/assessment")}
              className="border-primary/40 text-primary"
            >
              Take monthly check-in →
            </Button>
          </Card>
        </motion.div>
      );
    }
    return null;
  }

  const first = results[0];
  const latest = results[results.length - 1];
  const diff = latest.percentage_score - first.percentage_score;

  const handleShare = async () => {
    const text = `I started at ${first.percentage_score}%. Today I'm at ${latest.percentage_score}%. ${Math.abs(diff)} points of transformation.\nReset Your Mind 1111™ #WorthThermostat`;
    if (navigator.share) {
      try { await navigator.share({ text }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      toast("Copied to clipboard ✦");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
      <Card className="p-6 bg-card/80 border-border/50">
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-4 text-center">
          Your Transformation
        </p>

        <div className="flex items-center justify-center gap-4 mb-4">
          {/* Day 1 */}
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">When you started</p>
            <p className="text-xs text-muted-foreground">{new Date(first.completed_at).toLocaleDateString()}</p>
            <p className="font-serif text-3xl font-bold text-foreground">{first.percentage_score}%</p>
            <p className="text-xs text-muted-foreground">{first.thermostat_type}</p>
          </div>

          <ArrowRight className="w-5 h-5 text-primary shrink-0" />

          {/* Today */}
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Right now</p>
            <p className="text-xs text-muted-foreground">{new Date(latest.completed_at).toLocaleDateString()}</p>
            <p className="font-serif text-3xl font-bold text-primary">{latest.percentage_score}%</p>
            <p className="text-xs text-muted-foreground">{latest.thermostat_type}</p>
          </div>
        </div>

        {diff > 0 ? (
          <p className="text-sm text-primary text-center font-medium">
            You've risen {diff} points.
            <span className="block text-xs text-muted-foreground mt-0.5">
              That is not small. That is the work.
            </span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground text-center">
            You're holding steady. Keep going — the shift is coming.
          </p>
        )}

        <div className="flex justify-center mt-3">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </Card>
    </motion.div>
  );
}
