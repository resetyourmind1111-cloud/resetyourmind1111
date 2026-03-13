import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";

export function PastDueBanner() {
  const { subscription } = useSubscription();

  if (!subscription || subscription.status !== "past_due") return null;

  return (
    <div className="bg-destructive/10 border-b border-destructive/30 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">
            Your last payment failed. Please update your payment method to keep your access.
          </span>
        </div>
        <Link to="/my-account">
          <Button variant="outline" size="sm" className="border-destructive/50 text-destructive hover:bg-destructive/10">
            Update Payment
          </Button>
        </Link>
      </div>
    </div>
  );
}
