import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { useSubscription } from "@/hooks/useSubscription";

export function TrialExpiredOverlay() {
  const { trialExpired, isLoading: trialLoading } = useTrialStatus();
  const { effectiveTier, isLoading: subLoading } = useSubscription();
  const navigate = useNavigate();

  if (trialLoading || subLoading) return null;
  if (!trialExpired || effectiveTier !== "free") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#06060e]/90 backdrop-blur-sm p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#C9A84C]/15 flex items-center justify-center mx-auto">
          <Lock className="w-10 h-10 text-[#C9A84C]" />
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#F9F6F0]">
            Your preview has ended.
          </h2>
          <p className="text-[#F9F6F0]/80 text-lg leading-relaxed">
            You started something real.<br />
            Don't leave it unfinished.
          </p>
        </div>

        <p className="text-[#F9F6F0]/50 text-sm">
          Everything you started is still here — waiting for you.
        </p>

        <Button
          size="lg"
          onClick={() => navigate("/upgrade")}
          className="bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-serif font-bold text-lg px-8 py-6"
        >
          Continue My Reset →
        </Button>
      </div>
    </div>
  );
}
