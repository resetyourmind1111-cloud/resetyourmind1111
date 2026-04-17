import { Link } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { PauseCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CancelledBanner() {
  const { subscription, effectiveTier } = useSubscription();

  // Show only when fully cancelled and no longer in paid period (effectiveTier dropped to free)
  if (
    !subscription ||
    subscription.status !== "canceled" ||
    effectiveTier !== "free"
  ) {
    return null;
  }

  return (
    <div className="w-full bg-accent/15 border-y border-accent/40 px-4 py-3">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-foreground">
          <PauseCircle className="w-5 h-5 flex-shrink-0 text-accent" />
          <p className="text-sm font-medium">
            Your subscription is paused. Reactivate to continue your reset.
          </p>
        </div>
        <Link to="/upgrade">
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
            Reactivate →
          </Button>
        </Link>
      </div>
    </div>
  );
}
