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
    <div className="w-full bg-amber-100 dark:bg-amber-900/30 border-y border-amber-300 dark:border-amber-700/50 px-4 py-3">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
          <PauseCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">
            Your subscription is paused. Reactivate to continue your reset.
          </p>
        </div>
        <Link to="/upgrade">
          <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold">
            Reactivate →
          </Button>
        </Link>
      </div>
    </div>
  );
}
