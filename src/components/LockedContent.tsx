import { ReactNode } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface LockedContentProps {
  children: ReactNode;
  requiredTier: "tier2" | "tier3";
  currentTier: string;
}

const tierLabels: Record<string, string> = {
  tier2: "Expand",
  tier3: "Embody",
};

export function LockedContent({ children, requiredTier, currentTier }: LockedContentProps) {
  const tierOrder = ["free", "tier1", "tier2", "tier3"];
  const currentIndex = tierOrder.indexOf(currentTier);
  const requiredIndex = tierOrder.indexOf(requiredTier);

  if (currentIndex >= requiredIndex) {
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
            Upgrade to {tierLabels[requiredTier]}
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
