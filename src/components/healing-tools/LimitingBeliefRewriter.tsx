import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useHealingToolEntries } from "@/hooks/useHealingToolEntries";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function LimitingBeliefRewriter() {
  const { entries, saveEntry, deleteEntry } = useHealingToolEntries("limiting-belief-rewriter");
  const [showForm, setShowForm] = useState(false);
  const [belief, setBelief] = useState("");
  const [origin, setOrigin] = useState("");
  const [newBelief, setNewBelief] = useState("");
  const [affirmation, setAffirmation] = useState("");

  const handleSave = () => {
    if (!belief.trim() || !newBelief.trim()) return;
    saveEntry.mutate({ belief, origin, newBelief, affirmation }, {
      onSuccess: () => {
        setBelief(""); setOrigin(""); setNewBelief(""); setAffirmation("");
        setShowForm(false);
      },
    });
  };

  return (
    <div className="space-y-6">
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" /> New Belief Rewrite
        </Button>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="glass-card">
              <CardContent className="p-6 space-y-5">
                <div>
                  <Label className="text-foreground font-semibold">Your Limiting Belief</Label>
                  <p className="text-xs text-muted-foreground mb-2">Write it exactly as it sounds in your head</p>
                  <Textarea placeholder="e.g. I am not smart enough to be successful" value={belief} onChange={(e) => setBelief(e.target.value)} className="bg-input border-border" />
                </div>
                <div className="glass-card p-4 text-sm text-muted-foreground italic space-y-1">
                  <p>Where do you think this belief came from?</p>
                  <p>What age were you when you first heard or felt this?</p>
                </div>
                <div>
                  <Label className="text-foreground font-semibold">Origin</Label>
                  <p className="text-xs text-muted-foreground mb-2">Where did this belief come from?</p>
                  <Textarea placeholder="e.g. My third grade teacher told me I was slow" value={origin} onChange={(e) => setOrigin(e.target.value)} className="bg-input border-border" />
                </div>
                <div>
                  <Label className="text-foreground font-semibold">New Empowering Belief</Label>
                  <p className="text-xs text-muted-foreground mb-2">Rewrite in present tense starting with "I am", "I have", or "I choose"</p>
                  <Textarea placeholder="e.g. I am constantly growing and my intelligence expands with every new experience" value={newBelief} onChange={(e) => setNewBelief(e.target.value)} className="bg-input border-border" />
                </div>
                <div>
                  <Label className="text-foreground font-semibold">Daily Affirmation</Label>
                  <p className="text-xs text-muted-foreground mb-2">A short affirmation based on your new belief</p>
                  <Textarea placeholder="e.g. My mind is sharp, capable, and always expanding" value={affirmation} onChange={(e) => setAffirmation(e.target.value)} className="bg-input border-border" />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleSave} disabled={saveEntry.isPending} className="bg-accent text-accent-foreground hover:bg-accent/90">
                    {saveEntry.isPending ? "Saving..." : "Save to Library"}
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
          <h3 className="font-serif text-xl text-foreground">Your Belief Library</h3>
          {entries.map((entry: any) => {
            const d = entry.entry_data;
            return (
              <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="glass-card">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs text-muted-foreground">{format(new Date(entry.created_at), "MMM d, yyyy")}</span>
                      <Button variant="ghost" size="sm" className="text-destructive h-6 w-6 p-0" onClick={() => deleteEntry.mutate(entry.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-destructive line-through text-sm mb-1">{d.belief}</p>
                    {d.origin && <p className="text-xs text-muted-foreground mb-2 italic">Origin: {d.origin}</p>}
                    <p className="text-accent font-semibold text-sm mb-1">{d.newBelief}</p>
                    {d.affirmation && <p className="text-sm text-muted-foreground italic">"{d.affirmation}"</p>}
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
