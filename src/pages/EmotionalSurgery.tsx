import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Lock, ChevronLeft, Play, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { LockedContent } from "@/components/LockedContent";
import { emotionalSurgeryTracks, Track, Lesson } from "@/data/emotionalSurgeryData";
import { useToast } from "@/hooks/use-toast";

interface LessonCompletion {
  track_name: string;
  lesson_number: number;
  lesson_title: string;
  journal_response: string | null;
  action_step_complete: boolean;
  completed_at: string | null;
}

function VideoPlaceholder({ label }: { label: string }) {
  return (
    <div className="aspect-video rounded-xl bg-muted/50 border border-border/50 flex flex-col items-center justify-center gap-3">
      <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
        <Play className="w-6 h-6 text-primary ml-0.5" />
      </div>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">Video coming soon — check back shortly</p>
    </div>
  );
}

export default function EmotionalSurgery() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [completions, setCompletions] = useState<Record<string, LessonCompletion>>({});
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [journalText, setJournalText] = useState("");
  const [actionComplete, setActionComplete] = useState(false);
  const [userTier, setUserTier] = useState("free");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const completionKey = (track: string, num: number) => `${track}_${num}`;

  const getTrackCompletions = (trackName: string) => {
    let count = 0;
    for (let i = 1; i <= 5; i++) {
      if (completions[completionKey(trackName, i)]?.completed_at) count++;
    }
    return count;
  };

  const totalCompleted = Object.values(completions).filter(c => c.completed_at).length;

  const isLessonUnlocked = (trackName: string, lessonNum: number) => {
    if (lessonNum === 1) return true;
    return !!completions[completionKey(trackName, lessonNum - 1)]?.completed_at;
  };

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("subscription_tier").eq("user_id", user.id).single()
      .then(({ data }) => { if (data) setUserTier(data.subscription_tier || "free"); });
    supabase.from("lesson_completions").select("*").eq("user_id", user.id)
      .then(({ data }) => {
        if (data) {
          const map: Record<string, LessonCompletion> = {};
          data.forEach((r: any) => { map[completionKey(r.track_name, r.lesson_number)] = r; });
          setCompletions(map);
        }
      });
  }, [user]);

  // Auto-select track from query param (from Home screen routing)
  useEffect(() => {
    const moduleParam = searchParams.get("module");
    if (moduleParam !== null && !selectedTrack) {
      const idx = parseInt(moduleParam, 10);
      if (!isNaN(idx) && idx >= 0 && idx < emotionalSurgeryTracks.length) {
        setSelectedTrack(emotionalSurgeryTracks[idx]);
      }
    }
  }, [searchParams, selectedTrack]);

  useEffect(() => {
    if (selectedLesson && selectedTrack) {
      const key = completionKey(selectedTrack.name, selectedLesson.number);
      const c = completions[key];
      setJournalText(c?.journal_response || "");
      setActionComplete(c?.action_step_complete || false);
    }
  }, [selectedLesson, selectedTrack, completions]);

  const autoSave = useCallback((value: string) => {
    if (!user || !selectedTrack || !selectedLesson) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      await supabase.from("lesson_completions").upsert({
        user_id: user.id,
        track_name: selectedTrack.name,
        lesson_number: selectedLesson.number,
        lesson_title: selectedLesson.title,
        journal_response: value,
        action_step_complete: actionComplete,
      }, { onConflict: "user_id,track_name,lesson_number" });
    }, 1000);
  }, [user, selectedTrack, selectedLesson, actionComplete]);

  const markComplete = async () => {
    if (!user || !selectedTrack || !selectedLesson) return;
    const { error } = await supabase.from("lesson_completions").upsert({
      user_id: user.id,
      track_name: selectedTrack.name,
      lesson_number: selectedLesson.number,
      lesson_title: selectedLesson.title,
      journal_response: journalText || null,
      action_step_complete: true,
      completed_at: new Date().toISOString(),
    }, { onConflict: "user_id,track_name,lesson_number" });

    if (!error) {
      const key = completionKey(selectedTrack.name, selectedLesson.number);
      setCompletions(prev => ({
        ...prev,
        [key]: { track_name: selectedTrack.name, lesson_number: selectedLesson.number, lesson_title: selectedLesson.title, journal_response: journalText, action_step_complete: true, completed_at: new Date().toISOString() },
      }));
      toast({ title: "Lesson Complete! ✨", description: `${selectedLesson.title} marked as complete.` });
      setSelectedLesson(null);
    }
  };

  const trackColors: Record<string, string> = {
    Wealth: "border-primary/40 bg-primary/5",
    Love: "border-[hsl(var(--brand-pink))]/40 bg-[hsl(var(--brand-pink))]/5",
    Identity: "border-secondary/40 bg-secondary/5",
    Visibility: "border-emerald-500/40 bg-emerald-500/5",
  };

  const trackAccentText: Record<string, string> = {
    Wealth: "text-primary",
    Love: "text-[hsl(var(--brand-pink))]",
    Identity: "text-secondary-foreground",
    Visibility: "text-emerald-400",
  };

  // Tier gating: Expand and above
  if (!["expand", "embody", "founding_full_access"].includes(userTier)) {
    return (
      <AuthenticatedLayout title="Emotional Surgery Lessons">
        <div className="min-h-screen pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            <LockedContent requiredTier="expand" currentTier={userTier}>
              <div className="h-[600px]" />
            </LockedContent>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout title="Emotional Surgery Lessons">
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">Emotional Surgery Lessons</h1>
            <p className="text-muted-foreground text-sm">Deep healing across 4 transformative tracks</p>
          </div>

          {/* Overall progress */}
          <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
            <span>Overall Progress</span>
            <span className="font-semibold text-foreground">{totalCompleted} / 20 lessons</span>
          </div>
          <Progress value={(totalCompleted / 20) * 100} className="h-2 mb-8" />

          <AnimatePresence mode="wait">
            {selectedLesson && selectedTrack ? (
              /* Lesson Detail View */
              <motion.div key="lesson" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Button variant="ghost" size="sm" onClick={() => setSelectedLesson(null)} className="mb-4">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back to {selectedTrack.name} Track
                </Button>

                <Card className={`p-6 md:p-8 ${trackColors[selectedTrack.name]}`}>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">{selectedTrack.icon} {selectedTrack.name} Track · Lesson {selectedLesson.number}</p>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">{selectedLesson.title}</h2>

                  {/* Video Placeholder */}
                  <div className="mb-6">
                    <VideoPlaceholder label={selectedLesson.videoLabel} />
                  </div>

                  {/* Core Teaching */}
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" /> Core Teaching
                    </h3>
                    <p className="text-sm text-foreground/80 leading-relaxed">{selectedLesson.coreTeaching}</p>
                  </div>

                  {/* Journal Prompt */}
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-primary mb-2">📝 Journal Prompt</h3>
                    <p className="text-sm text-foreground/90 mb-3">{selectedLesson.journalPrompt}</p>
                    <Textarea
                      placeholder="Write your response..."
                      value={journalText}
                      onChange={e => { setJournalText(e.target.value); autoSave(e.target.value); }}
                      className="min-h-[150px] bg-muted/50 border-border/50"
                    />
                  </div>

                  {/* Action Step */}
                  <div className="mb-8 p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <h3 className="text-sm font-bold text-primary mb-2">🎯 Action Step</h3>
                    <p className="text-sm text-foreground/90">{selectedLesson.actionStep}</p>
                  </div>

                  {/* Mark Complete */}
                  {!completions[completionKey(selectedTrack.name, selectedLesson.number)]?.completed_at ? (
                    <Button variant="gold" className="w-full" size="lg" onClick={markComplete}>
                      <Check className="w-5 h-5 mr-2" /> Mark Lesson Complete
                    </Button>
                  ) : (
                    <div className="text-center py-3 rounded-xl bg-primary/10 border border-primary/20">
                      <p className="text-primary font-semibold flex items-center justify-center gap-2">
                        <Check className="w-5 h-5" /> Lesson Complete
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>
            ) : selectedTrack ? (
              /* Track Lessons View */
              <motion.div key="track" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTrack(null)} className="mb-4">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back to All Tracks
                </Button>

                <div className="mb-6">
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-1">{selectedTrack.icon} {selectedTrack.name} Track</h2>
                  <p className="text-sm text-muted-foreground italic">{selectedTrack.tagline}</p>
                </div>

                <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
                  <span>Track Progress</span>
                  <span className="font-semibold text-foreground">{getTrackCompletions(selectedTrack.name)} / 5</span>
                </div>
                <Progress value={(getTrackCompletions(selectedTrack.name) / 5) * 100} className="h-2 mb-6" />

                <div className="space-y-3">
                  {selectedTrack.lessons.map(lesson => {
                    const key = completionKey(selectedTrack.name, lesson.number);
                    const isComplete = !!completions[key]?.completed_at;
                    const unlocked = isLessonUnlocked(selectedTrack.name, lesson.number);

                    return (
                      <button
                        key={lesson.number}
                        onClick={unlocked ? () => setSelectedLesson(lesson) : undefined}
                        disabled={!unlocked}
                        className={`w-full text-left rounded-xl border p-5 transition-all ${
                          isComplete ? "border-primary/30 bg-card" :
                          !unlocked ? "border-border/30 bg-muted/30 opacity-50 cursor-not-allowed" :
                          "border-border bg-card hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                            isComplete ? "bg-primary text-primary-foreground" :
                            !unlocked ? "bg-muted text-muted-foreground" :
                            "bg-primary/20 text-primary border border-primary"
                          }`}>
                            {isComplete ? <Check className="w-5 h-5" /> : !unlocked ? <Lock className="w-4 h-4" /> : lesson.number}
                          </div>
                          <div>
                            <p className="text-base font-semibold text-foreground">Lesson {lesson.number}: {lesson.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{lesson.videoLabel}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              /* Track Selection View */
              <motion.div key="tracks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {emotionalSurgeryTracks.map(track => {
                    const done = getTrackCompletions(track.name);
                    return (
                      <button
                        key={track.name}
                        onClick={() => setSelectedTrack(track)}
                        className={`text-left rounded-2xl border p-6 transition-all hover:scale-[1.02] ${trackColors[track.name]}`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">{track.icon}</span>
                          <h3 className="font-serif text-xl font-bold text-foreground">{track.name}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground italic mb-4">{track.tagline}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                          <span>Progress</span>
                          <span className="font-semibold text-foreground">{done} / 5</span>
                        </div>
                        <Progress value={(done / 5) * 100} className="h-1.5" />
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
