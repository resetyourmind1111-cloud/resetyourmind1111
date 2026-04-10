import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause, Check, Sparkles, BookOpen, Repeat, Home, Volume2, ExternalLink } from "lucide-react";
import { startAmbientTone, stopAmbientTone, isAmbientPlaying } from "@/lib/ambientTones";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { LockedContent } from "@/components/LockedContent";
import { CelebrationOverlay } from "@/components/trial/CelebrationOverlay";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";


const AUDIO_URL = "https://mindist.page.link/Uiar";

const SCREENS = ["insight", "framework", "reflection", "reset", "complete"] as const;
type Screen = typeof SCREENS[number];

export default function ReleasingResistance() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { effectiveTier } = useSubscription();
  const { toast } = useToast();

  const [screen, setScreen] = useState<Screen>("insight");
  const [reflectionText, setReflectionText] = useState("");
  const [reflectionSaved, setReflectionSaved] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  const screenIndex = SCREENS.indexOf(screen);

  const goNext = () => {
    const next = SCREENS[screenIndex + 1];
    if (next) setScreen(next);
  };

  const saveReflection = async () => {
    if (!user || !reflectionText.trim()) return;
    await supabase.from("healing_tool_entries").insert({
      user_id: user.id,
      tool_id: "es-releasing-resistance-reflection",
      entry_data: { text: reflectionText.trim(), tags: ["releasing-resistance", "reflection"] },
    });
    setReflectionSaved(true);
    toast({ title: "Reflection saved ✨" });
  };

  const openAudioInMindist = () => {
    window.open(AUDIO_URL, "_blank", "noopener,noreferrer");
  };

  const markComplete = async () => {
    if (!user) return;
    await supabase.from("lesson_completions").upsert({
      user_id: user.id,
      track_name: "Releasing Resistance",
      lesson_number: 0,
      lesson_title: "Releasing Resistance",
      journal_response: reflectionText || null,
      action_step_complete: true,
      completed_at: new Date().toISOString(),
    }, { onConflict: "user_id,track_name,lesson_number" });

    setLessonCompleted(true);
    setShowCelebration(true);

    setTimeout(() => {
      setShowCelebration(false);
      setScreen("complete");
    }, 2600);
  };

  return (
    <AuthenticatedLayout title="Releasing Resistance">
      <LockedContent requiredTier="expand" currentTier={effectiveTier}>
        <div className="min-h-screen pt-24 pb-32 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Back */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/emotional-surgery")}
              className="mb-6 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to Emotional Surgery™
            </Button>

            {/* Pillar Tags */}
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {["Health", "Wealth", "Love", "Leadership"].map((p) => (
                <span key={p} className="text-[10px] uppercase tracking-[0.15em] px-3 py-1 rounded-full border border-primary/30 text-primary font-semibold">
                  {p}
                </span>
              ))}
            </div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-2">
                Start Here
              </p>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
                Releasing Resistance
              </h1>
              <p className="text-base text-primary/80 italic font-medium">
                What you fight, you feed. What you feel, you free.
              </p>
            </motion.div>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {SCREENS.map((s, i) => (
                <div
                  key={s}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i <= screenIndex ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* SCREEN 1: THE INSIGHT */}
              {screen === "insight" && (
                <motion.div key="insight" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <Card className="p-6 md:p-8 bg-card/80 border-border/50">
                    <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-5">
                      What resistance really is
                    </h2>
                    <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
                      <p>Resistance is not a character flaw. It is a survival strategy your subconscious developed to protect you from pain, failure, rejection, or loss.</p>
                      <p>The problem is — the same system that protected you is now keeping you from the life you want.</p>
                      <p className="font-medium text-foreground">Resistance shows up as:</p>
                      <ul className="space-y-1.5 pl-1">
                        <li className="flex items-start gap-2"><span className="text-primary mt-0.5">→</span> Procrastination</li>
                        <li className="flex items-start gap-2"><span className="text-primary mt-0.5">→</span> Overthinking</li>
                        <li className="flex items-start gap-2"><span className="text-primary mt-0.5">→</span> Self-sabotage</li>
                        <li className="flex items-start gap-2"><span className="text-primary mt-0.5">→</span> Perfectionism</li>
                        <li className="flex items-start gap-2"><span className="text-primary mt-0.5">→</span> "I'll do it when…" thinking</li>
                      </ul>
                      <p className="italic text-primary/90 font-medium pt-2">It is not laziness. It is fear wearing a disguise.</p>
                    </div>
                  </Card>
                  <Button className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6 rounded-2xl" onClick={goNext}>
                    Continue <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </motion.div>
              )}

              {/* SCREEN 2: THE FRAMEWORK */}
              {screen === "framework" && (
                <motion.div key="framework" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <Card className="p-6 md:p-8 bg-card/80 border-border/50">
                    <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-5">
                      Lorie's Lens
                    </h2>
                    <div className="border-l-4 border-primary pl-5 py-2 space-y-4 text-sm text-foreground/80 leading-relaxed">
                      <p>In NLP and Timeline Therapy™, resistance is a signal — not a stop sign.</p>
                      <p>It means there is an unresolved emotional event or limiting belief at the root.</p>
                      <p className="font-medium text-foreground">We don't push through resistance. We dissolve it at the source.</p>
                      <p>When the subconscious feels safe, resistance disappears naturally. You don't have to force yourself forward. You just have to remove what's been holding you back.</p>
                    </div>
                  </Card>
                  <Button className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6 rounded-2xl" onClick={goNext}>
                    Continue <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </motion.div>
              )}

              {/* SCREEN 3: REFLECTION */}
              {screen === "reflection" && (
                <motion.div key="reflection" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <Card className="p-6 md:p-8 bg-card/80 border-border/50">
                    <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-5">
                      Before the reset
                    </h2>
                    <p className="font-serif text-base md:text-lg text-foreground italic text-center leading-relaxed mb-6 px-2">
                      "Where in your life are you working hardest against yourself?
                      <br /><br />
                      What is the one area where you keep starting over — and what emotion lives underneath that pattern?"
                    </p>
                    <Textarea
                      placeholder="Write what comes up. No filter needed."
                      value={reflectionText}
                      onChange={(e) => setReflectionText(e.target.value)}
                      className="min-h-[160px] bg-muted/50 border-border/50 mb-4"
                    />
                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground mb-4"
                      onClick={saveReflection}
                      disabled={!reflectionText.trim() || reflectionSaved}
                    >
                      {reflectionSaved ? "✦ Reflection Saved" : "Save My Reflection"}
                    </Button>
                  </Card>
                  <Button className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6 rounded-2xl" onClick={goNext}>
                    Continue to Reset <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </motion.div>
              )}

              {/* SCREEN 4: GUIDED RESET (AUDIO) */}
              {screen === "reset" && (
                <motion.div key="reset" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <Card className="p-6 md:p-8 bg-card/80 border-border/50">
                    <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-2">
                      The Releasing Resistance Reset
                    </h2>
                    <p className="text-sm text-muted-foreground mb-6">
                      Find a quiet space. Press play and let it move through you.
                    </p>

                    {/* Audio Player Card */}
                    <div className="rounded-2xl bg-[#1a0f2e] border border-primary/20 p-6 mb-6">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={openAudioInMindist}
                          className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shrink-0 hover:bg-primary/90 transition-colors shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
                        >
                          <Play className="w-6 h-6 text-primary-foreground ml-0.5" />
                        </button>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Releasing Resistance — Guided Reset</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Opens in Mindist · Guided meditation</p>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6 rounded-2xl"
                      onClick={markComplete}
                      disabled={lessonCompleted}
                    >
                      <Check className="w-5 h-5 mr-2" /> Mark Complete
                    </Button>
                  </Card>
                </motion.div>
              )}

              {/* SCREEN 5: COMPLETION */}
              {screen === "complete" && (
                <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className="text-center space-y-6">
                    <Sparkles className="w-10 h-10 text-primary mx-auto" />
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground leading-relaxed">
                      You didn't push through it.<br />
                      You moved through it.<br />
                      That's the difference.
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                      Resistance dissolves when you stop fighting it and start feeling it. That is Emotional Surgery™ in action.
                    </p>

                    {/* Stats Pills */}
                    <div className="flex flex-wrap justify-center gap-3">
                      <span className="px-4 py-2 rounded-full border border-primary/40 text-primary text-sm font-medium">
                        ✦ Lesson complete
                      </span>
                      {reflectionSaved && (
                        <span className="px-4 py-2 rounded-full border border-primary/40 text-primary text-sm font-medium">
                          ✦ Reflection saved
                        </span>
                      )}
                      <span className="px-4 py-2 rounded-full border border-primary/40 text-primary text-sm font-medium">
                        ✦ Reset complete
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4">
                      <Button
                        variant="outline"
                        className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground py-5 rounded-xl"
                        onClick={() => {
                          setScreen("reset");
                          setLessonCompleted(false);
                        }}
                      >
                        <Repeat className="w-4 h-4 mr-2" /> Repeat this reset tomorrow
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-border text-foreground hover:bg-muted py-5 rounded-xl"
                        onClick={() => navigate("/healing-tools")}
                      >
                        <BookOpen className="w-4 h-4 mr-2" /> Journal more on this
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-border text-foreground hover:bg-muted py-5 rounded-xl"
                        onClick={() => navigate("/emotional-surgery")}
                      >
                        Return to Lessons
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </LockedContent>
      <CelebrationOverlay show={showCelebration} message="You moved through it. That's Emotional Surgery™." />
    </AuthenticatedLayout>
  );
}