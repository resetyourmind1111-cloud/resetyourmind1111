import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTrialStatus } from "@/hooks/useTrialStatus";

export function Day7BottomBanner() {
  const { isTrialActive, trialDay } = useTrialStatus();

  // Show only on Day 7 (trialDay === 6, zero-indexed). Day 8+ shows TrialExpiredOverlay instead.
  if (!isTrialActive || trialDay !== 6) return null;

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 px-4 py-3 bg-[#06060e]/95 backdrop-blur-sm border-t border-[#C9A84C]/30">
      <Link
        to="/upgrade"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#06060e] font-bold text-base shadow-lg transition-colors"
      >
        Start My Full Reset
        <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  );
}
