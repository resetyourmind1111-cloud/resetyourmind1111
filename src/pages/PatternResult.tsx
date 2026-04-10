import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { TRAP_SLUGS } from "@/data/identityTrapData";
import { useSubscription } from "@/hooks/useSubscription";

export default function PatternResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasAccess } = useSubscription();
  const { primary, secondary } = (location.state as { primary: string; secondary: string | null }) || {};

  if (!primary) {
    navigate("/patterns");
    return null;
  }

  const slug = TRAP_SLUGS[primary];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center space-y-6"
      >
        <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-semibold">Your primary pattern</p>

        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight">
          {primary}
        </h1>

        <p className="text-muted-foreground text-base leading-relaxed">
          This does not mean this is who you are.{"\n"}
          It means this is the protection pattern your system learned.{"\n"}
          And patterns can be reset.
        </p>

        {secondary && (
          <p className="text-sm text-muted-foreground/70 italic">
            You may also notice: {secondary}
          </p>
        )}

        <div className="space-y-3 pt-4">
          <Button
            variant="gold"
            size="lg"
            className="w-full text-base py-6"
            onClick={() => navigate(`/patterns/${slug}`, { state: { startAt: 7 } })}
          >
            Start My 3-Min Reset
          </Button>

          <Button
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => navigate(`/patterns/${slug}`)}
          >
            Learn About This Pattern
          </Button>

          {hasAccess("expand") ? (
            <button
              onClick={() => navigate(`/patterns/${slug}`, { state: { startAt: 10 } })}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Ask AI For Help →
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground/50">
              <Lock className="w-3.5 h-3.5" />
              <span>AI Support — Available on Expand plan</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
