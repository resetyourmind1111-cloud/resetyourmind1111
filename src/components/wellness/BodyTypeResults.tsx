import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BodyTypeProfile } from "@/data/bodyTypeData";
import { ArrowRight, RotateCcw, Utensils, Dumbbell, ShoppingBag } from "lucide-react";

interface BodyTypeResultsProps {
  profile: BodyTypeProfile;
  onRetake: () => void;
  onNavigateTab: (tab: string) => void;
}

export function BodyTypeResults({ profile, onRetake, onNavigateTab }: BodyTypeResultsProps) {
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="text-6xl mb-4 block">{profile.emoji}</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-2">
            You are <span className="text-primary">{profile.name}</span>
          </h1>
          <p className="text-lg text-muted-foreground italic">{profile.tagline}</p>
        </motion.div>

        <div className="space-y-6">
          {/* Core Traits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <h3 className="font-serif text-xl font-semibold text-primary mb-3">Core Traits</h3>
            <p className="text-foreground/90 leading-relaxed">{profile.coreTraits}</p>
          </motion.div>

          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <h3 className="font-serif text-xl font-semibold text-primary mb-3">Your Strengths</h3>
            <p className="text-foreground/90 leading-relaxed">{profile.strengths}</p>
          </motion.div>

          {/* Challenges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <h3 className="font-serif text-xl font-semibold text-primary mb-3">Your Challenges</h3>
            <p className="text-foreground/90 leading-relaxed">{profile.challenges}</p>
          </motion.div>

          {/* Physical Tendencies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <h3 className="font-serif text-xl font-semibold text-primary mb-3">Physical Tendencies</h3>
            <p className="text-foreground/90 leading-relaxed">{profile.physicalTendencies}</p>
            <p className="text-muted-foreground mt-2 text-sm">
              <strong>Tension areas:</strong> {profile.tensionAreas}
            </p>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-6"
          >
            <h3 className="font-serif text-xl font-semibold text-primary mb-4">Your Personalized Plans</h3>
            <div className="grid gap-3">
              <Button
                variant="outline"
                className="w-full justify-between h-auto py-4"
                onClick={() => onNavigateTab("nutrition")}
              >
                <span className="flex items-center gap-3">
                  <Utensils className="w-5 h-5 text-primary" />
                  <span>View Your Nutrition Plan & Recipes</span>
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between h-auto py-4"
                onClick={() => onNavigateTab("movement")}
              >
                <span className="flex items-center gap-3">
                  <Dumbbell className="w-5 h-5 text-primary" />
                  <span>View Your Movement Plan</span>
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between h-auto py-4"
                onClick={() => onNavigateTab("avini")}
              >
                <span className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  <span>Recommended Supplements</span>
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>

          {/* FDA Disclaimer */}
          <p className="text-[10px] text-muted-foreground/70 text-center max-w-xl mx-auto leading-relaxed">
            These statements have not been evaluated by the FDA. These products are not intended to diagnose, treat, cure, or prevent any disease.
          </p>

          {/* Retake */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center pt-4"
          >
            <Button variant="ghost" onClick={onRetake} className="gap-2 text-muted-foreground">
              <RotateCcw className="w-4 h-4" />
              Retake Assessment
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
