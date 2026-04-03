import { Link } from "react-router-dom";
import { useTrialStatus } from "@/hooks/useTrialStatus";

export function Day7BottomBanner() {
  const { isTrialActive, trialDay } = useTrialStatus();

  // Show only on Day 7 (trialDay >= 6)
  if (!isTrialActive || trialDay < 6) return null;

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-[#C9A84C]/90 backdrop-blur-sm px-4 py-2 text-center">
      <span className="text-[#06060e] text-sm font-medium">
        Preview ends today ·{" "}
        <Link to="/upgrade" className="underline font-bold">
          Upgrade to keep going →
        </Link>
      </span>
    </div>
  );
}
