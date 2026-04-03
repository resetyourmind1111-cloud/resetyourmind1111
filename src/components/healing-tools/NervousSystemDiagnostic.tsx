import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Loader2 } from "lucide-react";

type NervousState = "fight" | "flight" | "freeze" | "fawn";

interface Question {
  stem: string;
  options: { text: string; state: NervousState }[];
}

const questions: Question[] = [
  {
    stem: "my body feels...",
    options: [
      { text: "Tense, hot, and ready to explode — like there's too much energy with nowhere to go", state: "fight" },
      { text: "Restless and desperate to escape — like I need to run, hide, or disappear", state: "flight" },
      { text: "Heavy, numb, and completely flat — like I've gone somewhere far away inside myself", state: "freeze" },
      { text: "Anxious to make sure everyone around me is okay — like I can't relax until I know they're fine", state: "fawn" },
    ],
  },
  {
    stem: "my thoughts are...",
    options: [
      { text: "Racing, angry, and looking for something to fight or fix", state: "fight" },
      { text: "Spinning, catastrophizing, and scanning for the next threat", state: "flight" },
      { text: "Blank, foggy, or just... absent — I can't think clearly", state: "freeze" },
      { text: "Focused entirely on others — what they need, what they think, how to keep the peace", state: "fawn" },
    ],
  },
  {
    stem: "my jaw and shoulders feel...",
    options: [
      { text: "Clenched and braced — like I'm holding back something big", state: "fight" },
      { text: "Raised and tight — like I'm already bracing for impact", state: "flight" },
      { text: "Heavy and collapsed — like I don't have the energy to hold them up", state: "freeze" },
      { text: "Stiff from holding a smile I don't actually feel", state: "fawn" },
    ],
  },
  {
    stem: "what I most want to do is...",
    options: [
      { text: "Confront someone, argue, or get things done — the anger needs somewhere to go", state: "fight" },
      { text: "Cancel everything, close all the tabs, and just disappear for a while", state: "flight" },
      { text: "Lie down and stare at the ceiling — I can't make myself do anything", state: "freeze" },
      { text: "Check on everyone else first — I'll deal with myself after they're okay", state: "fawn" },
    ],
  },
  {
    stem: "my breathing is...",
    options: [
      { text: "Short and sharp — like I'm ready to charge", state: "fight" },
      { text: "Fast and shallow — like there's never quite enough air", state: "flight" },
      { text: "Slow and barely there — like I'm holding my breath without realizing it", state: "freeze" },
      { text: "Controlled and careful — like I'm managing how I appear to others", state: "fawn" },
    ],
  },
  {
    stem: 'if someone asked how I was doing, I would...',
    options: [
      { text: "Snap, vent, or give them more than they bargained for", state: "fight" },
      { text: 'Say "fine" while desperately wanting to escape the conversation', state: "flight" },
      { text: 'Say "I don\'t know" because I genuinely can\'t access how I feel', state: "freeze" },
      { text: "Ask how they are doing and redirect away from myself entirely", state: "fawn" },
    ],
  },
  {
    stem: "my stomach feels...",
    options: [
      { text: "Knotted and burning — like something is eating at me from the inside", state: "fight" },
      { text: "Churning and unsettled — like dread I can't name", state: "flight" },
      { text: "Empty and disconnected — like I can't feel it at all", state: "freeze" },
      { text: "Tight with the pressure of keeping everyone around me okay", state: "fawn" },
    ],
  },
  {
    stem: "the word that fits me best is...",
    options: [
      { text: "Reactive", state: "fight" },
      { text: "Overwhelmed", state: "flight" },
      { text: "Disconnected", state: "freeze" },
      { text: "Invisible", state: "fawn" },
    ],
  },
  {
    stem: "my relationship with my own needs feels...",
    options: [
      { text: "Irrelevant — I'm too activated to even think about needs", state: "fight" },
      { text: "Terrifying — my needs feel like too much for anyone to handle", state: "flight" },
      { text: "Inaccessible — I can't even remember what I need", state: "freeze" },
      { text: "Secondary — everyone else's needs feel more urgent and real than mine", state: "fawn" },
    ],
  },
  {
    stem: "what triggered this feeling was probably...",
    options: [
      { text: "A conflict, injustice, or situation where I felt disrespected or unheard", state: "fight" },
      { text: "Too many demands, an impossible deadline, or a situation that felt out of control", state: "flight" },
      { text: "Emotional exhaustion, a loss, shock, or prolonged stress with no relief", state: "freeze" },
      { text: "A relationship dynamic where I felt responsible for someone else's emotions", state: "fawn" },
    ],
  },
];

const stateData: Record<NervousState, {
  label: string;
  emoji: string;
  color: string;
  borderColor: string;
  title: string;
  meaning: string;
  feeling: string;
  trigger: string;
  notThis: string;
  bodyNeeds: string;
  resetPlan: { step: string; detail: string; toolRoute?: string; toolLabel?: string }[];
}> = {
  fight: {
    label: "Fight",
    emoji: "🔥",
    color: "text-[hsl(345,45%,62%)]",
    borderColor: "border-[hsl(345,45%,62%)]",
    title: "Your Nervous System Is In Fight",
    meaning: "Your body is flooded with activation energy — adrenaline, cortisol, heat. You are wired for confrontation or action because your nervous system has detected a threat, real or perceived. This is not a character flaw. This is biology doing exactly what it was designed to do. The problem is when the threat passes but the activation stays.",
    feeling: "Anger just beneath the surface. Irritability at small things. A need to confront, argue, control, or fix. Tension in your jaw, neck, and chest. Difficulty sitting still or slowing down. A sense of injustice that won't quiet down.",
    trigger: "A conflict. A boundary violation. Feeling dismissed, disrespected, or unheard. Witnessing injustice. A situation where you felt powerless and your body responded by mobilizing for a fight you may not be able to have.",
    notThis: "This is not you being difficult. This is not you overreacting. This is your body protecting you. It just needs help completing the stress cycle so the activation can move through and out.",
    bodyNeeds: "Your nervous system needs to discharge the activation energy — to move it through the body and out. Stillness will not help right now. Movement, breath, and expression will.",
    resetPlan: [
      { step: "Right Now (5 minutes)", detail: 'Go to Somatic Breathing → Select "Physiological Sigh" or "Box Breathing". These patterns specifically down-regulate fight activation.', toolRoute: "/healing-tools/somatic-breathing", toolLabel: "Open Somatic Breathing" },
      { step: "Move the Energy (10 minutes)", detail: "Physical discharge: shake your hands vigorously for 60 seconds, do 10 jumping jacks, or press your palms hard against a wall and push for 30 seconds. This completes the stress cycle your body started." },
      { step: "Name What Happened", detail: "Go to Emotional Trigger Tracker → Log what triggered this state. Name the emotion, the situation, and what your body experienced. Naming reduces activation.", toolRoute: "/healing-tools/emotional-trigger-tracker", toolLabel: "Open Trigger Tracker" },
      { step: "Address the Root", detail: "If connected to a boundary violation → Boundary Builder. If connected to a relationship pattern → Shadow Work Library. If connected to a limiting belief about your power → Limiting Belief Rewriter.", toolRoute: "/healing-tools/boundary-builder", toolLabel: "Open Boundary Builder" },
      { step: "When You're Calmer", detail: "Return here and journal: What was my nervous system protecting me from? Was the threat real or a pattern from the past? What do I actually need in this situation?" },
    ],
  },
  flight: {
    label: "Flight",
    emoji: "🌪️",
    color: "text-accent",
    borderColor: "border-accent",
    title: "Your Nervous System Is In Flight",
    meaning: "Your body wants to escape. The threat feels too big to fight, so your nervous system is mobilizing to flee — physically, mentally, or emotionally. This shows up as anxiety, overwhelm, the urge to cancel everything, close all tabs, disappear, or simply run from your own life for a while.",
    feeling: "Racing thoughts you can't slow down. The urge to avoid, procrastinate, or cancel. Shallow breathing and a tight chest. Scanning for the next thing that could go wrong. The sense that everything is too much and you need out.",
    trigger: "Overwhelm from too many demands. A situation that felt out of control. Anticipatory anxiety about something coming. A buildup of smaller stressors that finally tipped into too much.",
    notThis: "This is not weakness. This is not you failing at life. This is your nervous system working hard to protect you from something that feels bigger than your current resources. You just need to resource yourself.",
    bodyNeeds: "Your nervous system needs to slow down and feel safe. It needs signals that the threat has passed and that you are okay right now, in this moment. Grounding and breath are your most powerful tools.",
    resetPlan: [
      { step: "Right Now (5 minutes)", detail: 'Go to Somatic Breathing → Select "4-7-8 Breathing" or "Extended Exhale". The extended exhale directly activates the parasympathetic nervous system.', toolRoute: "/healing-tools/somatic-breathing", toolLabel: "Open Somatic Breathing" },
      { step: "Ground Your Body", detail: "Feel five things you can physically touch right now. Name them out loud. Press your feet flat into the floor. This brings you back into your body and out of the anxious spiral." },
      { step: "Reduce the Load", detail: "Write down everything on your mental load — every to-do, worry, and obligation. Get it out of your head and onto paper. Your nervous system is trying to hold all of it at once." },
      { step: "Address the Root", detail: "If connected to feeling overwhelmed by others' needs → Boundary Builder. If connected to anxiety about finances → Money Story Audit. If connected to avoidance → Shadow Work Library.", toolRoute: "/healing-tools/money-story-audit", toolLabel: "Open Money Story Audit" },
      { step: "When You're Calmer", detail: "Return here and journal: What am I running from? Is the threat as big as my nervous system believes? What would it mean to stay — with myself, with this feeling?" },
    ],
  },
  freeze: {
    label: "Freeze",
    emoji: "🧊",
    color: "text-[hsl(213,18%,60%)]",
    borderColor: "border-[hsl(213,18%,60%)]",
    title: "Your Nervous System Is In Freeze",
    meaning: "Your nervous system has gone into shutdown. When a threat feels too big to fight and impossible to flee, the body's last resort is to freeze — to go still, numb, and distant. This is the oldest survival response. It is also the most misunderstood, because from the outside it can look like laziness, depression, or not caring. It is none of those things.",
    feeling: "Numbness or emotional flatness. Difficulty feeling anything at all. Heavy limbs and no motivation. Disconnection from your body, emotions, and people. The sense that you are watching your life from behind glass. An inability to make decisions.",
    trigger: "Prolonged stress without relief. Emotional exhaustion. A shock, loss, or overwhelming experience. A buildup of unfelt feelings that eventually caused the system to shut down.",
    notThis: "This is not depression (though they can coexist). This is not laziness. This is not you giving up. This is your body's emergency brake — it engaged because you needed protection. Now it needs help releasing slowly and safely.",
    bodyNeeds: "Your nervous system needs gentle, slow activation — not intensity. Warmth, gentle movement, and small doses of sensation will begin to thaw the freeze without overwhelming a system already at capacity.",
    resetPlan: [
      { step: "Right Now (5 minutes)", detail: 'Go to Somatic Breathing → Select "Humming Breath" or "Belly Breathing". The vibration of humming directly stimulates the vagus nerve.', toolRoute: "/healing-tools/somatic-breathing", toolLabel: "Open Somatic Breathing" },
      { step: "Warm Your Body", detail: "Make a warm drink. Take a warm shower. Place a hand on your heart and one on your belly. Warmth and gentle touch signal safety to a frozen nervous system." },
      { step: "One Small Movement", detail: "You don't need to do much. Wiggle your fingers. Roll your shoulders. Stand up and stretch. One small physical action begins to break the immobility." },
      { step: "Address the Root", detail: "If connected to emotional exhaustion → Inner Child Healing. If connected to unprocessed grief → Shadow Work Library. If connected to shutdown in relationships → Attachment Style Analyzer. If connected to stored trauma → Body Map Journal.", toolRoute: "/healing-tools/inner-child-healing", toolLabel: "Open Inner Child Healing" },
      { step: "When You're Thawing", detail: "Return here and journal: What has been too much for me lately? What have I been carrying without support? What would it feel like to put some of this down?" },
    ],
  },
  fawn: {
    label: "Fawn",
    emoji: "🤍",
    color: "text-[hsl(138,16%,55%)]",
    borderColor: "border-[hsl(138,16%,55%)]",
    title: "Your Nervous System Is In Fawn",
    meaning: "Fawn is the fourth and most socially invisible stress response. Instead of fighting, fleeing, or freezing, your nervous system learned to survive by pleasing — by becoming whatever the person or situation needed you to be. Fawn looks like helpfulness, agreeableness, and selflessness. But underneath it is a nervous system that learned your safety depended on managing other people's emotions.",
    feeling: "Hyperawareness of everyone else's emotions while being disconnected from your own. The compulsive need to fix, help, smooth over, or make peace. Difficulty knowing what you actually want. Resentment that lives underneath a smiling face. The exhaustion of being endlessly available.",
    trigger: "A relationship dynamic where someone's emotions felt threatening or overwhelming. A situation where conflict felt dangerous. An environment where your value was contingent on your usefulness to others.",
    notThis: "This is not who you are. This is what you learned in order to survive. The most giving, empathic women are often the ones whose nervous systems learned earliest that self-erasure was the price of safety. You are not too giving. You were taught that giving was the only safe option.",
    bodyNeeds: "Your nervous system needs to come back to you. It needs to practice locating your own needs, feelings, and desires — separate from everyone else's. This is not selfish. This is the healing.",
    resetPlan: [
      { step: "Right Now (5 minutes)", detail: 'Go to Somatic Breathing → Select "Coherence Breathing" or "Self-Compassion Breath". Place both hands on your own heart. Breathe for yourself.', toolRoute: "/healing-tools/somatic-breathing", toolLabel: "Open Somatic Breathing" },
      { step: "Come Back to You", detail: "Ask yourself three questions and write the answers: What am I feeling right now? What do I need right now? What do I want right now — just for me?" },
      { step: "Practice One Small No", detail: "Identify one small thing you're doing because you feel you have to — not because you want to. Say no to it, delay it, or simply acknowledge you resent it." },
      { step: "Address the Root", detail: "If connected to people-pleasing → Boundary Builder. If connected to the mother wound → Inner Child Healing. If connected to attachment patterns → Attachment Style Analyzer. If connected to losing identity → Values Clarity Tool.", toolRoute: "/healing-tools/boundary-builder", toolLabel: "Open Boundary Builder" },
      { step: "When You're Back in Your Body", detail: "Return here and journal: Whose emotions have I been managing today instead of my own? What am I afraid would happen if I stopped? What do I need that I haven't asked for?" },
    ],
  },
};

type Screen = "entry" | "quiz" | "results" | "save";

export default function NervousSystemDiagnostic() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("entry");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<NervousState[]>([]);
  const [primaryState, setPrimaryState] = useState<NervousState | null>(null);
  const [secondaryState, setSecondaryState] = useState<NervousState | null>(null);
  const [journalText, setJournalText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiGuide, setAiGuide] = useState<any>(null);

  const { data: history = [] } = useQuery({
    queryKey: ["nervous-system-checkins", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nervous_system_checkins" as any)
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data as any[];
    },
    enabled: !!user,
  });

  const handleAnswer = useCallback((state: NervousState) => {
    const newAnswers = [...answers, state];
    setAnswers(newAnswers);

    if (currentQ < 9) {
      setCurrentQ(currentQ + 1);
    } else {
      // Score
      const counts: Record<NervousState, number> = { fight: 0, flight: 0, freeze: 0, fawn: 0 };
      newAnswers.forEach((s) => counts[s]++);
      const sorted = (Object.entries(counts) as [NervousState, number][]).sort((a, b) => b[1] - a[1]);
      setPrimaryState(sorted[0][0]);
      if (sorted[0][1] === sorted[1][1]) {
        setSecondaryState(sorted[1][0]);
      }
      setScreen("results");
    }
  }, [answers, currentQ]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const counts: Record<NervousState, number> = { fight: 0, flight: 0, freeze: 0, fawn: 0 };
    answers.forEach((s) => counts[s]++);

    const { error } = await supabase.from("nervous_system_checkins" as any).insert({
      user_id: user.id,
      primary_state: primaryState,
      secondary_state: secondaryState || null,
      scores_json: counts,
      journal_entry: journalText || null,
      reset_completed: false,
    } as any);

    setSaving(false);
    if (error) {
      toast.error("Failed to save check-in");
    } else {
      toast.success("Check-in saved");
      setSaved(true);
    }
  };

  const resetTool = () => {
    setScreen("entry");
    setCurrentQ(0);
    setAnswers([]);
    setPrimaryState(null);
    setSecondaryState(null);
    setJournalText("");
    setSaved(false);
  };

  // SCREEN 1: Entry
  if (screen === "entry") {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 md:p-12 text-center border border-accent/30"
          style={{ boxShadow: "0 0 30px hsl(var(--accent) / 0.15)" }}
        >
          <div className="text-5xl mb-6">🧠</div>
          <h2 className="font-serif text-2xl md:text-3xl text-accent mb-4">
            How Is Your Nervous System Right Now?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto">
            Before you reach for a tool, let's find out what your body actually needs. This 10-question check-in will identify your current nervous system state and guide you to the exact reset your body is asking for.
          </p>
          <Button variant="gold" size="lg" onClick={() => setScreen("quiz")}>
            Begin Check-In
          </Button>
          <p className="text-xs text-muted-foreground mt-4">Takes about 2 minutes</p>

          {history.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border/30">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Recent Check-Ins</h3>
              <div className="space-y-2">
                {history.slice(0, 3).map((h: any) => (
                  <div key={h.id} className="flex items-center justify-between text-sm bg-muted/30 rounded-lg px-4 py-2">
                    <span className="capitalize">
                      {stateData[h.primary_state as NervousState]?.emoji} {h.primary_state}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {new Date(h.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // SCREEN 2: Quiz
  if (screen === "quiz") {
    const q = questions[currentQ];
    return (
      <div className="max-w-2xl mx-auto">
        <Progress value={((currentQ + 1) / 10) * 100} className="mb-6 h-2" />
        <p className="text-xs text-muted-foreground text-center mb-2">
          Question {currentQ + 1} of 10
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-6 md:p-8"
          >
            <h3 className="font-serif text-lg md:text-xl text-accent mb-6">
              Right now, in this moment, {q.stem}
            </h3>
            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt.state)}
                  className="w-full text-left p-4 rounded-xl border border-border/40 bg-card/50 hover:border-accent/60 hover:bg-accent/5 transition-all duration-200 text-sm leading-relaxed text-foreground/90"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // SCREEN 3: Results
  if (screen === "results" && primaryState) {
    const data = stateData[primaryState];
    const secondary = secondaryState ? stateData[secondaryState] : null;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`glass-card p-8 md:p-10 border ${data.borderColor}`}
          style={{ boxShadow: "0 0 40px hsl(var(--accent) / 0.12)" }}
        >
          <div className="text-center mb-8">
            <span className="text-5xl block mb-3">{data.emoji}</span>
            <h2 className={`font-serif text-2xl md:text-3xl ${data.color} mb-2`}>
              {data.title}
            </h2>
            {secondary && (
              <p className="text-sm text-muted-foreground">
                With elements of {secondary.emoji} {secondary.label} state
              </p>
            )}
          </div>

          <div className="space-y-6 text-sm leading-relaxed">
            <div>
              <h4 className="font-semibold text-foreground mb-2">What this means:</h4>
              <p className="text-muted-foreground">{data.meaning}</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">You might be feeling:</h4>
              <p className="text-muted-foreground">{data.feeling}</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">What likely triggered this:</h4>
              <p className="text-muted-foreground">{data.trigger}</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">What this is NOT:</h4>
              <p className="text-muted-foreground italic">{data.notThis}</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">What your body needs right now:</h4>
              <p className="text-muted-foreground">{data.bodyNeeds}</p>
            </div>
          </div>
        </motion.div>

        {/* Reset Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8"
        >
          <h3 className="font-serif text-xl text-accent mb-6">
            Your Reset Plan — {data.label} State
          </h3>
          <div className="space-y-5">
            {data.resetPlan.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground text-sm mb-1">Step {i + 1} — {step.step}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.detail}</p>
                  {step.toolRoute && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => navigate(step.toolRoute!)}
                    >
                      {step.toolLabel}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex justify-center">
          <Button variant="gold" size="lg" onClick={() => setScreen("save")}>
            Save My Reset Plan & Journal
          </Button>
        </div>
      </div>
    );
  }

  // SCREEN 4: Save + Track
  if (screen === "save" && primaryState) {
    const data = stateData[primaryState];
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          <h3 className="font-serif text-xl text-accent mb-4">Journal About This</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Today my nervous system was in <span className={`font-semibold ${data.color}`}>{data.label}</span> state. What I noticed was...
          </p>
          <Textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="Write freely about what you noticed, felt, and experienced..."
            className="min-h-[150px] bg-background/50"
          />
        </motion.div>

        <div className="flex flex-col gap-3">
          <Button
            variant="gold"
            size="lg"
            onClick={handleSave}
            disabled={saving || saved}
            className="w-full"
          >
            {saved ? "✓ Check-In Saved" : saving ? "Saving..." : "Save My Check-In"}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/healing-tools/somatic-breathing")}
            className="w-full"
          >
            🌬️ Go to Somatic Breathing
          </Button>
          <button
            onClick={resetTool}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
          >
            Retake in 30 Minutes →
          </button>
        </div>
      </div>
    );
  }

  return null;
}
