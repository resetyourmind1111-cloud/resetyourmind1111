import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useHealingToolEntries } from "@/hooks/useHealingToolEntries";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Sparkles, Wand2, Loader2 } from "lucide-react";
import { format, isThisWeek, isToday, differenceInCalendarDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CATEGORIES = [
  "Money Received", "Unexpected Gift", "Support Shown", "Beauty Noticed",
  "Synchronicity", "Opportunity Arrived", "Act of Kindness", "Time Given",
];

type AbundanceInsight = {
  deeperMeaning: string;
  patternReflection: string;
  amplifyAction: string;
};

export default function AbundanceEvidenceLog() {
  const { entries, saveEntry, deleteEntry } = useHealingToolEntries("abundance-evidence-log");
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [insightLoading, setInsightLoading] = useState<string | null>(null);
  const [insights, setInsights] = useState<Record<string, AbundanceInsight>>({});

  const handleSave = () => {
    if (!category || !description.trim()) return;
    saveEntry.mutate({ category, description, gratitude }, {
      onSuccess: () => { setCategory(""); setDescription(""); setGratitude(""); setShowForm(false); },
    });
  };

  const fetchInsight = async (entryId: string, data: { category: string; description: string; gratitude?: string }) => {
    setInsightLoading(entryId);
    try {
      const { data: result, error } = await supabase.functions.invoke("abundance-insight", {
        body: data,
      });
      if (error) throw error;
      if (result?.error) throw new Error(result.error);
      setInsights(prev => ({ ...prev, [entryId]: result }));
    } catch (e: any) {
      toast.error(e.message || "Failed to get insight");
    } finally {
      setInsightLoading(null);
    }
  };

  // Calculate streak
  const streak = useMemo(() => {
    if (!entries.length) return 0;
    const days = [...new Set(entries.map((e: any) => format(new Date(e.created_at), "yyyy-MM-dd")))].sort().reverse();
    if (!isToday(new Date(days[0]))) return 0;
    let count = 1;
    for (let i = 1; i < days.length; i++) {
      if (differenceInCalendarDays(new Date(days[i - 1]), new Date(days[i])) === 1) count++;
      else break;
    }
    return count;
  }, [entries]);

  const weekEntries = entries.filter((e: any) => isThisWeek(new Date(e.created_at)));

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-serif text-accent">{entries.length}</p>
            <p className="text-xs text-muted-foreground">Total Logged</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-serif text-accent">🔥 {streak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-serif text-accent">{weekEntries.length}</p>
            <p className="text-xs text-muted-foreground">This Week</p>
          </CardContent>
        </Card>
      </div>

      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" /> Log Abundance
        </Button>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="glass-card">
              <CardContent className="p-6 space-y-5">
                <div>
                  <Label className="text-foreground font-semibold mb-2 block">Category</Label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <Button key={cat} variant={category === cat ? "default" : "outline"} size="sm"
                        className={category === cat ? "bg-accent text-accent-foreground" : "border-border text-muted-foreground"}
                        onClick={() => setCategory(cat)}>
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-foreground font-semibold">What happened?</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the abundance..." className="bg-input border-border mt-1" />
                </div>
                <div>
                  <Label className="text-foreground font-semibold">I am grateful because...</Label>
                  <Textarea value={gratitude} onChange={(e) => setGratitude(e.target.value)} placeholder="I am grateful because..." className="bg-input border-border mt-1" />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleSave} disabled={saveEntry.isPending} className="bg-accent text-accent-foreground">
                    <Sparkles className="w-4 h-4 mr-2" /> {saveEntry.isPending ? "Saving..." : "Log It"}
                  </Button>
                  <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {entries.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-serif text-xl text-foreground">Abundance Log</h3>
          {entries.map((entry: any) => {
            const d = entry.entry_data;
            const insight = insights[entry.id];
            const isLoading = insightLoading === entry.id;
            return (
              <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-accent/20 text-accent text-xs border-0">{d.category}</Badge>
                        <span className="text-xs text-muted-foreground">{format(new Date(entry.created_at), "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-accent h-7 px-2 text-xs hover:bg-accent/10"
                          disabled={isLoading}
                          onClick={() => fetchInsight(entry.id, { category: d.category, description: d.description, gratitude: d.gratitude })}
                        >
                          {isLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Wand2 className="w-3 h-3 mr-1" />}
                          {insight ? "Refresh" : "Decode"}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive h-6 w-6 p-0" onClick={() => deleteEntry.mutate(entry.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-foreground">{d.description}</p>
                    {d.gratitude && <p className="text-xs text-muted-foreground mt-1 italic">Grateful: {d.gratitude}</p>}

                    <AnimatePresence>
                      {insight && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 space-y-3 border-t border-border pt-4"
                        >
                          <div>
                            <p className="text-xs font-semibold text-accent mb-1">✨ Deeper Meaning</p>
                            <p className="text-sm text-foreground/90">{insight.deeperMeaning}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-accent mb-1">🪞 Pattern Reflection</p>
                            <p className="text-sm text-foreground/90">{insight.patternReflection}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-accent mb-1">🚀 Amplify This</p>
                            <p className="text-sm text-foreground/90">{insight.amplifyAction}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
