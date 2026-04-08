import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useHealingToolEntries } from "@/hooks/useHealingToolEntries";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, RotateCcw, Sparkles } from "lucide-react";
import { AiButton } from "@/components/AiButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const QUESTIONS = [
  "What was the money situation in your home growing up?",
  "What did you hear adults say about money most often?",
  "What was your first memory of money feeling scarce?",
  "What emotion did money bring up in your household?",
  "Were you praised or shamed for wanting things?",
  "What did you believe wealthy people were like?",
  "What does money mean to you emotionally right now?",
  "Where do you currently self-sabotage with money?",
  "What do you believe you have to do or be to deserve financial abundance?",
  "What does wealthy mean to you and do you truly believe you can have it?",
];

export default function MoneyStoryAudit() {
  const { entries, saveEntry } = useHealingToolEntries("money-story-audit");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(10).fill(""));
  const [newStory, setNewStory] = useState("");
  const [showAudit, setShowAudit] = useState(false);
  const [patternInsight, setPatternInsight] = useState("");
  const [isRewriting, setIsRewriting] = useState(false);

  const existingAudit = useMemo(() => entries.find((e: any) => e.entry_data.type === "audit"), [entries]);

  const handleNext = () => {
    if (step < 9) setStep(step + 1);
    else setStep(10); // summary
  };

  const handleSave = () => {
    saveEntry.mutate(
      { type: "audit", answers, newStory },
      { onSuccess: () => setShowAudit(false) }
    );
  };

  const handleAiRewrite = async () => {
    const answeredCount = answers.filter((a) => a.trim()).length;
    if (answeredCount < 3) {
      toast.error("Please answer at least 3 questions before using AI rewrite");
      return;
    }
    setIsRewriting(true);
    try {
      const { data, error } = await supabase.functions.invoke("rewrite-money-story", {
        body: { answers, questions: QUESTIONS },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data.pattern) setPatternInsight(data.pattern);
      if (data.newStory) setNewStory(data.newStory);
      toast.success("AI money story rewrite complete — personalize it to make it yours");
    } catch (err: any) {
      console.error("Money story rewrite error:", err);
      toast.error(err.message || "Failed to rewrite. Please try again.");
    } finally {
      setIsRewriting(false);
    }
  };

  if (!showAudit && existingAudit) {
    const d = existingAudit.entry_data as any;
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-semibold">✅ Money Story Audited</div>
          <Button variant="outline" size="sm" onClick={() => { setShowAudit(true); setStep(0); setAnswers(d.answers || Array(10).fill("")); setNewStory(d.newStory || ""); }}>
            <RotateCcw className="w-3 h-3 mr-1" /> Revisit
          </Button>
        </div>
        <Card className="glass-card">
          <CardContent className="p-6">
            <h3 className="font-serif text-lg text-accent mb-3">Your New Money Story</h3>
            <p className="text-foreground/80 whitespace-pre-wrap">{d.newStory}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!showAudit && !existingAudit) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Uncover the money story running your financial life through 10 guided questions.</p>
        <Button onClick={() => setShowAudit(true)} className="bg-accent text-accent-foreground">Begin Audit</Button>
      </div>
    );
  }

  // In audit flow
  if (step < 10) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Progress value={((step + 1) / 10) * 100} className="h-2" />
        <p className="text-xs text-muted-foreground text-center">Question {step + 1} of 10</p>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <Card className="glass-card">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-serif text-lg text-foreground">{QUESTIONS[step]}</h3>
                <Textarea
                  value={answers[step]}
                  onChange={(e) => {
                    const a = [...answers];
                    a[step] = e.target.value;
                    setAnswers(a);
                  }}
                  placeholder="Write your answer..."
                  className="bg-input border-border min-h-[120px]"
                />
                <div className="flex justify-between">
                  <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
                  <Button onClick={handleNext} className="bg-accent text-accent-foreground">
                    {step === 9 ? "See Summary" : "Next"} <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // Summary step
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card className="glass-card">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-serif text-xl text-accent">Your Money Story Summary</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {QUESTIONS.map((q, i) => (
              <div key={i} className="text-sm">
                <p className="text-muted-foreground text-xs">{q}</p>
                <p className="text-foreground/80">{answers[i] || "—"}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="glass-card">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-serif text-lg text-foreground">Rewrite Your Money Story</h3>
          <p className="text-xs text-muted-foreground">Write your new money story in first person, present tense.</p>

          {/* AI Rewrite Button */}
          <AiButton
            onClick={handleAiRewrite}
            isLoading={isRewriting}
            loadingText="Rewriting with AI..."
            variant="outline"
            className="w-full border-primary/30 text-primary hover:bg-primary/10"
          >
            <Sparkles className="w-4 h-4 mr-2" /> Help Me Rewrite My Money Story (AI)
          </AiButton>

          {patternInsight && (
            <div className="glass-card p-4 text-sm text-muted-foreground italic">
              <p className="text-xs text-accent uppercase tracking-wider mb-2 not-italic">Your Old Pattern</p>
              {patternInsight}
            </div>
          )}

          <Textarea
            value={newStory}
            onChange={(e) => setNewStory(e.target.value)}
            placeholder="My new money story is..."
            className="bg-input border-border min-h-[150px]"
          />
          <div className="glass-card p-3 text-sm text-accent italic text-center">
            My new money story is already true.
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setStep(9)} variant="ghost">Back</Button>
            <Button onClick={handleSave} disabled={saveEntry.isPending} className="bg-accent text-accent-foreground">
              {saveEntry.isPending ? "Saving..." : "Save Audit"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
