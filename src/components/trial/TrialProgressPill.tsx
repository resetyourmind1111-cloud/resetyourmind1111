import { useState } from "react";
import { useTrialStatus, TRIAL_TOOL_NAMES } from "@/hooks/useTrialStatus";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Check, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export function TrialProgressPill() {
  const { isTrialActive, trialExpired, trialDay, isLoading } = useTrialStatus();

  if (isLoading) return null;
  if (!isTrialActive && !trialExpired) return null;

  const label = trialExpired
    ? "Preview Ended · Upgrade to Continue"
    : `Day ${Math.min(trialDay + 1, 7)} of 7 · Preview`;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="px-3 py-1 text-xs font-medium rounded-full bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/30 hover:bg-[#C9A84C]/25 transition-colors whitespace-nowrap">
          {label}
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="bg-[#06060e] border-[#C9A84C]/20">
        <SheetHeader>
          <SheetTitle className="font-serif text-[#F9F6F0] text-xl">
            Your 7-Day Preview — Day {Math.min(trialDay + 1, 7)} of 7
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <p className="text-[#C9A84C] text-xs uppercase tracking-wider font-semibold">Unlocked</p>
            {["Worth Thermostat™", "Days 1–3 of 30-Day Experience", "3 Meditations", "2 Tools"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span className="text-[#F9F6F0]/80 text-sm">{item}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-[#F9F6F0]/40 text-xs uppercase tracking-wider font-semibold">Waiting</p>
            {["Full Emotional Surgery™", "Complete 30-Day Experience", "Full Tools", "Oracle Cards"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#F9F6F0]/30" />
                <span className="text-[#F9F6F0]/50 text-sm">{item}</span>
              </div>
            ))}
          </div>
          <Link to="/upgrade" className="block">
            <Button className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-serif font-bold mt-2">
              Upgrade Now →
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
