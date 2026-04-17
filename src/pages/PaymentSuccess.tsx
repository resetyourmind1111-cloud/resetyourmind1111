import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscription, effectiveTier } = useSubscription();
  const [searchParams] = useSearchParams();
  const [polledTier, setPolledTier] = useState<string | null>(null);

  // Poll for active subscription up to 10 times (Stripe webhook may lag)
  useEffect(() => {
    if (!user) return;
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      const { data } = await supabase
        .from("subscriptions")
        .select("tier, status, founding_member")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data && (data.status === "active" || data.status === "past_due")) {
        setPolledTier(data.founding_member ? "founder" : data.tier.toLowerCase());
        clearInterval(interval);
      }
      if (attempts >= 10) clearInterval(interval);
    }, 3000);
    return () => clearInterval(interval);
  }, [user]);

  // Confetti
  useEffect(() => {
    const colors = ["#C9A84C", "#3D1A6E", "#F9F6F0"];
    const end = Date.now() + 3000;
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  const tier = polledTier || (subscription?.founding_member ? "founder" : effectiveTier);
  const isFounder = tier === "founder" || subscription?.founding_member;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-16 text-center relative overflow-hidden">
      {/* Animated 1111 pulse */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 0.7, 0.4, 0.7], scale: [0.6, 1.1, 1, 1.05] }}
        transition={{ duration: 2.4, repeat: Infinity, repeatType: "reverse" }}
        className="absolute font-serif text-[20rem] md:text-[28rem] font-bold text-accent/5 select-none pointer-events-none"
        aria-hidden
      >
        1111
      </motion.div>

      <div className="relative z-10 max-w-xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-serif text-4xl md:text-6xl font-bold text-accent mb-6 leading-tight"
        >
          You just chose yourself.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-foreground text-lg md:text-xl leading-relaxed mb-2"
        >
          Your full reset begins now.
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="text-foreground/80 text-base md:text-lg mb-8"
        >
          Everything is unlocked.
        </motion.p>

        {isFounder && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mx-auto max-w-md mb-10 p-5 rounded-2xl border border-accent/40 bg-accent/5"
          >
            <p className="text-accent font-serif text-lg font-semibold mb-1">You are one of 111.</p>
            <p className="text-foreground/80 text-sm leading-relaxed">
              Your rate is locked while you stay active.<br />
              Welcome to the founding circle.
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Button
            size="lg"
            className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/90 font-semibold rounded-xl px-8 py-6 text-base"
            onClick={() => navigate("/home")}
          >
            Start My Full Reset →
          </Button>

          {user?.email && (
            <p className="text-xs text-muted-foreground mt-6">
              A confirmation has been sent to {user.email}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
