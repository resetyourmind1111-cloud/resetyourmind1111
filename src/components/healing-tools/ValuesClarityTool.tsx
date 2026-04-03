import { useState } from "react";
import { useHealingToolEntries } from "@/hooks/useHealingToolEntries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Sparkles, Loader2, Eye, AlertTriangle, Heart, Shield } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const allValues = [
  "Freedom", "Security", "Adventure", "Creativity", "Love", "Connection", "Growth", "Authenticity",
  "Justice", "Compassion", "Courage", "Integrity", "Joy", "Peace", "Power", "Wisdom",
  "Family", "Service", "Wealth", "Health", "Spirituality", "Beauty", "Loyalty", "Independence",
  "Passion", "Purpose", "Simplicity", "Excellence", "Humor", "Gratitude", "Honesty", "Resilience",
];

interface ValuesInsight {
  blindSpots: { value: string; insight: string }[];
  tensions: { values: string[]; insight: string }[];
  alignment: string;
  shadowValues: { value: string; insight: string }[];
  coreMessage: string;
}

export default function ValuesClarityTool() {
  const { entries, isLoading, saveEntry, deleteEntry } = useHealingToolEntries("values-clarity-tool");
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [topFive, setTopFive] = useState<string[]>([]);
  const [reflections, setReflections] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState<ValuesInsight | null>(null);

  const toggleValue = (v: string) => {
    if (step === 1) {
      setSelected(prev => prev.includes(v) ? prev.filter(x => x !== v) : prev.length < 10 ? [...prev, v] : prev);
    } else if (step === 2) {
      setTopFive(prev => prev.includes(v) ? prev.filter(x => x !== v) : prev.length < 5 ? [...prev, v] : prev);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAiInsight(null);
    try {
      const { data, error } = await supabase.functions.invoke("values-insight", {
        body: { topFive, reflections, allSelected: selected },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setAiInsight(data);
      setStep(4);
      toast.success("Values analysis complete ✨");
    } catch (err: any) {
      console.error("Values insight error:", err);
      toast.error(err.message || "Failed to analyze values");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    saveEntry.mutate({
      top_five: topFive,
      reflections,
      all_selected: selected,
      aiInsight: aiInsight || undefined,
    });
    setStep(1); setSelected([]); setTopFive([]); setReflections({}); setAiInsight(null);
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
              <Button
                onClick={handleAnalyze}
                variant="outline"
                className="w-full border-accent/30 text-accent hover:bg-accent/10"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing your values...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" /> AI: Reveal My Blind Spots</>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
        {step === 4 && aiInsight && (
          <div className="space-y-6">
            {/* Core Message */}
            <Card className="glass-card border-accent/20 bg-accent/5">
              <CardContent className="pt-6 text-center">
                <p className="font-serif text-xl text-foreground leading-relaxed">"{aiInsight.coreMessage}"</p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Blind Spots */}
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="font-serif text-lg flex items-center gap-2">
                    <Eye className="w-5 h-5 text-accent" /> Blind Spots
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {aiInsight.blindSpots.map((bs, i) => (
                    <div key={i} className="border-l-2 border-accent/30 pl-3">
                      <p className="text-sm font-semibold text-foreground">{bs.value}</p>
                      <p className="text-sm text-muted-foreground">{bs.insight}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Shadow Values */}
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="font-serif text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-accent" /> Shadow Values
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground mb-2">Values you dropped — but they may hold wisdom.</p>
                  {aiInsight.shadowValues.map((sv, i) => (
                    <div key={i} className="border-l-2 border-accent/30 pl-3">
                      <p className="text-sm font-semibold text-foreground">{sv.value}</p>
                      <p className="text-sm text-muted-foreground">{sv.insight}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Tensions */}
              {aiInsight.tensions.length > 0 && (
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-serif text-lg flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-500" /> Value Tensions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {aiInsight.tensions.map((t, i) => (
                      <div key={i} className="border-l-2 border-amber-500/30 pl-3">
                        <p className="text-sm font-semibold text-foreground">{t.values.join(" ↔ ")}</p>
                        <p className="text-sm text-muted-foreground">{t.insight}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Alignment */}
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="font-serif text-lg flex items-center gap-2">
                    <Heart className="w-5 h-5 text-accent" /> What Your Values Reveal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{aiInsight.alignment}</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => { setStep(3); setAiInsight(null); }} variant="outline">← Back to Reflections</Button>
              <Button onClick={handleSave} variant="gold" className="flex-1">Save Values + AI Insights</Button>
            </div>
          </div>
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
              {e.entry_data.aiInsight && (
                <div className="mt-4 pt-4 border-t border-accent/10">
                  <p className="text-xs text-accent font-semibold mb-2 flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI Analysis</p>
                  <p className="text-sm text-muted-foreground italic mb-2">"{e.entry_data.aiInsight.coreMessage}"</p>
                  {e.entry_data.aiInsight.blindSpots?.map((bs: any, i: number) => (
                    <p key={i} className="text-xs text-muted-foreground">🔍 <strong>{bs.value}</strong>: {bs.insight}</p>
                  ))}
                </div>
              )}
            </CardContent></Card>
          ))}</div>}
      </TabsContent>
    </Tabs>
  );
}
