import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type Reason = "stuck" | "sabotage" | "relationships" | "levelup";

const RECOMMENDATIONS: Record<
  Reason,
  { title: string; body: string; cta: string; to: string }
> = {
  stuck: {
    title: "Your pattern check-in",
    body: "You said you feel stuck. Here's today's interrupt.",
    cta: "Do my check-in →",
    to: "/patterns/check-in",
  },
  sabotage: {
    title: "Catch the sabotage before it starts",
    body: "Notice any resistance today? Here's what to do with it.",
    cta: "Open my reset →",
    to: "/healing-tools/limiting-belief-rewriter",
  },
  relationships: {
    title: "How would love respond today?",
    body: "One question that changes every interaction.",
    cta: "Reflect →",
    to: "/healing-tools/boundary-builder",
  },
  levelup: {
    title: "Close the gap",
    body: "You know what to do. Here's the tool to actually do it.",
    cta: "Take action →",
    to: "/healing-tools/manifestation-tracker",
  },
};

/**
 * Personalized "For You Today" card based on profiles.onboarding_reason.
 * Shows once per day; tap marks today_recommendation_used_date.
 */
export function RecommendedForYouCard() {
  const { user } = useAuth();
  const [reason, setReason] = useState<Reason | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    supabase
      .from("profiles")
      .select("onboarding_reason, today_recommendation_used_date")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (cancelled || !data) return;
        const r = (data as any).onboarding_reason as string | null;
        if (!r || !(r in RECOMMENDATIONS)) return;
        const usedDate = (data as any).today_recommendation_used_date as
          | string
          | null;
        const today = new Date().toISOString().split("T")[0];
        if (usedDate === today) return;
        setReason(r as Reason);
        setShow(true);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleTap = async () => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];
    await supabase
      .from("profiles")
      .update({ today_recommendation_used_date: today } as any)
      .eq("user_id", user.id);
    setShow(false);
  };

  if (!show || !reason) return null;
  const rec = RECOMMENDATIONS[reason];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="mb-6"
      >
        <Card className="relative overflow-hidden p-5 border-border/40 bg-[#3D1A6E]/15">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#C9A84C]" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold mb-2">
            For You Today
          </p>
          <h3 className="font-serif text-lg font-bold text-foreground mb-1">
            {rec.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {rec.body}
          </p>
          <Link to={rec.to} onClick={handleTap}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl">
              {rec.cta}
            </Button>
          </Link>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
