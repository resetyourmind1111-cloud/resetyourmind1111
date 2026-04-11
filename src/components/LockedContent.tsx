import { ReactNode } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useFoundingMode } from "@/hooks/useFoundingMode";

type TierName = "reset" | "expand" | "embody" | "founding_full_access";

interface LockedContentProps {
  children: ReactNode;
  requiredTier: TierName;
  currentTier: string;
}

const tierLabels: Record<TierName, string> = {
  reset: "Reset",
  expand: "Expand",
  embody: "Embody",
  founding_full_access: "Founding 111",
};

const tierPrices: Record<TierName, string> = {
  reset: "$44",
  expand: "$88",
  embody: "$111",
  founding_full_access: "$44",
};

const TIER_LEVEL: Record<string, number> = {
  free: 0,
  reset: 1,
  expand: 2,
  embody: 3,
  founding_full_access: 3,
};

export function LockedContent({ children, requiredTier, currentTier }: LockedContentProps) {
  const normalize = (t: string) => TIER_LEVEL[t.toLowerCase()] ?? 0;
  const { foundingMode } = useFoundingMode();

  if (normalize(currentTier) >= normalize(requiredTier)) {
    return <>{children}</>;
  }

  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="blur-sm pointer-events-none select-none opacity-40">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm rounded-2xl">
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-accent" />
          </div>
          {foundingMode ? (
            <>
              <h3 className="font-serif text-xl font-bold text-foreground">
                Available inside Founding Access
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                Lock in $44/month for full access — for life.
              </p>
              <Link to="/upgrade">
                <Button variant="gold" size="lg">
                  Lock In My Founding Rate →
                </Button>
              </Link>
            </>
          ) : (
            <>
              <h3 className="font-serif text-xl font-bold text-foreground">
                Unlock with {tierLabels[requiredTier]} — {tierPrices[requiredTier]}/month
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                This content is available with the {tierLabels[requiredTier]} plan and above.
              </p>
              <Link to="/upgrade">
                <Button variant="gold" size="lg">
                  Upgrade to {tierLabels[requiredTier]} →
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
