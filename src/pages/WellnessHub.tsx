import { useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BodyTypeAssessment } from "@/components/wellness/BodyTypeAssessment";
import { NutritionPlans } from "@/components/wellness/NutritionPlans";
import { MovementPlans } from "@/components/wellness/MovementPlans";
import { motion } from "framer-motion";
import { AviniHealthProducts } from "@/components/wellness/AviniHealthProducts";
import { DailyWellnessTips } from "@/components/wellness/DailyWellnessTips";
import { HormoneHealthModule } from "@/components/wellness/HormoneHealthModule";
import { MentalHealthModule } from "@/components/wellness/MentalHealthModule";
import { TrialLockedContent } from "@/components/TrialLockedContent";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import NervousSystemDiagnostic from "@/components/healing-tools/NervousSystemDiagnostic";

export default function WellnessHub() {
  const [activeTab, setActiveTab] = useState("body-type");
  const { isTrialActive } = useTrialStatus();
  const { effectiveTier } = useSubscription();
  const isTrialUser = isTrialActive && effectiveTier === "free";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4 mb-8"
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">
            Wellness <span className="text-primary">Hub</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Your personalized path to physical and nutritional wellness
          </p>
        </motion.div>

        <div className="container mx-auto px-4">
          {/* Trial Preview Banner */}
          {isTrialUser && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 rounded-xl border-t-2 border-[#C9A84C] bg-[#1a1040] p-5"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold mb-2">
                Your Free Preview
              </p>
              <p className="text-sm text-[hsl(40,30%,85%)] leading-relaxed mb-3">
                You have access to the Nervous System Diagnostic during your 7-day reset.
                The full Wellness Hub unlocks with full access.
              </p>
              <Link to="/upgrade">
                <Button variant="outline" size="sm" className="border-[#C9A84C]/50 text-[#C9A84C] hover:bg-[#C9A84C]/10">
                  See what's included →
                </Button>
              </Link>
            </motion.div>
          )}

          {isTrialUser ? (
            // Trial user: Show Nervous System Diagnostic + locked tabs
            <div className="space-y-8">
              {/* Nervous System Diagnostic - Unlocked */}
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Nervous System Diagnostic</h2>
                <NervousSystemDiagnostic />
              </div>

              {/* Locked content preview */}
              <div className="relative rounded-2xl overflow-hidden">
                <div className="blur-sm pointer-events-none select-none opacity-40">
                  <Tabs value="body-type" className="w-full">
                    <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted/50 p-1.5 rounded-xl mb-8">
                      <TabsTrigger value="body-type" className="flex-1 min-w-[80px] text-xs sm:text-sm">Body Type</TabsTrigger>
                      <TabsTrigger value="nutrition" className="flex-1 min-w-[80px] text-xs sm:text-sm">Nutrition</TabsTrigger>
                      <TabsTrigger value="movement" className="flex-1 min-w-[80px] text-xs sm:text-sm">Movement</TabsTrigger>
                      <TabsTrigger value="hormones" className="flex-1 min-w-[80px] text-xs sm:text-sm">Hormone Health</TabsTrigger>
                      <TabsTrigger value="mental-health" className="flex-1 min-w-[80px] text-xs sm:text-sm">Mental Health</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm rounded-2xl">
                  <div className="flex flex-col items-center gap-4 p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-[#C9A84C]" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-foreground">
                      Your nervous system diagnostic is unlocked.
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-xs">
                      The full Wellness Hub — including Hormone Health, Mental Health, Body Type Analyzer, and all healing tools — is available inside full access.
                    </p>
                    <Link to="/upgrade">
                      <Button variant="gold" size="lg">
                        Unlock Full Access →
                      </Button>
                    </Link>
                    <p className="text-xs text-muted-foreground">Founding rate: $44/month — locked in for life.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Paid user: Full Wellness Hub
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted/50 p-1.5 rounded-xl mb-8">
                <TabsTrigger value="body-type" className="flex-1 min-w-[80px] text-xs sm:text-sm">Body Type</TabsTrigger>
                <TabsTrigger value="nutrition" className="flex-1 min-w-[80px] text-xs sm:text-sm">Nutrition</TabsTrigger>
                <TabsTrigger value="movement" className="flex-1 min-w-[80px] text-xs sm:text-sm">Movement</TabsTrigger>
                <TabsTrigger value="avini" className="flex-1 min-w-[80px] text-xs sm:text-sm">Avini Health</TabsTrigger>
                <TabsTrigger value="tips" className="flex-1 min-w-[80px] text-xs sm:text-sm">Daily Tips</TabsTrigger>
                <TabsTrigger value="hormones" className="flex-1 min-w-[80px] text-xs sm:text-sm">Hormone Health</TabsTrigger>
                <TabsTrigger value="mental-health" className="flex-1 min-w-[80px] text-xs sm:text-sm">Mental Health</TabsTrigger>
              </TabsList>

              <TabsContent value="body-type">
                <BodyTypeAssessment onNavigateTab={setActiveTab} />
              </TabsContent>
              <TabsContent value="nutrition">
                <NutritionPlans />
              </TabsContent>
              <TabsContent value="movement">
                <MovementPlans />
              </TabsContent>
              <TabsContent value="avini">
                <AviniHealthProducts />
              </TabsContent>
              <TabsContent value="tips">
                <DailyWellnessTips />
              </TabsContent>
              <TabsContent value="hormones">
                <HormoneHealthModule />
              </TabsContent>
              <TabsContent value="mental-health">
                <MentalHealthModule />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
