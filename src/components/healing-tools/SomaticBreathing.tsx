import { useState, useEffect, useRef } from "react";
import { useHealingToolEntries } from "@/hooks/useHealingToolEntries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Play, Pause, RotateCcw, Trash2, Sparkles, Loader2, Wind, Flame, Moon, Sun, Heart, Zap, Shield, Leaf, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { playPhaseTone, playCompletionTone } from "@/lib/breathingAudio";

const exercises = [
  { id: "box", name: "Box Breathing", inhale: 4, hold1: 4, exhale: 4, hold2: 4, icon: "box", category: "Calm", description: "Equal counts for calm focus. Navy SEALs use this to stay composed under pressure." },
  { id: "478", name: "4-7-8 Breathing", inhale: 4, hold1: 7, exhale: 8, hold2: 0, icon: "moon", category: "Sleep", description: "Dr. Andrew Weil's technique for deep relaxation and falling asleep." },
  { id: "physiological-sigh", name: "Physiological Sigh", inhale: 3, hold1: 0, exhale: 6, hold2: 2, icon: "wind", category: "Reset", description: "Double inhale through nose, long exhale through mouth. Fastest way to calm your nervous system." },
  { id: "energizing", name: "Energizing Breath", inhale: 2, hold1: 0, exhale: 2, hold2: 0, icon: "zap", category: "Energy", description: "Rapid rhythmic breathing to wake up your body and increase alertness." },
  { id: "coherent", name: "Coherent Breathing", inhale: 5, hold1: 0, exhale: 5, hold2: 0, icon: "heart", category: "Heart", description: "5-5 rhythm synchronizes heart rate variability. Brings heart and brain into coherence." },
  { id: "vagal-tone", name: "Vagal Toning", inhale: 4, hold1: 0, exhale: 8, hold2: 0, icon: "shield", category: "Heal", description: "Extended exhale activates the vagus nerve. Signals safety to your entire nervous system." },
  { id: "wim-hof", name: "Wim Hof Method", inhale: 2, hold1: 0, exhale: 2, hold2: 0, icon: "flame", category: "Power", description: "Power breathing with 30 rapid breaths then breath hold. Builds resilience and inner fire." },
  { id: "alternate-nostril", name: "Alternate Nostril", inhale: 4, hold1: 2, exhale: 4, hold2: 2, icon: "leaf", category: "Balance", description: "Nadi Shodhana — balances left and right brain hemispheres. Ancient yogic practice for inner harmony." },
  { id: "resonance", name: "Resonance Breathing", inhale: 6, hold1: 0, exhale: 6, hold2: 0, icon: "sun", category: "Flow", description: "6 breaths per minute. Maximizes heart rate variability and emotional resilience." },
  { id: "lions-breath", name: "Lion's Breath", inhale: 4, hold1: 2, exhale: 5, hold2: 0, icon: "flame", category: "Release", description: "Deep inhale, then exhale with open mouth and tongue out. Releases tension in face, jaw, and throat." },
];

const categoryIcons: Record<string, React.ReactNode> = {
  Calm: <Shield className="w-3.5 h-3.5" />,
  Sleep: <Moon className="w-3.5 h-3.5" />,
  Reset: <Wind className="w-3.5 h-3.5" />,
  Energy: <Zap className="w-3.5 h-3.5" />,
  Heart: <Heart className="w-3.5 h-3.5" />,
  Heal: <Shield className="w-3.5 h-3.5" />,
  Power: <Flame className="w-3.5 h-3.5" />,
  Balance: <Leaf className="w-3.5 h-3.5" />,
  Flow: <Sun className="w-3.5 h-3.5" />,
  Release: <Flame className="w-3.5 h-3.5" />,
};

type Phase = "inhale" | "hold1" | "exhale" | "hold2" | "idle";
const phaseLabels: Record<Phase, string> = { inhale: "Breathe In", hold1: "Hold", exhale: "Breathe Out", hold2: "Hold", idle: "Ready" };
const phaseColors: Record<Phase, string> = { inhale: "text-emerald-400", hold1: "text-amber-400", exhale: "text-sky-400", hold2: "text-amber-400", idle: "text-muted-foreground" };

type AiData = {
  bodyMessage: string;
  nervousSystemState: string;
  somaticPractice: string;
  emotionalRelease: string;
  closingAffirmation: string;
};

export default function SomaticBreathing() {
  const { entries, isLoading, saveEntry, deleteEntry } = useHealingToolEntries("somatic-breathing");
  const [selected, setSelected] = useState(exercises[0]);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [counter, setCounter] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [targetCycles, setTargetCycles] = useState(5);
  const [notes, setNotes] = useState("");
  const [intention, setIntention] = useState("");
  const [isCoaching, setIsCoaching] = useState(false);
  const [aiData, setAiData] = useState<AiData | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(0.7);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPhaseRef = useRef<Phase>("idle");

  const totalCycleTime = selected.inhale + selected.hold1 + selected.exhale + selected.hold2;

  const filteredExercises = categoryFilter
    ? exercises.filter(ex => ex.category === categoryFilter)
    : exercises;

  const categories = [...new Set(exercises.map(ex => ex.category))];

  useEffect(() => {
    if (!running) { if (intervalRef.current) clearInterval(intervalRef.current); return; }
    let elapsed = 0;
    let lastPhase: Phase = "idle";
    // Play initial inhale tone
    if (soundEnabled) playPhaseTone("inhale", soundVolume);
    const tick = () => {
      elapsed++;
      const pos = elapsed % totalCycleTime;
      const completedCycles = Math.floor(elapsed / totalCycleTime);
      if (completedCycles >= targetCycles) {
        stop();
        setCycles(targetCycles);
        if (soundEnabled) playCompletionTone(soundVolume);
        return;
      }
      setCycles(completedCycles);
      let p: Phase; let c: number;
      if (pos < selected.inhale) { p = "inhale"; c = selected.inhale - pos; }
      else if (pos < selected.inhale + selected.hold1) { p = "hold1"; c = selected.inhale + selected.hold1 - pos; }
      else if (pos < selected.inhale + selected.hold1 + selected.exhale) { p = "exhale"; c = selected.inhale + selected.hold1 + selected.exhale - pos; }
      else { p = "hold2"; c = totalCycleTime - pos; }

      // Play tone on phase transition
      if (p !== lastPhase && soundEnabled) {
        // Skip hold phases with 0 duration
        const shouldPlay = (p === "hold1" && selected.hold1 > 0) ||
                           (p === "hold2" && selected.hold2 > 0) ||
                           p === "inhale" || p === "exhale";
        if (shouldPlay) playPhaseTone(p, soundVolume);
      }
      lastPhase = p;

      setPhase(p); setCounter(c);
    };
    intervalRef.current = setInterval(tick, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, selected, targetCycles, totalCycleTime, soundEnabled, soundVolume]);

  const stop = () => { setRunning(false); if (intervalRef.current) clearInterval(intervalRef.current); };
  const reset = () => { stop(); setPhase("idle"); setCounter(0); setCycles(0); setAiData(null); };

  const handleSave = () => {
    saveEntry.mutate({
      exercise: selected.name,
      exercise_id: selected.id,
      cycles_completed: cycles,
      target_cycles: targetCycles,
      notes,
      intention,
      completed_at: new Date().toISOString(),
      aiGuidance: aiData || undefined,
    });
    setNotes(""); setIntention(""); setAiData(null); reset();
  };

  const handleAiCoach = async () => {
    setIsCoaching(true);
    try {
      const { data, error } = await supabase.functions.invoke("somatic-coach", {
        body: {
          exercise: selected.name,
          cycles: cycles > 0 ? cycles : targetCycles,
          notes: notes.trim() || undefined,
          intention: intention.trim() || undefined,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setAiData(data);
      toast.success("Somatic guidance ready — breathe and receive");
    } catch (err: any) {
      console.error("Somatic coach error:", err);
      toast.error(err.message || "Failed to generate guidance. Please try again.");
    } finally {
      setIsCoaching(false);
    }
  };

  // Breathing animation scale
  const getBreathScale = () => {
    if (phase === "inhale") return "scale-110";
    if (phase === "exhale") return "scale-90";
    return "scale-100";
  };

  return (
    <Tabs defaultValue="practice">
      <TabsList className="mb-6">
        <TabsTrigger value="practice">Practice</TabsTrigger>
        <TabsTrigger value="history">History ({entries.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="practice">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left column — exercise picker */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="font-serif text-lg">Choose Exercise</CardTitle>
              {/* Category filters */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                <button
                  onClick={() => setCategoryFilter(null)}
                  className={`text-xs px-2.5 py-1 rounded-full transition-colors ${!categoryFilter ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-accent/20"}`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
                    className={`text-xs px-2.5 py-1 rounded-full transition-colors flex items-center gap-1 ${categoryFilter === cat ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-accent/20"}`}
                  >
                    {categoryIcons[cat]} {cat}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[420px] overflow-y-auto">
              {filteredExercises.map(ex => (
                <button key={ex.id} onClick={() => { reset(); setSelected(ex); }}
                  className={`w-full text-left p-3 rounded-xl border-2 transition-all ${selected.id === ex.id ? "border-accent bg-accent/10" : "border-border hover:border-accent/40"}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-accent">{categoryIcons[ex.category]}</span>
                    <p className="font-semibold text-foreground text-sm">{ex.name}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground ml-auto">{ex.category}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{ex.description}</p>
                  <p className="text-xs text-accent mt-1">{ex.inhale}s in · {ex.hold1 > 0 ? `${ex.hold1}s hold · ` : ""}{ex.exhale}s out{ex.hold2 > 0 ? ` · ${ex.hold2}s hold` : ""}</p>
                </button>
              ))}
              <div className="pt-2">
                <label className="text-sm text-muted-foreground">Target Cycles</label>
                <Select value={String(targetCycles)} onValueChange={v => setTargetCycles(Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{[3, 5, 8, 10, 15, 20].map(n => <SelectItem key={n} value={String(n)}>{n} cycles</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Right column — breathing timer + AI */}
          <div className="space-y-4">
            {/* Intention */}
            <Card className="glass-card">
              <CardContent className="pt-4">
                <Input
                  placeholder="Set an intention for this session (optional)..."
                  value={intention}
                  onChange={e => setIntention(e.target.value)}
                  className="bg-input border-border text-sm"
                />
              </CardContent>
            </Card>

            {/* Breathing Timer */}
            <Card className="glass-card">
              <CardContent className="pt-6 flex flex-col items-center gap-4">
                <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-1000 ${
                  phase === "inhale" ? "border-emerald-400 scale-110" :
                  phase === "exhale" ? "border-sky-400 scale-90" :
                  phase === "hold1" || phase === "hold2" ? "border-amber-400 scale-100" :
                  "border-border scale-100"
                }`}>
                  <div className={`text-5xl font-bold transition-all duration-500 ${phaseColors[phase]}`}>
                    {phase === "idle" ? "●" : counter}
                  </div>
                </div>
                <p className={`text-lg font-semibold ${phaseColors[phase]}`}>{phaseLabels[phase]}</p>
                <Progress value={(cycles / targetCycles) * 100} className="h-2" />
                <p className="text-sm text-muted-foreground">{cycles} / {targetCycles} cycles</p>
                <div className="flex gap-3">
                  <Button onClick={() => running ? stop() : setRunning(true)} variant="gold" size="lg">
                    {running ? <><Pause className="w-4 h-4 mr-2" /> Pause</> : <><Play className="w-4 h-4 mr-2" /> Start</>}
                  </Button>
                  <Button onClick={reset} variant="outline" size="lg"><RotateCcw className="w-4 h-4" /></Button>
                </div>
                {/* Sound controls */}
                <div className="flex items-center gap-3 w-full pt-1">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title={soundEnabled ? "Mute bowl tones" : "Enable bowl tones"}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={soundEnabled ? soundVolume : 0}
                    onChange={e => { setSoundVolume(Number(e.target.value)); setSoundEnabled(Number(e.target.value) > 0); }}
                    className="flex-1 h-1.5 accent-accent cursor-pointer"
                  />
                  <span className="text-[10px] text-muted-foreground w-8">{soundEnabled ? `${Math.round(soundVolume * 100)}%` : "Off"}</span>
                </div>
              </CardContent>
            </Card>

            {/* Notes + AI + Save */}
            <Card className="glass-card">
              <CardContent className="pt-4 space-y-3">
                <Textarea placeholder="How does your body feel after this session?" value={notes} onChange={e => setNotes(e.target.value)} rows={3} />

                {/* AI Coach Button */}
                <Button
                  onClick={handleAiCoach}
                  disabled={isCoaching}
                  variant="outline"
                  className="w-full border-primary/30 text-primary hover:bg-primary/10"
                >
                  {isCoaching ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Reading your body's signals...</>
                  ) : (
                    <><Sparkles className="w-4 h-4 mr-2" /> Get Somatic Guidance (AI)</>
                  )}
                </Button>

                <Button onClick={handleSave} variant="gold" className="w-full" disabled={cycles === 0 && !aiData}>
                  Save Session
                </Button>
              </CardContent>
            </Card>

            {/* AI Results */}
            {aiData && (
              <Card className="glass-card border-accent/20">
                <CardContent className="pt-5 space-y-4">
                  <h3 className="font-serif text-lg text-accent flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Your Somatic Guidance
                  </h3>

                  <div>
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1">Body Message</p>
                    <p className="text-sm text-foreground/80 italic">{aiData.bodyMessage}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1">Nervous System State</p>
                    <p className="text-sm text-foreground/80">{aiData.nervousSystemState}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1">Follow-Up Practice</p>
                    <p className="text-sm text-foreground/80">{aiData.somaticPractice}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1">Emotional Release</p>
                    <p className="text-sm text-foreground/80 italic">{aiData.emotionalRelease}</p>
                  </div>

                  <div className="bg-accent/10 p-3 rounded-lg text-center">
                    <p className="text-sm font-serif text-accent italic">"{aiData.closingAffirmation}"</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="history">
        {isLoading ? <p className="text-muted-foreground">Loading...</p> : entries.length === 0 ? <p className="text-muted-foreground text-center py-8">No sessions yet. Start breathing!</p> :
          <div className="space-y-3">{entries.map((e: any) => (
            <Card key={e.id} className="glass-card"><CardContent className="pt-4 flex justify-between items-start">
              <div>
                <p className="font-semibold text-foreground">{e.entry_data.exercise}</p>
                <p className="text-sm text-muted-foreground">{e.entry_data.cycles_completed}/{e.entry_data.target_cycles} cycles · {format(new Date(e.created_at), "MMM d, yyyy")}</p>
                {e.entry_data.intention && <p className="text-xs text-accent mt-1">Intention: {e.entry_data.intention}</p>}
                {e.entry_data.notes && <p className="text-sm text-muted-foreground mt-1 italic">"{e.entry_data.notes}"</p>}
              </div>
              <Button variant="ghost" size="icon" onClick={() => deleteEntry.mutate(e.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </CardContent></Card>
          ))}</div>}
      </TabsContent>
    </Tabs>
  );
}
