import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Sparkles, Wind, Heart, Brain } from "lucide-react";
import { toast } from "sonner";

const TOTAL_STEPS = 7;

const EMOTIONS = ["Overwhelmed", "Anxious", "Stuck", "Frustrated", "Hopeful", "Calm"];
const BLOCKED_AREAS = [
  { label: "Money & Career", icon: "💰" },
  { label: "Relationships & Love", icon: "❤️" },
  { label: "Self-Worth & Confidence", icon: "✨" },
  { label: "Health & Body", icon: "🧘" },
  { label: "Purpose & Direction", icon: "🧭" },
  { label: "Emotional Healing", icon: "🌿" },
];

const TOOL_MAP: Record<string, { name: string; id: string }[]> = {
  "Money & Career": [
    { name: "Money Story Audit", id: "money-story-audit" },
    { name: "Abundance Evidence Log", id: "abundance-evidence-log" },
    { name: "Limiting Belief Rewriter", id: "limiting-belief-rewriter" },
  ],
  "Relationships & Love": [
    { name: "Attachment Style Analyzer", id: "attachment-style-analyzer" },
    { name: "Boundary Builder", id: "boundary-builder" },
    { name: "Inner Child Healing", id: "inner-child-healing" },
  ],
  "Self-Worth & Confidence": [
    { name: "Affirmation Builder", id: "affirmation-builder" },
    { name: "Shadow Work Library", id: "shadow-work-library" },
    { name: "Values Clarity Tool", id: "values-clarity" },
  ],
  "Health & Body": [
    { name: "Somatic Breathing", id: "somatic-breathing" },
    { name: "Body Map Journal", id: "body-map-journal" },
    { name: "Nervous System Diagnostic", id: "nervous-system-diagnostic" },
  ],
  "Purpose & Direction": [
    { name: "CEO Self-Assessment", id: "ceo-self-assessment" },
    { name: "Visibility Challenge Tracker", id: "visibility-challenge" },
    { name: "Manifestation Tracker", id: "manifestation-tracker" },
  ],
  "Emotional Healing": [
    { name: "Inner Child Healing", id: "inner-child-healing" },
    { name: "Emotional Trigger Tracker", id: "emotional-trigger-tracker" },
    { name: "Energy Cord Cutting", id: "energy-cord-cutting" },
  ],
};

function getSecondaryFocus(emotions: string[]): string {
  if (emotions.includes("Anxious") || emotions.includes("Overwhelmed")) return "Nervous System Regulation";
  if (emotions.includes("Frustrated") || emotions.includes("Stuck")) return "Emotional Processing";
  if (emotions.includes("Hopeful") || emotions.includes("Calm")) return "Expansion & Growth";
  return "Emotional Awareness";
}

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [blockedArea, setBlockedArea] = useState("");
  const [worthScore, setWorthScore] = useState(5);
  const [limitingBelief, setLimitingBelief] = useState("");
  const [newBelief, setNewBelief] = useState("");
  const [isReframing, setIsReframing] = useState(false);
  const [beliefAccepted, setBeliefAccepted] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [breathCycle, setBreathCycle] = useState(0);
  const [breathComplete, setBreathComplete] = useState(false);
  const [abundanceEvidence, setAbundanceEvidence] = useState("");
  const [futureSelfAnswer, setFutureSelfAnswer] = useState("");

  const toggleEmotion = (e: string) => {
    setEmotions((prev) => prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]);
  };

  const handleReframeBelief = async () => {
    if (!limitingBelief.trim()) return;
    setIsReframing(true);
    try {
      const { data, error } = await supabase.functions.invoke("reframe-belief", {
        body: { limiting_belief: limitingBelief },
      });
      if (error) throw error;
      setNewBelief(data.new_belief);
    } catch {
      setNewBelief("I am worthy of everything I desire, and I give myself permission to receive it now.");
    } finally {
      setIsReframing(false);
    }
  };

  // Breathing exercise
  useEffect(() => {
    if (step !== 4 || breathComplete) return;
    const phases = [
      { name: "inhale" as const, duration: 4000 },
      { name: "hold" as const, duration: 4000 },
      { name: "exhale" as const, duration: 6000 },
    ];
    let currentPhase = 0;
    let currentCycle = 0;

    const runPhase = () => {
      if (currentCycle >= 3) {
        setBreathComplete(true);
        return;
      }
      setBreathPhase(phases[currentPhase].name);
      const timeout = setTimeout(() => {
        currentPhase++;
        if (currentPhase >= phases.length) {
          currentPhase = 0;
          currentCycle++;
          setBreathCycle(currentCycle);
        }
        runPhase();
      }, phases[currentPhase].duration);
      return () => clearTimeout(timeout);
    };

    const cleanup = runPhase();
    return cleanup;
  }, [step, breathComplete]);

  const saveAndComplete = useCallback(async () => {
    if (!user) return;
    const primaryFocus = blockedArea;
    const secondaryFocus = getSecondaryFocus(emotions);
    const tools = TOOL_MAP[blockedArea] || TOOL_MAP["Emotional Healing"];

    try {
      await supabase.from("onboarding_responses").insert({
        user_id: user.id,
        emotional_state: emotions,
        blocked_area: blockedArea,
        worth_score: worthScore,
        limiting_belief: limitingBelief,
        new_belief: newBelief,
        abundance_evidence: abundanceEvidence,
        future_self_answer: futureSelfAnswer,
        primary_focus: primaryFocus,
        secondary_focus: secondaryFocus,
        recommended_tools: tools.map((t) => t.id),
      } as any);

      await supabase
        .from("profiles")
        .update({ onboarding_complete: true } as any)
        .eq("user_id", user.id);

      onComplete();
    } catch {
      toast.error("Could not save your responses. Please try again.");
    }
  }, [user, emotions, blockedArea, worthScore, limitingBelief, newBelief, abundanceEvidence, futureSelfAnswer, onComplete]);

  const canAdvance = () => {
    switch (step) {
      case 1: return emotions.length > 0 && blockedArea !== "";
      case 2: return true;
      case 3: return beliefAccepted || !limitingBelief.trim();
      case 4: return breathComplete;
      case 5: return abundanceEvidence.trim().length > 0;
      case 6: return futureSelfAnswer.trim().length > 0;
      case 7: return true;
      default: return true;
    }
  };

  const nextStep = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
    else saveAndComplete();
  };

  const recommendedTools = TOOL_MAP[blockedArea] || TOOL_MAP["Emotional Healing"];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      {/* Progress */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Step {step} of {TOTAL_STEPS}</span>
          <span>~{10 - step} min remaining</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-lg"
        >
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Welcome. Let's start where you are.</h1>
              </div>
              <div>
                <p className="text-muted-foreground mb-4">How are you feeling right now? <span className="text-xs">(select all that apply)</span></p>
                <div className="flex flex-wrap gap-2">
                  {EMOTIONS.map((e) => (
                    <Badge
                      key={e}
                      variant={emotions.includes(e) ? "default" : "outline"}
                      className="cursor-pointer text-sm py-2 px-4 transition-all"
                      onClick={() => toggleEmotion(e)}
                    >
                      {emotions.includes(e) && <Check className="w-3 h-3 mr-1" />}
                      {e}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-muted-foreground mb-4">What area of life feels most blocked right now?</p>
                <div className="grid grid-cols-2 gap-3">
                  {BLOCKED_AREAS.map((a) => (
                    <button
                      key={a.label}
                      onClick={() => setBlockedArea(a.label)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        blockedArea === a.label
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      <span className="text-xl block mb-1">{a.icon}</span>
                      <span className="text-sm font-medium">{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-8 text-center">
              <h1 className="font-serif text-3xl font-bold text-foreground">Your Worth Thermostat</h1>
              <div>
                <p className="text-muted-foreground mb-6">On a scale of 1–10, how worthy do you feel of the life you want right now?</p>
                <div className="px-4">
                  <Slider
                    value={[worthScore]}
                    onValueChange={([v]) => setWorthScore(v)}
                    min={1}
                    max={10}
                    step={1}
                    className="mb-4"
                  />
                  <div className="text-4xl font-bold text-primary">{worthScore}</div>
                </div>
              </div>
              <div className="glass-card p-5 text-left space-y-2">
                <p className="text-sm text-muted-foreground font-medium">A low Worth Thermostat often leads to:</p>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  <li>• Undercharging and financial struggle</li>
                  <li>• Tolerating relationships that drain you</li>
                  <li>• Fear of being seen and stepping up</li>
                  <li>• Self-doubt that overrides your intuition</li>
                </ul>
              </div>
              <p className="text-primary font-medium italic">This app was built to change that. Starting right now.</p>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Let's find what's holding you back.</h1>
                <p className="text-muted-foreground">Complete this sentence honestly:</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2 italic">"I would have the life I want if it weren't for..."</p>
                <Textarea
                  value={limitingBelief}
                  onChange={(e) => setLimitingBelief(e.target.value)}
                  placeholder="I would have the life I want if it weren't for..."
                  className="min-h-[100px]"
                />
                {!newBelief && (
                  <Button
                    onClick={handleReframeBelief}
                    disabled={!limitingBelief.trim() || isReframing}
                    className="w-full mt-4"
                    variant="gold"
                  >
                    {isReframing ? (
                      <><Sparkles className="w-4 h-4 mr-2 animate-spin" /> Reframing...</>
                    ) : (
                      <><Brain className="w-4 h-4 mr-2" /> Reframe My Belief</>
                    )}
                  </Button>
                )}
              </div>
              {newBelief && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="glass-card p-5 space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Old belief:</p>
                      <p className="text-foreground/60 line-through text-sm">{limitingBelief}</p>
                    </div>
                    <div>
                      <p className="text-xs text-primary uppercase tracking-wider mb-1">New belief:</p>
                      <p className="text-foreground font-medium">{newBelief}</p>
                    </div>
                  </div>
                  {!beliefAccepted ? (
                    <Button onClick={() => setBeliefAccepted(true)} variant="gold" className="w-full">
                      <Heart className="w-4 h-4 mr-2" /> I accept this new belief
                    </Button>
                  ) : (
                    <p className="text-center text-primary font-medium">✨ Belief accepted. You're rewriting your story.</p>
                  )}
                </motion.div>
              )}
            </div>
          )}

          {/* STEP 4 — Breathing */}
          {step === 4 && (
            <div className="space-y-8 text-center">
              <h1 className="font-serif text-3xl font-bold text-foreground">Before we go further — let's regulate.</h1>
              <p className="text-muted-foreground">Your nervous system must feel safe before your life can expand. Let's do a quick reset together.</p>
              
              <div className="flex items-center justify-center py-8">
                <motion.div
                  animate={{
                    scale: breathPhase === "inhale" ? 1.6 : breathPhase === "hold" ? [1.6, 1.55, 1.6] : 1,
                    opacity: breathPhase === "exhale" ? 0.6 : 1,
                  }}
                  transition={{
                    duration: breathPhase === "inhale" ? 4 : breathPhase === "hold" ? 4 : 6,
                    ease: "easeInOut",
                  }}
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center shadow-[0_0_60px_rgba(var(--primary),0.3)]"
                >
                  <Wind className="w-10 h-10 text-primary" />
                </motion.div>
              </div>

              {!breathComplete ? (
                <div>
                  <p className="text-lg font-medium text-foreground capitalize">{breathPhase}</p>
                  <p className="text-sm text-muted-foreground">Cycle {breathCycle + 1} of 3</p>
                </div>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-primary font-medium text-lg"
                >
                  Your nervous system just reset. You're ready. ✨
                </motion.p>
              )}
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Let's activate abundance perception.</h1>
                <p className="text-muted-foreground">What is ONE thing in your life right now that proves you are supported?</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {["A friend who shows up for you", "An opportunity at the right time", "A lesson that changed your perspective", "A resource you have access to"].map((s) => (
                  <Badge
                    key={s}
                    variant="outline"
                    className="cursor-pointer text-xs py-1.5 px-3 hover:bg-primary/10 transition-colors"
                    onClick={() => setAbundanceEvidence(s)}
                  >
                    {s}
                  </Badge>
                ))}
              </div>
              <Textarea
                value={abundanceEvidence}
                onChange={(e) => setAbundanceEvidence(e.target.value)}
                placeholder="Write your evidence of support here..."
                className="min-h-[100px]"
              />
            </div>
          )}

          {/* STEP 6 */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Meet the version of you who chose themselves.</h1>
                <p className="text-muted-foreground">What would the version of you who deeply loved themselves do next?</p>
              </div>
              <Textarea
                value={futureSelfAnswer}
                onChange={(e) => setFutureSelfAnswer(e.target.value)}
                placeholder="She would..."
                className="min-h-[120px]"
              />
              <p className="text-center text-primary/80 italic text-sm">
                That version of you is not far away. She is why this app exists.
              </p>
            </div>
          )}

          {/* STEP 7 — Results */}
          {step === 7 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Your Reset Starting Point</h1>
              </div>
              <div className="glass-card p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Primary Focus</p>
                    <p className="font-medium text-foreground">{blockedArea || "Emotional Healing"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Secondary Focus</p>
                    <p className="font-medium text-foreground">{getSecondaryFocus(emotions)}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-3 font-medium">Recommended tools to start with:</p>
                <div className="space-y-2">
                  {recommendedTools.map((tool) => (
                    <div key={tool.id} className="glass-card p-4 flex items-center justify-between">
                      <span className="font-medium text-foreground text-sm">{tool.name}</span>
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="w-full max-w-lg mt-8">
        <Button
          onClick={nextStep}
          disabled={!canAdvance()}
          variant="gold"
          size="lg"
          className="w-full"
        >
          {step === TOTAL_STEPS ? (
            <>Begin My Reset <ArrowRight className="w-5 h-5 ml-2" /></>
          ) : (
            <>Continue <ArrowRight className="w-5 h-5 ml-2" /></>
          )}
        </Button>
        {step === 3 && !limitingBelief.trim() && (
          <button onClick={nextStep} className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Skip this step
          </button>
        )}
      </div>
    </div>
  );
}
