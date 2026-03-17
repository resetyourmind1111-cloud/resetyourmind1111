import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Check, Star, Crown, Sparkles, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const tiers = [
  {
    name: "Reset",
    subtitle: "Mind",
    monthlyPrice: 44,
    annualMonthlyPrice: 33,
    annualTotal: 396,
    annualSavings: 132,
    description: "Begin your journey with essential tools for mental clarity and worth recognition.",
    features: [
      "Worth Thermostat Assessment (25 questions, 5 outcomes)",
      "Permission Granted Oracle Deck (52 cards)",
      "Mind Library (10 guided meditations)",
      "125 Permission Slips",
      "Human Design Analysis",
      "Daily Mood Check-In and Healing Streak",
      "Angel Number Journal",
      "Manifesto",
    ],
    icon: Sparkles,
    popular: false,
    color: "primary" as const,
    monthlyPriceId: "price_1TAUgeC1ibVojXJKMY9OXfeh",
    annualPriceId: "price_1TAUl6C1ibVojXJKGipOvp36",
    tierKey: "RESET",
  },
  {
    name: "Expand",
    subtitle: "Mind, Soul & Body",
    monthlyPrice: 88,
    annualMonthlyPrice: 66,
    annualTotal: 792,
    annualSavings: 264,
    description: "Full access to all tools for deep, lasting transformation across every dimension.",
    features: [
      "Everything in Reset",
      "Abundance Oracle Deck (52 cards)",
      "Relationships Oracle Deck (52 cards)",
      "All 10 Oracle Spreads",
      "Soul Library (12 meditations) and Body Library (12 meditations)",
      "All 21 Healing Tools",
      "Emotional Surgery Lessons (4 tracks)",
      "Body Type Analyzer and Wellness Hub",
      "Hormone Health Module",
      "Mental Health Awareness Module",
    ],
    icon: Star,
    popular: true,
    color: "accent" as const,
    monthlyPriceId: "price_1TAUqnC1ibVojXJKtXzr7iOc",
    annualPriceId: "price_1TAUs8C1ibVojXJKk9KaIU2z",
    tierKey: "EXPAND",
  },
  {
    name: "Embody",
    subtitle: "The Complete Reset",
    monthlyPrice: 111,
    annualMonthlyPrice: 83.25,
    annualTotal: 999,
    annualSavings: 333,
    description: "The ultimate transformation experience with exclusive access and all future features.",
    features: [
      "Everything in Expand",
      "30-Day Experience and Digital Workbook",
      "Sacred Circle Community",
      "Reset Score Dashboard",
      "Daily Ritual Builder",
      "Milestone Shareable Cards",
      "Referral Program",
      "Coaching Upsell Booking",
      "All future features",
    ],
    icon: Crown,
    popular: false,
    color: "brand-pink" as const,
    monthlyPriceId: "price_1TAUuwC1ibVojXJKW8fcj8Hc",
    annualPriceId: "price_1TAUwUC1ibVojXJKqMHhdeJE",
    tierKey: "EMBODY",
  },
];

function PricingCard({ tier, index, isAnnual, onCheckout }: { tier: typeof tiers[0]; index: number; isAnnual: boolean; onCheckout: (priceId: string, tierKey: string) => void }) {
  const ref = useRef(null);
  const Icon = tier.icon;

  const displayPrice = isAnnual ? tier.annualMonthlyPrice : tier.monthlyPrice;
  const priceId = isAnnual ? tier.annualPriceId : tier.monthlyPriceId;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={`relative glass-card p-6 md:p-8 ${
        tier.popular 
          ? "ring-2 ring-accent shadow-xl scale-[1.02]" 
          : ""
      }`}
    >
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-accent text-accent-foreground text-sm font-semibold rounded-full shadow-lg">
          Most Popular
        </div>
      )}

      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
          tier.color === "primary" ? "bg-primary/10 text-primary" :
          tier.color === "accent" ? "bg-accent/10 text-accent" :
          "bg-brand-pink/10 text-brand-pink"
        }`}>
          <Icon className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-foreground mb-1">
          {tier.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">{tier.subtitle}</p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl md:text-5xl font-bold text-foreground">${displayPrice}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
        {isAnnual && (
          <p className="text-sm text-primary mt-2">
            Billed as ${tier.annualTotal}/year — Save ${tier.annualSavings}/year
          </p>
        )}
      </div>

      <p className="text-center text-muted-foreground mb-8 min-h-[48px]">
        {tier.description}
      </p>

      <ul className="space-y-3 mb-8">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
              tier.color === "primary" ? "text-primary" :
              tier.color === "accent" ? "text-accent" :
              "text-brand-pink"
            }`} />
            <span className="text-foreground text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <Button 
        className="w-full" 
        variant={tier.popular ? "gold" : "outline"}
        size="lg"
        onClick={() => onCheckout(priceId, tier.tierKey)}
      >
        Start with {tier.name}
      </Button>
    </motion.div>
  );
}

function FoundingCard({ spotsRemaining, onCheckout }: { spotsRemaining: number; onCheckout: (priceId: string, tierKey: string) => void }) {
  const ref = useRef(null);
  const isSoldOut = spotsRemaining <= 0;
  const spotsUsed = 111 - spotsRemaining;
  const percentUsed = Math.round((spotsUsed / 111) * 100);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="relative max-w-2xl mx-auto mt-16"
    >
      {/* Section label */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-primary/40" />
        <span className="text-xs font-semibold text-primary uppercase tracking-widest">Limited Offer</span>
        <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-primary/40" />
      </div>

      {/* Card with animated gold border */}
      <div className="relative rounded-2xl p-[2px] overflow-hidden">
        {/* Animated gold pulse border */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, hsl(43 52% 54% / 0.6), hsl(43 52% 70% / 0.3), hsl(43 52% 54% / 0.6))",
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Outer glow */}
        <motion.div
          className="absolute -inset-1 rounded-2xl blur-md"
          style={{ background: "hsl(43 52% 54% / 0.12)" }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative rounded-2xl bg-card p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            {/* Left: Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
                <Flame className="w-3.5 h-3.5" />
                Never offered again
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
                Founding <span className="text-primary">111</span>
              </h3>
              <p className="text-muted-foreground text-sm mb-5 max-w-sm">
                Full Embody-tier access — every tool, every future feature — locked in at the Reset price. Forever.
              </p>

              <div className="flex items-baseline justify-center md:justify-start gap-1 mb-1">
                <span className="text-4xl md:text-5xl font-bold text-foreground">$44</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-xs text-primary font-medium mb-6">
                Instead of $111/mo — locked in for life
              </p>

              <ul className="space-y-2.5 mb-6 text-left">
                {[
                  "Everything in the Embody tier",
                  "$44/month locked in forever",
                  "All current + future features included",
                  "Founding member badge on your profile",
                  "Listed on the Founding Wall",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                    <span className="text-foreground text-sm">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full md:w-auto min-w-[220px]"
                variant="hero"
                size="lg"
                disabled={isSoldOut}
                onClick={() => onCheckout("price_1TAUzKC1ibVojXJKoehSnlnq", "FOUNDING")}
              >
                {isSoldOut ? "Sold Out" : "Claim Your Founding Spot"}
              </Button>
            </div>

            {/* Right: Live counter */}
            <div className="flex-shrink-0 w-full md:w-52">
              <div className="rounded-xl bg-muted/50 border border-border p-5 text-center">
                {isSoldOut ? (
                  <p className="font-serif text-lg font-bold text-primary">SOLD OUT</p>
                ) : (
                  <>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Spots remaining</p>
                    <motion.p
                      key={spotsRemaining}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="font-serif text-5xl font-bold text-primary mb-1"
                    >
                      {spotsRemaining}
                    </motion.p>
                    <p className="text-xs text-muted-foreground mb-4">of 111</p>

                    {/* Progress bar */}
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, hsl(43 52% 54%), hsl(43 52% 65%))" }}
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${percentUsed}%` } : {}}
                        transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{percentUsed}% claimed</p>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3 italic">
                Cancel anytime — but the rate is gone forever
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function PricingSection() {
  const headerRef = useRef(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [spotsRemaining, setSpotsRemaining] = useState(111);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from("founding_member_spots")
      .select("spots_remaining")
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setSpotsRemaining(data.spots_remaining);
      });
  }, []);

  const handleCheckout = async (priceId: string, tierKey: string) => {
    if (!user) {
      // Redirect to auth with the intended plan info
      navigate(`/auth?redirect=checkout&priceId=${priceId}&tier=${tierKey}`);
      return;
    }

    const checkoutWindow = window.open("about:blank", "_blank");

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId, tierKey },
      });

      if (error) throw error;
      if (!data?.url) throw new Error("No checkout URL returned.");

      if (checkoutWindow) {
        checkoutWindow.location.replace(data.url);
        checkoutWindow.focus();
      } else {
        // Popup blocked: fallback to same-tab redirect
        window.location.assign(data.url);
      }
    } catch (err: any) {
      if (checkoutWindow && !checkoutWindow.closed) {
        checkoutWindow.close();
      }
      toast.error(err.message || "Failed to start checkout. Please try again.");
    }
  };

  return (
    <section className="section-padding relative overflow-hidden" id="pricing">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container relative mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Investment in Yourself
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Choose Your{" "}
            <span className="gradient-text-gold">Transformation</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-4">
            Every tier includes the Worth Thermostat Assessment, Permission Slips, and Human Design Analysis.
            Pick the depth that matches where you are right now.
          </p>
          <p className="font-serif text-primary italic">Permission granted.</p>
        </motion.div>

        {/* Billing Toggle */}
        <div className="flex flex-col items-center gap-3 mb-12">
          <div className="flex items-center gap-4">
            <span className={`text-sm font-medium transition-colors ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                isAnnual ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-foreground transition-transform duration-300 ${
                  isAnnual ? "translate-x-7" : "translate-x-0.5"
                }`}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
              Annual
            </span>
          </div>
          <motion.div
            initial={false}
            animate={{ opacity: isAnnual ? 1 : 0, y: isAnnual ? 0 : -4 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-primary text-xs font-semibold"
          >
            <Sparkles className="w-3 h-3" />
            Save up to 25% — that's up to $333/year
          </motion.div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <PricingCard key={tier.name} tier={tier} index={index} isAnnual={isAnnual} onCheckout={handleCheckout} />
          ))}
        </div>

        {/* Founding 111 */}
        <FoundingCard spotsRemaining={spotsRemaining} onCheckout={handleCheckout} />

        {/* Guarantee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground">
            💜 <span className="font-medium text-foreground">7-day money-back guarantee</span> on all plans. 
            Cancel anytime. No contracts.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
