import { useState } from "react";
import { useHealingToolEntries } from "@/hooks/useHealingToolEntries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

const dimensions = [
  { id: "vision", name: "Vision & Strategy", q: "Do I have a clear vision for my life and am I actively working toward it?" },
  { id: "boundaries", name: "Boundaries", q: "Am I protecting my time, energy, and peace without guilt?" },
  { id: "finances", name: "Financial Leadership", q: "Am I managing my money intentionally and building wealth?" },
  { id: "decisions", name: "Decision-Making", q: "Do I make decisions from alignment rather than fear?" },
  { id: "delegation", name: "Delegation & Support", q: "Am I asking for help and delegating what drains me?" },
  { id: "self-care", name: "Self-Care & Energy", q: "Am I prioritizing my health, rest, and nervous system?" },
  { id: "visibility", name: "Visibility & Voice", q: "Am I showing up, speaking up, and being seen?" },
  { id: "relationships", name: "Relationships", q: "Are my relationships reciprocal, healthy, and aligned?" },
  { id: "growth", name: "Growth & Learning", q: "Am I investing in my personal and professional development?" },
  { id: "integrity", name: "Integrity & Follow-Through", q: "Am I keeping promises to myself and others?" },
];

export default function CEOSelfAssessment() {
  const { entries, isLoading, saveEntry, deleteEntry } = useHealingToolEntries("ceo-self-assessment");
  const [scores, setScores] = useState<Record<string, number>>({});
  const [reflection, setReflection] = useState("");

  const setScore = (id: string, val: number) => setScores(prev => ({ ...prev, [id]: val }));
  const allScored = dimensions.every(d => scores[d.id] !== undefined);
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const maxScore = dimensions.length * 10;
  const percentage = allScored ? Math.round((totalScore / maxScore) * 100) : 0;

  const getGrade = (pct: number) => {
    if (pct >= 90) return { label: "CEO Energy Activated 👑", color: "text-accent" };
    if (pct >= 70) return { label: "Rising Leader 🔥", color: "text-amber-400" };
    if (pct >= 50) return { label: "Building Momentum 🌱", color: "text-emerald-400" };
    return { label: "Foundation Phase 🧱", color: "text-muted-foreground" };
  };

  const handleSave = () => {
    saveEntry.mutate({ scores, total_score: totalScore, percentage, reflection, grade: getGrade(percentage).label });
    setScores({}); setReflection("");
  };

  return (
    <Tabs defaultValue="assess">
      <TabsList className="mb-6"><TabsTrigger value="assess">Assessment</TabsTrigger><TabsTrigger value="history">History ({entries.length})</TabsTrigger></TabsList>
      <TabsContent value="assess">
        <div className="space-y-4">
          {dimensions.map(d => (
            <Card key={d.id} className="glass-card">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-2">
                  <div><p className="font-semibold text-foreground">{d.name}</p><p className="text-sm text-muted-foreground">{d.q}</p></div>
                  <span className="text-lg font-bold text-accent">{scores[d.id] ?? "—"}</span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                    <button key={n} onClick={() => setScore(d.id, n)}
                      className={`flex-1 py-2 rounded text-xs font-bold transition-all ${scores[d.id] === n ? "bg-accent text-accent-foreground" : scores[d.id] && n <= scores[d.id] ? "bg-accent/30 text-accent" : "bg-muted text-muted-foreground hover:bg-accent/20"}`}>{n}</button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {allScored && (
            <Card className="glass-card border-accent/30">
              <CardContent className="pt-6 text-center space-y-4">
                <p className={`text-2xl font-serif font-bold ${getGrade(percentage).color}`}>{getGrade(percentage).label}</p>
                <p className="text-4xl font-bold text-foreground">{percentage}%</p>
                <Progress value={percentage} className="h-3" />
                <Textarea value={reflection} onChange={e => setReflection(e.target.value)} placeholder="What stood out? What's one thing you'll shift this week?" rows={3} />
                <Button onClick={handleSave} variant="gold" className="w-full">Save Assessment</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>
      <TabsContent value="history">
        {isLoading ? <p className="text-muted-foreground">Loading...</p> : entries.length === 0 ? <p className="text-muted-foreground text-center py-8">No assessments yet.</p> :
          <div className="space-y-3">{entries.map((e: any) => (
            <Card key={e.id} className="glass-card"><CardContent className="pt-4 flex justify-between items-start">
              <div>
                <p className="font-semibold text-foreground">{e.entry_data.grade} — {e.entry_data.percentage}%</p>
                <p className="text-sm text-muted-foreground">{format(new Date(e.created_at), "MMM d, yyyy")}</p>
                {e.entry_data.reflection && <p className="text-sm text-muted-foreground mt-1 italic">"{e.entry_data.reflection}"</p>}
              </div>
              <Button variant="ghost" size="icon" onClick={() => deleteEntry.mutate(e.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </CardContent></Card>
          ))}</div>}
      </TabsContent>
    </Tabs>
  );
}
