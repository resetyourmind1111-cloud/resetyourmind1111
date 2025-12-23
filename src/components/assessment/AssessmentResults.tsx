import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThermostatType, calculateCategoryScores } from "@/data/thermostatTypes";
import { 
  Thermometer, 
  Heart, 
  DollarSign, 
  Briefcase, 
  Shield, 
  Zap,
  CheckCircle,
  ArrowRight,
  Share2,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface AssessmentResultsProps {
  firstName: string;
  totalScore: number;
  percentage: number;
  thermostatType: ThermostatType;
  answers: Record<number, number>;
}

const categoryIcons: Record<string, React.ElementType> = {
  love: Heart,
  money: DollarSign,
  career: Briefcase,
  boundaries: Shield,
  action: Zap,
};

const categoryLabels: Record<string, string> = {
  love: "Love & Relationships",
  money: "Money & Abundance",
  career: "Career & Purpose",
  boundaries: "Self-Care & Boundaries",
  action: "Action & Manifestation",
};

const categoryColors: Record<string, string> = {
  love: "text-pink-500",
  money: "text-accent",
  career: "text-primary",
  boundaries: "text-emerald-500",
  action: "text-orange-500",
};

export function AssessmentResults({
  firstName,
  totalScore,
  percentage,
  thermostatType,
  answers,
}: AssessmentResultsProps) {
  const categoryScores = calculateCategoryScores(answers);

  const handleShare = () => {
    const text = `I just discovered I'm "${thermostatType.name}" on the Worth Thermostat Assessment! My worth temperature is ${thermostatType.temperature}. Take the free assessment to discover yours!`;
    if (navigator.share) {
      navigator.share({
        title: "My Worth Thermostat Results",
        text,
        url: window.location.origin + "/assessment",
      });
    } else {
      navigator.clipboard.writeText(text + " " + window.location.origin + "/assessment");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Celebration Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className={cn(
              "w-28 h-28 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-br",
              thermostatType.color
            )}
          >
            <span className="text-5xl">{thermostatType.emoji}</span>
          </motion.div>
          
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            {firstName}, You Are...
          </h1>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-display text-3xl md:text-4xl font-bold gradient-text mb-4"
          >
            {thermostatType.name}
          </motion.h2>
          
          <p className="text-xl text-muted-foreground italic max-w-lg mx-auto">
            "{thermostatType.tagline}"
          </p>
        </motion.div>

        {/* Score Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Thermostat Visual */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Thermometer className="w-16 h-16 text-primary" />
                <div 
                  className={cn(
                    "absolute bottom-1 left-1/2 -translate-x-1/2 w-3 rounded-full bg-gradient-to-t",
                    thermostatType.color
                  )}
                  style={{ height: `${Math.max(20, percentage)}%`, maxHeight: '60%' }}
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Temperature Setting</p>
                <p className="text-3xl font-bold text-foreground">{thermostatType.temperature}</p>
              </div>
            </div>

            {/* Score Display */}
            <div className="flex gap-8 text-center">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Total Score</p>
                <p className="text-4xl font-bold text-foreground">{totalScore}<span className="text-xl text-muted-foreground">/125</span></p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Percentage</p>
                <p className="text-4xl font-bold gradient-text">{percentage}%</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-8 mb-8"
        >
          <h3 className="font-display text-2xl font-semibold text-foreground mb-6">
            Category Breakdown
          </h3>
          
          <div className="space-y-4">
            {Object.entries(categoryScores).map(([category, score]) => {
              const Icon = categoryIcons[category];
              const maxScore = 25;
              const percent = (score / maxScore) * 100;
              
              return (
                <div key={category} className="flex items-center gap-4">
                  <div className={cn("p-2 rounded-full bg-secondary", categoryColors[category])}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{categoryLabels[category]}</span>
                      <span className="text-sm text-muted-foreground">{score}/25</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-card p-8 mb-8"
        >
          <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
            What This Means
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            {thermostatType.description}
          </p>
          <p className="text-foreground leading-relaxed">
            {thermostatType.whatThisMeans}
          </p>
        </motion.div>

        {/* What You Need */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass-card p-8 mb-8"
        >
          <h3 className="font-display text-2xl font-semibold text-foreground mb-6">
            What You Need
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {thermostatType.whatYouNeed.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
              >
                <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                <span className="text-foreground">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="glass-card p-8 mb-8 bg-gradient-to-br from-primary/10 to-accent/10"
        >
          <h3 className="font-display text-2xl font-semibold text-foreground mb-6">
            Your Personalized Next Steps
          </h3>
          <div className="space-y-3">
            {thermostatType.nextSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-lg bg-background/50"
              >
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                  {index + 1}
                </span>
                <span className="text-foreground">{step}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/#pricing">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-full"
            >
              Start Your Transformation
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          
          <Button
            variant="outline"
            size="lg"
            onClick={handleShare}
            className="px-8 py-6 text-lg rounded-full"
          >
            <Share2 className="mr-2 w-5 h-5" />
            Share Results
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
