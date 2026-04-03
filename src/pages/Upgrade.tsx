import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Star, Sparkles, Check, Lock, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const TIERS = [
  {
    key: "RESET",
    name: "Reset",
    price: 44,
    annualPrice: 33,
    annualTotal: 396,
    tagline: "Your reset begins here.",
    features: [
      "Worth Thermostat™",
      "Module 1: Recognition",
      "Partial Module 2: Release",
      "Basic Tools",
    ],
    icon: Sparkles,
    badge: null,
    monthlyPriceId: "price_1TAUgeC1ibVojXJKMY9OXfeh",
    annualPriceId: "price_1TAUl6C1ibVojXJKGipOvp36",
    style: "border-border/40 bg-card",
  },
  {
    key: "EXPAND",
    name: "Expand",
    price: 88,
    annualPrice: 66,
    annualTotal: 792,
    tagline: "Go deeper. Release more.",
    features: [
      "Everything in Reset",
      "Full Release",
      "The Quiet Phase™",
      "Recalibration",
      "Full Tools Library",
    ],
    icon: Star,
    badge: "MOST POPULAR",
    monthlyPriceId: "price_1TAUqnC1ibVojXJKtXzr7iOc",
    annualPriceId: "price_1TAUs8C1ibVojXJKk9KaIU2z",
    style: "ring-2 ring-primary border-primary bg-card",
  },
  {
    key: "EMBODY",
    name: "Embody",
    price: 111,
    annualPrice: 83.25,
    annualTotal: 999,
    tagline: "The full transformation experience.",
    features: [
      "Everything in Expand",
      "Embodiment",
      "30-Day Experience",
      "Shadow Work",
      "Oracle Cards (all 3 decks)",
      "Priority features",
    ],
    icon: Crown,
    badge: "FULL ACCESS",
    monthlyPriceId: "price_1TAUuwC1ibVojXJKW8fcj8Hc",
    annualPriceId: "price_1TAUwUC1ibVojXJKqMHhdeJE",
    style: "border-secondary bg-secondary/20",
  },
];

const FOUNDING_PRICE_ID = "price_1TAUgeC1ibVojXJKMY9OXfeh"; // founding uses reset price

export default function Upgrade() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { effectiveTier } = useSubscription();
  const [isAnnual, setIsAnnual] = useState(false);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleCheckout = async (priceId: string, tierKey: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setLoadingTier(tierKey);
    try {
      const newTab = window.open("about:blank", "_blank");
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId, tierKey },
      });
      if (error) throw error;
      if (data?.url) {
        if (newTab) {
          newTab.location.href = data.url;
        } else {
          window.location.assign(data.url);
        }
      }
    } catch (err: any) {
      toast.error("Unable to start checkout. Please try again.");
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="pt-16 pb-8 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4"
        >
          Stop settling for crumbs.{" "}
          <span className="text-primary">Choose celebration.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto"
        >
          You don't need more information. You need transformation.
        </motion.p>
      </div>

      {/* Annual toggle */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={`text-sm font-medium ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
        <button
          onClick={() => setIsAnnual(!isAnnual)}
          className={`relative w-14 h-7 rounded-full transition-colors ${isAnnual ? "bg-primary" : "bg-muted"}`}
        >
          <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-background shadow transition-transform ${isAnnual ? "translate-x-7" : "translate-x-0.5"}`} />
        </button>
        <span className={`text-sm font-medium ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
          Annual <span className="text-primary text-xs font-semibold">Save 25%</span>
        </span>
      </div>

      {/* Tier cards */}
      <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-3 gap-6 mb-12">
        {TIERS.map((tier, i) => {
          const Icon = tier.icon;
          const displayPrice = isAnnual ? tier.annualPrice : tier.price;
          const priceId = isAnnual ? tier.annualPriceId : tier.monthlyPriceId;
          const isCurrentTier = effectiveTier === tier.key.toLowerCase();
          const buttonLabels: Record<string, string> = {
            RESET: "Start Reset",
            EXPAND: "Expand Now",
            EMBODY: "Embody Everything",
          };

          return (
            <motion.div
              key={tier.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className={`relative rounded-2xl p-6 md:p-8 border ${tier.style} ${tier.key === "EXPAND" ? "md:scale-105" : ""}`}
            >
              {tier.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  tier.key === "EXPAND"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}>
                  {tier.badge}
                </div>
              )}

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-3">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground">{tier.name}</h3>
                <p className="text-sm text-muted-foreground italic mt-1">{tier.tagline}</p>
              </div>

              <div className="text-center mb-6">
                <span className="font-serif text-4xl font-bold text-foreground">${displayPrice}</span>
                <span className="text-muted-foreground text-sm">/month</span>
                {isAnnual && (
                  <p className="text-xs text-primary mt-1">${tier.annualTotal}/year billed annually</p>
                )}
              </div>

              <ul className="space-y-2.5 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrentTier ? (
                <Button disabled className="w-full rounded-xl font-semibold" variant="outline">
                  Current Plan
                </Button>
              ) : (
                <Button
                  className={`w-full rounded-xl font-semibold ${
                    tier.key === "EXPAND"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : tier.key === "EMBODY"
                      ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      : "bg-card border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  }`}
                  onClick={() => handleCheckout(priceId, tier.key)}
                  disabled={!!loadingTier}
                >
                  {loadingTier === tier.key ? "Loading…" : buttonLabels[tier.key]}
                </Button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Founding 111 Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-5xl mx-auto px-4 mb-10"
      >
        <div className="rounded-2xl bg-primary p-6 md:p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-accent/30 opacity-90" />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Flame className="w-6 h-6 text-primary-foreground" />
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary-foreground">
                Founding 111
              </h3>
              <Flame className="w-6 h-6 text-primary-foreground" />
            </div>
            <p className="text-primary-foreground/90 text-sm md:text-base max-w-2xl mx-auto mb-2 leading-relaxed">
              Lock in <strong>$44/month</strong> — full EMBODY access — locked while you stay active.
            </p>
            <p className="text-primary-foreground/70 text-xs md:text-sm max-w-xl mx-auto mb-5">
              As long as you stay active, your rate never changes. Only 111 spots. Cancel and the rate is gone permanently.
            </p>
            <Button
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold rounded-xl px-8"
              onClick={() => handleCheckout(FOUNDING_PRICE_ID, "FOUNDING")}
              disabled={!!loadingTier}
            >
              {loadingTier === "FOUNDING" ? "Loading…" : "Claim Your Founding Spot"}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Annual savings + trust */}
      <div className="text-center pb-16 px-4">
        <p className="text-xs text-muted-foreground mb-2">
          Save 25% with annual billing · RESET $396/yr · EXPAND $792/yr · EMBODY $999/yr
        </p>
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5" /> Powered by Stripe. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
