import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useHealingToolEntries } from "@/hooks/useHealingToolEntries";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Scissors, Heart, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

const ritualSteps = [
  { title: "Set Your Intention", instruction: "Find a quiet space. Close your eyes. Take three deep breaths. Set your intention to release the energetic cords that no longer serve your highest good." },
  { title: "Identify the Connection", instruction: "Visualize the person, situation, or pattern you are cutting cords with. See the energetic cord connecting you to them. Notice where it attaches to your body. What color is it? How thick is it?" },
  { title: "Honor the Lesson", instruction: "Before you cut, honor what this connection taught you. Every cord carries a lesson. Acknowledge the growth, even if it came through pain." },
  { title: "The Cutting", instruction: "Visualize a golden sword of light in your hands. With love and firmness, cut the cord. See it dissolve into light. Feel the release in your body. You are free." },
  { title: "Seal & Protect", instruction: "Place your hand where the cord was attached. Visualize golden healing light filling that space. Seal it with love. You are whole. You are complete without this cord." },
  { title: "Declare Your Freedom", instruction: "Speak your closure statement aloud or in your heart. Declare your sovereignty. This is your reclamation." },
];

const closureTemplates = [
  "I release you with love. I take back my energy. I am whole.",
  "I honor what we shared. I forgive what hurt. I am free to move forward.",
  "I cut this cord not from hatred but from self-love. I choose myself.",
  "What was meant for me has already blessed me. I release the rest.",
  "I am no longer energetically available for this pattern. I am sovereign.",
  "I send you love from a distance. I reclaim my peace.",
];

const emotionScale = ["Peaceful", "Relieved", "Neutral", "Unsettled", "Heavy", "Anxious", "Grief", "Angry"];

export default function EnergyCordCutting() {
  const { entries, saveEntry, deleteEntry } = useHealingToolEntries("energy-cord-cutting");
  const [showRitual, setShowRitual] = useState(false);
  const [ritualStep, setRitualStep] = useState(0);
  const [person, setPerson] = useState("");
  const [relationship, setRelationship] = useState("");
  const [cordLocation, setCordLocation] = useState("");
  const [lesson, setLesson] = useState("");
  const [closureStatement, setClosureStatement] = useState("");
  const [preFeelings, setPreFeelings] = useState<string[]>([]);
  const [postFeelings, setPostFeelings] = useState<string[]>([]);
  const [preIntensity, setPreIntensity] = useState([5]);
  const [postIntensity, setPostIntensity] = useState([5]);
  const [journalReflection, setJournalReflection] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiGuide, setAiGuide] = useState<any>(null);

  const handleAiGuide = async () => {
    if (!person.trim()) return;
    setIsAnalyzing(true);
    setAiGuide(null);
    try {
      const { data, error } = await supabase.functions.invoke("healing-tool-insight", {
        body: { toolType: "cord-cutting-guide", person, relationship, cordLocation, preFeelings, preIntensity: preIntensity[0] },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setAiGuide(data);
      toast.success("Cord insight revealed ✨");
    } catch (err: any) {
      toast.error(err.message || "Failed to get guidance");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setPerson(""); setRelationship(""); setCordLocation(""); setLesson("");
    setClosureStatement(""); setPreFeelings([]); setPostFeelings([]);
    setPreIntensity([5]); setPostIntensity([5]); setJournalReflection("");
    setRitualStep(0); setShowRitual(false);
  };

  const handleSave = () => {
    if (!person.trim()) return;
    saveEntry.mutate({
      person, relationship, cordLocation, lesson, closureStatement,
      preFeelings, postFeelings,
      preIntensity: preIntensity[0], postIntensity: postIntensity[0],
      journalReflection,
      date: new Date().toISOString(),
    }, { onSuccess: resetForm });
  };

  const toggleFeeling = (feeling: string, type: "pre" | "post") => {
    if (type === "pre") {
      setPreFeelings(prev => prev.includes(feeling) ? prev.filter(f => f !== feeling) : [...prev, feeling]);
    } else {
      setPostFeelings(prev => prev.includes(feeling) ? prev.filter(f => f !== feeling) : [...prev, feeling]);
    }
  };

  return (
    <div className="space-y-6">
      {!showRitual && (
        <Button onClick={() => setShowRitual(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Scissors className="w-4 h-4 mr-2" /> Begin Cord Cutting Ritual
        </Button>
      )}

      <AnimatePresence>
        {showRitual && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            {/* Step 1: Identify */}
            {ritualStep === 0 && (
              <Card className="glass-card">
                <CardContent className="p-6 space-y-5">
                  <div className="flex items-center gap-2">
                    <Scissors className="w-5 h-5 text-accent" />
                    <h3 className="font-serif text-lg text-foreground">Who or What Are You Releasing?</h3>
                  </div>
                  <div>
                    <Label className="text-foreground font-semibold">Person / Situation / Pattern</Label>
                    <p className="text-xs text-muted-foreground mb-2">Name the connection you are ready to release</p>
                    <Textarea placeholder="e.g. My ex-partner, my old job, the pattern of people-pleasing..." value={person} onChange={(e) => setPerson(e.target.value)} className="bg-input border-border" />
                  </div>
                  <div>
                    <Label className="text-foreground font-semibold">Relationship / Context</Label>
                    <Textarea placeholder="Describe the nature of this connection and why you're ready to release it..." value={relationship} onChange={(e) => setRelationship(e.target.value)} className="bg-input border-border" />
                  </div>
                  <div>
                    <Label className="text-foreground font-semibold">Where do you feel this cord in your body?</Label>
                    <Textarea placeholder="e.g. My chest feels tight, my stomach knots, my throat closes..." value={cordLocation} onChange={(e) => setCordLocation(e.target.value)} className="bg-input border-border" />
                  </div>

                  <div>
                    <Label className="text-foreground font-semibold mb-2 block">Pre-Ritual Emotional Check-in</Label>
                    <p className="text-xs text-muted-foreground mb-3">Select all emotions you're feeling right now</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {emotionScale.map((em) => (
                        <Button
                          key={em}
                          size="sm"
                          variant={preFeelings.includes(em) ? "default" : "outline"}
                          className={preFeelings.includes(em) ? "bg-accent text-accent-foreground text-xs" : "border-accent/30 text-accent hover:bg-accent/10 text-xs"}
                          onClick={() => toggleFeeling(em, "pre")}
                        >
                          {em}
                        </Button>
                      ))}
                    </div>
                    <Label className="text-foreground text-sm">Emotional intensity: {preIntensity[0]}/10</Label>
                    <Slider value={preIntensity} onValueChange={setPreIntensity} min={1} max={10} step={1} className="mt-2" />
                  </div>

                  <Button
                    onClick={() => setRitualStep(1)}
                    disabled={!person.trim()}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Begin the Ritual →
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Steps 2-6: Guided Ritual */}
            {ritualStep >= 1 && ritualStep <= 6 && (
              <Card className="glass-card">
                <CardContent className="p-6 space-y-5">
                  <Progress value={(ritualStep / 6) * 100} className="h-2 bg-muted" />
                  <Badge variant="outline" className="border-accent/30 text-accent">Step {ritualStep} of 6</Badge>
                  <h3 className="font-serif text-xl text-foreground">{ritualSteps[ritualStep - 1].title}</h3>
                  <div className="glass-card p-5">
                    <p className="text-sm text-muted-foreground italic leading-relaxed">{ritualSteps[ritualStep - 1].instruction}</p>
                  </div>

                  {ritualStep === 3 && (
                    <div>
                      <Label className="text-foreground font-semibold">What did this connection teach you?</Label>
                      <Textarea placeholder="Honor the lesson before you release..." value={lesson} onChange={(e) => setLesson(e.target.value)} className="bg-input border-border" />
                    </div>
                  )}

                  {ritualStep === 6 && (
                    <div className="space-y-4">
                      <Label className="text-foreground font-semibold">Your Closure Statement</Label>
                      <p className="text-xs text-muted-foreground">Write your own or choose a template below</p>
                      <div className="space-y-2">
                        {closureTemplates.map((t, i) => (
                          <div
                            key={i}
                            className={`glass-card p-3 cursor-pointer transition-all text-sm ${closureStatement === t ? "ring-2 ring-accent" : "hover:bg-accent/5"}`}
                            onClick={() => setClosureStatement(t)}
                          >
                            <p className="text-muted-foreground italic">"{t}"</p>
                          </div>
                        ))}
                      </div>
                      <Textarea
                        placeholder="Or write your own closure statement..."
                        value={closureStatement}
                        onChange={(e) => setClosureStatement(e.target.value)}
                        className="bg-input border-border"
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    {ritualStep > 1 && <Button variant="ghost" onClick={() => setRitualStep(ritualStep - 1)}>← Back</Button>}
                    {ritualStep < 6 ? (
                      <Button onClick={() => setRitualStep(ritualStep + 1)} className="bg-accent text-accent-foreground hover:bg-accent/90">Continue →</Button>
                    ) : (
                      <Button onClick={() => setRitualStep(7)} className="bg-accent text-accent-foreground hover:bg-accent/90">
                        <Sparkles className="w-4 h-4 mr-2" /> Complete Ritual
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 7: Post-Ritual */}
            {ritualStep === 7 && (
              <Card className="glass-card">
                <CardContent className="p-6 space-y-5">
                  <div className="text-center mb-4">
                    <Heart className="w-10 h-10 text-accent mx-auto mb-2" />
                    <h3 className="font-serif text-xl text-foreground">You Are Free</h3>
                    <p className="text-sm text-muted-foreground">Take a moment to notice how you feel now.</p>
                  </div>

                  <div>
                    <Label className="text-foreground font-semibold mb-2 block">Post-Ritual Emotional Check-in</Label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {emotionScale.map((em) => (
                        <Button
                          key={em}
                          size="sm"
                          variant={postFeelings.includes(em) ? "default" : "outline"}
                          className={postFeelings.includes(em) ? "bg-accent text-accent-foreground text-xs" : "border-accent/30 text-accent hover:bg-accent/10 text-xs"}
                          onClick={() => toggleFeeling(em, "post")}
                        >
                          {em}
                        </Button>
                      ))}
                    </div>
                    <Label className="text-foreground text-sm">Emotional intensity: {postIntensity[0]}/10</Label>
                    <Slider value={postIntensity} onValueChange={setPostIntensity} min={1} max={10} step={1} className="mt-2" />
                  </div>

                  <div>
                    <Label className="text-foreground font-semibold">Final Reflection</Label>
                    <Textarea placeholder="What shifted? What do you want to remember about this release?" value={journalReflection} onChange={(e) => setJournalReflection(e.target.value)} className="bg-input border-border" />
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleSave} disabled={saveEntry.isPending} className="bg-accent text-accent-foreground hover:bg-accent/90">
                      {saveEntry.isPending ? "Saving..." : "Save Ritual"}
                    </Button>
                    <Button variant="ghost" onClick={resetForm}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* History */}
      {entries.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-serif text-xl text-foreground">Ritual History</h3>
          {entries.map((entry: any) => {
            const d = entry.entry_data;
            return (
              <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="glass-card">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs text-muted-foreground">{format(new Date(entry.created_at), "MMM d, yyyy")}</span>
                      <Button variant="ghost" size="sm" className="text-destructive h-6 w-6 p-0" onClick={() => deleteEntry.mutate(entry.id)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                    <p className="font-serif text-foreground font-semibold mb-1">Released: {d.person}</p>
                    {d.relationship && <p className="text-xs text-muted-foreground mb-2">{d.relationship}</p>}
                    {d.closureStatement && <p className="text-sm text-accent italic mb-2">"{d.closureStatement}"</p>}
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Before: {d.preIntensity}/10</span>
                      <span>→</span>
                      <span>After: {d.postIntensity}/10</span>
                    </div>
                    {d.preFeelings?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {d.preFeelings.map((f: string) => <Badge key={f} variant="outline" className="text-[10px] border-destructive/30 text-destructive">{f}</Badge>)}
                        <span className="text-xs text-muted-foreground mx-1">→</span>
                        {d.postFeelings?.map((f: string) => <Badge key={f} variant="outline" className="text-[10px] border-accent/30 text-accent">{f}</Badge>)}
                      </div>
                    )}
                    {d.journalReflection && <p className="text-sm text-muted-foreground mt-2">{d.journalReflection}</p>}
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
