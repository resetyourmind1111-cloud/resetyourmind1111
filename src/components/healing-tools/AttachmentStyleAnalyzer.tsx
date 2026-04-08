import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useHealingToolEntries } from "@/hooks/useHealingToolEntries";
import { motion } from "framer-motion";
import { RotateCcw, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AiButton } from "@/components/AiButton";
import { useUsage } from "@/contexts/UsageContext";

const QUESTIONS = [
  { q: "When my partner is distant, I tend to:", o: ["Feel comfortable giving them space", "Feel anxious and seek reassurance", "Feel relieved and enjoy the freedom", "Feel confused — wanting closeness but also wanting to run"] },
  { q: "In conflict, I usually:", o: ["Stay calm and communicate my needs", "Become emotional and fear the relationship ending", "Shut down or withdraw", "Alternate between reaching out desperately and pulling away"] },
  { q: "When I think about commitment, I feel:", o: ["Excited and secure", "Hopeful but worried they will leave", "Slightly trapped or pressured", "Both drawn to it and terrified of it"] },
  { q: "When someone gets close to me, I:", o: ["Welcome it naturally", "Crave more and more closeness", "Feel the urge to create distance", "Want it intensely but feel unsafe"] },
  { q: "My biggest relationship fear is:", o: ["Not having enough quality time together", "Being abandoned or replaced", "Losing my independence", "Being hurt if I let my guard down"] },
  { q: "When my partner does not text back quickly, I:", o: ["Assume they are busy and move on", "Check my phone repeatedly and worry", "Barely notice or feel relieved", "Swing between worry and telling myself I do not care"] },
  { q: "I feel most loved when:", o: ["We share meaningful experiences together", "My partner constantly shows they choose me", "I have freedom within the relationship", "Someone proves they will not leave despite seeing all of me"] },
  { q: "After an argument, I typically:", o: ["Want to resolve it calmly and reconnect", "Replay it obsessively and fear rejection", "Need significant alone time before reconnecting", "Feel both desperate to fix it and wanting to disappear"] },
  { q: "When I express vulnerability:", o: ["I feel safe doing so with trusted people", "I over-share hoping for reassurance", "I regret it almost immediately", "I test people to see if they can handle it"] },
  { q: "My relationship pattern tends to be:", o: ["Stable and mutually supportive", "Intense highs and painful lows", "Keeping people at arm's length", "Chaotic push-pull dynamics"] },
  { q: "When a relationship ends, I:", o: ["Grieve healthily and eventually move on", "Feel devastated and obsess over what went wrong", "Move on quickly and feel emotionally flat", "Feel both shattered and strangely relieved"] },
  { q: "I believe I am:", o: ["Worthy of consistent love", "Only lovable when I am performing or pleasing", "Better off relying on myself", "Fundamentally broken but desperate for connection"] },
  { q: "Trust in relationships feels:", o: ["Natural and built over time", "Fragile — always waiting for the other shoe to drop", "Unnecessary — I trust myself most", "Nearly impossible but deeply desired"] },
  { q: "When someone sets a boundary with me, I:", o: ["Respect it and feel secure", "Feel rejected and panicked", "Feel relieved — less pressure", "Feel both rejected and grateful at the same time"] },
  { q: "My parents or caregivers were:", o: ["Consistently warm and available", "Inconsistent — sometimes loving, sometimes unavailable", "Emotionally distant or dismissive", "Frightening or unpredictable"] },
  { q: "I handle jealousy by:", o: ["Talking about it openly with my partner", "Becoming anxious and seeking constant reassurance", "Pretending I do not feel it", "Oscillating between confrontation and withdrawal"] },
  { q: "My ideal relationship looks like:", o: ["Deep connection with healthy independence", "Complete emotional fusion and constant togetherness", "Companionship with lots of personal space", "Intense passion but I am not sure it can be safe"] },
  { q: "When someone depends on me emotionally, I:", o: ["Feel honored and capable", "Feel needed and more secure", "Feel overwhelmed and want to escape", "Feel both drawn in and suffocated"] },
  { q: "I show love primarily by:", o: ["Being present and communicating openly", "Giving everything and hoping it is enough", "Acts of service from a comfortable distance", "Unpredictably — sometimes intensely, sometimes withdrawing"] },
  { q: "If I could change one thing about how I love, it would be:", o: ["Nothing major — I feel generally secure", "Needing less reassurance", "Being able to let people in more", "Feeling safe enough to stay consistent"] },
];

const STYLES = ["Secure", "Anxious", "Avoidant", "Disorganized"];
const STYLE_INFO: Record<string, { color: string; description: string; developed: string; showsUp: string; healing: string[]; lookFor: string[]; greenFlags: string[]; redFlags: string[] }> = {
  Secure: {
    color: "text-accent",
    description: "Comfortable with closeness and autonomy equally. You trust others and yourself in relationships.",
    developed: "Consistent, responsive caregiving in childhood created a stable internal model of love.",
    showsUp: "You communicate needs clearly, handle conflict calmly, and maintain healthy independence within relationships.",
    healing: ["Continue nurturing your emotional awareness", "Model healthy relating for others", "Be patient with partners who have insecure styles"],
    lookFor: ["Someone who communicates openly", "A partner who respects both closeness and space", "Emotional maturity and self-awareness"],
    greenFlags: ["They communicate directly about feelings", "They give you space without withdrawing love", "They take accountability for mistakes"],
    redFlags: ["Love-bombing or excessive intensity early on", "Inability to be alone", "Dismissing your emotions as too much"],
  },
  Anxious: {
    color: "text-rose-400",
    description: "Fears abandonment, craves reassurance and closeness. Your love is deep but your fear is deeper.",
    developed: "Inconsistent caregiving created a belief that love is unreliable and you must work to keep it.",
    showsUp: "You over-give, people-please, monitor for signs of rejection, and struggle with self-worth outside relationships.",
    healing: ["Build a relationship with yourself first", "Practice sitting with discomfort without seeking reassurance", "Journal your triggers and patterns"],
    lookFor: ["Consistency over intensity", "Someone who follows through on commitments", "A partner who can hold space for your emotions without being consumed by them"],
    greenFlags: ["They text back consistently without games", "They show up when they say they will", "They welcome your emotions without judgment"],
    redFlags: ["Hot and cold behavior that activates your anxiety", "Emotional unavailability that feels like a challenge to overcome", "Intensity that masks instability"],
  },
  Avoidant: {
    color: "text-blue-400",
    description: "Fears engulfment, values independence over intimacy. You protect yourself by keeping distance.",
    developed: "Emotionally distant or dismissive caregiving taught you that depending on others leads to disappointment.",
    showsUp: "You withdraw when things get close, intellectualize emotions, and feel suffocated by partners' needs.",
    healing: ["Practice naming your emotions daily", "Challenge the belief that needing someone is weakness", "Stay present when you feel the urge to withdraw"],
    lookFor: ["Someone patient who does not chase", "A partner who models vulnerability safely", "Someone with their own life who does not need to merge"],
    greenFlags: ["They respect your need for space without taking it personally", "They are patient with your process", "They have their own interests and identity"],
    redFlags: ["Clinginess that confirms your fear of engulfment", "Dramatic emotional expressions that overwhelm you", "Pressure to commit before you feel ready"],
  },
  Disorganized: {
    color: "text-purple-400",
    description: "Fears both abandonment and closeness simultaneously — often rooted in trauma.",
    developed: "Caregivers who were both a source of comfort and fear created conflicting impulses around attachment.",
    showsUp: "Push-pull dynamics, testing partners, sabotaging good things, and intense emotional swings in relationships.",
    healing: ["Trauma-informed therapy is essential", "Build safety with predictable, calm relationships", "Practice grounding techniques when activated"],
    lookFor: ["Someone extraordinarily patient and consistent", "A partner who does not take your push-pull personally", "Someone who understands trauma without enabling patterns"],
    greenFlags: ["They stay calm during your storms", "They do not punish you for pulling away", "They are consistent without being controlling"],
    redFlags: ["Chaos that feels like passion", "Someone who mirrors your push-pull", "Intensity that retraumatizes rather than heals"],
  },
};

export default function AttachmentStyleAnalyzer() {
  const { entries, saveEntry } = useHealingToolEntries("attachment-style-analyzer");
  const { isLimitReached, incrementUsage } = useUsage();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(20).fill(-1));
  const [started, setStarted] = useState(false);
  const [isInsighting, setIsInsighting] = useState(false);
  const [aiData, setAiData] = useState<{ personalInsight: string; coreWound: string; dailyPractice: string; affirmation: string } | null>(null);

  const existingResult = useMemo(() => entries.find((e: any) => e.entry_data.type === "result"), [entries]);

  const calculateScores = () => {
    const scores = [0, 0, 0, 0]; // Secure, Anxious, Avoidant, Disorganized
    answers.forEach((a) => { if (a >= 0) scores[a]++; });
    return scores;
  };

  const handleFinish = () => {
    const scores = calculateScores();
    const maxScore = Math.max(...scores);
    const primaryIdx = scores.indexOf(maxScore);
    const sortedScores = [...scores].sort((a, b) => b - a);
    const secondaryIdx = sortedScores[1] >= 4 ? scores.indexOf(sortedScores[1], sortedScores[1] === sortedScores[0] ? primaryIdx + 1 : 0) : -1;

    saveEntry.mutate(
      {
        type: "result",
        scores,
        primary: STYLES[primaryIdx],
        secondary: secondaryIdx >= 0 && secondaryIdx !== primaryIdx ? STYLES[secondaryIdx] : null,
        completedAt: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          setStarted(false);
        },
      }
    );
  };

  const handleAiInsight = async (d: any) => {
    if (isLimitReached) { toast.error("Daily limit reached — resets at midnight"); return; }
    const allowed = await incrementUsage(); if (!allowed) return;
    setIsInsighting(true);
    try {
      const { data, error } = await supabase.functions.invoke("attachment-insight", {
        body: { primary: d.primary, secondary: d.secondary, scores: d.scores },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setAiData(data);
      toast.success("Personalized insight ready — sit with this");
    } catch (err: any) {
      console.error("Attachment insight error:", err);
      toast.error(err.message || "Failed to generate insight. Please try again.");
    } finally {
      setIsInsighting(false);
    }
  };

  if (existingResult && !started) {
    const d = existingResult.entry_data as any;
    const info = STYLE_INFO[d.primary];
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 flex-wrap">
          <div className={`bg-accent/20 ${info.color} px-3 py-1 rounded-full text-sm font-semibold`}>
            Primary: {d.primary}
          </div>
          {d.secondary && (
            <div className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm">
              Secondary: {d.secondary}
            </div>
          )}
          <Button variant="outline" size="sm" onClick={() => { setStarted(true); setStep(0); setAnswers(Array(20).fill(-1)); setAiData(null); }}>
            <RotateCcw className="w-3 h-3 mr-1" /> Retake
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {STYLES.map((s, i) => (
            <Card key={s} className={`glass-card p-3 text-center ${d.primary === s ? "border-accent/50" : ""}`}>
              <p className="text-xl font-serif text-accent">{d.scores[i]}</p>
              <p className="text-xs text-muted-foreground">{s}</p>
            </Card>
          ))}
        </div>

        {/* AI Insight Button */}
        <Button
          onClick={() => handleAiInsight(d)}
          disabled={isInsighting}
          variant="outline"
          className="w-full border-primary/30 text-primary hover:bg-primary/10"
        >
          {isInsighting ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating Personalized Insight...</>
          ) : (
            <><Sparkles className="w-4 h-4 mr-2" /> Get My Personalized AI Insight</>
          )}
        </Button>

        {aiData && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="glass-card border-accent/30">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-serif text-lg text-accent">✨ Your Personalized Insight</h3>
                <p className="text-foreground/80 italic">{aiData.personalInsight}</p>
                <div>
                  <h4 className="font-semibold text-foreground text-sm mb-1">Core Wound</h4>
                  <p className="text-sm text-muted-foreground">{aiData.coreWound}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm mb-1">Daily Healing Practice</h4>
                  <p className="text-sm text-muted-foreground">{aiData.dailyPractice}</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <p className="text-accent italic font-semibold">"{aiData.affirmation}"</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Card className="glass-card">
          <CardContent className="p-6 space-y-4">
            <h3 className={`font-serif text-xl ${info.color}`}>{d.primary} Attachment Style</h3>
            <p className="text-foreground/80">{info.description}</p>
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-1">How It Developed</h4>
              <p className="text-sm text-muted-foreground">{info.developed}</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-1">How It Shows Up</h4>
              <p className="text-sm text-muted-foreground">{info.showsUp}</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-1">Healing Practices</h4>
              <ul className="text-sm text-muted-foreground space-y-1">{info.healing.map((h, i) => <li key={i}>• {h}</li>)}</ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-1">What to Look For in a Partner</h4>
              <ul className="text-sm text-muted-foreground space-y-1">{info.lookFor.map((l, i) => <li key={i}>• {l}</li>)}</ul>
            </div>
            <div>
              <h4 className="font-semibold text-accent text-sm mb-1">🟢 Green Flags (may feel unfamiliar but are healthy)</h4>
              <ul className="text-sm text-muted-foreground space-y-1">{info.greenFlags.map((g, i) => <li key={i}>• {g}</li>)}</ul>
            </div>
            <div>
              <h4 className="font-semibold text-destructive text-sm mb-1">🔴 Red Flags (may feel familiar but are harmful)</h4>
              <ul className="text-sm text-muted-foreground space-y-1">{info.redFlags.map((r, i) => <li key={i}>• {r}</li>)}</ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="text-center py-12 max-w-lg mx-auto">
        <p className="text-muted-foreground mb-4">Answer 20 questions to discover your primary attachment style and get personalized healing guidance.</p>
        <Button onClick={() => setStarted(true)} className="bg-accent text-accent-foreground">Begin Assessment</Button>
      </div>
    );
  }

  if (step >= 20) {
    return (
      <div className="text-center py-12 max-w-lg mx-auto space-y-4">
        <h3 className="font-serif text-xl text-foreground">Assessment Complete</h3>
        <p className="text-muted-foreground">Ready to see your results?</p>
        <div className="flex gap-3 justify-center">
          <Button variant="ghost" onClick={() => setStep(19)}>Back</Button>
          <Button onClick={handleFinish} disabled={saveEntry.isPending} className="bg-accent text-accent-foreground">
            {saveEntry.isPending ? "Calculating..." : "See My Results"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Progress value={((step + 1) / 20) * 100} className="h-2" />
      <p className="text-xs text-muted-foreground text-center">Question {step + 1} of 20</p>

      <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
        <Card className="glass-card">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-serif text-lg text-foreground">{QUESTIONS[step].q}</h3>
            <div className="space-y-2">
              {QUESTIONS[step].o.map((option, i) => (
                <button
                  key={i}
                  onClick={() => { const a = [...answers]; a[step] = i; setAnswers(a); }}
                  className={`w-full text-left p-3 rounded-lg border text-sm transition-colors ${answers[step] === i ? "border-accent bg-accent/10 text-accent" : "border-border text-foreground/70 hover:border-accent/30"}`}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="flex justify-between pt-2">
              <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
              <Button onClick={() => setStep(step + 1)} disabled={answers[step] === -1} className="bg-accent text-accent-foreground">
                {step === 19 ? "Finish" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
