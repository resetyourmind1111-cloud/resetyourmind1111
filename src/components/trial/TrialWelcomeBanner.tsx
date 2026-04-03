import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const BANNER_COPY: Record<string, string> = {
  stuck: "Let's find out what's keeping you there. Start with the Worth Thermostat™.",
  sabotage: "The pattern is subconscious. Let's surface it. Start here.",
  relationships: "Your outer world reflects your inner standard. Let's reset that standard.",
  levelup: "You already know. Let's remove what's in the way. Start here.",
};

export function TrialWelcomeBanner() {
  const { isTrialActive, trialDay, onboardingReason, welcomeBannerDismissed } = useTrialStatus();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  if (!isTrialActive || trialDay > 0 || welcomeBannerDismissed || dismissed || !onboardingReason) return null;

  const handleDismiss = async () => {
    setDismissed(true);
    if (user) {
      await supabase.from("profiles").update({ welcome_banner_dismissed: true } as any).eq("user_id", user.id);
    }
  };

  const copy = BANNER_COPY[onboardingReason] || BANNER_COPY.stuck;

  return (
    <div className="relative w-full bg-[#C9A84C] text-[#06060e] px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex-1">
        <p className="font-serif font-semibold text-sm">{copy}</p>
      </div>
      <Button
        size="sm"
        onClick={() => { handleDismiss(); navigate("/assessment"); }}
        className="bg-[#06060e] text-[#C9A84C] hover:bg-[#06060e]/90 text-xs font-semibold whitespace-nowrap"
      >
        Start Here →
      </Button>
      <button onClick={handleDismiss} className="absolute top-1 right-1 p-1 opacity-60 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
