import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHealingToolEntries } from "@/hooks/useHealingToolEntries";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Sparkles, Loader2, Wand2 } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AiButton } from "@/components/AiButton";
import { useUsage } from "@/contexts/UsageContext";

const EMOTIONS = [
  "Anger", "Shame", "Fear", "Sadness", "Abandonment",
  "Rejection", "Overwhelm", "Jealousy", "Unworthiness", "Betrayal",
];

type TriggerInsight = {
  bodySensation: string;
  rootReflection: string;
  healingPrompt: string;
};

export default function EmotionalTriggerTracker() {
  const { entries, saveEntry, updateEntry, deleteEntry } = useHealingToolEntries("emotional-trigger-tracker");
  const [showForm, setShowForm] = useState(false);
  const [trigger, setTrigger] = useState("");
  const [emotion, setEmotion] = useState("");
  const [bodySensation, setBodySensation] = useState("");
  const [rootResponse, setRootResponse] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insightLoading, setInsightLoading] = useState<string | null>(null);

  const emotionCounts = entries.reduce((acc: Record<string, number>, e: any) => {
    const em = e.entry_data.emotion;
    acc[em] = (acc[em] || 0) + 1;
    return acc;
  }, {});

  const handleSave = () => {
    if (!trigger.trim() || !emotion) return;
    saveEntry.mutate({ trigger, emotion, bodySensation, rootResponse }, {
      onSuccess: () => {
        setTrigger(""); setEmotion(""); setBodySensation(""); setRootResponse("");
        setShowForm(false);
      },
    });
  };

  const handleAiAnalyze = async () => {
    if (!trigger.trim() || !emotion) {
      toast.error("Please describe the trigger and select an emotion first");
      return;
    }
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-trigger", {
        body: { trigger: trigger.trim(), emotion },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data.bodySensation) setBodySensation(data.bodySensation);
      if (data.rootReflection) setRootResponse(data.rootReflection);
      if (data.healingPrompt) {
        setRootResponse((prev) => prev ? `${prev}\n\n💡 Journaling prompt: ${data.healingPrompt}` : `💡 Journaling prompt: ${data.healingPrompt}`);
      }
      toast.success("AI analysis complete — review and personalize the insights");
    } catch (err: any) {
      console.error("Analyze trigger error:", err);
      toast.error(err.message || "Failed to analyze trigger. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fetchInsight = async (entryId: string, entryData: any) => {
    setInsightLoading(entryId);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-trigger", {
        body: { trigger: entryData.trigger, emotion: entryData.emotion },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      updateEntry.mutate({
        id: entryId,
        entryData: { ...entryData, aiInsight: data },
      });
    } catch (e: any) {
      toast.error(e.message || "Failed to get insight");
    } finally {
      setInsightLoading(null);
    }
  };

  const patternNote = emotion && emotionCounts[emotion] ? (
    <p className="text-sm text-accent italic mt-2">
      💡 This emotion has come up {emotionCounts[emotion]} time{emotionCounts[emotion] > 1 ? "s" : ""} — this may be a pattern worth exploring.
    </p>
  ) : null;

  return (
    <div className="space-y-6">
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" /> Log a Trigger
        </Button>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="glass-card">
              <CardContent className="p-6 space-y-5">
                <div>
                  <Label className="text-foreground font-semibold">What happened?</Label>
                  <Textarea placeholder="Describe the situation..." value={trigger} onChange={(e) => setTrigger(e.target.value)} className="bg-input border-border mt-1" />
                </div>
                <div>
                  <Label className="text-foreground font-semibold mb-2 block">What emotion came up?</Label>
                  <div className="flex flex-wrap gap-2">
                    {EMOTIONS.map((em) => (
                      <Button key={em} variant={emotion === em ? "default" : "outline"} size="sm"
                        className={emotion === em ? "bg-accent text-accent-foreground" : "border-border text-muted-foreground"}
                        onClick={() => setEmotion(em)}>
                        {em}
                      </Button>
                    ))}
                  </div>
                  {patternNote}
                </div>

                {/* AI Analyze Button */}
                <Button
                  onClick={handleAiAnalyze}
                  disabled={isAnalyzing || !trigger.trim() || !emotion}
                  variant="outline"
                  className="w-full border-primary/30 text-primary hover:bg-primary/10"
                >
                  {isAnalyzing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing with AI...</>
                  ) : (
                    <><Sparkles className="w-4 h-4 mr-2" /> Help Me Understand This (AI)</>
                  )}
                </Button>

                <div>
                  <Label className="text-foreground font-semibold">Where do you feel it physically?</Label>
                  <Textarea placeholder="e.g. tightness in my chest, knot in my stomach..." value={bodySensation} onChange={(e) => setBodySensation(e.target.value)} className="bg-input border-border mt-1" />
                </div>
                <div className="glass-card p-4 text-sm text-muted-foreground italic space-y-1">
                  <p>What does this remind you of?</p>
                  <p>How old do you feel right now?</p>
                </div>
                <div>
                  <Label className="text-foreground font-semibold">Your reflection</Label>
                  <Textarea placeholder="What came up when you sat with those questions..." value={rootResponse} onChange={(e) => setRootResponse(e.target.value)} className="bg-input border-border mt-1" />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleSave} disabled={saveEntry.isPending} className="bg-accent text-accent-foreground">
                    {saveEntry.isPending ? "Saving..." : "Save Entry"}
                  </Button>
                  <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {entries.length > 0 && (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="all">All</TabsTrigger>
            {Object.keys(emotionCounts).map((em) => (
              <TabsTrigger key={em} value={em}>{em} ({emotionCounts[em]})</TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="all">
            <div className="space-y-3">
              {entries.map((entry: any) => (
                <TriggerCard key={entry.id} entry={entry} onDelete={() => deleteEntry.mutate(entry.id)} onDecode={fetchInsight} isDecoding={insightLoading === entry.id} />
              ))}
            </div>
          </TabsContent>
          {Object.keys(emotionCounts).map((em) => (
            <TabsContent key={em} value={em}>
              <div className="space-y-3">
                {entries.filter((e: any) => e.entry_data.emotion === em).map((entry: any) => (
                  <TriggerCard key={entry.id} entry={entry} onDelete={() => deleteEntry.mutate(entry.id)} onDecode={fetchInsight} isDecoding={insightLoading === entry.id} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}

function TriggerCard({ entry, onDelete, onDecode, isDecoding }: { entry: any; onDelete: () => void; onDecode: (id: string, data: any) => void; isDecoding: boolean }) {
  const d = entry.entry_data;
  const insight: TriggerInsight | undefined = d.aiInsight;
  return (
    <Card className="glass-card">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-secondary text-secondary-foreground text-xs">{d.emotion}</Badge>
            <span className="text-xs text-muted-foreground">{format(new Date(entry.created_at), "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-accent h-7 px-2 text-xs hover:bg-accent/10"
              disabled={isDecoding}
              onClick={() => onDecode(entry.id, d)}
            >
              {isDecoding ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Wand2 className="w-3 h-3 mr-1" />}
              {insight ? "Refresh" : "Decode"}
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive h-6 w-6 p-0" onClick={onDelete}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-foreground mb-1">{d.trigger}</p>
        {d.bodySensation && <p className="text-xs text-muted-foreground">Body: {d.bodySensation}</p>}
        {d.rootResponse && <p className="text-xs text-muted-foreground mt-1 italic whitespace-pre-wrap">Reflection: {d.rootResponse}</p>}

        <AnimatePresence>
          {insight && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-3 border-t border-border pt-4"
            >
              <div>
                <p className="text-xs font-semibold text-accent mb-1">🧠 Body-Mind Connection</p>
                <p className="text-sm text-foreground/90">{insight.bodySensation}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-accent mb-1">🪞 Root Reflection</p>
                <p className="text-sm text-foreground/90">{insight.rootReflection}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-accent mb-1">📝 Healing Prompt</p>
                <p className="text-sm text-foreground/90">{insight.healingPrompt}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
