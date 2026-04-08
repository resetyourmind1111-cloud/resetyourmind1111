import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useHealingToolEntries } from "@/hooks/useHealingToolEntries";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, Sparkles, Loader2, Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AiButton } from "@/components/AiButton";
import { useUsage } from "@/contexts/UsageContext";
import { format } from "date-fns";

const PROMPTS: Record<string, string[]> = {
  "Self-Worth": [
    "What part of yourself do you judge most harshly in others?",
    "What would you do differently if you truly believed you were enough?",
    "What compliment do you find hardest to receive and why?",
    "What are you most afraid people would think if they knew the real you?",
    "Where in your life are you performing instead of being?",
    "What version of yourself have you been hiding and why?",
  ],
  "Relationships": [
    "What pattern keeps repeating in your relationships?",
    "What did you learn about love from watching your parents?",
    "Where do you abandon yourself to keep others comfortable?",
    "What do you most need from others that you refuse to ask for?",
    "Who in your life are you most resentful of and what does that resentment protect you from feeling?",
    "What would your relationships look like if you stopped being afraid of being too much?",
  ],
  "Money": [
    "What emotion comes up when you think about being wealthy?",
    "What does your family believe about people with money?",
    "Where are you self-sabotaging your financial growth?",
    "What would change about how people see you if you were wealthy?",
    "What do you believe you have to sacrifice to be rich?",
    "What is the real reason you are not charging more?",
  ],
  "Anger": [
    "What are you most angry about that you have never said out loud?",
    "Who taught you that your anger was not allowed?",
    "What injustice in your life have you minimized or explained away?",
    "Where in your body do you hold unexpressed anger?",
    "What would you say if you knew there were no consequences?",
    "What does your anger most want to protect?",
  ],
  "Fear": [
    "What is the thing you most want that you are most afraid to want?",
    "What would you do if you knew you could not fail?",
    "What fear has been running your decisions without your permission?",
    "What are you avoiding by staying comfortable?",
    "What is the worst thing that could happen if you fully showed up — and could you survive it?",
    "What would your life look like if fear had no vote?",
  ],
};

const allPrompts = Object.entries(PROMPTS).flatMap(([cat, prompts]) =>
  prompts.map((p, i) => ({ category: cat, prompt: p, index: i }))
);

type ShadowInsight = {
  insight: string;
  deeperPrompt: string;
  integration: string;
};

export default function ShadowWorkLibrary() {
  const { entries, saveEntry, updateEntry } = useHealingToolEntries("shadow-work-library");
  const { isLimitReached, incrementUsage } = useUsage();
  const [activePrompt, setActivePrompt] = useState<{ category: string; prompt: string; globalIndex: number } | null>(null);
  const [response, setResponse] = useState("");
  const [aiInsight, setAiInsight] = useState("");
  const [aiDeeperPrompt, setAiDeeperPrompt] = useState("");
  const [aiIntegration, setAiIntegration] = useState("");
  const [isGuiding, setIsGuiding] = useState(false);
  const [insightLoading, setInsightLoading] = useState<string | null>(null);

  const completedPrompts = new Set(entries.map((e: any) => e.entry_data.prompt));
  const completedCount = completedPrompts.size;

  const handleSave = () => {
    if (!response.trim() || !activePrompt) return;
    saveEntry.mutate(
      { category: activePrompt.category, prompt: activePrompt.prompt, response },
      { onSuccess: () => { setResponse(""); setActivePrompt(null); setAiInsight(""); setAiDeeperPrompt(""); setAiIntegration(""); } }
    );
  };

  const handleAiGuide = async () => {
    if (isLimitReached) { toast.error("Daily limit reached — resets at midnight"); return; }
    const allowed = await incrementUsage(); if (!allowed) return;
    if (!activePrompt) return;
    setIsGuiding(true);
    try {
      const { data, error } = await supabase.functions.invoke("shadow-work-guide", {
        body: {
          category: activePrompt.category,
          prompt: activePrompt.prompt,
          response: response.trim() || undefined,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data.insight) setAiInsight(data.insight);
      if (data.deeperPrompt) setAiDeeperPrompt(data.deeperPrompt);
      if (data.integration) setAiIntegration(data.integration);
      toast.success("Shadow work guidance ready — sit with these insights");
    } catch (err: any) {
      console.error("Shadow work guide error:", err);
      toast.error(err.message || "Failed to generate guidance. Please try again.");
    } finally {
      setIsGuiding(false);
    }
  };

  const fetchInsight = async (entryId: string, entryData: any) => {
    if (isLimitReached) { toast.error("Daily limit reached — resets at midnight"); return; }
    const allowed = await incrementUsage(); if (!allowed) return;
    setInsightLoading(entryId);
    try {
      const { data, error } = await supabase.functions.invoke("shadow-work-guide", {
        body: {
          category: entryData.category,
          prompt: entryData.prompt,
          response: entryData.response || undefined,
        },
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

  if (activePrompt) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" className="text-muted-foreground" onClick={() => { setActivePrompt(null); setAiInsight(""); setAiDeeperPrompt(""); setAiIntegration(""); }}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to prompts
        </Button>
        <Card className="glass-card">
          <CardContent className="p-6 space-y-5">
            <p className="text-xs text-accent uppercase tracking-wider">{activePrompt.category}</p>
            <h3 className="font-serif text-xl text-foreground">{activePrompt.prompt}</h3>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Write freely. There is no wrong answer here..."
              className="bg-input border-border min-h-[200px]"
            />

            {/* AI Guide Button */}
            <Button
              onClick={handleAiGuide}
              disabled={isGuiding}
              variant="outline"
              className="w-full border-primary/30 text-primary hover:bg-primary/10"
            >
              {isGuiding ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Exploring with AI...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> Help Me Go Deeper (AI)</>
              )}
            </Button>

            {aiInsight && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 text-sm space-y-3">
                <div>
                  <p className="text-xs text-accent uppercase tracking-wider mb-1">Shadow Insight</p>
                  <p className="text-foreground/80 italic">{aiInsight}</p>
                </div>
                {aiDeeperPrompt && (
                  <div>
                    <p className="text-xs text-accent uppercase tracking-wider mb-1">Go Deeper</p>
                    <p className="text-foreground/80">{aiDeeperPrompt}</p>
                  </div>
                )}
                {aiIntegration && (
                  <div>
                    <p className="text-xs text-accent uppercase tracking-wider mb-1">Integration Statement</p>
                    <p className="text-accent italic font-semibold">"{aiIntegration}"</p>
                  </div>
                )}
              </motion.div>
            )}

            <div className="glass-card p-4 text-sm text-muted-foreground italic">
              <p>Reflection: What surprised you about what came up?</p>
            </div>
            <div className="glass-card p-4 text-sm text-accent italic text-center">
              I integrate this part of myself with compassion. It is safe to see myself fully.
            </div>
            <Button onClick={handleSave} disabled={saveEntry.isPending} className="bg-accent text-accent-foreground">
              {saveEntry.isPending ? "Saving..." : "Complete & Save"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Progress value={(completedCount / 30) * 100} className="flex-1 h-3" />
        <span className="text-sm text-muted-foreground font-medium">{completedCount}/30</span>
      </div>

      {/* Completed entries with Decode */}
      {entries.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-serif text-lg text-foreground">Completed Shadow Work</h3>
          {entries.map((entry: any) => {
            const d = entry.entry_data;
            const insight: ShadowInsight | undefined = d.aiInsight;
            const isLoading = insightLoading === entry.id;
            return (
              <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs text-accent uppercase tracking-wider">{d.category}</p>
                        <p className="text-sm text-foreground font-medium mt-1">{d.prompt}</p>
                        <p className="text-xs text-muted-foreground mt-1">{format(new Date(entry.created_at), "MMM d, yyyy")}</p>
                      </div>
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
                    </div>
                    <p className="text-sm text-foreground/70 italic mt-2">"{d.response}"</p>

                    <AnimatePresence>
                      {insight && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 space-y-3 border-t border-border pt-4"
                        >
                          <div>
                            <p className="text-xs font-semibold text-accent mb-1">🔮 Shadow Insight</p>
                            <p className="text-sm text-foreground/90">{insight.insight}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-accent mb-1">🌊 Go Deeper</p>
                            <p className="text-sm text-foreground/90">{insight.deeperPrompt}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-accent mb-1">✨ Integration</p>
                            <p className="text-sm text-foreground/90 italic">"{insight.integration}"</p>
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

      <Tabs defaultValue="Self-Worth">
        <TabsList className="bg-muted flex-wrap h-auto gap-1 p-1">
          {Object.keys(PROMPTS).map((cat) => (
            <TabsTrigger key={cat} value={cat} className="text-xs">{cat}</TabsTrigger>
          ))}
        </TabsList>
        {Object.entries(PROMPTS).map(([cat, prompts]) => (
          <TabsContent key={cat} value={cat} className="space-y-3 mt-4">
            {prompts.map((prompt, i) => {
              const done = completedPrompts.has(prompt);
              const globalIndex = allPrompts.findIndex((p) => p.prompt === prompt);
              return (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                  <Card
                    className={`glass-card cursor-pointer transition-all ${done ? "border-accent/40" : "hover:border-accent/20"}`}
                    onClick={() => !done && setActivePrompt({ category: cat, prompt, globalIndex })}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-accent text-accent-foreground" : "border border-border"}`}>
                        {done && <Check className="w-3 h-3" />}
                      </div>
                      <p className={`text-sm ${done ? "text-muted-foreground" : "text-foreground"}`}>{prompt}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
