import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useTrialStatus, TRIAL_PERMISSION_SLIPS } from "@/hooks/useTrialStatus";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export function DailyPermissionSlipCard() {
  const { user } = useAuth();
  const { isTrialActive, trialDay, trialExpired } = useTrialStatus();
  const [revealed, setRevealed] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;
  if (!isTrialActive && !trialExpired) return null;
  if (!user) return null;

  // Day index 0-6 maps to slips 0-6
  const slipIndex = Math.min(Math.max(trialDay, 0), 6);
  const slip = TRIAL_PERMISSION_SLIPS[slipIndex];
  const isDay7 = trialDay >= 6; // index 6 = Day 7

  const handleSave = async () => {
    await supabase.from("healing_tool_entries").insert({
      user_id: user.id,
      tool_id: "permission-slip-trial",
      entry_data: { text: slip, day: trialDay + 1, tags: ["permission_slip", "trial"] },
    });
    setSaved(true);
    toast.success("✨ You gave yourself permission. That changes everything.");
  };

  if (!revealed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card
          onClick={() => setRevealed(true)}
          className="cursor-pointer border-2 border-[#C9A84C]/30 bg-[#3D1A6E]/20 p-6 text-center hover:border-[#C9A84C]/60 transition-all"
        >
          <Sparkles className="w-6 h-6 text-[#C9A84C] mx-auto mb-3" />
          <p className="font-serif text-[#C9A84C] font-semibold">Your Permission Slip for Today</p>
          <p className="text-muted-foreground text-xs mt-1">Tap to reveal</p>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: 90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`border-2 ${isDay7 ? "border-[#C9A84C]" : "border-[#C9A84C]/30"} bg-[#06060e] p-6 text-center space-y-4`}>
        <Sparkles className="w-6 h-6 text-[#C9A84C] mx-auto" />
        <p className="font-serif italic text-[#F9F6F0] text-xl leading-relaxed">"{slip}"</p>

        {!saved ? (
          <div className="flex gap-3 justify-center">
            <Button onClick={handleSave} variant="gold" size="sm">
              Save to Journal
            </Button>
            <Button onClick={() => setDismissed(true)} variant="ghost" size="sm" className="text-muted-foreground">
              Keep Going →
            </Button>
          </div>
        ) : (
          <p className="text-[#C9A84C] text-sm font-medium">
            ✨ You gave yourself permission. That changes everything.
          </p>
        )}

        {isDay7 && revealed && (
          <div className="pt-3 border-t border-border/30 space-y-2">
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs">
              <Lock className="w-3 h-3" />
              <span>More permission slips are waiting inside the full app.</span>
            </div>
            <Link to="/upgrade">
              <Button variant="ghost" size="sm" className="text-[#C9A84C] text-xs">
                Unlock All →
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
