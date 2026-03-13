import { ReactNode } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface LockedContentProps {
  children: ReactNode;
  requiredTier: "tier1" | "tier2" | "tier3" | "reset" | "expand" | "embody";
  currentTier: string;
}

const tierLabels: Record<string, string> = {
  tier1: "Reset",
  tier2: "Expand",
  tier3: "Embody",
  reset: "Reset",
  expand: "Expand",
  embody: "Embody",
};

const tierPrices: Record<string, string> = {
  tier1: "$44",
  tier2: "$88",
  tier3: "$111",
  reset: "$44",
  expand: "$88",
  embody: "$111",
};

export function LockedContent({ children, requiredTier, currentTier }: LockedContentProps) {
  // Normalize tier names for comparison
  const normalize = (t: string) => {
    const map: Record<string, number> = {
      free: 0, tier1: 1, reset: 1, tier2: 2, expand: 2, tier3: 3, embody: 3, founding_full_access: 3,
    };
    return map[t.toLowerCase()] ?? 0;
  };

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
          <h3 className="font-serif text-xl font-bold text-foreground">
            Unlock with {tierLabels[requiredTier]} — {tierPrices[requiredTier]}/month
          </h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            This content is available with the {tierLabels[requiredTier]} plan and above.
          </p>
          <Link to="/#pricing">
            <Button variant="gold" size="lg">
              Upgrade Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
