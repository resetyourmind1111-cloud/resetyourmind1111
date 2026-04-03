import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Lock, ChevronLeft, Flame, Award, Sparkles, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { LockedContent } from "@/components/LockedContent";
import { TrialLockedContent } from "@/components/TrialLockedContent";
import { journeyWeeks, allJourneyDays, getWeekForDay, type JourneyDay } from "@/data/journeyData";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { useToast } from "@/hooks/use-toast";

interface DayProgress {
  day_number: number;
  phase: string;
  morning_response: string | null;
  evening_response: string | null;
  marked_complete: boolean;
  completed_at: string | null;
}

// ─── Celebration Overlay ───
function CelebrationOverlayInline({ dayNum, onDismiss }: { dayNum: number; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 2500);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <div className="text-center p-8">
        <p className="text-4xl mb-3">✨</p>
        <p className="font-serif text-xl text-foreground font-bold">Day {dayNum} complete.</p>
        <p className="text-muted-foreground text-sm mt-1">You showed up.</p>
      </div>
    </motion.div>
  );
}

// ─── Week Completion Card ───
function WeekCompletionCard({ weekNum, tagline, onContinue }: { weekNum: number; tagline: string; onContinue: () => void }) {
  const week = journeyWeeks[weekNum - 1];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
    >
      <div className="max-w-md w-full rounded-2xl p-8 text-center" style={{ backgroundColor: week.accentHex + '15', border: `2px solid ${week.accentHex}40` }}>
        <p className="text-3xl mb-3">🎉</p>
        <h3 className="font-serif text-2xl font-bold text-foreground mb-2">Week {weekNum} complete.</h3>
        <p className="text-sm italic text-muted-foreground mb-2">{tagline}</p>
        <p className="text-sm text-foreground/80 mb-6">You are not the same person who started this week.</p>
        {weekNum < 4 && (
          <Button onClick={onContinue} className="bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#06060e] font-semibold">
            Into Week {weekNum + 1} <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        )}
        {weekNum === 4 && (
          <Button onClick={onContinue} className="bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#06060e] font-semibold">
            See Your Results <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Day 30 Completion Screen ───
function Day30Screen({ scoreDay1, scoreDay24, onBeginAgain, onContinue }: { scoreDay1?: number | null; scoreDay24?: number | null; onBeginAgain: () => void; onContinue: () => void }) {
  const hasScores = scoreDay1 != null && scoreDay24 != null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-[#06060e] p-4">
      <div className="max-w-lg w-full text-center">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="font-serif text-5xl md:text-6xl font-bold text-[#C9A84C] mb-8">30 days.</motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="space-y-2 mb-8">
          <p className="text-[#F9F6F0] text-lg">You showed up.</p>
          <p className="text-[#F9F6F0] text-lg">You did the work.</p>
          <p className="text-[#F9F6F0] text-lg">You proved it to yourself.</p>
          <p className="text-[#F9F6F0]/60 text-sm mt-4 italic">This is not the end.<br/>This is who you are now.</p>
        </motion.div>
        {hasScores && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="mb-8 p-6 rounded-2xl border border-[#C9A84C]/30 bg-[#C9A84C]/5">
            <p className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] mb-3">Worth Thermostat™ Progress</p>
            <p className="text-[#F9F6F0] text-lg">Your score rose from <span className="text-[#C9A84C] font-bold">{scoreDay1}</span> to <span className="text-[#C9A84C] font-bold">{scoreDay24}</span>.</p>
            <p className="text-[#C9A84C] text-sm mt-1">That's {(scoreDay24! - scoreDay1!)} points of recalibration.</p>
          </motion.div>
        )}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="space-y-3">
          <Button onClick={onBeginAgain} className="w-full bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#06060e] font-semibold text-base py-6">Begin Again →</Button>
          <Button onClick={onContinue} variant="outline" className="w-full border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C]/10 py-5">Continue with Full App →</Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Day Card ───
function DayCard({ day, progress, isUnlocked, isCurrent, onSelect, accentHex }: {
  day: JourneyDay; progress?: DayProgress; isUnlocked: boolean; isCurrent: boolean; onSelect: () => void; accentHex: string;
}) {
  const isComplete = progress?.marked_complete;
  return (
    <button
      onClick={isUnlocked ? onSelect : undefined}
      disabled={!isUnlocked}
      className={`w-full text-left rounded-xl p-4 transition-all duration-200 ${
        isCurrent ? "ring-1 bg-card" : isComplete ? "bg-card/60" : !isUnlocked ? "bg-muted/20 opacity-40 cursor-not-allowed" : "bg-card hover:bg-card/80"
      }`}
      style={{ borderLeft: `3px solid ${isComplete ? '#C9A84C' : isUnlocked ? accentHex : 'transparent'}`, borderTop: '1px solid hsl(var(--border) / 0.3)', borderRight: '1px solid hsl(var(--border) / 0.3)', borderBottom: '1px solid hsl(var(--border) / 0.3)', ...(isCurrent ? { ringColor: accentHex } : {}) }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            isComplete ? "bg-[#C9A84C] text-[#06060e]" : !isUnlocked ? "bg-muted text-muted-foreground" : ""
          }`} style={!isComplete && isUnlocked ? { backgroundColor: accentHex + '20', color: accentHex } : {}}>
            {isComplete ? <Check className="w-4 h-4" /> : !isUnlocked ? <Lock className="w-3 h-3" /> : day.day}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Day {day.day}</p>
            <p className="text-xs text-muted-foreground">{day.title}</p>
          </div>
        </div>
        {isCurrent && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: accentHex + '20', color: accentHex }}>Today</span>}
      </div>
    </button>
  );
}

// ─── Main Page ───
export default function ThirtyDayExperience() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isTrialActive, trialExpired } = useTrialStatus();
  const isTrialUser = isTrialActive || trialExpired;
  const [progressMap, setProgressMap] = useState<Record<number, DayProgress>>({});
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [journalText, setJournalText] = useState("");
  const [userTier, setUserTier] = useState("free");
  const [userSource, setUserSource] = useState("organic");
  const [scoreDay1, setScoreDay1] = useState<number | null>(null);
  const [scoreDay24, setScoreDay24] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState<number | null>(null);
  const [showWeekComplete, setShowWeekComplete] = useState<number | null>(null);
  const [showDay30, setShowDay30] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const completedDays = Object.values(progressMap).filter(p => p.marked_complete).length;
  // Sequential unlock: day unlocked if previous day complete (day 1 always unlocked)
  const isDayUnlocked = (dayNum: number) => {
    if (dayNum === 1) return true;
    return !!progressMap[dayNum - 1]?.marked_complete;
  };
  const currentDay = (() => {
    for (let i = 1; i <= 30; i++) {
      if (!progressMap[i]?.marked_complete) return i;
    }
    return 30;
  })();
  const currentWeek = getWeekForDay(currentDay);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("subscription_tier, user_source, worth_score_day1, worth_score_day24").eq("user_id", user.id).single()
      .then(({ data }) => {
        if (data) {
          setUserTier((data as any).subscription_tier || "free");
          setUserSource((data as any).user_source || "organic");
          setScoreDay1((data as any).worth_score_day1 ?? null);
          setScoreDay24((data as any).worth_score_day24 ?? null);
        }
      });
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
      setJournalText(progressMap[selectedDay]?.morning_response || "");
    }
  }, [selectedDay, progressMap]);

  const autoSave = useCallback((value: string) => {
    if (!user || selectedDay === null) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const week = getWeekForDay(selectedDay);
      await supabase.from("thirty_day_progress").upsert({
        user_id: user.id,
        day_number: selectedDay,
        phase: `Week ${week.week}: ${week.theme}`,
        morning_response: value,
        marked_complete: progressMap[selectedDay]?.marked_complete || false,
      }, { onConflict: "user_id,day_number" });
    }, 1000);
  }, [user, selectedDay, progressMap]);

  const markComplete = async () => {
    if (!user || selectedDay === null) return;
    const week = getWeekForDay(selectedDay);
    const { error } = await supabase.from("thirty_day_progress").upsert({
      user_id: user.id,
      day_number: selectedDay,
      phase: `Week ${week.week}: ${week.theme}`,
      morning_response: journalText || null,
      evening_response: null,
      marked_complete: true,
      completed_at: new Date().toISOString(),
    }, { onConflict: "user_id,day_number" });

    if (!error) {
      setProgressMap(prev => ({
        ...prev,
        [selectedDay]: { day_number: selectedDay, phase: `Week ${week.week}`, morning_response: journalText, evening_response: null, marked_complete: true, completed_at: new Date().toISOString() },
      }));

      if (selectedDay === 30) {
        setShowDay30(true);
      } else if (selectedDay === 7 || selectedDay === 14 || selectedDay === 21) {
        setShowWeekComplete(week.week);
      } else {
        setShowCelebration(selectedDay);
      }
      setSelectedDay(null);
    }
  };

  const resetJourney = async () => {
    if (!user) return;
    await supabase.from("thirty_day_progress").delete().eq("user_id", user.id);
    setProgressMap({});
    setShowDay30(false);
  };

  const selectedDayData = selectedDay ? allJourneyDays.find(d => d.day === selectedDay) : null;
  const selectedWeek = selectedDay ? getWeekForDay(selectedDay) : null;

  const content = (
    <AuthenticatedLayout title="30-Day Journey" subtitle="Your path to reclaimed worth">
      <div className="pb-16">
        <div className="max-w-4xl mx-auto">

          {/* Workshop / Welcome Banner */}
          {userSource === "workshop_april18" ? (
            <div className="mb-6 p-4 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/30">
              <p className="text-sm text-foreground"><span className="mr-1">🎉</span> <strong>Welcome back from Permission Granted™.</strong></p>
              <p className="text-xs text-muted-foreground mt-1">Your 30-day journey picks up right where the workshop left off. You've already done the hardest part — you began.</p>
            </div>
          ) : (
            <div className="mb-6 p-4 rounded-xl bg-[#4A7FA5]/10 border border-[#4A7FA5]/30">
              <p className="text-sm text-foreground"><span className="mr-1">🌱</span> <strong>Your 30-day reset starts here.</strong></p>
              <p className="text-xs text-muted-foreground mt-1">Each day builds on the last. Show up. Do the work. Watch who you become.</p>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-2">
            <p className="text-xs text-muted-foreground mb-1 font-medium">Day {currentDay} of 30 · {currentWeek.theme}</p>
            <Progress value={(completedDays / 30) * 100} className="h-3 [&>div]:bg-[#C9A84C]" />
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Flame className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span className="font-semibold text-foreground">{completedDays}</span> / 30 days
            </div>
          </div>

          <AnimatePresence mode="wait">
            {selectedDay && selectedDayData && selectedWeek ? (
              <motion.div key="detail" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Button variant="ghost" size="sm" onClick={() => setSelectedDay(null)} className="mb-4">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>

                <Card className="p-6 md:p-8" style={{ borderLeft: `3px solid ${selectedWeek.accentHex}` }}>
                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-[0.2em] mb-1" style={{ color: selectedWeek.accentHex }}>Week {selectedWeek.week} · {selectedWeek.theme}</p>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-1">Day {selectedDay} — {selectedDayData.title}</h2>
                    <p className="text-xs text-muted-foreground italic">{selectedWeek.tagline}</p>
                  </div>

                  {/* Teaching */}
                  <div className="mb-6 p-4 rounded-xl bg-muted/30 border border-border/30">
                    <p className="text-sm text-foreground/90 italic leading-relaxed">"{selectedDayData.teaching}"</p>
                  </div>

                  {/* Action */}
                  {selectedDayData.toolRoute && (
                    <div className="mb-6">
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                        onClick={() => navigate(selectedDayData.toolRoute!)}
                      >
                        {selectedDayData.actionLabel}
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {selectedDayData.journalPrompt && (
                    <div className="mb-6">
                      <h3 className="text-sm font-bold mb-2" style={{ color: selectedWeek.accentHex }}>✍️ Journal Prompt</h3>
                      <p className="text-sm text-foreground/90 mb-3">{selectedDayData.journalPrompt}</p>
                      <Textarea
                        placeholder="Write your reflection..."
                        value={journalText}
                        onChange={e => { setJournalText(e.target.value); autoSave(e.target.value); }}
                        className="min-h-[140px] bg-muted/50 border-border/50"
                      />
                    </div>
                  )}

                  {/* Mark Complete */}
                  {!progressMap[selectedDay]?.marked_complete ? (
                    <Button onClick={markComplete} className="w-full bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#06060e] font-semibold" size="lg">
                      <Award className="w-5 h-5 mr-2" /> Mark Day Complete
                    </Button>
                  ) : (
                    <div className="text-center py-3 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20">
                      <p className="text-[#C9A84C] font-semibold flex items-center justify-center gap-2">
                        <Check className="w-5 h-5" /> Day {selectedDay} Complete
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>
            ) : (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {journeyWeeks.map(week => (
                  <div key={week.week} className="mb-8">
                    <div className="flex items-baseline gap-2 mb-1">
                      <h3 className="font-serif text-lg font-bold text-foreground">Week {week.week}: {week.theme}</h3>
                    </div>
                    <p className="text-xs italic mb-4" style={{ color: week.accentHex }}>{week.tagline}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {week.days.map(day => {
                        const trialLocked = isTrialUser && day.day > 3;
                        const unlocked = isDayUnlocked(day.day);
                        return (
                          <TrialLockedContent key={day.day} isLocked={trialLocked}>
                            <DayCard
                              day={day}
                              progress={progressMap[day.day]}
                              isUnlocked={!trialLocked && unlocked}
                              isCurrent={!trialLocked && day.day === currentDay}
                              onSelect={() => !trialLocked && unlocked && setSelectedDay(day.day)}
                              accentHex={week.accentHex}
                            />
                          </TrialLockedContent>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {showCelebration !== null && (
          <CelebrationOverlayInline dayNum={showCelebration} onDismiss={() => setShowCelebration(null)} />
        )}
      </AnimatePresence>
      {showWeekComplete !== null && (
        <WeekCompletionCard weekNum={showWeekComplete} tagline={journeyWeeks[showWeekComplete - 1].tagline} onContinue={() => setShowWeekComplete(null)} />
      )}
      {showDay30 && (
        <Day30Screen scoreDay1={scoreDay1} scoreDay24={scoreDay24} onBeginAgain={resetJourney} onContinue={() => navigate("/emotional-surgery")} />
      )}
    </AuthenticatedLayout>
  );

  if (!["embody", "founding_full_access"].includes(userTier)) {
    return (
      <AuthenticatedLayout title="30-Day Journey">
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
