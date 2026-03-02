import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useHealingToolEntries } from "@/hooks/useHealingToolEntries";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function InnerChildHealing() {
  const { entries, saveEntry, deleteEntry } = useHealingToolEntries("inner-child-healing");
  const [showForm, setShowForm] = useState(false);
  const [age, setAge] = useState([7]);
  const [prompt1, setPrompt1] = useState("");
  const [prompt2, setPrompt2] = useState("");
  const [prompt3, setPrompt3] = useState("");
  const [letter, setLetter] = useState("");

  const handleSave = () => {
    if (!letter.trim()) return;
    saveEntry.mutate({ age: age[0], prompt1, prompt2, prompt3, letter }, {
      onSuccess: () => {
        setAge([7]); setPrompt1(""); setPrompt2(""); setPrompt3(""); setLetter("");
        setShowForm(false);
      },
    });
  };

  return (
    <div className="space-y-6">
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" /> Begin a Healing Session
        </Button>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="glass-card">
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label className="text-foreground font-semibold mb-3 block">What age do you want to visit today?</Label>
                  <div className="flex items-center gap-4">
                    <Slider value={age} onValueChange={setAge} min={1} max={18} step={1} className="flex-1" />
                    <span className="text-2xl font-serif text-accent min-w-[3ch] text-center">{age[0]}</span>
                  </div>
                </div>

                <div className="glass-card p-5 text-sm text-foreground/80 italic leading-relaxed">
                  Close your eyes. Imagine walking into a room and seeing yourself at age {age[0]}. Notice what she is wearing. Notice her face. She has been waiting for you. Walk toward her. She needs to know you made it. She needs to know she is safe now.
                </div>

                <div>
                  <Label className="text-foreground font-semibold">What does she look like right now? What is she feeling?</Label>
                  <Textarea value={prompt1} onChange={(e) => setPrompt1(e.target.value)} className="bg-input border-border mt-1" />
                </div>
                <div>
                  <Label className="text-foreground font-semibold">What did she need to hear that she never heard?</Label>
                  <Textarea value={prompt2} onChange={(e) => setPrompt2(e.target.value)} className="bg-input border-border mt-1" />
                </div>
                <div>
                  <Label className="text-foreground font-semibold">What do you want to say to her now?</Label>
                  <Textarea value={prompt3} onChange={(e) => setPrompt3(e.target.value)} className="bg-input border-border mt-1" />
                </div>
                <div>
                  <Label className="text-foreground font-semibold">Write a letter from present you to younger you</Label>
                  <p className="text-xs text-muted-foreground mb-2">Tell her everything.</p>
                  <Textarea value={letter} onChange={(e) => setLetter(e.target.value)} className="bg-input border-border min-h-[150px]" />
                </div>

                <div className="glass-card p-4 text-sm text-accent italic text-center">
                  She is safe now. You came back for her. She is part of you and she is loved.
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleSave} disabled={saveEntry.isPending} className="bg-accent text-accent-foreground">
                    {saveEntry.isPending ? "Saving..." : "Save Letter"}
                  </Button>
                  <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {entries.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-serif text-xl text-foreground">Inner Child Library</h3>
          {entries.map((entry: any) => {
            const d = entry.entry_data;
            return (
              <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="glass-card">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-accent font-serif text-lg">Age {d.age}</span>
                        <span className="text-xs text-muted-foreground ml-3">{format(new Date(entry.created_at), "MMM d, yyyy")}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive h-6 w-6 p-0" onClick={() => deleteEntry.mutate(entry.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-foreground/80 whitespace-pre-wrap">{d.letter}</p>
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
