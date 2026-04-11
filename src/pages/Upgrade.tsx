import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown, Star, Sparkles, Check, Lock, Flame, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useFoundingMode } from "@/hooks/useFoundingMode";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const TIERS = [
  {
    key: "RESET",
    name: "Reset",
    price: 44,
    annualPrice: 33,
    annualTotal: 397,
    tagline: "Start here. Identify your patterns. Reset your foundation.",
    forText: "People who are ready to begin and want a clear starting point.",
    features: [
      "Worth Thermostat + monthly tracking",
      "All 5 Identity Trap modules",
      "10 Mind Library meditations",
      "125 Permission Slips",
      "Human Design analysis",
      "Onboarding + personalized reset plan",
      "Daily micro-journal",
      "Monthly Reset Ceremony",
      "Cumulative progress tracking",
    ],
    icon: Sparkles,
    badge: null,
    monthlyPriceId: "price_1TAUgeC1ibVojXJKMY9OXfeh",
    annualPriceId: "price_1TAUl6C1ibVojXJKGipOvp36",
    style: "border-border/40 bg-card",
    cta: "Start My Reset",
  },
  {
    key: "EXPAND",
    name: "Expand",
    price: 88,
    annualPrice: 66,
    annualTotal: 797,
    tagline: "Go deeper. Work on every layer — body, money, love, identity.",
    forText: "People who've started their reset and are ready for the full toolkit.",
    features: [
      "Everything in Reset",
      "Soul + Body Library (24 more meditations)",
      "All 3 Oracle Card Decks + 10 Spreads",
      "All 21 Healing Tools",
      "Emotional Surgery™ Lessons — all 4 tracks",
      "Identity Trap AI Support",
      "Wellness Hub, Hormone Health, Mental Health",
      "Shadow Work, Inner Child, Money Story tools",
    ],
    icon: Star,
    badge: "MOST POPULAR",
    monthlyPriceId: "price_1TAUqnC1ibVojXJKtXzr7iOc",
    annualPriceId: "price_1TAUs8C1ibVojXJKk9KaIU2z",
    style: "ring-2 ring-accent border-accent bg-card",
    cta: "Expand My Reset",
  },
  {
    key: "EMBODY",
    name: "Embody",
    price: 111,
    annualPrice: 83,
    annualTotal: 999,
    tagline: "Live it fully. Community, live sessions, the complete system.",
    forText: "People who are committed to making this a way of life.",
    features: [
      "Everything in Expand",
      "30-Day Recalibration Experience + Workbook",
      "Sacred Circle Community",
      "Accountability Buddy System",
      "Live Monthly Sessions with Lorie",
      "Daily Ritual Builder",
      "Reset Score Dashboard",
      "All future features",
    ],
    icon: Crown,
    badge: "FULL ACCESS",
    monthlyPriceId: "price_1TAUuwC1ibVojXJKW8fcj8Hc",
    annualPriceId: "price_1TAUwUC1ibVojXJKqMHhdeJE",
    style: "border-secondary bg-secondary/20",
    cta: "Embody My Reset",
  },
];

const FOUNDING_PRICE_ID = "price_1TAUgeC1ibVojXJKMY9OXfeh";
const FOUNDING_FEATURES = [
  "Full 30-Day Reset Experience",
  "All 5 Identity Trap Modules + AI Support",
  "Complete Emotional Surgery™ Sessions",
  "All 34 Guided Meditations",
  "125 Permission Slips",
  "3 Oracle Card Decks + 10 Spreads",
  "All 21 Healing Tools",
  "Sacred Circle Community",
  "Monthly Reset Ceremony",
  "Live Sessions with Lorie",
  "Everything. All future features.",
];

export default function Upgrade() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { effectiveTier } = useSubscription();
  const { foundingMode, spotsRemaining } = useFoundingMode();
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
        if (newTab) newTab.location.href = data.url;
        else window.location.assign(data.url);
      }
    } catch {
      toast.error("Unable to start checkout. Please try again.");
    } finally {
      setLoadingTier(null);
    }
  };

  // ─── FOUNDING MODE ───
  if (foundingMode) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-16 pb-8 px-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-semibold mb-3">FOUNDING MEMBER ACCESS</p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
            Get in before this closes.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            The first 111 members lock in $44/month for full access — for life, as long as they stay active. When founding closes, this price is gone forever.
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-accent font-serif text-2xl font-bold mt-6">
            {spotsRemaining} spots remaining
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto px-4 grid md:grid-cols-2 gap-6 mb-12">
          {/* Founding Member Card */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative rounded-2xl p-6 md:p-8 border-2 border-accent bg-secondary/20">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent text-accent-foreground">
              ⭐ LIMITED — {spotsRemaining} SPOTS REMAINING
            </div>
            <div className="text-center mb-6 mt-2">
              <h3 className="font-serif text-2xl font-bold text-foreground">Founding Member</h3>
              <div className="mt-2">
                <span className="font-serif text-4xl font-bold text-foreground">$44</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Locked in for life while you stay active</p>
            </div>
            <ul className="space-y-2 mb-6">
              {FOUNDING_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="text-accent mt-0.5">—</span> {f}
                </li>
              ))}
            </ul>
            <p className="text-[10px] text-muted-foreground mb-4">If you cancel, your founding rate cannot be reinstated under any circumstances.</p>
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold rounded-xl" onClick={() => handleCheckout(FOUNDING_PRICE_ID, "FOUNDING")} disabled={!!loadingTier}>
              {loadingTier === "FOUNDING" ? "Loading…" : "Lock In My Founding Rate"}
            </Button>
            <p className="text-[10px] text-muted-foreground text-center mt-2">111 spots total. {spotsRemaining} remaining.</p>
          </motion.div>

          {/* Lifetime Card */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl p-6 md:p-8 border border-border/40 bg-card">
            <div className="text-center mb-6">
              <h3 className="font-serif text-2xl font-bold text-foreground">Lifetime Access</h3>
              <div className="mt-2">
                <span className="font-serif text-4xl font-bold text-foreground">$1,111</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">One-time. Never pay again. Full access forever.</p>
            </div>
            <p className="text-sm text-foreground/70 mb-6 leading-relaxed">
              Everything in Founding Member — paid once, yours for life. No monthly commitment. No renewals. Ever.
            </p>
            <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent/10 font-semibold rounded-xl" onClick={() => handleCheckout(FOUNDING_PRICE_ID, "LIFETIME")} disabled={!!loadingTier}>
              {loadingTier === "LIFETIME" ? "Loading…" : "Get Lifetime Access"}
            </Button>
          </motion.div>
        </div>

        <div className="text-center pb-16 px-4">
          <p className="text-xs text-muted-foreground">After founding closes, monthly access starts at $44. Lock in your rate now.</p>
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 mt-2">
            <Lock className="w-3.5 h-3.5" /> Powered by Stripe. Cancel anytime.
          </p>
        </div>
      </div>
    );
  }

  // ─── REGULAR MODE ───
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 pb-8 px-4 text-center">
        <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-semibold mb-3">CHOOSE YOUR RESET</p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
          Start where you are.{" "}<span className="text-accent">Grow from there.</span>
        </motion.h1>
      </div>

      {/* Annual toggle */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={`text-sm font-medium ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
        <button onClick={() => setIsAnnual(!isAnnual)} className={`relative w-14 h-7 rounded-full transition-colors ${isAnnual ? "bg-accent" : "bg-muted"}`}>
          <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-background shadow transition-transform ${isAnnual ? "translate-x-7" : "translate-x-0.5"}`} />
        </button>
        <span className={`text-sm font-medium ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
          Annual <span className="text-accent text-xs font-semibold">Save 25%</span>
        </span>
      </div>

      {/* Tier cards */}
      <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-3 gap-6 mb-12">
        {TIERS.map((tier, i) => {
          const Icon = tier.icon;
          const displayPrice = isAnnual ? tier.annualPrice : tier.price;
          const priceId = isAnnual ? tier.annualPriceId : tier.monthlyPriceId;
          const isCurrentTier = effectiveTier === tier.key.toLowerCase();

          return (
            <motion.div key={tier.key} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
              className={`relative rounded-2xl p-6 md:p-8 border ${tier.style} ${tier.key === "EXPAND" ? "md:scale-105" : ""}`}>
              {tier.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  tier.key === "EXPAND" ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"
                }`}>{tier.badge}</div>
              )}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-3">
                  <Icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground">{tier.name}</h3>
                <p className="text-sm text-muted-foreground italic mt-1">{tier.tagline}</p>
              </div>
              <div className="text-center mb-6">
                <span className="font-serif text-4xl font-bold text-foreground">${displayPrice}</span>
                <span className="text-muted-foreground text-sm">/month</span>
                {isAnnual && <p className="text-xs text-accent mt-1">${tier.annualTotal}/year billed annually</p>}
              </div>
              <ul className="space-y-2.5 mb-8">
                {tier.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              {isCurrentTier ? (
                <Button disabled className="w-full rounded-xl font-semibold" variant="outline">Current Plan</Button>
              ) : (
                <Button className={`w-full rounded-xl font-semibold ${
                  tier.key === "EXPAND" ? "bg-accent text-accent-foreground hover:bg-accent/90" :
                  tier.key === "EMBODY" ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" :
                  "bg-card border border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                }`} onClick={() => handleCheckout(priceId, tier.key)} disabled={!!loadingTier}>
                  {loadingTier === tier.key ? "Loading…" : `${tier.cta} — $${displayPrice}/month`}
                </Button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Lifetime text link */}
      <div className="text-center pb-16 px-4">
        <p className="text-sm text-muted-foreground mb-2">Want lifetime access? <strong>$1,111</strong> — one-time, everything, forever.</p>
        <button onClick={() => handleCheckout(FOUNDING_PRICE_ID, "LIFETIME")} className="text-accent text-sm underline hover:text-accent/80">Get Lifetime Access →</button>
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 mt-4">
          <Lock className="w-3.5 h-3.5" /> Powered by Stripe. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
