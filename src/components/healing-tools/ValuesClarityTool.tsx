import { useState } from "react";
import { useHealingToolEntries } from "@/hooks/useHealingToolEntries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

const allValues = [
  "Freedom", "Security", "Adventure", "Creativity", "Love", "Connection", "Growth", "Authenticity",
  "Justice", "Compassion", "Courage", "Integrity", "Joy", "Peace", "Power", "Wisdom",
  "Family", "Service", "Wealth", "Health", "Spirituality", "Beauty", "Loyalty", "Independence",
  "Passion", "Purpose", "Simplicity", "Excellence", "Humor", "Gratitude", "Honesty", "Resilience",
];

export default function ValuesClarityTool() {
  const { entries, isLoading, saveEntry, deleteEntry } = useHealingToolEntries("values-clarity-tool");
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [topFive, setTopFive] = useState<string[]>([]);
  const [reflections, setReflections] = useState<Record<string, string>>({});

  const toggleValue = (v: string) => {
    if (step === 1) {
      setSelected(prev => prev.includes(v) ? prev.filter(x => x !== v) : prev.length < 10 ? [...prev, v] : prev);
    } else if (step === 2) {
      setTopFive(prev => prev.includes(v) ? prev.filter(x => x !== v) : prev.length < 5 ? [...prev, v] : prev);
    }
  };

  const handleSave = () => {
    saveEntry.mutate({ top_five: topFive, reflections, all_selected: selected });
    setStep(1); setSelected([]); setTopFive([]); setReflections({});
  };

  return (
    <Tabs defaultValue="discover">
      <TabsList className="mb-6"><TabsTrigger value="discover">Discover</TabsTrigger><TabsTrigger value="results">My Values ({entries.length})</TabsTrigger></TabsList>
      <TabsContent value="discover">
        {step === 1 && (
          <Card className="glass-card">
            <CardHeader><CardTitle className="font-serif text-lg">Step 1: Choose 10 values that resonate</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Don't overthink it. Go with your gut. Which words make your body say YES? ({selected.length}/10)</p>
              <div className="flex flex-wrap gap-2">
                {allValues.map(v => (
                  <button key={v} onClick={() => toggleValue(v)}
                    className={`px-4 py-2 rounded-full text-sm border-2 transition-all ${selected.includes(v) ? "bg-accent text-accent-foreground border-accent" : "border-border text-muted-foreground hover:border-accent/40"}`}>{v}</button>
                ))}
              </div>
              <Button onClick={() => { setStep(2); setTopFive([]); }} variant="gold" className="w-full" disabled={selected.length < 5}>
                Next: Narrow to 5 →
              </Button>
            </CardContent>
          </Card>
        )}
        {step === 2 && (
          <Card className="glass-card">
            <CardHeader><CardTitle className="font-serif text-lg">Step 2: Choose your top 5 non-negotiables</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">If you could only live by 5 values for the rest of your life, which would they be? ({topFive.length}/5)</p>
              <div className="flex flex-wrap gap-2">
                {selected.map(v => (
                  <button key={v} onClick={() => toggleValue(v)}
                    className={`px-4 py-2 rounded-full text-sm border-2 transition-all ${topFive.includes(v) ? "bg-accent text-accent-foreground border-accent" : "border-border text-foreground hover:border-accent/40"}`}>{v}</button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setStep(1)} variant="outline">← Back</Button>
                <Button onClick={() => setStep(3)} variant="gold" className="flex-1" disabled={topFive.length < 5}>Next: Reflect →</Button>
              </div>
            </CardContent>
          </Card>
        )}
        {step === 3 && (
          <Card className="glass-card">
            <CardHeader><CardTitle className="font-serif text-lg">Step 3: Define what each value means to YOU</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {topFive.map(v => (
                <div key={v}>
                  <label className="text-sm font-semibold text-accent">{v}</label>
                  <Textarea value={reflections[v] || ""} onChange={e => setReflections(prev => ({ ...prev, [v]: e.target.value }))}
                    placeholder={`What does ${v} look like in your daily life?`} rows={2} />
                </div>
              ))}
              <div className="flex gap-3">
                <Button onClick={() => setStep(2)} variant="outline">← Back</Button>
                <Button onClick={handleSave} variant="gold" className="flex-1">Save My Values</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>
      <TabsContent value="results">
        {isLoading ? <p className="text-muted-foreground">Loading...</p> : entries.length === 0 ? <p className="text-muted-foreground text-center py-8">Complete the exercise to see your values.</p> :
          <div className="space-y-4">{entries.map((e: any) => (
            <Card key={e.id} className="glass-card"><CardContent className="pt-4">
              <div className="flex justify-between items-start mb-3">
                <p className="text-sm text-muted-foreground">{format(new Date(e.created_at), "MMM d, yyyy")}</p>
                <Button variant="ghost" size="icon" onClick={() => deleteEntry.mutate(e.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {(e.entry_data.top_five || []).map((v: string) => (
                  <span key={v} className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-semibold">{v}</span>
                ))}
              </div>
              {e.entry_data.reflections && Object.entries(e.entry_data.reflections).map(([k, v]: any) => v && (
                <div key={k} className="mb-2"><p className="text-xs font-bold text-foreground">{k}</p><p className="text-sm text-muted-foreground italic">"{v}"</p></div>
              ))}
            </CardContent></Card>
          ))}</div>}
      </TabsContent>
    </Tabs>
  );
}
