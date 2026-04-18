import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const REMIND_HOURS = 24;

export function TrialExpiredOverlay() {
  const { trialExpired, isLoading: trialLoading } = useTrialStatus();
  const { effectiveTier, isLoading: subLoading } = useSubscription();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [snoozed, setSnoozed] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user || trialLoading || subLoading) return;
    if (!trialExpired || effectiveTier !== "free") {
      setSnoozed(false);
      return;
    }

    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("upgrade_reminder_timestamp")
        .eq("user_id", user.id)
        .maybeSingle();

      const ts = (data as any)?.upgrade_reminder_timestamp;
      if (!ts) {
        setSnoozed(false);
        return;
      }
      const elapsedMs = Date.now() - new Date(ts).getTime();
      const remindMs = REMIND_HOURS * 60 * 60 * 1000;
      if (elapsedMs >= remindMs) {
        // Reset & show
        await supabase
          .from("profiles")
          .update({ upgrade_reminder_timestamp: null } as any)
          .eq("user_id", user.id);
        setSnoozed(false);
      } else {
        setSnoozed(true);
      }
    })();
  }, [user, trialExpired, effectiveTier, trialLoading, subLoading]);

  if (trialLoading || subLoading) return null;
  if (!trialExpired || effectiveTier !== "free") return null;
  if (snoozed === null || snoozed) return null;

  const handleRemind = async () => {
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ upgrade_reminder_timestamp: new Date().toISOString() } as any)
      .eq("user_id", user.id);
    setSnoozed(true);
    toast("We'll remind you tomorrow.");
  };

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
          {["Worth Thermostat™", "3 days of your reset journey", "3 Meditations", "2 Tools"].map((item) => (
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

        <Button
          variant="outline"
          size="sm"
          onClick={handleRemind}
          className="border-[#F9F6F0]/20 bg-transparent text-[#F9F6F0]/60 hover:bg-[#F9F6F0]/5 hover:text-[#F9F6F0]/80"
        >
          Remind me in 24 hours
        </Button>
      </div>
    </div>
  );
}
