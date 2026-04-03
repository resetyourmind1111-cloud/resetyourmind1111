import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHealingToolEntries } from "@/hooks/useHealingToolEntries";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Sparkles, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const INTERPRETATIONS: Record<string, string> = {
  "111": "Thoughts becoming reality — choose them wisely",
  "222": "Trust divine timing — you are exactly where you need to be",
  "333": "You are surrounded by support and guidance right now",
  "444": "You are protected — stability is being built for you",
  "555": "Significant change is coming — embrace not resist",
  "666": "Rebalance — return to love over fear or material focus",
  "777": "Spiritual alignment — you are on exactly the right path",
  "888": "Financial and material abundance is incoming",
  "999": "A chapter is completing — prepare for the new",
  "1111": "Manifestation portal is open — make your wish now. You are being reminded of your power",
};

function getInterpretation(num: string): string {
  if (INTERPRETATIONS[num]) return INTERPRETATIONS[num];
  const digits = num.replace(/\D/g, "");
  for (const key of Object.keys(INTERPRETATIONS)) {
    if (digits.includes(key)) return INTERPRETATIONS[key];
  }
  return "This number carries a personal message for you. Reflect on what it means in this moment.";
}

export default function AngelNumberJournal() {
  const { entries, saveEntry, deleteEntry } = useHealingToolEntries("angel-number-journal");
  const [showForm, setShowForm] = useState(false);
  const [number, setNumber] = useState("");
  const [location, setLocation] = useState("");
  const [thinking, setThinking] = useState("");
  const [personalMeaning, setPersonalMeaning] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState<any>(null);

  const patterns = useMemo(() => {
    const counts: Record<string, number> = {};
    entries.forEach((e: any) => {
      const n = e.entry_data.number;
      counts[n] = (counts[n] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [entries]);

  const handleAiDecode = async () => {
    if (!number.trim()) return;
    setIsAnalyzing(true);
    setAiInsight(null);
    try {
      const { data, error } = await supabase.functions.invoke("healing-tool-insight", {
        body: { toolType: "angel-number-deeper", number, location, thinking, personalMeaning },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setAiInsight(data);
      toast.success("Deeper meaning revealed ✨");
    } catch (err: any) {
      toast.error(err.message || "Failed to decode");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (!number.trim()) return;
    saveEntry.mutate(
      { number, location, thinking, personalMeaning, interpretation: getInterpretation(number), aiInsight: aiInsight || undefined, date: new Date().toISOString() },
      {
        onSuccess: () => {
          setNumber(""); setLocation(""); setThinking(""); setPersonalMeaning(""); setShowForm(false); setAiInsight(null);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" /> Log a Number
        </Button>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="glass-card">
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label className="text-foreground font-semibold">Number Seen</Label>
                  <Input placeholder="e.g. 1111, 444, 222" value={number} onChange={(e) => setNumber(e.target.value)} className="bg-input border-border mt-1" />
                </div>

                {number && (
                  <div className="glass-card p-4 text-center">
                    <p className="text-accent font-serif text-lg mb-1">{number}</p>
                    <p className="text-sm text-foreground/80 italic">{getInterpretation(number)}</p>
                  </div>
                )}

                <div>
                  <Label className="text-foreground font-semibold">Where did you see it?</Label>
                  <Input placeholder="Clock, license plate, receipt..." value={location} onChange={(e) => setLocation(e.target.value)} className="bg-input border-border mt-1" />
                </div>
                <div>
                  <Label className="text-foreground font-semibold">What were you thinking or doing?</Label>
                  <Textarea placeholder="I was thinking about..." value={thinking} onChange={(e) => setThinking(e.target.value)} className="bg-input border-border" />
                </div>
                <div>
                  <Label className="text-foreground font-semibold">What does this number mean to you specifically right now?</Label>
                  <Textarea placeholder="To me, this means..." value={personalMeaning} onChange={(e) => setPersonalMeaning(e.target.value)} className="bg-input border-border" />
                </div>

                <Button
                  onClick={handleAiDecode}
                  variant="outline"
                  className="w-full border-accent/30 text-accent hover:bg-accent/10"
                  disabled={!number.trim() || isAnalyzing}
                >
                  {isAnalyzing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Decoding...</> : <><Sparkles className="w-4 h-4 mr-2" /> AI: Go Deeper on This Number</>}
                </Button>

                {aiInsight && (
                  <Card className="border-accent/20 bg-accent/5">
                    <CardContent className="pt-4 space-y-2">
                      <p className="text-xs text-accent font-semibold flex items-center gap-1"><Sparkles className="w-3 h-3" /> Deeper Meaning</p>
                      <p className="text-sm text-foreground">{aiInsight.deeperMeaning}</p>
                      <p className="text-xs text-muted-foreground font-semibold mt-2">Soul Message</p>
                      <p className="text-sm text-muted-foreground italic">"{aiInsight.soulMessage}"</p>
                      <p className="text-xs text-muted-foreground font-semibold mt-2">Action Guidance</p>
                      <p className="text-sm text-muted-foreground">{aiInsight.actionGuidance}</p>
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-3">
                  <Button onClick={handleSave} disabled={saveEntry.isPending} className="bg-accent text-accent-foreground">
                    {saveEntry.isPending ? "Saving..." : "Log Number"}
                  </Button>
                  <Button variant="ghost" onClick={() => { setShowForm(false); setAiInsight(null); }}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="bg-card/50">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4 mt-4">
          {entries.map((entry: any) => {
            const d = entry.entry_data;
            return (
              <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-accent font-serif text-xl font-bold">{d.number}</span>
                        <span className="text-xs text-muted-foreground">{format(new Date(d.date), "MMM d, yyyy h:mm a")}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive h-6 w-6 p-0" onClick={() => deleteEntry.mutate(entry.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-accent italic mb-1">{d.interpretation}</p>
                    {d.location && <p className="text-xs text-muted-foreground">📍 {d.location}</p>}
                    {d.thinking && <p className="text-xs text-muted-foreground">💭 {d.thinking}</p>}
                    {d.personalMeaning && <p className="text-sm text-foreground/80 mt-1">"{d.personalMeaning}"</p>}
                    {d.aiInsight && (
                      <div className="mt-2 pt-2 border-t border-accent/10">
                        <p className="text-xs text-accent font-semibold flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI Decode</p>
                        <p className="text-xs text-muted-foreground">{d.aiInsight.deeperMeaning}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
          {entries.length === 0 && <p className="text-muted-foreground text-center py-8">No numbers logged yet. Start tracking the signs.</p>}
        </TabsContent>

        <TabsContent value="patterns" className="mt-4">
          {patterns.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {patterns.map(([num, count]) => (
                <Card key={num} className="glass-card text-center p-4">
                  <p className="text-2xl font-serif text-accent">{num}</p>
                  <p className="text-xs text-muted-foreground">{count} time{count !== 1 ? "s" : ""}</p>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Log numbers to see patterns emerge.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
