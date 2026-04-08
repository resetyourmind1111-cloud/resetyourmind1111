import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useHealingToolEntries } from "@/hooks/useHealingToolEntries";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Shield, ChevronRight, ChevronLeft, Sparkles, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AiButton } from "@/components/AiButton";
import { useUsage } from "@/contexts/UsageContext";

const STEPS = [
  { title: "Identify", prompt: "Who or what needs a boundary right now?" },
  { title: "Why It Matters", prompt: "What am I protecting — my peace, energy, time, self-worth?" },
  { title: "The Block", prompt: "What has stopped me from setting this boundary before?" },
  { title: "Script Options", prompt: "Choose or adapt a script:" },
  { title: "Practice", prompt: "Write it in your own words:" },
  { title: "Accountability", prompt: "When will you deliver this boundary?" },
];

export default function BoundaryBuilder() {
  const { entries, saveEntry, updateEntry, deleteEntry } = useHealingToolEntries("boundary-builder");
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(0);
  const [who, setWho] = useState("");
  const [why, setWhy] = useState("");
  const [block, setBlock] = useState("");
  const [script, setScript] = useState("");
  const [practice, setPractice] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [reflectingId, setReflectingId] = useState<string | null>(null);
  const [reflection, setReflection] = useState("");
  const [isCoaching, setIsCoaching] = useState(false);
  const [aiInsight, setAiInsight] = useState("");
  const [aiScripts, setAiScripts] = useState<{ direct: string; gentle: string; practice: string } | null>(null);

  const handleSave = () => {
    if (!who.trim()) return;
    saveEntry.mutate(
      { who, why, block, script, practice, deliveryDate, reflection: "", status: deliveryDate ? "pending" : "set" },
      {
        onSuccess: () => {
          setWho(""); setWhy(""); setBlock(""); setScript(""); setPractice("");
          setDeliveryDate(""); setStep(0); setShowForm(false); setAiInsight(""); setAiScripts(null);
        },
      }
    );
  };

  const handleAiCoach = async () => {
    if (!who.trim()) {
      toast.error("Please identify who or what needs a boundary first");
      return;
    }
    setIsCoaching(true);
    try {
      const { data, error } = await supabase.functions.invoke("boundary-coach", {
        body: { who: who.trim(), why: why.trim() || undefined, block: block.trim() || undefined },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data.whyItMatters) setWhy(data.whyItMatters);
      if (data.blockInsight) setBlock(data.blockInsight);
      setAiInsight(data.whyItMatters || "");
      setAiScripts({
        direct: data.directScript || "",
        gentle: data.gentleScript || "",
        practice: data.practiceWords || "",
      });
      toast.success("Boundary coaching ready — review and personalize");
    } catch (err: any) {
      console.error("Boundary coach error:", err);
      toast.error(err.message || "Failed to generate coaching. Please try again.");
    } finally {
      setIsCoaching(false);
    }
  };

  const handleReflection = (entry: any) => {
    updateEntry.mutate({ id: entry.id, entryData: { ...entry.entry_data, reflection, status: "reflected" } });
    setReflectingId(null);
    setReflection("");
  };

  const scripts = aiScripts
    ? [aiScripts.direct, aiScripts.gentle, aiScripts.practice]
    : who ? [
        `I need you to respect this boundary. This is important to me.`,
        `I care about our relationship and I also need this boundary honored.`,
        `I have communicated this before. Going forward, this is non-negotiable.`,
      ] : [];

  const renderStep = () => {
    switch (step) {
      case 0: return (
        <div className="space-y-3">
          <Textarea placeholder="Who or what..." value={who} onChange={(e) => setWho(e.target.value)} className="bg-input border-border" />
          {/* AI Coach Button - available after step 0 */}
          <Button
            onClick={handleAiCoach}
            disabled={isCoaching || !who.trim()}
            variant="outline"
            className="w-full border-primary/30 text-primary hover:bg-primary/10"
          >
            {isCoaching ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Coaching with AI...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" /> Help Me Build This Boundary (AI)</>
            )}
          </Button>
        </div>
      );
      case 1: return <Textarea placeholder="My peace, energy, time..." value={why} onChange={(e) => setWhy(e.target.value)} className="bg-input border-border" />;
      case 2: return <Textarea placeholder="Fear, guilt, obligation..." value={block} onChange={(e) => setBlock(e.target.value)} className="bg-input border-border" />;
      case 3: return (
        <div className="space-y-3">
          {["Direct", "Gentle", aiScripts ? "Personalized" : "Final"].map((label, i) => (
            <button
              key={label}
              onClick={() => setScript(scripts[i])}
              className={`w-full text-left p-3 rounded-lg border text-sm transition-colors ${script === scripts[i] ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:border-accent/30"}`}
            >
              <span className="font-semibold text-foreground">{label}:</span> {scripts[i]}
            </button>
          ))}
        </div>
      );
      case 4: return <Textarea placeholder="In my own words..." value={practice} onChange={(e) => setPractice(e.target.value)} className="bg-input border-border min-h-[120px]" />;
      case 5: return (
        <div>
          <Label className="text-foreground font-semibold">Set a date and time</Label>
          <Input type="datetime-local" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="bg-input border-border mt-1" />
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" /> Build a Boundary
        </Button>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="glass-card">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  {STEPS.map((_, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-accent" : "bg-border"}`} />
                  ))}
                </div>
                <h3 className="font-serif text-lg text-foreground">Step {step + 1}: {STEPS[step].title}</h3>
                <p className="text-sm text-muted-foreground">{STEPS[step].prompt}</p>
                {renderStep()}
                <div className="flex justify-between">
                  <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  {step < 5 ? (
                    <Button onClick={() => setStep(step + 1)} className="bg-accent text-accent-foreground">
                      Next <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  ) : (
                    <Button onClick={handleSave} disabled={saveEntry.isPending} className="bg-accent text-accent-foreground">
                      {saveEntry.isPending ? "Saving..." : "Save Boundary"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {entries.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-serif text-xl text-foreground">Boundary Library</h3>
          {entries.map((entry: any) => {
            const d = entry.entry_data;
            return (
              <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="glass-card">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-accent" />
                        <span className="text-foreground font-semibold">{d.who}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${d.status === "reflected" ? "bg-accent/20 text-accent" : d.status === "pending" ? "bg-muted text-muted-foreground" : "bg-primary/20 text-primary"}`}>
                          {d.status === "reflected" ? "✅ Reflected" : d.status === "pending" ? "⏳ Pending" : "Set"}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive h-6 w-6 p-0" onClick={() => deleteEntry.mutate(entry.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    {d.practice && <p className="text-sm text-foreground/80 mb-1">"{d.practice}"</p>}
                    {d.why && <p className="text-xs text-muted-foreground">Protecting: {d.why}</p>}
                    {d.deliveryDate && <p className="text-xs text-muted-foreground">Deliver by: {format(new Date(d.deliveryDate), "MMM d, yyyy h:mm a")}</p>}
                    {d.reflection && <p className="text-sm text-accent italic mt-2">Reflection: "{d.reflection}"</p>}

                    {!d.reflection && d.status !== "reflected" && (
                      reflectingId === entry.id ? (
                        <div className="mt-3 space-y-2">
                          <p className="text-sm text-muted-foreground italic">How did it go? What happened? How do you feel?</p>
                          <Textarea value={reflection} onChange={(e) => setReflection(e.target.value)} className="bg-input border-border" />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleReflection(entry)} className="bg-accent text-accent-foreground">Save Reflection</Button>
                            <Button size="sm" variant="ghost" onClick={() => setReflectingId(null)}>Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <Button size="sm" variant="ghost" className="text-accent text-xs mt-2" onClick={() => setReflectingId(entry.id)}>
                          + Add Reflection
                        </Button>
                      )
                    )}
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
