import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Star, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Reset",
    subtitle: "Mind",
    price: 44,
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
    color: "primary",
  },
  {
    name: "Expand",
    subtitle: "Mind, Soul & Body",
    price: 88,
    description: "Full access to all tools for deep, lasting transformation across every dimension.",
    features: [
      "Everything in Reset",
      "Abundance Oracle Deck (52 cards)",
      "Relationships Oracle Deck (52 cards)",
      "All 10 Oracle Spreads",
      "Soul Library (12 meditations) and Body Library (12 meditations)",
      "All 18 Healing Tools",
      "Emotional Surgery Lessons (4 tracks)",
      "Body Type Analyzer and Wellness Hub",
      "Hormone Health Module",
      "Mental Health Awareness Module",
    ],
    icon: Star,
    popular: true,
    color: "accent",
  },
  {
    name: "Embody",
    subtitle: "Premium Experience",
    price: 111,
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
    color: "brand-pink",
  },
];

function PricingCard({ tier, index }: { tier: typeof tiers[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const Icon = tier.icon;

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
          <span className="text-4xl md:text-5xl font-bold text-foreground">${tier.price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
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
      >
        Get Started
      </Button>
    </motion.div>
  );
}

export function PricingSection() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

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
          <p className="text-lg text-muted-foreground">
            Every tier is designed to meet you where you are and guide you to where you deserve to be.
          </p>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <PricingCard key={tier.name} tier={tier} index={index} />
          ))}
        </div>

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
            Try risk-free.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
