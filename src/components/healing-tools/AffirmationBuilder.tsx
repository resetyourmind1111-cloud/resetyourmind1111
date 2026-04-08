import { useState } from "react";
import { useHealingToolEntries } from "@/hooks/useHealingToolEntries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Copy, Shuffle, Sparkles, Loader2, Plus } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { AiButton } from "@/components/AiButton";
import { useUsage } from "@/contexts/UsageContext";
import { supabase } from "@/integrations/supabase/client";

const categories = ["Self-Worth", "Abundance", "Love", "Healing", "Power", "Purpose", "Boundaries", "Joy"];

const starters: Record<string, string[]> = {
  "Self-Worth": ["I am worthy of love exactly as I am", "I do not need to earn my place in this world", "My value is not determined by my productivity"],
  "Abundance": ["Money flows to me easily and frequently", "I am a magnet for abundance in all forms", "I release all scarcity thinking now"],
  "Love": ["I am deeply lovable and deserving of healthy love", "I attract love that feels safe and expansive", "I choose myself first, and love follows"],
  "Healing": ["I am healing at exactly the right pace", "My wounds are becoming my wisdom", "I release what no longer serves my highest good"],
  "Power": ["I am the most powerful person in my own life", "I trust my decisions completely", "I lead with conviction and grace"],
  "Purpose": ["I was born for this moment", "My purpose unfolds as I show up fully", "I trust the path even when I cannot see the destination"],
  "Boundaries": ["No is a complete sentence", "I protect my energy without guilt", "My boundaries are an act of self-love"],
  "Joy": ["I give myself permission to feel deep joy", "Happiness is my birthright", "I celebrate myself without apology"],
};

interface AiAffirmation {
  text: string;
  why: string;
}

export default function AffirmationBuilder() {
  const { entries, isLoading, saveEntry, deleteEntry } = useHealingToolEntries("affirmation-builder");
  const [category, setCategory] = useState("Self-Worth");
  const [affirmation, setAffirmation] = useState("");
  const [reminder, setReminder] = useState("morning");

  // AI generation state
  const [struggle, setStruggle] = useState("");
  const [desiredFeeling, setDesiredFeeling] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResults, setAiResults] = useState<AiAffirmation[]>([]);

  const inspire = () => {
    const list = starters[category] || starters["Self-Worth"];
    setAffirmation(list[Math.floor(Math.random() * list.length)]);
  };

  const handleSave = () => {
    if (!affirmation.trim()) return;
    saveEntry.mutate({ affirmation: affirmation.trim(), category, reminder_time: reminder });
    setAffirmation("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setAiResults([]);
    try {
      const { data, error } = await supabase.functions.invoke("generate-affirmations", {
        body: { category, struggle: struggle || undefined, desiredFeeling: desiredFeeling || undefined },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.affirmations) {
        setAiResults(data.affirmations);
        toast.success("3 personalized affirmations generated ✨");
      }
    } catch (err: any) {
      console.error("Generate affirmations error:", err);
      toast.error(err.message || "Failed to generate affirmations");
    } finally {
      setIsGenerating(false);
    }
  };

  const useAiAffirmation = (text: string) => {
    setAffirmation(text);
    toast.success("Added to your affirmation — save it when ready!");
  };

  const saveAiAffirmationDirectly = (text: string) => {
    saveEntry.mutate({ affirmation: text.trim(), category, reminder_time: reminder, ai_generated: true });
  };

  return (
    <Tabs defaultValue="create">
      <TabsList className="mb-6"><TabsTrigger value="create">Create</TabsTrigger><TabsTrigger value="ai">✨ AI Generate</TabsTrigger><TabsTrigger value="collection">My Affirmations ({entries.length})</TabsTrigger><TabsTrigger value="daily">Daily Practice</TabsTrigger></TabsList>

      {/* Manual Create Tab */}
      <TabsContent value="create">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader><CardTitle className="font-serif text-lg">Build Your Affirmation</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><label className="text-sm font-medium text-foreground">Category</label>
                <Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
              </div>
              <div><label className="text-sm font-medium text-foreground">Your Affirmation</label>
                <Input value={affirmation} onChange={e=>setAffirmation(e.target.value)} placeholder="I am..." className="text-base" /></div>
              <Button onClick={inspire} variant="outline" className="w-full"><Shuffle className="w-4 h-4 mr-2" /> Inspire Me</Button>
              <div><label className="text-sm font-medium text-foreground">Reminder</label>
                <Select value={reminder} onValueChange={setReminder}><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="morning">Morning</SelectItem><SelectItem value="afternoon">Afternoon</SelectItem><SelectItem value="evening">Evening</SelectItem><SelectItem value="none">No Reminder</SelectItem></SelectContent></Select>
              </div>
              <Button onClick={handleSave} variant="gold" className="w-full" disabled={!affirmation.trim()}>Save Affirmation</Button>
            </CardContent>
          </Card>
          <Card className="glass-card bg-accent/5">
            <CardHeader><CardTitle className="font-serif text-lg">✨ Tips</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>• Start with "I am" or "I have" — present tense</p>
              <p>• Make it personal and specific to YOU</p>
              <p>• If it makes you emotional, it's hitting the right wound</p>
              <p>• Say it out loud, looking in the mirror</p>
              <p>• Write it on your mirror, your phone wallpaper, your steering wheel</p>
              <p>• Repeat it until your body believes it</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* AI Generate Tab */}
      <TabsContent value="ai">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="glass-card border-accent/20">
            <CardHeader>
              <CardTitle className="font-serif text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" /> AI Affirmation Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Tell me what you're working through, and I'll create affirmations designed specifically for your healing.</p>
              <div>
                <label className="text-sm font-medium text-foreground">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">What are you struggling with right now?</label>
                <Textarea
                  value={struggle}
                  onChange={e => setStruggle(e.target.value)}
                  placeholder="e.g., I keep undercharging for my work because I don't feel like I'm good enough..."
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">How do you want to feel instead?</label>
                <Input
                  value={desiredFeeling}
                  onChange={e => setDesiredFeeling(e.target.value)}
                  placeholder="e.g., Confident, abundant, unapologetic"
                />
              </div>
              <Button
                onClick={handleGenerate}
                variant="gold"
                className="w-full"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Channeling your affirmations...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" /> Generate My Affirmations</>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {aiResults.length > 0 ? (
              <>
                <h3 className="font-serif text-lg text-foreground">Your Personalized Affirmations</h3>
                {aiResults.map((a, i) => (
                  <Card key={i} className="glass-card border-accent/10 hover:border-accent/30 transition-colors">
                    <CardContent className="pt-5 space-y-3">
                      <p className="font-serif text-lg text-foreground leading-relaxed">"{a.text}"</p>
                      <p className="text-sm text-muted-foreground italic">{a.why}</p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => useAiAffirmation(a.text)}
                          className="border-accent/30 text-accent hover:bg-accent/10"
                        >
                          Edit & Save
                        </Button>
                        <Button
                          variant="gold"
                          size="sm"
                          onClick={() => saveAiAffirmationDirectly(a.text)}
                        >
                          <Plus className="w-3 h-3 mr-1" /> Save to Collection
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(a.text)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <Card className="glass-card bg-accent/5">
                <CardContent className="pt-6 text-center py-16">
                  <Sparkles className="w-10 h-10 text-accent/40 mx-auto mb-4" />
                  <p className="text-muted-foreground text-sm">Share what you're working through and the AI will generate 3 personalized affirmations just for you.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </TabsContent>

      {/* Collection Tab */}
      <TabsContent value="collection">
        {isLoading ? <p className="text-muted-foreground">Loading...</p> : entries.length === 0 ? <p className="text-muted-foreground text-center py-8">No affirmations yet. Create your first one!</p> :
          <div className="grid md:grid-cols-2 gap-3">{entries.map((e: any) => (
            <Card key={e.id} className="glass-card"><CardContent className="pt-4">
              <p className="font-serif text-lg text-foreground mb-2">"{e.entry_data.affirmation}"</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-accent">
                  {e.entry_data.category} · {e.entry_data.reminder_time}
                  {e.entry_data.ai_generated && " · ✨ AI"}
                </span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(e.entry_data.affirmation)}><Copy className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteEntry.mutate(e.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </div>
            </CardContent></Card>
          ))}</div>}
      </TabsContent>

      {/* Daily Practice Tab */}
      <TabsContent value="daily">
        <Card className="glass-card">
          <CardContent className="pt-6 text-center">
            {entries.length === 0 ? <p className="text-muted-foreground py-8">Save some affirmations first to build your daily practice.</p> : (() => {
              const random = entries[Math.floor(Math.random() * entries.length)] as any;
              return (<div className="py-12 space-y-6">
                <p className="text-3xl font-serif text-foreground leading-relaxed">"{random.entry_data.affirmation}"</p>
                <p className="text-accent text-sm">{random.entry_data.category}</p>
                <p className="text-muted-foreground text-sm">Close your eyes. Say it three times. Feel it in your body.</p>
              </div>);
            })()}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
