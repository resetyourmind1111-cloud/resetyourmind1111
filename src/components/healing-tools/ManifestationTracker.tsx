import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHealingToolEntries } from "@/hooks/useHealingToolEntries";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Star, Sparkles, Wand2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AiButton } from "@/components/AiButton";
import { useUsage } from "@/contexts/UsageContext";

const STATUSES = ["Calling In", "In Progress", "Manifested"] as const;

type ManifestationInsight = {
  energeticAlignment: string;
  hiddenPattern: string;
  nextStep: string;
};

export default function ManifestationTracker() {
  const { entries, saveEntry, updateEntry, deleteEntry } = useHealingToolEntries("manifestation-tracker");
  const [showForm, setShowForm] = useState(false);
  const [intention, setIntention] = useState("");
  const [feeling, setFeeling] = useState("");
  const [addEvidenceId, setAddEvidenceId] = useState<string | null>(null);
  const [evidenceText, setEvidenceText] = useState("");
  const [insightLoading, setInsightLoading] = useState<string | null>(null);

  const handleSave = () => {
    if (!intention.trim()) return;
    saveEntry.mutate(
      { intention, feeling, status: "Calling In", evidence: [], createdDate: new Date().toISOString() },
      { onSuccess: () => { setIntention(""); setFeeling(""); setShowForm(false); } }
    );
  };

  const handleStatusChange = (entry: any, newStatus: string) => {
    const data = { ...entry.entry_data, status: newStatus };
    if (newStatus === "Manifested") data.manifestedDate = new Date().toISOString();
    updateEntry.mutate({ id: entry.id, entryData: data });
  };

  const handleAddEvidence = (entry: any) => {
    if (!evidenceText.trim()) return;
    const evidence = [...(entry.entry_data.evidence || []), { text: evidenceText, date: new Date().toISOString() }];
    updateEntry.mutate({ id: entry.id, entryData: { ...entry.entry_data, evidence } });
    setEvidenceText("");
    setAddEvidenceId(null);
  };

  const fetchInsight = async (entryId: string, entryData: any) => {
    setInsightLoading(entryId);
    try {
      const { data, error } = await supabase.functions.invoke("manifestation-insight", {
        body: { intention: entryData.intention, feeling: entryData.feeling, status: entryData.status, evidence: entryData.evidence },
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

  const active = entries.filter((e: any) => e.entry_data.status !== "Manifested");
  const manifested = entries.filter((e: any) => e.entry_data.status === "Manifested");

  return (
    <div className="space-y-6">
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" /> New Intention
        </Button>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="glass-card">
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label className="text-foreground font-semibold">What are you calling in?</Label>
                  <Textarea placeholder="Describe your intention..." value={intention} onChange={(e) => setIntention(e.target.value)} className="bg-input border-border mt-1" />
                </div>
                <div>
                  <Label className="text-foreground font-semibold">How will it feel when it arrives?</Label>
                  <p className="text-xs text-muted-foreground mb-1">Describe in present tense as if it is already here</p>
                  <Textarea placeholder="I feel..." value={feeling} onChange={(e) => setFeeling(e.target.value)} className="bg-input border-border" />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleSave} disabled={saveEntry.isPending} className="bg-accent text-accent-foreground">
                    {saveEntry.isPending ? "Saving..." : "Set Intention"}
                  </Button>
                  <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="bg-card/50">
          <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="manifested">
            <Sparkles className="w-3 h-3 mr-1" /> Success Gallery ({manifested.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-4">
          {active.map((entry: any) => {
            const d = entry.entry_data;
            const insight: ManifestationInsight | undefined = d.aiInsight;
            const isLoading = insightLoading === entry.id;
            return (
              <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="glass-card">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-foreground font-semibold">{d.intention}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(d.createdDate), "MMM d, yyyy")}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-accent h-7 px-2 text-xs hover:bg-accent/10"
                          disabled={isLoading}
                          onClick={() => fetchInsight(entry.id, d)}
                        >
                          {isLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Wand2 className="w-3 h-3 mr-1" />}
                          {insight ? "Refresh" : "Decode"}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive h-6 w-6 p-0" onClick={() => deleteEntry.mutate(entry.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    {d.feeling && <p className="text-sm text-muted-foreground italic">"{d.feeling}"</p>}

                    <div className="flex gap-2">
                      {STATUSES.map((s) => (
                        <Button
                          key={s}
                          size="sm"
                          variant={d.status === s ? "default" : "outline"}
                          className={d.status === s ? "bg-accent text-accent-foreground" : "border-border text-muted-foreground"}
                          onClick={() => handleStatusChange(entry, s)}
                        >
                          {s === "Manifested" && <Star className="w-3 h-3 mr-1" />}
                          {s}
                        </Button>
                      ))}
                    </div>

                    {d.evidence?.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-semibold">Signs & Synchronicities:</p>
                        {d.evidence.map((ev: any, i: number) => (
                          <p key={i} className="text-xs text-foreground/70">• {ev.text} <span className="text-muted-foreground">({format(new Date(ev.date), "MMM d")})</span></p>
                        ))}
                      </div>
                    )}

                    {addEvidenceId === entry.id ? (
                      <div className="flex gap-2">
                        <Input placeholder="What sign appeared?" value={evidenceText} onChange={(e) => setEvidenceText(e.target.value)} className="bg-input border-border text-sm" />
                        <Button size="sm" onClick={() => handleAddEvidence(entry)} className="bg-accent text-accent-foreground">Add</Button>
                        <Button size="sm" variant="ghost" onClick={() => setAddEvidenceId(null)}>Cancel</Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="ghost" className="text-accent text-xs" onClick={() => setAddEvidenceId(entry.id)}>
                        + Add Evidence
                      </Button>
                    )}

                    <AnimatePresence>
                      {insight && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 space-y-3 border-t border-border pt-4"
                        >
                          <div>
                            <p className="text-xs font-semibold text-accent mb-1">⚡ Energetic Alignment</p>
                            <p className="text-sm text-foreground/90">{insight.energeticAlignment}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-accent mb-1">🪞 Hidden Pattern</p>
                            <p className="text-sm text-foreground/90">{insight.hiddenPattern}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-accent mb-1">🎯 Next Step</p>
                            <p className="text-sm text-foreground/90">{insight.nextStep}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
          {active.length === 0 && <p className="text-muted-foreground text-center py-8">No active intentions yet. Set your first one above.</p>}
        </TabsContent>

        <TabsContent value="manifested" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {manifested.map((entry: any) => {
              const d = entry.entry_data;
              return (
                <motion.div key={entry.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <Card className="glass-card border-accent/30">
                    <CardContent className="p-5 text-center">
                      <Sparkles className="w-8 h-8 text-accent mx-auto mb-2" />
                      <p className="font-serif text-lg text-accent mb-1">{d.intention}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(d.createdDate), "MMM d")} → {d.manifestedDate ? format(new Date(d.manifestedDate), "MMM d, yyyy") : ""}
                      </p>
                      {d.feeling && <p className="text-sm text-muted-foreground italic mt-2">"{d.feeling}"</p>}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
            {manifested.length === 0 && <p className="text-muted-foreground text-center py-8 col-span-2">Your manifested intentions will appear here as gold cards.</p>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
