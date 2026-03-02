import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { movementPlans, Exercise } from "@/data/movementData";
import { bodyTypeProfiles } from "@/data/bodyTypeData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Lock,
  Dumbbell,
  Flame,
  Zap,
  Moon,
  Heart,
  Clock,
  Target,
  Utensils,
} from "lucide-react";
import { cn } from "@/lib/utils";

const intensityConfig = {
  low: { label: "Low", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  moderate: { label: "Moderate", className: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  high: { label: "High", className: "bg-red-500/15 text-red-400 border-red-500/30" },
};

const dayIcons: Record<string, typeof Flame> = {
  Monday: Dumbbell,
  Tuesday: Heart,
  Wednesday: Zap,
  Thursday: Moon,
  Friday: Flame,
  Saturday: Target,
  Sunday: Moon,
};

export function MovementPlans() {
  const { user } = useAuth();
  const [bodyType, setBodyType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

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
        <p className="text-muted-foreground mb-4">Sign in to access your personalized movement plan.</p>
        <Button variant="gold" asChild><a href="/auth">Sign In</a></Button>
      </div>
    );
  }

  if (!bodyType) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Dumbbell className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="font-serif text-2xl text-foreground mb-2">Take the Body Type Assessment First</h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          Your movement plan is personalized based on your body type. Complete the assessment in the Body Type tab to unlock your plan.
        </p>
      </div>
    );
  }

  const plan = movementPlans[bodyType];
  const profile = bodyTypeProfiles[bodyType];
  if (!plan || !profile) return null;

  const selectedDayData = selectedDay !== null ? plan.weeklySchedule[selectedDay] : null;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <span className="text-4xl mb-3 block">{profile.emoji}</span>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
          <span className="text-primary">{profile.name}</span> Movement Plan
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{plan.overview}</p>
      </motion.div>

      {/* Philosophy & Goal */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid md:grid-cols-2 gap-6 mb-10">
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="w-5 h-5 text-primary" />
              Movement Philosophy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80 text-sm leading-relaxed">{plan.philosophy}</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-primary" />
              Weekly Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-primary font-semibold text-lg mb-3">{plan.weeklyGoal}</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-semibold text-primary uppercase tracking-wider block mb-1">Warm-Up</span>
                <ul className="space-y-1 text-foreground/70">
                  {plan.warmUp.map((w) => <li key={w}>• {w}</li>)}
                </ul>
              </div>
              <div>
                <span className="font-semibold text-primary uppercase tracking-wider block mb-1">Cool-Down</span>
                <ul className="space-y-1 text-foreground/70">
                  {plan.coolDown.map((c) => <li key={c}>• {c}</li>)}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Schedule */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="font-serif text-2xl font-bold text-foreground mb-6 text-center">
          Weekly <span className="text-primary">Schedule</span>
        </h3>
        <div className="grid gap-3">
          {plan.weeklySchedule.map((day, i) => {
            const Icon = dayIcons[day.day] || Dumbbell;
            return (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary/40",
                    day.restDay && "border-muted/30 bg-muted/5"
                  )}
                  onClick={() => setSelectedDay(i)}
                >
                  <CardContent className="py-4 px-5 flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      day.restDay ? "bg-muted/20" : "bg-primary/10"
                    )}>
                      <Icon className={cn("w-5 h-5", day.restDay ? "text-muted-foreground" : "text-primary")} />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-foreground text-sm">{day.day}</span>
                        {day.restDay && (
                          <span className="px-2 py-0.5 rounded-full bg-muted/30 text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
                            Rest
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm truncate">{day.focus}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {day.exercises.length} exercise{day.exercises.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Day Detail Modal */}
      <Dialog open={selectedDay !== null} onOpenChange={() => setSelectedDay(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-card border-border">
          {selectedDayData && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {selectedDayData.day}
                  </span>
                  {selectedDayData.restDay && (
                    <span className="px-2 py-0.5 rounded-full bg-muted/30 text-muted-foreground text-xs font-semibold">
                      Rest Day
                    </span>
                  )}
                </div>
                <DialogTitle className="font-serif text-xl">{selectedDayData.focus}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                {selectedDayData.exercises.map((exercise, i) => {
                  const intensity = intensityConfig[exercise.intensity];
                  return (
                    <div key={i} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="font-serif text-base font-semibold text-foreground">{exercise.name}</h4>
                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border shrink-0", intensity.className)}>
                          {intensity.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <Clock className="w-3 h-3" />
                        {exercise.duration}
                      </div>
                      <p className="text-sm text-foreground/80 mb-3">{exercise.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {exercise.benefits.map((b) => (
                          <span key={b} className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
