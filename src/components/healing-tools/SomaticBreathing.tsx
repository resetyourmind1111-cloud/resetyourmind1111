import { useState } from "react";
import { useHealingToolEntries } from "@/hooks/useHealingToolEntries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Play, Pause, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

const exercises = [
  { id: "box", name: "Box Breathing", inhale: 4, hold1: 4, exhale: 4, hold2: 4, description: "Equal counts for calm focus. Navy SEALs use this to stay composed under pressure." },
  { id: "478", name: "4-7-8 Breathing", inhale: 4, hold1: 7, exhale: 8, hold2: 0, description: "Dr. Andrew Weil's technique for deep relaxation and falling asleep." },
  { id: "physiological-sigh", name: "Physiological Sigh", inhale: 3, hold1: 0, exhale: 6, hold2: 2, description: "Double inhale through nose, long exhale through mouth. Fastest way to calm your nervous system." },
  { id: "energizing", name: "Energizing Breath", inhale: 2, hold1: 0, exhale: 2, hold2: 0, description: "Rapid rhythmic breathing to wake up your body and increase alertness." },
];

type Phase = "inhale" | "hold1" | "exhale" | "hold2" | "idle";
const phaseLabels: Record<Phase, string> = { inhale: "Breathe In", hold1: "Hold", exhale: "Breathe Out", hold2: "Hold", idle: "Ready" };
const phaseColors: Record<Phase, string> = { inhale: "text-emerald-400", hold1: "text-amber-400", exhale: "text-sky-400", hold2: "text-amber-400", idle: "text-muted-foreground" };

export default function SomaticBreathing() {
  const { entries, isLoading, saveEntry, deleteEntry } = useHealingToolEntries("somatic-breathing");
  const [selected, setSelected] = useState(exercises[0]);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [counter, setCounter] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [targetCycles, setTargetCycles] = useState(5);
  const [notes, setNotes] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalCycleTime = selected.inhale + selected.hold1 + selected.exhale + selected.hold2;

  useEffect(() => {
    if (!running) { if (intervalRef.current) clearInterval(intervalRef.current); return; }
    let elapsed = 0;
    const tick = () => {
      elapsed++;
      const pos = elapsed % totalCycleTime;
      const completedCycles = Math.floor(elapsed / totalCycleTime);
      if (completedCycles >= targetCycles) { stop(); setCycles(targetCycles); return; }
      setCycles(completedCycles);
      let p: Phase; let c: number;
      if (pos < selected.inhale) { p = "inhale"; c = selected.inhale - pos; }
      else if (pos < selected.inhale + selected.hold1) { p = "hold1"; c = selected.inhale + selected.hold1 - pos; }
      else if (pos < selected.inhale + selected.hold1 + selected.exhale) { p = "exhale"; c = selected.inhale + selected.hold1 + selected.exhale - pos; }
      else { p = "hold2"; c = totalCycleTime - pos; }
      setPhase(p); setCounter(c);
    };
    intervalRef.current = setInterval(tick, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, selected, targetCycles, totalCycleTime]);

  const stop = () => { setRunning(false); if (intervalRef.current) clearInterval(intervalRef.current); };
  const reset = () => { stop(); setPhase("idle"); setCounter(0); setCycles(0); };

  const handleSave = () => {
    saveEntry.mutate({ exercise: selected.name, exercise_id: selected.id, cycles_completed: cycles, target_cycles: targetCycles, notes, completed_at: new Date().toISOString() });
    setNotes(""); reset();
  };

  return (
    <Tabs defaultValue="practice">
      <TabsList className="mb-6"><TabsTrigger value="practice">Practice</TabsTrigger><TabsTrigger value="history">History ({entries.length})</TabsTrigger></TabsList>
      <TabsContent value="practice">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader><CardTitle className="font-serif text-lg">Choose Exercise</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {exercises.map(ex => (
                <button key={ex.id} onClick={() => { reset(); setSelected(ex); }}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selected.id === ex.id ? "border-accent bg-accent/10" : "border-border hover:border-accent/40"}`}>
                  <p className="font-semibold text-foreground">{ex.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{ex.description}</p>
                  <p className="text-xs text-accent mt-1">{ex.inhale}s in · {ex.hold1 > 0 ? `${ex.hold1}s hold · ` : ""}{ex.exhale}s out{ex.hold2 > 0 ? ` · ${ex.hold2}s hold` : ""}</p>
                </button>
              ))}
              <div className="pt-2">
                <label className="text-sm text-muted-foreground">Target Cycles</label>
                <Select value={String(targetCycles)} onValueChange={v => setTargetCycles(Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{[3,5,8,10,15].map(n => <SelectItem key={n} value={String(n)}>{n} cycles</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="glass-card">
              <CardContent className="pt-6 flex flex-col items-center gap-4">
                <div className={`text-6xl font-bold transition-all duration-500 ${phaseColors[phase]}`}>
                  {phase === "idle" ? "●" : counter}
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
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6 space-y-3">
                <Textarea placeholder="How does your body feel after this session?" value={notes} onChange={e => setNotes(e.target.value)} rows={3} />
                <Button onClick={handleSave} variant="gold" className="w-full" disabled={cycles === 0}>Save Session</Button>
              </CardContent>
            </Card>
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
                {e.entry_data.notes && <p className="text-sm text-muted-foreground mt-1 italic">"{e.entry_data.notes}"</p>}
              </div>
              <Button variant="ghost" size="icon" onClick={() => deleteEntry.mutate(e.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </CardContent></Card>
          ))}</div>}
      </TabsContent>
    </Tabs>
  );
}
