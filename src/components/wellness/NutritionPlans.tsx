import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { nutritionPlans, Recipe } from "@/data/nutritionData";
import { bodyTypeProfiles } from "@/data/bodyTypeData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lock, ChefHat, Leaf, AlertTriangle, Clock, Users, ArrowLeft, Utensils, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function NutritionPlans() {
  const { user } = useAuth();
  const [bodyType, setBodyType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    async function fetch() {
      if (!user) { setLoading(false); return; }
      const { data } = await supabase
        .from("profiles")
        .select("body_type")
        .eq("user_id", user.id)
        .single();
      if (data?.body_type) setBodyType(data.body_type);
      setLoading(false);
    }
    fetch();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Lock className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="font-serif text-2xl text-foreground mb-2">Sign In Required</h3>
        <p className="text-muted-foreground mb-4">Sign in to access your personalized nutrition plan.</p>
        <Button variant="gold" asChild><a href="/auth">Sign In</a></Button>
      </div>
    );
  }

  if (!bodyType) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Utensils className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="font-serif text-2xl text-foreground mb-2">Take the Body Type Assessment First</h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          Your nutrition plan is personalized based on your body type. Complete the assessment in the Body Type tab to unlock your plan.
        </p>
      </div>
    );
  }

  const plan = nutritionPlans[bodyType];
  const profile = bodyTypeProfiles[bodyType];

  if (!plan || !profile) return null;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <span className="text-4xl mb-3 block">{profile.emoji}</span>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
          <span className="text-primary">{profile.name}</span> Nutrition Plan
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{plan.overview}</p>
      </motion.div>

      {/* Foods To Eat / Reduce */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="h-full border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Leaf className="w-5 h-5 text-primary" />
                Foods to Eat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {plan.foodsToEat.map((food) => (
                  <span key={food} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {food}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full border-destructive/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Foods to Reduce
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {plan.foodsToReduce.map((food) => (
                  <span key={food} className="px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm font-medium">
                    {food}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Sample Meal Plan */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-12">
        <h3 className="font-serif text-2xl font-bold text-foreground mb-6 text-center">
          3-Day Sample <span className="text-primary">Meal Plan</span>
        </h3>
        <div className="grid gap-4">
          {plan.sampleDays.map((day, i) => (
            <Card key={day.day} className="overflow-hidden">
              <CardHeader className="bg-primary/5 pb-3 pt-4">
                <CardTitle className="text-base font-semibold">{day.day}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-semibold text-primary text-xs uppercase tracking-wider">Breakfast</span>
                    <p className="text-foreground/80 mt-1">{day.breakfast}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-primary text-xs uppercase tracking-wider">Lunch</span>
                    <p className="text-foreground/80 mt-1">{day.lunch}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-primary text-xs uppercase tracking-wider">Dinner</span>
                    <p className="text-foreground/80 mt-1">{day.dinner}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-primary text-xs uppercase tracking-wider">Snack</span>
                    <p className="text-foreground/80 mt-1">{day.snack}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Recipe Library */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h3 className="font-serif text-2xl font-bold text-foreground mb-6 text-center">
          Recipe <span className="text-primary">Library</span>
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plan.recipes.map((recipe, i) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <Card
                className="cursor-pointer glass-card-hover h-full"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <CardContent className="pt-5 pb-4 px-4 flex flex-col h-full">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <ChefHat className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-serif text-sm font-semibold text-foreground mb-2 leading-tight flex-grow">
                    {recipe.name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{recipe.prepTime}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{recipe.servings}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recipe Detail Modal */}
      <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-card border-border">
          {selectedRecipe && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {selectedRecipe.bodyType}
                  </span>
                </div>
                <DialogTitle className="font-serif text-xl">{selectedRecipe.name}</DialogTitle>
              </DialogHeader>

              <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />Prep: {selectedRecipe.prepTime}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />Cook: {selectedRecipe.cookTime}</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" />{selectedRecipe.servings} servings</span>
              </div>

              {/* Nutritional Notes */}
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 mb-5">
                <p className="text-sm text-foreground/80 italic">{selectedRecipe.nutritionalNotes}</p>
              </div>

              {/* Ingredients */}
              <div className="mb-5">
                <h4 className="font-serif text-base font-semibold text-foreground mb-3">Ingredients</h4>
                <ul className="space-y-1.5">
                  {selectedRecipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="font-serif text-base font-semibold text-foreground mb-3">Instructions</h4>
                <ol className="space-y-3">
                  {selectedRecipe.instructions.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-foreground/80">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
