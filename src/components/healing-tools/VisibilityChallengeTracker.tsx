import { useState } from "react";
import { useHealingToolEntries } from "@/hooks/useHealingToolEntries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Trash2, CheckCircle, Circle } from "lucide-react";
import { format } from "date-fns";

const challenges = [
  "Post a photo of yourself with zero filters", "Share an unpopular opinion publicly", "Go live for 60 seconds on social media",
  "Send a pitch or proposal you've been sitting on", "Share a vulnerable truth about your journey", "Ask for a testimonial from someone you've helped",
  "Record a video of yourself speaking your mission", "Comment on 10 posts in your industry with real value", "Share your pricing publicly without apologizing",
  "Tell someone 'no' without over-explaining", "Post about a failure and what it taught you", "Send a bold email to someone you admire",
  "Share a before/after of your growth", "Raise your hand for an opportunity that scares you", "Write a caption that makes you nervous to post",
  "Speak up in a meeting or group chat", "Share your goals publicly for accountability", "Celebrate a win without minimizing it",
  "Introduce yourself as who you're becoming", "Take up space in a room — physically and energetically", "Share your work without a disclaimer",
  "Ask for exactly what you want with no caveats", "Make a bold promise and follow through", "Show your face on camera with confidence",
  "Write and publish something without editing it 10 times", "Share a boundary you set and how it felt", "Respond to criticism without shrinking",
  "Claim your title out loud", "Put yourself forward for something you don't feel 'ready' for", "Look in the mirror and say 'I am proud of you'",
];

export default function VisibilityChallengeTracker() {
  const { entries, isLoading, saveEntry, deleteEntry } = useHealingToolEntries("visibility-challenge");
  const [reflection, setReflection] = useState("");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const completedDays = new Set(entries.map((e: any) => e.entry_data.day));
  const progress = (completedDays.size / 30) * 100;

  const handleComplete = (day: number) => {
    if (completedDays.has(day)) return;
    setSelectedDay(day);
  };

  const handleSave = () => {
    if (selectedDay === null) return;
    saveEntry.mutate({ day: selectedDay, challenge: challenges[selectedDay - 1], reflection, completed_at: new Date().toISOString() });
    setReflection(""); setSelectedDay(null);
  };

  return (
    <Tabs defaultValue="challenges">
      <TabsList className="mb-6"><TabsTrigger value="challenges">30 Challenges</TabsTrigger><TabsTrigger value="journal">Journal ({entries.length})</TabsTrigger></TabsList>
      <TabsContent value="challenges">
        <Card className="glass-card mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-foreground">{completedDays.size}/30 Completed</p>
              <p className="text-sm text-accent">{Math.round(progress)}%</p>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {challenges.map((c, i) => {
            const day = i + 1;
            const done = completedDays.has(day);
            const active = selectedDay === day;
            return (
              <button key={day} onClick={() => handleComplete(day)} disabled={done}
                className={`p-4 rounded-xl border-2 text-left transition-all ${done ? "border-accent/30 bg-accent/10 opacity-70" : active ? "border-accent bg-accent/10" : "border-border hover:border-accent/40"}`}>
                <div className="flex items-center gap-2 mb-1">
                  {done ? <CheckCircle className="w-4 h-4 text-accent" /> : <Circle className="w-4 h-4 text-muted-foreground" />}
                  <span className="text-xs font-bold text-muted-foreground">Day {day}</span>
                </div>
                <p className="text-sm text-foreground">{c}</p>
              </button>
            );
          })}
        </div>

        {selectedDay !== null && (
          <Card className="glass-card mt-6">
            <CardHeader><CardTitle className="font-serif text-lg">Day {selectedDay} Reflection</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-foreground font-medium">{challenges[selectedDay - 1]}</p>
              <Textarea value={reflection} onChange={e => setReflection(e.target.value)} placeholder="How did it feel? What came up for you?" rows={3} />
              <Button onClick={handleSave} variant="gold" className="w-full">Mark Complete</Button>
            </CardContent>
          </Card>
        )}
      </TabsContent>
      <TabsContent value="journal">
        {isLoading ? <p className="text-muted-foreground">Loading...</p> : entries.length === 0 ? <p className="text-muted-foreground text-center py-8">Complete a challenge to see your journal.</p> :
          <div className="space-y-3">{entries.sort((a: any, b: any) => a.entry_data.day - b.entry_data.day).map((e: any) => (
            <Card key={e.id} className="glass-card"><CardContent className="pt-4 flex justify-between items-start">
              <div>
                <p className="font-semibold text-foreground">Day {e.entry_data.day}: {e.entry_data.challenge}</p>
                {e.entry_data.reflection && <p className="text-sm text-muted-foreground mt-1 italic">"{e.entry_data.reflection}"</p>}
                <p className="text-xs text-muted-foreground mt-1">{format(new Date(e.created_at), "MMM d, yyyy")}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => deleteEntry.mutate(e.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </CardContent></Card>
          ))}</div>}
      </TabsContent>
    </Tabs>
  );
}
