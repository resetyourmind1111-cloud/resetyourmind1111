import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTrialStatus } from "@/hooks/useTrialStatus";

export function TrialDayBanner() {
  const { isTrialActive, trialDay } = useTrialStatus();
  const [dismissed, setDismissed] = useState(false);

  // Show only on Day 3+, during active trial, and not dismissed
  if (!isTrialActive || trialDay < 3 || dismissed) return null;

  return (
    <div className="relative w-full bg-[#C9A84C] text-[#06060e] px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex-1 text-center">
        <p className="font-serif font-semibold text-sm md:text-base">
          You've started something. Don't stop here.
        </p>
        <p className="text-xs opacity-80 mt-0.5">
          {7 - trialDay} day{7 - trialDay !== 1 ? "s" : ""} left in your preview
        </p>
      </div>
      <Link to="/upgrade">
        <Button size="sm" className="bg-[#06060e] text-[#C9A84C] hover:bg-[#06060e]/90 text-xs font-semibold whitespace-nowrap">
          Upgrade Now
        </Button>
      </Link>
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-1 right-1 p-1 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
