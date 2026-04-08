import { useState } from "react";
import { useHealingToolEntries } from "@/hooks/useHealingToolEntries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Sparkles, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AiButton } from "@/components/AiButton";
import { useUsage } from "@/contexts/UsageContext";

const bodyAreas = ["Head", "Jaw/Throat", "Neck/Shoulders", "Chest/Heart", "Stomach/Solar Plexus", "Lower Belly/Sacral", "Hips/Pelvis", "Upper Back", "Lower Back", "Arms/Hands", "Legs/Feet", "Full Body"];
const sensations = ["Tension", "Pain", "Tightness", "Heaviness", "Warmth", "Tingling", "Numbness", "Fluttering", "Pressure", "Buzzing", "Coldness", "Emptiness"];
const emotions = ["Anxiety", "Sadness", "Anger", "Fear", "Shame", "Joy", "Love", "Grief", "Overwhelm", "Peace", "Confusion", "Power"];

export default function BodyMapJournal() {
  const { entries, isLoading, saveEntry, deleteEntry } = useHealingToolEntries("body-map-journal");
  const { isLimitReached, incrementUsage } = useUsage();
  const [area, setArea] = useState("");
  const [sensation, setSensation] = useState("");
  const [emotion, setEmotion] = useState("");
  const [intensity, setIntensity] = useState("5");
  const [trigger, setTrigger] = useState("");
  const [message, setMessage] = useState("");
  const [release, setRelease] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSave = () => {
    if (!area || !sensation) return;
    saveEntry.mutate({ body_area: area, sensation, emotion, intensity: Number(intensity), trigger, body_message: message, release_action: release });
    setArea(""); setSensation(""); setEmotion(""); setIntensity("5"); setTrigger(""); setMessage(""); setRelease("");
  };

  const handleAiInsight = async () => {
    if (isLimitReached) { toast.error("Daily limit reached — resets at midnight"); return; }
    const allowed = await incrementUsage(); if (!allowed) return;
    if (!area || !sensation) {
      toast.error("Please select a body area and sensation first");
      return;
    }
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("body-map-insight", {
        body: { bodyArea: area, sensation, emotion: emotion || undefined },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data.bodyMessage) setMessage(data.bodyMessage);
      if (data.triggerInsight) setTrigger(data.triggerInsight);
      if (data.releaseAction) setRelease(data.releaseAction);
      toast.success("AI insight complete — review and personalize");
    } catch (err: any) {
      console.error("Body map insight error:", err);
      toast.error(err.message || "Failed to get insight. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Tabs defaultValue="log">
      <TabsList className="mb-6"><TabsTrigger value="log">New Entry</TabsTrigger><TabsTrigger value="history">History ({entries.length})</TabsTrigger><TabsTrigger value="patterns">Patterns</TabsTrigger></TabsList>
      <TabsContent value="log">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader><CardTitle className="font-serif text-lg">Where do you feel it?</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {bodyAreas.map(a => (
                  <button key={a} onClick={() => setArea(a)} className={`px-3 py-1.5 rounded-full text-sm border transition-all ${area === a ? "bg-accent text-accent-foreground border-accent" : "border-border text-muted-foreground hover:border-accent/40"}`}>{a}</button>
                ))}
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">What sensation?</label>
                <div className="flex flex-wrap gap-2">
                  {sensations.map(s => (
                    <button key={s} onClick={() => setSensation(s)} className={`px-3 py-1.5 rounded-full text-sm border transition-all ${sensation === s ? "bg-accent text-accent-foreground border-accent" : "border-border text-muted-foreground hover:border-accent/40"}`}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Connected emotion?</label>
                <div className="flex flex-wrap gap-2">
                  {emotions.map(em => (
                    <button key={em} onClick={() => setEmotion(em)} className={`px-3 py-1.5 rounded-full text-sm border transition-all ${emotion === em ? "bg-accent text-accent-foreground border-accent" : "border-border text-muted-foreground hover:border-accent/40"}`}>{em}</button>
                  ))}
                </div>
              </div>
              <Button
                onClick={handleAiInsight}
                variant="outline"
                className="w-full mt-2 border-accent/30 text-accent hover:bg-accent/10"
                disabled={!area || !sensation || isAnalyzing}
              >
                {isAnalyzing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Listening to your body...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" /> AI: Decode This Sensation</>
                )}
              </Button>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader><CardTitle className="font-serif text-lg">Go Deeper</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Intensity (1-10)</label>
                <Select value={intensity} onValueChange={setIntensity}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{Array.from({length:10},(_,i)=>i+1).map(n=><SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><label className="text-sm font-medium text-foreground">What triggered this?</label><Textarea value={trigger} onChange={e=>setTrigger(e.target.value)} placeholder="A conversation, memory, thought..." rows={2} /></div>
              <div><label className="text-sm font-medium text-foreground">If this sensation could speak, what would it say?</label><Textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Listen to your body..." rows={3} /></div>
              <div><label className="text-sm font-medium text-foreground">What does this part of you need?</label><Textarea value={release} onChange={e=>setRelease(e.target.value)} placeholder="Rest, movement, tears, comfort..." rows={2} /></div>
              <Button onClick={handleSave} variant="gold" className="w-full" disabled={!area || !sensation}>Save Body Check-In</Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="history">
        {isLoading ? <p className="text-muted-foreground">Loading...</p> : entries.length === 0 ? <p className="text-muted-foreground text-center py-8">No entries yet.</p> :
          <div className="space-y-3">{entries.map((e: any) => (
            <Card key={e.id} className="glass-card"><CardContent className="pt-4 flex justify-between items-start">
              <div>
                <p className="font-semibold text-foreground">{e.entry_data.body_area} — {e.entry_data.sensation}</p>
                <p className="text-sm text-muted-foreground">{e.entry_data.emotion && `${e.entry_data.emotion} · `}Intensity {e.entry_data.intensity}/10 · {format(new Date(e.created_at), "MMM d, yyyy")}</p>
                {e.entry_data.body_message && <p className="text-sm italic text-muted-foreground mt-1">"{e.entry_data.body_message}"</p>}
              </div>
              <Button variant="ghost" size="icon" onClick={() => deleteEntry.mutate(e.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </CardContent></Card>
          ))}</div>}
      </TabsContent>
      <TabsContent value="patterns">
        <Card className="glass-card"><CardContent className="pt-6">
          {entries.length < 3 ? <p className="text-muted-foreground text-center py-8">Log at least 3 entries to see patterns.</p> : (() => {
            const areaCounts: Record<string, number> = {}; const emotionCounts: Record<string, number> = {};
            entries.forEach((e: any) => { areaCounts[e.entry_data.body_area] = (areaCounts[e.entry_data.body_area]||0)+1; if(e.entry_data.emotion) emotionCounts[e.entry_data.emotion] = (emotionCounts[e.entry_data.emotion]||0)+1; });
            const topArea = Object.entries(areaCounts).sort((a,b)=>b[1]-a[1])[0];
            const topEmotion = Object.entries(emotionCounts).sort((a,b)=>b[1]-a[1])[0];
            return (<div className="space-y-4">
              <div><p className="text-sm text-muted-foreground">Most active area</p><p className="text-xl font-serif text-foreground">{topArea[0]} ({topArea[1]} entries)</p></div>
              {topEmotion && <div><p className="text-sm text-muted-foreground">Most frequent emotion</p><p className="text-xl font-serif text-foreground">{topEmotion[0]} ({topEmotion[1]} times)</p></div>}
              <div><p className="text-sm text-muted-foreground">Total check-ins</p><p className="text-xl font-serif text-foreground">{entries.length}</p></div>
            </div>);
          })()}
        </CardContent></Card>
      </TabsContent>
    </Tabs>
  );
}
