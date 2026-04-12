import { ReactNode } from "react";
import { Lock, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

interface TrialLockedContentProps {
  children: ReactNode;
  isLocked: boolean;
}

export function TrialLockedContent({ children, isLocked }: TrialLockedContentProps) {
  const navigate = useNavigate();
  if (!isLocked) return <>{children}</>;

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/dashboard");
  };

  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="blur-sm pointer-events-none select-none opacity-40">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm rounded-2xl">
        <button onClick={handleBack} className="absolute top-4 left-4 flex items-center gap-1 text-sm text-foreground/65 hover:text-foreground/90 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-accent" />
          </div>
          <p className="text-muted-foreground text-sm max-w-xs">
            This is available when you upgrade. Your preview gives you a taste. The full reset is waiting.
          </p>
          <Link to="/upgrade">
            <Button variant="gold" size="lg">
              Upgrade Now
            </Button>
          </Link>
          <button onClick={handleBack} className="text-foreground/40 text-[13px] hover:text-foreground/60 transition-colors mt-2">
            ← Continue my preview
          </button>
        </div>
      </div>
    </div>
  );
}
