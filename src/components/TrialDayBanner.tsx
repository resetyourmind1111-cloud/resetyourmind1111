import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function TrialDayBanner() {
  const { isTrialActive, trialDay, founderBannerDismissedCount } = useTrialStatus();
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  // Show on Day 3+, re-show on Day 5 if dismissed only once
  const shouldShow = isTrialActive && trialDay >= 2 && !dismissed;
  const wasAlreadyDismissed = founderBannerDismissedCount >= 1 && trialDay < 4;
  const wasDoubleDismissed = founderBannerDismissedCount >= 2;

  if (!shouldShow || wasAlreadyDismissed || wasDoubleDismissed) return null;

  const handleDismiss = async () => {
    setDismissed(true);
    if (user) {
      await supabase.from("profiles").update({
        founder_banner_dismissed_count: founderBannerDismissedCount + 1,
      } as any).eq("user_id", user.id);
    }
  };

  const daysLeft = 7 - trialDay;

  return (
    <div className="relative w-full bg-[#C9A84C] text-[#06060e] px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex-1 text-center">
        <p className="font-serif font-semibold text-sm md:text-base">
          {trialDay >= 2 && trialDay < 4
            ? "🔒 You've started something real. Lock in Founding Member pricing before your preview ends."
            : `You've started something. Don't stop here.`}
        </p>
        <p className="text-xs opacity-80 mt-0.5">
          {daysLeft > 0 ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left in your preview` : "Preview ends today"}
        </p>
      </div>
      <Link to="/upgrade">
        <Button size="sm" className="bg-[#06060e] text-[#C9A84C] hover:bg-[#06060e]/90 text-xs font-semibold whitespace-nowrap">
          {trialDay >= 2 && trialDay < 4 ? "Claim Founding Rate →" : "Upgrade Now"}
        </Button>
      </Link>
      <button
        onClick={handleDismiss}
        className="absolute top-1 right-1 p-1 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
