import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Lock, ChevronLeft, Flame, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { LockedContent } from "@/components/LockedContent";
import { thirtyDayContent, DayContent } from "@/data/thirtyDayExperienceData";
import { useToast } from "@/hooks/use-toast";

const dailyAffirmations = [
  "You are the permission you've been waiting for.",
  "Your worth is not up for negotiation.",
  "You are allowed to take up space unapologetically.",
  "Choosing yourself is not selfish — it's sacred.",
  "You don't need anyone's approval to become who you're meant to be.",
  "Rest is not a reward. It is a right.",
  "Your boundaries are proof of your self-respect.",
  "You are allowed to outgrow the version of you they were comfortable with.",
  "Joy is your birthright. Stop apologizing for feeling it.",
  "You are not too much. They were just not enough.",
  "Forgiveness is a gift you give yourself.",
  "You are allowed to want more — and to get it.",
  "The old story ends when you decide it does.",
  "You are building something no one else can build.",
  "Your voice matters. Use it without shrinking.",
  "Grief and growth can live in the same breath.",
  "You are allowed to change your mind as many times as you need.",
  "Abundance is not greed — it is alignment.",
  "You don't owe anyone an explanation for your evolution.",
  "Passion is not a luxury. It is a compass.",
  "Your tears are not weakness. They are release.",
  "You are allowed to fail publicly and rise loudly.",
  "No one can pour from your cup without your permission.",
  "You are the evidence that healing is possible.",
  "Trust your knowing. It has never lied to you.",
  "Love that requires you to shrink is not love.",
  "Your ambition is beautiful. Never dim it.",
  "Today, you choose yourself. Tomorrow, you choose yourself again.",
  "The world needs exactly what you carry inside you.",
  "You are the permission slip. You always were.",
];

interface DayProgress {
  day_number: number;
  phase: string;
  morning_response: string | null;
  evening_response: string | null;
  marked_complete: boolean;
  completed_at: string | null;
}

function CompletionCertificate({ firstName, completedDate }: { firstName: string; completedDate: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-xl p-4"
    >
      <div className="relative max-w-lg w-full rounded-3xl border-2 border-primary p-8 md:p-12 text-center bg-card shadow-[0_0_60px_hsl(var(--primary)/0.2)]">
        <motion.div
          className="absolute inset-0 rounded-3xl border-2 border-primary/50"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Certificate of Completion</p>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-1">30-Day Experience</h2>
        <p className="text-sm text-primary font-medium mb-6">Reset Your Mind 1111™</p>
        <p className="font-serif text-3xl md:text-4xl font-bold text-primary mb-6">{firstName}</p>
        <blockquote className="text-sm italic text-muted-foreground mb-6 max-w-sm mx-auto leading-relaxed">
          "You are the permission you've been waiting for. Stop waiting. You're worthy now."
        </blockquote>
        <p className="text-xs text-muted-foreground mb-1">— Lorie Wu</p>
        <p className="text-xs text-muted-foreground mt-4">Completed {new Date(completedDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        <div className="mt-8 flex flex-col gap-3">
          <Button variant="gold" className="w-full" onClick={() => window.location.href = "/assessment"}>
            Retake Assessment
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function DayCard({ day, progress, isToday, isFuture, onSelect }: {
  day: DayContent;
  progress?: DayProgress;
  isToday: boolean;
  isFuture: boolean;
  onSelect: () => void;
}) {
  const isComplete = progress?.marked_complete;

  return (
    <button
      onClick={!isFuture ? onSelect : undefined}
      disabled={isFuture}
      className={`w-full text-left rounded-xl border p-4 transition-all duration-200 ${
        isToday ? "border-primary bg-primary/10 ring-1 ring-primary/30" :
        isComplete ? "border-primary/30 bg-card" :
        isFuture ? "border-border/30 bg-muted/30 opacity-50 cursor-not-allowed" :
        "border-border bg-card hover:border-primary/40"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            isComplete ? "bg-primary text-primary-foreground" :
            isFuture ? "bg-muted text-muted-foreground" :
            isToday ? "bg-primary/20 text-primary border border-primary" :
            "bg-muted text-muted-foreground"
          }`}>
            {isComplete ? <Check className="w-4 h-4" /> : isFuture ? <Lock className="w-3 h-3" /> : day.day}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Day {day.day}</p>
            <p className="text-xs text-muted-foreground">{day.theme}</p>
          </div>
        </div>
        {isToday && <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">Today</span>}
      </div>
    </button>
  );
}

export default function ThirtyDayExperience() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [progressMap, setProgressMap] = useState<Record<number, DayProgress>>({});
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [morningText, setMorningText] = useState("");
  const [eveningText, setEveningText] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);
  const [userTier, setUserTier] = useState("free");
  const [firstName, setFirstName] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Determine current day based on first entry or default to 1
  const completedDays = Object.values(progressMap).filter(p => p.marked_complete).length;
  const currentDay = completedDays + 1;
  const streak = (() => {
    let s = 0;
    for (let i = completedDays; i >= 1; i--) {
      if (progressMap[i]?.marked_complete) s++;
      else break;
    }
    return s;
  })();

  useEffect(() => {
    if (!user) return;
    // Fetch profile
    supabase.from("profiles").select("subscription_tier, full_name").eq("user_id", user.id).single()
      .then(({ data }) => {
        if (data) {
          setUserTier(data.subscription_tier || "free");
          setFirstName(data.full_name || "");
        }
      });
    // Fetch progress
    supabase.from("thirty_day_progress").select("*").eq("user_id", user.id)
      .then(({ data }) => {
        if (data) {
          const map: Record<number, DayProgress> = {};
          data.forEach((r: any) => { map[r.day_number] = r; });
          setProgressMap(map);
        }
      });
  }, [user]);

  useEffect(() => {
    if (selectedDay !== null) {
      const p = progressMap[selectedDay];
      setMorningText(p?.morning_response || "");
      setEveningText(p?.evening_response || "");
    }
  }, [selectedDay, progressMap]);

  const autoSave = useCallback((field: "morning_response" | "evening_response", value: string) => {
    if (!user || selectedDay === null) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const dayContent = thirtyDayContent[selectedDay - 1];
      await supabase.from("thirty_day_progress").upsert({
        user_id: user.id,
        day_number: selectedDay,
        phase: `Phase ${dayContent.phase}: ${dayContent.phaseName}`,
        [field]: value,
        marked_complete: progressMap[selectedDay]?.marked_complete || false,
      }, { onConflict: "user_id,day_number" });
    }, 1000);
  }, [user, selectedDay, progressMap]);

  const markComplete = async () => {
    if (!user || selectedDay === null) return;
    const dayContent = thirtyDayContent[selectedDay - 1];
    const { error } = await supabase.from("thirty_day_progress").upsert({
      user_id: user.id,
      day_number: selectedDay,
      phase: `Phase ${dayContent.phase}: ${dayContent.phaseName}`,
      morning_response: morningText || null,
      evening_response: eveningText || null,
      marked_complete: true,
      completed_at: new Date().toISOString(),
    }, { onConflict: "user_id,day_number" });

    if (!error) {
      setProgressMap(prev => ({
        ...prev,
        [selectedDay]: { ...prev[selectedDay], day_number: selectedDay, phase: `Phase ${dayContent.phase}`, morning_response: morningText, evening_response: eveningText, marked_complete: true, completed_at: new Date().toISOString() },
      }));
      toast({ title: "Day Complete! ✨", description: `Day ${selectedDay} marked as complete.` });
      if (selectedDay === 30) setShowCertificate(true);
      else setSelectedDay(null);
    }
  };

  const selectedDayContent = selectedDay ? thirtyDayContent[selectedDay - 1] : null;
  const currentPhase = selectedDay ? Math.ceil(selectedDay / 10) : Math.ceil(currentDay / 10);
  const phaseNames = ["Recognition", "Recalibration", "Integration"];

  const content = (
    <AuthenticatedLayout title="30-Day Experience" subtitle="Your journey to reclaimed worth">
      <div className="pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Daily Affirmation */}
          <motion.blockquote
            key={currentDay}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm italic text-primary/80 max-w-md mx-auto leading-relaxed text-center mb-8"
          >
            "{dailyAffirmations[(currentDay - 1) % dailyAffirmations.length]}"
          </motion.blockquote>

          {/* Top Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Flame className="w-4 h-4 text-primary" />
              <span className="font-semibold text-foreground">{streak}</span> day streak
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{completedDays}</span> / 30 days
            </div>
          </div>

          {/* Progress Bar */}
          <Progress value={(completedDays / 30) * 100} className="h-3 mb-2" />

          {/* Phase Indicator */}
          <div className="flex gap-1 mb-8">
            {[1, 2, 3].map(p => (
              <div key={p} className={`flex-1 text-center py-2 rounded-lg text-xs font-medium transition-colors ${
                currentPhase === p ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground"
              }`}>
                Phase {p}: {phaseNames[p - 1]}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {selectedDay && selectedDayContent ? (
              <motion.div key="detail" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Button variant="ghost" size="sm" onClick={() => setSelectedDay(null)} className="mb-4">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back to Overview
                </Button>

                <Card className="p-6 md:p-8 border-primary/20">
                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-primary mb-1">Phase {selectedDayContent.phase} · {selectedDayContent.phaseName}</p>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-1">Day {selectedDay} — "{selectedDayContent.theme}"</h2>
                    <p className="text-xs text-muted-foreground italic">{selectedDayContent.phaseSubtitle}</p>
                  </div>

                  {/* Morning Prompt */}
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-primary mb-2">☀️ Morning Prompt</h3>
                    <p className="text-sm text-foreground/90 mb-3">{selectedDayContent.morningPrompt}</p>
                    <Textarea
                      placeholder="Write your morning reflection..."
                      value={morningText}
                      onChange={e => { setMorningText(e.target.value); autoSave("morning_response", e.target.value); }}
                      className="min-h-[120px] bg-muted/50 border-border/50"
                    />
                  </div>

                  {/* Evening Reflection */}
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-primary mb-2">🌙 Evening Reflection</h3>
                    <p className="text-sm text-foreground/90 mb-3">{selectedDayContent.eveningReflection}</p>
                    <Textarea
                      placeholder="Write your evening reflection..."
                      value={eveningText}
                      onChange={e => { setEveningText(e.target.value); autoSave("evening_response", e.target.value); }}
                      className="min-h-[120px] bg-muted/50 border-border/50"
                    />
                  </div>

                  {/* Daily Practice */}
                  <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <h3 className="text-sm font-bold text-primary mb-2">🎯 Daily Practice</h3>
                    <p className="text-sm text-foreground/90">{selectedDayContent.dailyPractice}</p>
                  </div>

                  {/* Celebration Moment */}
                  <div className="mb-8 p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                    <h3 className="text-sm font-bold text-secondary-foreground mb-2">🎉 Celebration Moment</h3>
                    <p className="text-sm text-foreground/90 italic">{selectedDayContent.celebrationMoment}</p>
                  </div>

                  {/* Mark Complete */}
                  {!progressMap[selectedDay]?.marked_complete ? (
                    <Button variant="gold" className="w-full" size="lg" onClick={markComplete}>
                      <Award className="w-5 h-5 mr-2" /> Mark Day Complete
                    </Button>
                  ) : (
                    <div className="text-center py-3 rounded-xl bg-primary/10 border border-primary/20">
                      <p className="text-primary font-semibold flex items-center justify-center gap-2">
                        <Check className="w-5 h-5" /> Day {selectedDay} Complete
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>
            ) : (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {[1, 2, 3].map(phase => (
                  <div key={phase} className="mb-8">
                    <h3 className="font-serif text-lg font-bold text-foreground mb-1">
                      Phase {phase}: {phaseNames[phase - 1]}
                    </h3>
                    <p className="text-xs text-muted-foreground italic mb-4">
                      {thirtyDayContent[(phase - 1) * 10].phaseSubtitle}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {thirtyDayContent.slice((phase - 1) * 10, phase * 10).map(day => (
                        <DayCard
                          key={day.day}
                          day={day}
                          progress={progressMap[day.day]}
                          isToday={day.day === currentDay}
                          isFuture={day.day > currentDay}
                          onSelect={() => setSelectedDay(day.day)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {showCertificate && <CompletionCertificate firstName={firstName} completedDate={new Date().toISOString()} />}
    </AuthenticatedLayout>
  );

  // Tier gating: Embody only
  if (!["embody", "founding_full_access"].includes(userTier)) {
    return (
      <AuthenticatedLayout title="30-Day Experience">
        <div className="min-h-screen pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            <LockedContent requiredTier="embody" currentTier={userTier}>
              <div className="h-[600px]" />
            </LockedContent>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return content;
}
