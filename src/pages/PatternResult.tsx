import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TRAP_SLUGS } from "@/data/identityTrapData";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PatternAiChatPanel, PatternAiTriggerButton } from "@/components/patterns/PatternAiChatPanel";
import { PatternShareCard } from "@/components/patterns/PatternShareCard";
import { TrialBackButton } from "@/components/TrialBackButton";

export default function PatternResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasAccess } = useSubscription();
  const { user } = useAuth();
  const stateData = (location.state as { primary?: string; secondary?: string | null }) || {};
  const [primary, setPrimary] = useState<string | null>(stateData.primary ?? null);
  const [secondary, setSecondary] = useState<string | null>(stateData.secondary ?? null);
  const [loading, setLoading] = useState(!stateData.primary);
  const [showAiChat, setShowAiChat] = useState(false);

  // If no state was passed (deep link / refresh), pull the latest saved result.
  useEffect(() => {
    if (primary || !user) return;
    let cancelled = false;
    supabase
      .from("identity_trap_results")
      .select("primary_trap, secondary_trap")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (cancelled) return;
        if (data && data.length > 0) {
          setPrimary(data[0].primary_trap);
          setSecondary(data[0].secondary_trap);
        } else {
          navigate("/patterns/quiz", { replace: true });
        }
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [primary, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!primary) return null;

  const slug = TRAP_SLUGS[primary];

  return (
    <div className="min-h-screen bg-background flex flex-col p-6">
      <TrialBackButton fallbackPath="/patterns" label="Back" className="mb-4" />
      <div className="flex-1 flex items-center justify-center">
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

          <PatternAiTriggerButton
            label="Ask AI For Help →"
            onClick={() => setShowAiChat(true)}
          />

          <div className="pt-2 flex justify-center">
            <PatternShareCard trapName={primary} />
          </div>
        </div>
      </motion.div>
      </div>

      <PatternAiChatPanel
        trapName={primary}
        show={showAiChat}
        onClose={() => setShowAiChat(false)}
      />
    </div>
  );
}
