import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useTrialStatus } from "@/hooks/useTrialStatus";

const MINDIST_WELCOME_URL = "https://mindist.page.link/eyTV";

export function LorieWelcomeCard() {
  const { user } = useAuth();
  const { trialDay, isTrialActive } = useTrialStatus();
  const [show, setShow] = useState(false);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (!user || !isTrialActive || trialDay > 1) return;

    const check = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("lorie_welcome_shown")
        .eq("user_id", user.id)
        .single();
      if (data && !(data as any).lorie_welcome_shown) {
        setShow(true);
      }
    };
    check();
  }, [user, isTrialActive, trialDay]);

  const openMindist = () => {
    window.open(MINDIST_WELCOME_URL, "_blank", "noopener,noreferrer");
    setOpened(true);
  };

  const handleDismissLater = () => setShow(false);

  const handleDismissForever = async () => {
    setShow(false);
    if (user) {
      await supabase
        .from("profiles")
        .update({ lorie_welcome_shown: true } as any)
        .eq("user_id", user.id);
    }
  };

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="p-5 bg-[#2A1F3D] border-t-2 border-t-[#C9A84C] border-[#2A1F3D]">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold mb-3">
          A Message From Lorie
        </p>

        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={openMindist}
            className="w-12 h-12 rounded-full bg-[#C9A84C] flex items-center justify-center shrink-0 hover:bg-[#C9A84C]/90 transition-colors"
          >
            <Play className="w-5 h-5 text-[#06060e] ml-0.5" />
          </button>
          <div>
            <p className="text-[#F9F6F0] text-sm font-semibold">Welcome to Your Reset</p>
            <p className="text-[#F9F6F0]/40 text-xs flex items-center gap-1">
              3 min — Opens in Mindist <ExternalLink className="w-3 h-3 inline" />
            </p>
          </div>
        </div>

        {opened && (
          <p className="text-xs text-[#C9A84C]/80 mb-3">✦ Guided reset opened — listen and come back when you're done</p>
        )}

        <div className="mb-3">
          <p className="text-[#F9F6F0]/80 text-sm font-medium">Lorie Wu</p>
          <p className="text-[#F9F6F0]/40 text-xs">
            CEO, Reset Your Mind 1111™ | Author, The Emotional Surgeon™
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleDismissLater}
            className="text-xs text-[#F9F6F0]/40 hover:text-[#F9F6F0]/60 transition-colors"
          >
            I'll listen later
          </button>
          <button
            onClick={handleDismissForever}
            className="text-[10px] text-[#F9F6F0]/25 hover:text-[#F9F6F0]/40 transition-colors"
          >
            Don't show again
          </button>
        </div>
      </Card>
    </motion.div>
  );
}
