import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useHealingToolEntries } from "@/hooks/useHealingToolEntries";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Wand2, Loader2 } from "lucide-react";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AiButton } from "@/components/AiButton";
import { useUsage } from "@/contexts/UsageContext";

const REFERENCE_NEW_MOON = new Date("2024-01-11T11:57:00Z");
const LUNAR_CYCLE = 29.53;

function getMoonPhase(date: Date) {
  const diff = (date.getTime() - REFERENCE_NEW_MOON.getTime()) / (1000 * 60 * 60 * 24);
  const cycle = ((diff % LUNAR_CYCLE) + LUNAR_CYCLE) % LUNAR_CYCLE;
  const illumination = Math.round((1 - Math.cos((cycle / LUNAR_CYCLE) * 2 * Math.PI)) / 2 * 100);

  let name: string, emoji: string;
  if (cycle < 1.85) { name = "New Moon"; emoji = "🌑"; }
  else if (cycle < 7.38) { name = "Waxing Crescent"; emoji = "🌒"; }
  else if (cycle < 9.23) { name = "First Quarter"; emoji = "🌓"; }
  else if (cycle < 14.76) { name = "Waxing Gibbous"; emoji = "🌔"; }
  else if (cycle < 16.61) { name = "Full Moon"; emoji = "🌕"; }
  else if (cycle < 22.14) { name = "Waning Gibbous"; emoji = "🌖"; }
  else if (cycle < 23.99) { name = "Last Quarter"; emoji = "🌗"; }
  else { name = "Waning Crescent"; emoji = "🌘"; }

  return { name, emoji, illumination, cycle };
}

function getNextPhase(currentCycle: number) {
  const phases = [
    { day: 0, name: "New Moon" }, { day: 3.69, name: "Waxing Crescent" },
    { day: 7.38, name: "First Quarter" }, { day: 11.07, name: "Waxing Gibbous" },
    { day: 14.76, name: "Full Moon" }, { day: 18.45, name: "Waning Gibbous" },
    { day: 22.14, name: "Last Quarter" }, { day: 25.83, name: "Waning Crescent" },
    { day: 29.53, name: "New Moon" },
  ];
  for (const p of phases) {
    if (p.day > currentCycle) return { name: p.name, daysAway: Math.ceil(p.day - currentCycle) };
  }
  return { name: "New Moon", daysAway: Math.ceil(LUNAR_CYCLE - currentCycle) };
}

const RITUALS: Record<string, { guide: string; prompt: string }> = {
  "New Moon": { guide: "Set your intentions. Write your desires as if already true. Plant seeds. Begin new projects. Cleanse your space.", prompt: "What are you calling in this cycle?" },
  "Waxing Crescent": { guide: "Take aligned action. Build momentum. Follow up on intentions.", prompt: "What steps can you take today?" },
  "First Quarter": { guide: "Push through resistance. Recommit to your vision.", prompt: "What obstacles are showing up and how will you move through them?" },
  "Waxing Gibbous": { guide: "Refine and adjust. You are almost there.", prompt: "What needs fine-tuning before the full moon?" },
  "Full Moon": { guide: "Release what no longer serves. Celebrate wins. Write a release list. Perform a letting go ritual.", prompt: "What are you releasing this cycle?" },
  "Waning Gibbous": { guide: "Share your gifts. Reflect on lessons. Express gratitude.", prompt: "What did this cycle teach you?" },
  "Last Quarter": { guide: "Let go of what did not work. Forgive. Clear the space for what is next.", prompt: "What are you forgiving?" },
  "Waning Crescent": { guide: "Rest. Restore. Integrate. Prepare. This is sacred rest time. Honor the pause.", prompt: "What do you need to release before the new cycle?" },
};

type MoonInsight = {
  lunarMessage: string;
  soulPattern: string;
  ritualSuggestion: string;
};

export default function MoonPhaseTracker() {
  const { entries, saveEntry, updateEntry, deleteEntry } = useHealingToolEntries("moon-phase-tracker");
  const { isLimitReached, incrementUsage } = useUsage();
  const [showJournal, setShowJournal] = useState(false);
  const [journalText, setJournalText] = useState("");
  const [insightLoading, setInsightLoading] = useState<string | null>(null);

  const today = new Date();
  const phase = getMoonPhase(today);
  const next = getNextPhase(phase.cycle);
  const ritual = RITUALS[phase.name];

  const monthDays = useMemo(() => {
    const start = startOfMonth(today);
    const end = endOfMonth(today);
    return eachDayOfInterval({ start, end }).map((d) => ({
      date: d,
      phase: getMoonPhase(d),
    }));
  }, []);

  const handleSave = () => {
    if (!journalText.trim()) return;
    saveEntry.mutate(
      { phase: phase.name, journal: journalText, date: today.toISOString() },
      { onSuccess: () => { setJournalText(""); setShowJournal(false); } }
    );
  };

  const fetchInsight = async (entryId: string, entryData: any) => {
    if (isLimitReached) { toast.error("Daily limit reached — resets at midnight"); return; }
    const allowed = await incrementUsage(); if (!allowed) return;
    setInsightLoading(entryId);
    try {
      const { data, error } = await supabase.functions.invoke("moon-insight", {
        body: { phase: entryData.phase, journal: entryData.journal },
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

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardContent className="p-6 text-center">
          <p className="text-6xl mb-3">{phase.emoji}</p>
          <h3 className="font-serif text-2xl text-accent mb-1">{phase.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">{phase.illumination}% illumination</p>
          <p className="text-xs text-muted-foreground">Next: {next.name} in {next.daysAway} day{next.daysAway !== 1 ? "s" : ""}</p>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardContent className="p-6">
          <h3 className="font-serif text-lg text-accent mb-2">{phase.name} Ritual Guide</h3>
          <p className="text-foreground/80 text-sm mb-3">{ritual.guide}</p>
          <p className="text-sm text-accent italic">{ritual.prompt}</p>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardContent className="p-4">
          <h4 className="font-serif text-sm text-foreground mb-3">{format(today, "MMMM yyyy")} Moon Calendar</h4>
          <div className="grid grid-cols-7 gap-1 text-center">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <span key={i} className="text-xs text-muted-foreground font-semibold">{d}</span>
            ))}
            {Array.from({ length: monthDays[0].date.getDay() }).map((_, i) => <span key={`e-${i}`} />)}
            {monthDays.map((d, i) => (
              <div
                key={i}
                className={`text-xs p-1 rounded ${format(d.date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd") ? "bg-accent/20 text-accent font-bold" : "text-muted-foreground"}`}
                title={d.phase.name}
              >
                <span className="block text-sm">{d.phase.emoji}</span>
                <span>{format(d.date, "d")}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {!showJournal && (
        <Button onClick={() => setShowJournal(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" /> Journal This Phase
        </Button>
      )}

      <AnimatePresence>
        {showJournal && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="glass-card">
              <CardContent className="p-6 space-y-4">
                <Label className="text-foreground font-semibold">{phase.name} Journal — {format(today, "MMM d, yyyy")}</Label>
                <p className="text-sm text-muted-foreground italic">{ritual.prompt}</p>
                <Textarea value={journalText} onChange={(e) => setJournalText(e.target.value)} placeholder="Write your moon ritual journal..." className="bg-input border-border min-h-[120px]" />
                <div className="flex gap-3">
                  <Button onClick={handleSave} disabled={saveEntry.isPending} className="bg-accent text-accent-foreground">
                    {saveEntry.isPending ? "Saving..." : "Save Entry"}
                  </Button>
                  <Button variant="ghost" onClick={() => setShowJournal(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {entries.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-serif text-xl text-foreground">Moon Journal</h3>
          {entries.map((entry: any) => {
            const d = entry.entry_data;
            const insight: MoonInsight | undefined = d.aiInsight;
            const isLoading = insightLoading === entry.id;
            return (
              <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-accent text-sm font-semibold">{d.phase}</span>
                        <span className="text-xs text-muted-foreground">{format(new Date(d.date), "MMM d, yyyy")}</span>
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
                    <p className="text-sm text-foreground/80 whitespace-pre-wrap">{d.journal}</p>

                    <AnimatePresence>
                      {insight && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 space-y-3 border-t border-border pt-4"
                        >
                          <div>
                            <p className="text-xs font-semibold text-accent mb-1">🌙 Lunar Message</p>
                            <p className="text-sm text-foreground/90">{insight.lunarMessage}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-accent mb-1">🔮 Soul Pattern</p>
                            <p className="text-sm text-foreground/90">{insight.soulPattern}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-accent mb-1">🕯️ Ritual Suggestion</p>
                            <p className="text-sm text-foreground/90">{insight.ritualSuggestion}</p>
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
