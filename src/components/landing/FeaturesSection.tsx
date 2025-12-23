import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Thermometer, 
  Sparkles, 
  Headphones, 
  BookOpen,
  Heart,
  Target
} from "lucide-react";

const features = [
  {
    icon: Thermometer,
    title: "Worth Thermostat Assessment",
    description: "Discover where your worth is set with our transformative 25-question assessment. Get personalized insights into your patterns across love, money, career, and self-care.",
    color: "primary",
  },
  {
    icon: Sparkles,
    title: "Oracle Card Guidance",
    description: "Access 104 beautifully designed oracle cards across two powerful decks. Permission Granted and Abundance cards offer daily wisdom and deep reflection.",
    color: "accent",
  },
  {
    icon: Headphones,
    title: "Guided Meditations",
    description: "34 transformative meditations for mind, soul, and body. Each session is designed to rewire your worth thermostat and embody celebration.",
    color: "brand-pink",
  },
  {
    icon: BookOpen,
    title: "Interactive Workbook",
    description: "30 pages of deep inner work with exercises, journal prompts, and weekly practices to permanently shift from crumbs to celebration.",
    color: "primary",
  },
  {
    icon: Heart,
    title: "Human Design Integration",
    description: "Personalized recommendations based on your unique Human Design type. Understand your natural gifts and how to honor your worth.",
    color: "accent",
  },
  {
    icon: Target,
    title: "Progress & Streaks",
    description: "Track your transformation journey with points, streaks, and achievements. Celebrate your growth and stay motivated.",
    color: "brand-pink",
  },
];

const colorClasses = {
  primary: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
  accent: "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground",
  "brand-pink": "bg-brand-pink/10 text-brand-pink group-hover:bg-brand-pink group-hover:text-primary-foreground",
};

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group glass-card-hover p-6 md:p-8"
    >
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6 transition-all duration-300 ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-serif text-xl md:text-2xl font-semibold text-foreground mb-3">
        {feature.title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  );
}

export function FeaturesSection() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
      
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
            Your Transformation Toolkit
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Everything You Need to{" "}
            <span className="gradient-text">Recalibrate</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive system designed to help you recognize your worth, 
            set powerful boundaries, and choose celebration over crumbs.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
