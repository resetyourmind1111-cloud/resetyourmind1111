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
    subtitle: "Premium Experience",
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
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const Icon = tier.icon;

  const displayPrice = isAnnual ? tier.annualMonthlyPrice : tier.monthlyPrice;
  const priceId = isAnnual ? tier.annualPriceId : tier.monthlyPriceId;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
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
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isSoldOut = spotsRemaining <= 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="relative glass-card p-6 md:p-8 border-2 border-primary/50 max-w-lg mx-auto mt-12"
      style={{ boxShadow: "0 0 30px hsl(43 52% 54% / 0.15)" }}
    >
      <motion.div
        className="absolute inset-0 rounded-[inherit] border-2 border-primary/30"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-primary/10 text-primary">
          <Flame className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-primary mb-1">
          Founding 111 — Full Access
        </h3>
        <div className="flex items-baseline justify-center gap-1 mb-2">
          <span className="text-4xl md:text-5xl font-bold text-foreground">$44</span>
          <span className="text-muted-foreground">/month</span>
        </div>
        <p className="text-sm text-primary mb-1">Locked in for life</p>
        <p className="text-sm text-muted-foreground mb-4">
          Full Embody access at the Reset price. Only 111 spots. Never offered again.
        </p>

        <div className="mb-6 py-3 px-4 rounded-lg bg-primary/10 border border-primary/20">
          {isSoldOut ? (
            <p className="text-primary font-semibold">Founding 111 — SOLD OUT</p>
          ) : (
            <p className="text-primary font-semibold">
              Only <span className="text-2xl">{spotsRemaining}</span> of 111 founding spots remaining
            </p>
          )}
        </div>

        <ul className="space-y-3 mb-8 text-left">
          {["Everything in Embody tier", "$44/month locked in forever", "Full access to all current and future features", "Founding member badge and priority support"].map((f) => (
            <li key={f} className="flex items-start gap-3">
              <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
              <span className="text-foreground text-sm">{f}</span>
            </li>
          ))}
        </ul>

        <Button
          className="w-full"
          variant="hero"
          size="lg"
          disabled={isSoldOut}
          onClick={() => onCheckout("price_1TAUzKC1ibVojXJKoehSnlnq", "FOUNDING")}
        >
          {isSoldOut ? "Sold Out" : "Claim Your Founding Spot"}
        </Button>
      </div>
    </motion.div>
  );
}

export function PricingSection() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });
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

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId, tierKey },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
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
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
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
          <p className="text-lg text-muted-foreground mb-2">
            Discover your Worth Thermostat and recalibrate your life across the four areas that matter most:
          </p>
          <p className="font-serif text-xl text-primary mb-4">
            Health. Wealth. Love. Leadership.
          </p>
          <p className="text-lg text-muted-foreground mb-2">
            Transform the patterns that keep you settling for less and step into the life you were meant to live.
          </p>
          <p className="font-serif text-primary italic">Permission granted.</p>
        </motion.div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
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
            <span className="ml-1 text-xs text-primary">(Save up to 25%)</span>
          </span>
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
