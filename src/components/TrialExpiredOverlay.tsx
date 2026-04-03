import { Button } from "@/components/ui/button";
import { Lock, Check } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#06060e]/90 backdrop-blur-sm p-6 overflow-y-auto">
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
          <p className="text-[#F9F6F0]/50 text-sm">
            Everything you experienced is still here. The rest is waiting.
          </p>
        </div>

        {/* What they unlocked */}
        <div className="space-y-2 text-left">
          <p className="text-[#C9A84C] text-xs uppercase tracking-wider font-semibold">What you unlocked</p>
          {["Worth Thermostat™", "Days 1–3", "3 Meditations", "2 Tools"].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span className="text-[#F9F6F0]/70 text-sm">{item}</span>
            </div>
          ))}
        </div>

        {/* What's waiting */}
        <div className="text-left">
          <p className="text-[#F9F6F0]/40 text-xs uppercase tracking-wider font-semibold mb-2">What's waiting</p>
          <p className="text-[#F9F6F0]/60 text-sm leading-relaxed">
            The full Emotional Surgery™ framework. All 5 phases. All tools. All 3 Oracle decks. The complete 30-Day reset.
          </p>
        </div>

        <Button
          size="lg"
          onClick={() => navigate("/upgrade")}
          className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-serif font-bold text-lg px-8 py-6"
        >
          Continue My Reset →
        </Button>

        <button
          onClick={() => {
            const overlay = document.getElementById("trial-expired-overlay");
            if (overlay) overlay.style.display = "none";
          }}
          className="text-[#F9F6F0]/30 text-xs hover:text-[#F9F6F0]/50 transition-colors"
        >
          Not right now
        </button>
      </div>
    </div>
  );
}
