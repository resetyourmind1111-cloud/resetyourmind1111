import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { useSubscription } from "@/hooks/useSubscription";
import { emotionalSurgeryTracks, Lesson } from "@/data/emotionalSurgeryData";
import { useToast } from "@/hooks/use-toast";
import { moduleScreens } from "@/data/emotionalSurgeryModules";
import ModuleScreen from "@/components/emotional-surgery/ModuleScreen";

const MODULE_SLUG_MAP: Record<string, { lessonNumber: number; title: string }> = {
  recognition: { lessonNumber: 1, title: "Recognition" },
  release: { lessonNumber: 2, title: "Release" },
  "quiet-phase": { lessonNumber: 3, title: "The Quiet Phase™" },
  recalibration: { lessonNumber: 4, title: "Recalibration" },
  embodiment: { lessonNumber: 5, title: "Embodiment" },
};

const MODULE_TIER_REQUIRED: Record<string, string> = {
  recognition: "reset",
  release: "reset",
  "quiet-phase": "expand",
  recalibration: "expand",
  embodiment: "embody",
};

interface TrackLesson {
  trackName: string;
  trackIcon: string;
  lesson: Lesson;
}

interface LessonCompletion {
  track_name: string;
  lesson_number: number;
  lesson_title: string;
  journal_response: string | null;
  action_step_complete: boolean;
  completed_at: string | null;
}

const trackColors: Record<string, string> = {
  Wealth: "border-primary/40 bg-primary/5",
  Love: "border-[hsl(var(--brand-pink))]/40 bg-[hsl(var(--brand-pink))]/5",
  Identity: "border-secondary/40 bg-secondary/5",
  Visibility: "border-emerald-500/40 bg-emerald-500/5",
};

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

export default function EmotionalSurgeryModule() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { effectiveTier } = useSubscription();
  const { toast } = useToast();

  const moduleInfo = slug ? MODULE_SLUG_MAP[slug] : null;
  const requiredTier = slug ? MODULE_TIER_REQUIRED[slug] : "reset";

  const [completions, setCompletions] = useState<Record<string, LessonCompletion>>({});
  const [selectedTrackLesson, setSelectedTrackLesson] = useState<TrackLesson | null>(null);
  const [journalText, setJournalText] = useState("");
  const [actionComplete, setActionComplete] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const completionKey = (track: string) => `${track}_${moduleInfo?.lessonNumber}`;

  // Get the lessons across all tracks for this module's lesson number
  const trackLessons: TrackLesson[] = moduleInfo
    ? emotionalSurgeryTracks.map((t) => ({
        trackName: t.name,
        trackIcon: t.icon,
        lesson: t.lessons[moduleInfo.lessonNumber - 1],
      }))
    : [];

  useEffect(() => {
    if (!user || !moduleInfo) return;
    supabase
      .from("lesson_completions")
      .select("*")
      .eq("user_id", user.id)
      .eq("lesson_number", moduleInfo.lessonNumber)
      .then(({ data }) => {
        if (data) {
          const map: Record<string, LessonCompletion> = {};
          data.forEach((r: any) => { map[completionKey(r.track_name)] = r; });
          setCompletions(map);
        }
      });
  }, [user, moduleInfo]);

  useEffect(() => {
    if (selectedTrackLesson && moduleInfo) {
      const key = completionKey(selectedTrackLesson.trackName);
      const c = completions[key];
      setJournalText(c?.journal_response || "");
      setActionComplete(c?.action_step_complete || false);
    }
  }, [selectedTrackLesson, completions]);

  const autoSave = useCallback((value: string) => {
    if (!user || !selectedTrackLesson || !moduleInfo) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      await supabase.from("lesson_completions").upsert({
        user_id: user.id,
        track_name: selectedTrackLesson.trackName,
        lesson_number: moduleInfo.lessonNumber,
        lesson_title: selectedTrackLesson.lesson.title,
        journal_response: value,
        action_step_complete: actionComplete,
      }, { onConflict: "user_id,track_name,lesson_number" });
    }, 1000);
  }, [user, selectedTrackLesson, moduleInfo, actionComplete]);

  const markComplete = async () => {
    if (!user || !selectedTrackLesson || !moduleInfo) return;
    const { error } = await supabase.from("lesson_completions").upsert({
      user_id: user.id,
      track_name: selectedTrackLesson.trackName,
      lesson_number: moduleInfo.lessonNumber,
      lesson_title: selectedTrackLesson.lesson.title,
      journal_response: journalText || null,
      action_step_complete: true,
      completed_at: new Date().toISOString(),
    }, { onConflict: "user_id,track_name,lesson_number" });

    if (!error) {
      const key = completionKey(selectedTrackLesson.trackName);
      setCompletions((prev) => ({
        ...prev,
        [key]: {
          track_name: selectedTrackLesson.trackName,
          lesson_number: moduleInfo.lessonNumber,
          lesson_title: selectedTrackLesson.lesson.title,
          journal_response: journalText,
          action_step_complete: true,
          completed_at: new Date().toISOString(),
        },
      }));
      toast({ title: "Lesson Complete! ✨", description: `${selectedTrackLesson.lesson.title} marked as complete.` });
      setSelectedTrackLesson(null);
    }
  };

  if (!moduleInfo) {
    return (
      <AuthenticatedLayout title="Emotional Surgery™">
        <div className="min-h-screen pt-24 pb-16 px-4 text-center">
          <p className="text-muted-foreground">Module not found.</p>
          <Button variant="ghost" onClick={() => navigate("/emotional-surgery")} className="mt-4">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Emotional Surgery™
          </Button>
        </div>
      </AuthenticatedLayout>
    );
  }

  // Use new module screens for 1, 2, 4, 5 (not quiet-phase)
  const newModuleContent = slug ? moduleScreens[slug] : null;
  if (newModuleContent) {
    return (
      <AuthenticatedLayout title={`${moduleInfo.title} — Emotional Surgery™`}>
        <div className="min-h-screen pt-24 pb-32 px-4">
          <LockedContent requiredTier={requiredTier as any} currentTier={effectiveTier}>
            <ModuleScreen module={newModuleContent} />
          </LockedContent>
        </div>
      </AuthenticatedLayout>
    );
  }

  const completedCount = trackLessons.filter((tl) => completions[completionKey(tl.trackName)]?.completed_at).length;

  return (
    <AuthenticatedLayout title={`${moduleInfo.title} — Emotional Surgery™`}>
      <div className="min-h-screen pt-24 pb-32 px-4">
        <div className="max-w-3xl mx-auto">
          <LockedContent requiredTier={requiredTier as any} currentTier={effectiveTier}>
            <AnimatePresence mode="wait">
              {selectedTrackLesson ? (
                /* Lesson Detail */
                <motion.div key="detail" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedTrackLesson(null)} className="mb-4">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to {moduleInfo.title}
                  </Button>

                  <Card className={`p-6 md:p-8 ${trackColors[selectedTrackLesson.trackName] || ""}`}>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
                      {selectedTrackLesson.trackIcon} {selectedTrackLesson.trackName} Track · Phase {moduleInfo.lessonNumber}
                    </p>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-6">{selectedTrackLesson.lesson.title}</h2>

                    <div className="mb-6">
                      <VideoPlaceholder label={selectedTrackLesson.lesson.videoLabel} />
                    </div>

                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" /> Core Teaching
                      </h3>
                      <p className="text-sm text-foreground/80 leading-relaxed">{selectedTrackLesson.lesson.coreTeaching}</p>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-primary mb-2">📝 Journal Prompt</h3>
                      <p className="text-sm text-foreground/90 mb-3">{selectedTrackLesson.lesson.journalPrompt}</p>
                      <Textarea
                        placeholder="Write your response..."
                        value={journalText}
                        onChange={(e) => { setJournalText(e.target.value); autoSave(e.target.value); }}
                        className="min-h-[150px] bg-muted/50 border-border/50"
                      />
                    </div>

                    <div className="mb-8 p-4 rounded-xl bg-primary/5 border border-primary/10">
                      <h3 className="text-sm font-bold text-primary mb-2">🎯 Action Step</h3>
                      <p className="text-sm text-foreground/90">{selectedTrackLesson.lesson.actionStep}</p>
                    </div>

                    {!completions[completionKey(selectedTrackLesson.trackName)]?.completed_at ? (
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
              ) : (
                /* Track listing for this module */
                <motion.div key="list" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/emotional-surgery")} className="mb-4">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Emotional Surgery™
                  </Button>

                  <div className="text-center mb-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-1">Phase {moduleInfo.lessonNumber}</p>
                    <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">{moduleInfo.title}</h1>
                  </div>

                  <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
                    <span>Module Progress</span>
                    <span className="font-semibold text-foreground">{completedCount} / {trackLessons.length}</span>
                  </div>
                  <Progress value={(completedCount / trackLessons.length) * 100} className="h-2 mb-6" />

                  <div className="space-y-3">
                    {trackLessons.map((tl) => {
                      const key = completionKey(tl.trackName);
                      const isComplete = !!completions[key]?.completed_at;

                      return (
                        <button
                          key={tl.trackName}
                          onClick={() => setSelectedTrackLesson(tl)}
                          className={`w-full text-left rounded-xl border p-5 transition-all ${
                            isComplete
                              ? "border-primary/30 bg-card"
                              : "border-border bg-card hover:border-primary/40"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                              isComplete ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary border border-primary"
                            }`}>
                              {isComplete ? <Check className="w-5 h-5" /> : tl.trackIcon}
                            </div>
                            <div>
                              <p className="text-base font-semibold text-foreground">{tl.trackIcon} {tl.trackName}: {tl.lesson.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{tl.lesson.videoLabel}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </LockedContent>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
