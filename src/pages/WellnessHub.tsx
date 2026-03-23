import { useState } from "react";
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

export default function WellnessHub() {
  const [activeTab, setActiveTab] = useState("body-type");

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
        </div>
      </div>
    </div>
  );
}
