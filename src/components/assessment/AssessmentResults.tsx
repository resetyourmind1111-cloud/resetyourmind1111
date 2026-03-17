import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  RefreshCw,
  Sparkles,
  Star,
  Mail,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useRef, useCallback, useState } from "react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const emailSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  email: z.string().trim().email("Please enter a valid email address").max(100),
});

interface AssessmentResultsProps {
  firstName: string;
  totalScore: number;
  percentage: number;
  thermostatType: ThermostatType;
  answers: Record<number, number>;
  onRetake?: () => void;
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

export function AssessmentResults({
  firstName,
  totalScore,
  percentage,
  thermostatType,
  answers,
  onRetake,
}: AssessmentResultsProps) {
  const categoryScores = calculateCategoryScores(answers);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const handleShareImage = useCallback(async () => {
    if (!shareCardRef.current) return;
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: "#0a0a0a",
        scale: 2,
      });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], "worth-thermostat-results.png", { type: "image/png" });
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: "My Worth Thermostat Results" });
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "worth-thermostat-results.png";
          a.click();
          URL.revokeObjectURL(url);
          toast.success("Results image downloaded!");
        }
      });
    } catch {
      toast.error("Could not generate share image");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Title */}
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
            className="font-display text-3xl md:text-4xl font-bold text-accent mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {thermostatType.name}
          </motion.h2>

          <p className="text-lg text-muted-foreground">
            Thermostat Temperature: <span className="text-foreground font-semibold">{thermostatType.temperature}</span> — <span className="text-accent italic">{thermostatType.temperatureLabel}</span>
          </p>
        </motion.div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-8 mb-8 text-center"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" strokeWidth="8" className="stroke-secondary" />
                <motion.circle
                  cx="60" cy="60" r="52" fill="none" strokeWidth="8"
                  strokeLinecap="round"
                  className="stroke-accent"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - percentage / 100) }}
                  transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-accent">{percentage}%</span>
              </div>
            </div>
            <p className="text-muted-foreground">Score: <span className="text-foreground font-semibold">{totalScore}</span> / 125</p>
          </div>
        </motion.div>

        {/* 5 Category Sub-Score Bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-8 mb-8"
        >
          <h3 className="font-display text-2xl font-semibold text-foreground mb-6">
            Category Breakdown
          </h3>
          <div className="space-y-5">
            {Object.entries(categoryScores).map(([category, score], i) => {
              const Icon = categoryIcons[category];
              const maxScore = 25;
              const percent = (score / maxScore) * 100;
              return (
                <div key={category}>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5 text-accent shrink-0" />
                    <span className="text-sm font-medium text-foreground flex-1">{categoryLabels[category]}</span>
                    <span className="text-sm font-semibold text-accent">{score}/25</span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ delay: 0.9 + i * 0.1, duration: 0.6 }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    />
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
          <p className="text-foreground/90 leading-relaxed text-lg">
            {thermostatType.description}
          </p>
        </motion.div>

        {/* What This Means */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass-card p-8 mb-8"
        >
          <h3 className="font-display text-2xl font-semibold text-foreground mb-5 flex items-center gap-2">
            <Star className="w-6 h-6 text-accent" />
            What This Means
          </h3>
          <ul className="space-y-3">
            {thermostatType.whatThisMeans.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.08 }}
                className="flex items-start gap-3 text-foreground/80"
              >
                <span className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* The Good News */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="glass-card p-8 mb-8 border-l-4 border-accent"
        >
          <h3 className="font-display text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" />
            The Good News
          </h3>
          <p className="text-foreground/90 leading-relaxed text-lg italic">
            {thermostatType.goodNews}
          </p>
        </motion.div>

        {/* What You Need */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="glass-card p-8 mb-8"
        >
          <h3 className="font-display text-2xl font-semibold text-foreground mb-5">
            What You Need
          </h3>
          <ul className="space-y-3">
            {thermostatType.whatYouNeed.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.08 }}
                className="flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground/80">{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Your Next Steps in the App */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="glass-card p-8 mb-8 bg-gradient-to-br from-primary/10 to-accent/10"
        >
          <h3 className="font-display text-2xl font-semibold text-foreground mb-6">
            Your Next Steps in the App
          </h3>
          <div className="space-y-3">
            {thermostatType.nextSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 + index * 0.1 }}
              >
                <Link
                  to={step.link}
                  className="flex items-start gap-3 p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors group"
                >
                  <span className="w-7 h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-foreground flex-1">{step.text}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0 mt-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Share Card (hidden, used for image generation) */}
        <div className="absolute -left-[9999px]">
          <div
            ref={shareCardRef}
            className="w-[600px] p-10 text-white"
            style={{ background: "linear-gradient(135deg, #0a0a0a, #1a1a2e)" }}
          >
            <div className="text-center mb-6">
              <p className="text-sm tracking-widest uppercase opacity-60 mb-2">Worth Thermostat Assessment</p>
              <p className="text-4xl font-bold mb-1" style={{ color: "#D4AF37" }}>{thermostatType.name}</p>
              <p className="text-lg opacity-70">{thermostatType.temperature} — {thermostatType.temperatureLabel}</p>
            </div>
            <div className="text-center mb-6">
              <p className="text-6xl font-bold" style={{ color: "#D4AF37" }}>{percentage}%</p>
              <p className="opacity-60">{totalScore} / 125</p>
            </div>
            <div className="space-y-2">
              {Object.entries(categoryScores).map(([category, score]) => (
                <div key={category} className="flex items-center gap-3">
                  <span className="text-sm w-40 opacity-70">{categoryLabels[category]}</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(score / 25) * 100}%`, background: "#D4AF37" }} />
                  </div>
                  <span className="text-sm opacity-70">{score}/25</span>
                </div>
              ))}
            </div>
            <p className="text-center mt-6 text-sm opacity-40">resetyourmind1111.com</p>
          </div>
        </div>

        {/* Upgrade Section for Public Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35 }}
          className="glass-card p-8 mb-8 border border-primary/30"
        >
          <h3
            className="font-serif text-2xl font-bold text-primary mb-4 text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Here's How to Raise Your Worth Thermostat
          </h3>
          <p className="text-foreground/80 text-center mb-6">
            Your Reset Your Mind 1111™ membership gives you the exact tools to recalibrate your thermostat across health, wealth, love, and leadership — starting today.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {[
              "Worth Thermostat tracking",
              "Emotional Surgery™ Lessons",
              "21 Healing Tools",
              "Permission Slips (125)",
              "3 Oracle Card Decks",
              "Guided Meditations",
              "Wellness Hub",
              "Hormone Health",
              "Sacred Circle Community",
              "30-Day Experience",
              "Daily Ritual Builder",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-foreground/70">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/auth?redirect=checkout&priceId=price_1TAUgeC1ibVojXJKMY9OXfeh&tier=RESET">
              <Button variant="hero" size="lg" className="w-full">
                Start Your Reset — $44/month
              </Button>
            </Link>
            <Link to="/#pricing">
              <Button variant="hero-outline" size="lg" className="w-full">
                See All Plans
              </Button>
            </Link>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Cancel anytime. No contracts.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="flex flex-col items-center gap-4 mb-6"
        >
          <Button
            size="lg"
            onClick={handleShareImage}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-full w-full sm:w-auto"
          >
            <Share2 className="mr-2 w-5 h-5" />
            Share Results as Image
          </Button>

          {onRetake && (
            <button
              onClick={onRetake}
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Retake Assessment
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
