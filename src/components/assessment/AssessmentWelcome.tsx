import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Thermometer, Heart, DollarSign, Briefcase, Shield, Zap } from "lucide-react";
import { TrialBackButton } from "@/components/TrialBackButton";

interface AssessmentWelcomeProps {
  onStart: () => void;
}

const categories = [
  { icon: Heart, label: "Love & Relationships", color: "text-pink-500" },
  { icon: DollarSign, label: "Money & Abundance", color: "text-accent" },
  { icon: Briefcase, label: "Career & Purpose", color: "text-primary" },
  { icon: Shield, label: "Self-Care & Boundaries", color: "text-emerald-500" },
  { icon: Zap, label: "Action & Manifestation", color: "text-orange-500" },
];

export function AssessmentWelcome({ onStart }: AssessmentWelcomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-16 px-4">
      <div className="max-w-2xl mx-auto mb-4">
        <TrialBackButton fallbackPath="/home" label="Back" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
          >
            <Thermometer className="w-12 h-12 text-primary-foreground" />
          </motion.div>
          
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Worth Thermostat Assessment
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">
            Discover your current "worth temperature" and learn what's keeping you stuck at crumbs instead of celebration.
          </p>
        </div>

        {/* What You'll Discover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-8 mb-8"
        >
          <h2 className="font-display text-2xl font-semibold text-foreground mb-6 text-center">
            What You'll Discover
          </h2>
          
          <div className="space-y-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-4 p-3 rounded-lg bg-background/50"
              >
                <div className={`p-2 rounded-full bg-secondary ${category.color}`}>
                  <category.icon className="w-5 h-5" />
                </div>
                <span className="text-foreground font-medium">{category.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Assessment Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mb-8 space-y-2"
        >
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">25 questions</span> • Takes about <span className="font-semibold text-foreground">3 minutes</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Answer honestly for the most accurate results
          </p>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <Button
            onClick={onStart}
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground px-12 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Begin Assessment
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
