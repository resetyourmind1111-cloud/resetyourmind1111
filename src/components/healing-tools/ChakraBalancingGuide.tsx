import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useHealingToolEntries } from "@/hooks/useHealingToolEntries";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const chakras = [
  { name: "Root", color: "bg-red-500", sanskrit: "Muladhara", location: "Base of spine", element: "Earth", theme: "Safety, security, survival, grounding", balancedSign: "Feeling safe, stable, and grounded in your body and life", blockedSign: "Anxiety, fear, financial stress, feeling unrooted or disconnected from your body" },
  { name: "Sacral", color: "bg-orange-500", sanskrit: "Svadhisthana", location: "Lower abdomen", element: "Water", theme: "Creativity, pleasure, emotions, sensuality", balancedSign: "Creative flow, healthy boundaries in intimacy, emotional fluidity", blockedSign: "Guilt around pleasure, creative blocks, emotional numbness, codependency" },
  { name: "Solar Plexus", color: "bg-yellow-500", sanskrit: "Manipura", location: "Upper abdomen", element: "Fire", theme: "Personal power, confidence, will", balancedSign: "Strong sense of self, healthy confidence, ability to set boundaries", blockedSign: "Low self-esteem, people-pleasing, control issues, shame, digestive problems" },
  { name: "Heart", color: "bg-green-500", sanskrit: "Anahata", location: "Center of chest", element: "Air", theme: "Love, compassion, forgiveness, connection", balancedSign: "Ability to give and receive love freely, self-compassion, forgiveness", blockedSign: "Fear of intimacy, jealousy, holding grudges, difficulty receiving, chest tightness" },
  { name: "Throat", color: "bg-blue-500", sanskrit: "Vishuddha", location: "Throat", element: "Ether", theme: "Truth, expression, communication, authenticity", balancedSign: "Speaking your truth clearly, active listening, authentic self-expression", blockedSign: "Fear of speaking up, people-pleasing through silence, sore throat, thyroid issues" },
  { name: "Third Eye", color: "bg-indigo-500", sanskrit: "Ajna", location: "Between brows", element: "Light", theme: "Intuition, insight, inner wisdom, vision", balancedSign: "Strong intuition, clarity of vision, trust in your inner knowing", blockedSign: "Self-doubt, ignoring gut feelings, overthinking, headaches, inability to envision future" },
  { name: "Crown", color: "bg-purple-500", sanskrit: "Sahasrara", location: "Top of head", element: "Cosmic energy", theme: "Spiritual connection, purpose, unity, transcendence", balancedSign: "Sense of purpose, spiritual connection, inner peace, trust in the universe", blockedSign: "Feeling disconnected from purpose, spiritual cynicism, isolation, existential dread" },
];

const assessmentQuestions = [
  { chakra: 0, q: "I feel safe and secure in my daily life." },
  { chakra: 0, q: "I trust that my basic needs will be met." },
  { chakra: 1, q: "I allow myself to experience pleasure without guilt." },
  { chakra: 1, q: "I feel creatively inspired and emotionally fluid." },
  { chakra: 2, q: "I feel confident in my personal power and decisions." },
  { chakra: 2, q: "I can set boundaries without feeling guilty." },
  { chakra: 3, q: "I can give and receive love freely." },
  { chakra: 3, q: "I practice self-compassion and forgiveness." },
  { chakra: 4, q: "I speak my truth clearly and authentically." },
  { chakra: 4, q: "I express myself without fear of judgment." },
  { chakra: 5, q: "I trust my intuition and inner knowing." },
  { chakra: 5, q: "I have a clear vision for my life." },
  { chakra: 6, q: "I feel connected to something greater than myself." },
  { chakra: 6, q: "I live with a sense of purpose and meaning." },
];

const meditationPrompts: Record<number, string[]> = {
  0: ["Visualize roots growing from your body deep into the earth.", "Repeat: I am safe. I am grounded. I belong here.", "What would it feel like to trust that you are fully supported?"],
  1: ["Place your hands on your lower belly. Breathe warmth into this space.", "Repeat: I deserve pleasure. My emotions are valid.", "What creative expression have you been suppressing?"],
  2: ["Imagine a golden sun radiating from your core.", "Repeat: I am powerful. I trust my decisions. I am enough.", "Where are you giving your power away?"],
  3: ["Place your hand on your heart. Feel it beating for you.", "Repeat: I am worthy of love. I forgive freely. I am open.", "Who do you need to forgive — including yourself?"],
  4: ["Gently hum and feel the vibration in your throat.", "Repeat: My voice matters. I speak my truth with love.", "What truth have you been afraid to speak?"],
  5: ["Close your eyes and focus on the space between your brows.", "Repeat: I trust my inner wisdom. I see clearly.", "What is your intuition trying to tell you right now?"],
  6: ["Imagine a beam of light entering through the top of your head.", "Repeat: I am connected. I trust the journey. I am divine.", "What does spiritual connection mean to you today?"],
};

export default function ChakraBalancingGuide() {
  const { entries, saveEntry, deleteEntry } = useHealingToolEntries("chakra-balancing");
  const [activeTab, setActiveTab] = useState("assessment");
  const [assessmentStep, setAssessmentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(14).fill(0));
  const [showResults, setShowResults] = useState(false);
  const [selectedChakra, setSelectedChakra] = useState<number | null>(null);
  const [journalText, setJournalText] = useState("");
  const [dailyCheckin, setDailyCheckin] = useState<Record<number, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState<any>(null);

  const handleAiInsight = async () => {
    setIsAnalyzing(true);
    setAiInsight(null);
    try {
      const { data, error } = await supabase.functions.invoke("healing-tool-insight", {
        body: { toolType: "chakra-insight", scores: chakraScores },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setAiInsight(data);
      toast.success("Chakra insight revealed ✨");
    } catch (err: any) {
      toast.error(err.message || "Failed to get insight");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[assessmentStep] = value;
    setAnswers(newAnswers);
    if (assessmentStep < 13) {
      setAssessmentStep(assessmentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const chakraScores = chakras.map((_, i) => {
    const q1 = answers[i * 2] || 0;
    const q2 = answers[i * 2 + 1] || 0;
    return Math.round(((q1 + q2) / 10) * 100);
  });

  const saveAssessment = () => {
    saveEntry.mutate({ type: "assessment", scores: chakraScores, answers, date: new Date().toISOString() }, {
      onSuccess: () => { setShowResults(false); setAssessmentStep(0); setAnswers(new Array(14).fill(0)); },
    });
  };

  const saveMeditation = () => {
    if (selectedChakra === null || !journalText.trim()) return;
    saveEntry.mutate({ type: "meditation", chakra: chakras[selectedChakra].name, journal: journalText, date: new Date().toISOString() }, {
      onSuccess: () => { setJournalText(""); setSelectedChakra(null); },
    });
  };

  const saveDailyCheckin = () => {
    const filled = Object.values(dailyCheckin).filter(v => v).length;
    if (filled === 0) return;
    const checkinData = chakras.reduce((acc, c, i) => ({ ...acc, [c.name]: dailyCheckin[i] || "balanced" }), {});
    saveEntry.mutate({ type: "daily-checkin", checkin: checkinData, date: new Date().toISOString() }, {
      onSuccess: () => setDailyCheckin({}),
    });
  };

  const assessmentEntries = entries.filter((e: any) => e.entry_data?.type === "assessment");
  const meditationEntries = entries.filter((e: any) => e.entry_data?.type === "meditation");
  const checkinEntries = entries.filter((e: any) => e.entry_data?.type === "daily-checkin");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-muted/50">
          <TabsTrigger value="assessment">Chakra Assessment</TabsTrigger>
          <TabsTrigger value="meditation">Guided Meditation</TabsTrigger>
          <TabsTrigger value="checkin">Daily Check-in</TabsTrigger>
        </TabsList>

        {/* ASSESSMENT TAB */}
        <TabsContent value="assessment">
          {!showResults ? (
            <Card className="glass-card">
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="border-accent/30 text-accent">
                    {chakras[assessmentQuestions[assessmentStep].chakra].name} Chakra
                  </Badge>
                  <span className="text-xs text-muted-foreground">{assessmentStep + 1}/14</span>
                </div>
                <Progress value={((assessmentStep + 1) / 14) * 100} className="h-2 bg-muted" />
                <p className="font-serif text-lg text-foreground">{assessmentQuestions[assessmentStep].q}</p>
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <Button
                      key={v}
                      variant={answers[assessmentStep] === v ? "default" : "outline"}
                      className={answers[assessmentStep] === v ? "bg-accent text-accent-foreground" : "border-accent/30 text-accent hover:bg-accent/10"}
                      onClick={() => handleAnswer(v)}
                    >
                      {v === 1 ? "Not at all" : v === 2 ? "Rarely" : v === 3 ? "Sometimes" : v === 4 ? "Often" : "Always"}
                    </Button>
                  ))}
                </div>
                {assessmentStep > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => setAssessmentStep(assessmentStep - 1)}>← Back</Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl text-foreground mb-4">Your Chakra Balance</h3>
                  <div className="space-y-3">
                    {chakras.map((c, i) => (
                      <div key={c.name} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${c.color}`} />
                            <span className="text-sm font-medium text-foreground">{c.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{chakraScores[i]}%</span>
                        </div>
                        <Progress value={chakraScores[i]} className="h-2 bg-muted" />
                        <p className="text-xs text-muted-foreground">
                          {chakraScores[i] >= 70 ? c.balancedSign : c.blockedSign}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-6 flex-wrap">
                    <Button onClick={saveAssessment} disabled={saveEntry.isPending} className="bg-accent text-accent-foreground hover:bg-accent/90">
                      {saveEntry.isPending ? "Saving..." : "Save Results"}
                    </Button>
                    <Button
                      onClick={handleAiInsight}
                      variant="outline"
                      className="border-accent/30 text-accent hover:bg-accent/10"
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</> : <><Sparkles className="w-4 h-4 mr-2" /> AI: Decode My Energy</>}
                    </Button>
                    <Button variant="ghost" onClick={() => { setShowResults(false); setAssessmentStep(0); setAnswers(new Array(14).fill(0)); setAiInsight(null); }}>Retake</Button>
                  </div>
                  {aiInsight && (
                    <Card className="mt-4 border-accent/20 bg-accent/5">
                      <CardContent className="pt-4 space-y-3">
                        <p className="text-xs text-accent font-semibold flex items-center gap-1"><Sparkles className="w-3 h-3" /> Energy Profile</p>
                        <p className="text-sm text-foreground">{aiInsight.energyProfile}</p>
                        <div className="border-l-2 border-accent/30 pl-3">
                          <p className="text-xs text-accent font-semibold">Most Blocked: {aiInsight.mostBlocked?.chakra}</p>
                          <p className="text-sm text-muted-foreground">{aiInsight.mostBlocked?.insight}</p>
                          <p className="text-sm text-foreground mt-1">→ {aiInsight.mostBlocked?.healingAction}</p>
                        </div>
                        <div className="border-l-2 border-accent/30 pl-3">
                          <p className="text-xs text-accent font-semibold">Strongest: {aiInsight.mostOpen?.chakra}</p>
                          <p className="text-sm text-muted-foreground">{aiInsight.mostOpen?.insight}</p>
                        </div>
                        <div className="border-l-2 border-accent/30 pl-3">
                          <p className="text-xs text-muted-foreground font-semibold">Connection Pattern</p>
                          <p className="text-sm text-muted-foreground">{aiInsight.connectionPattern}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {assessmentEntries.length > 0 && (
            <div className="space-y-4 mt-6">
              <h3 className="font-serif text-xl text-foreground">Assessment History</h3>
              {assessmentEntries.map((entry: any) => (
                <Card key={entry.id} className="glass-card">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs text-muted-foreground">{format(new Date(entry.created_at), "MMM d, yyyy")}</span>
                      <Button variant="ghost" size="sm" className="text-destructive h-6 w-6 p-0" onClick={() => deleteEntry.mutate(entry.id)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {chakras.map((c, i) => (
                        <div key={c.name} className="text-center">
                          <div className={`w-6 h-6 rounded-full ${c.color} mx-auto mb-1 flex items-center justify-center text-[10px] text-white font-bold`}>
                            {entry.entry_data.scores?.[i]}
                          </div>
                          <span className="text-[10px] text-muted-foreground">{c.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* MEDITATION TAB */}
        <TabsContent value="meditation">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {chakras.map((c, i) => (
              <Card
                key={c.name}
                className={`glass-card-hover cursor-pointer ${selectedChakra === i ? "ring-2 ring-accent" : ""}`}
                onClick={() => setSelectedChakra(i)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${c.color} shrink-0`} />
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-foreground">{c.name} — {c.sanskrit}</h4>
                    <p className="text-xs text-muted-foreground">{c.theme}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <AnimatePresence>
            {selectedChakra !== null && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Card className="glass-card">
                  <CardContent className="p-6 space-y-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${chakras[selectedChakra].color}`} />
                      <h3 className="font-serif text-lg text-foreground">{chakras[selectedChakra].name} Chakra Meditation</h3>
                    </div>
                    <div className="glass-card p-4 space-y-3">
                      {meditationPrompts[selectedChakra].map((prompt, i) => (
                        <p key={i} className="text-sm text-muted-foreground italic">• {prompt}</p>
                      ))}
                    </div>
                    <div>
                      <Label className="text-foreground font-semibold">Journal Your Experience</Label>
                      <p className="text-xs text-muted-foreground mb-2">What came up for you during this meditation?</p>
                      <Textarea placeholder="Write freely about what you felt, saw, or realized..." value={journalText} onChange={(e) => setJournalText(e.target.value)} className="bg-input border-border" />
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={saveMeditation} disabled={saveEntry.isPending} className="bg-accent text-accent-foreground hover:bg-accent/90">
                        {saveEntry.isPending ? "Saving..." : "Save Journal Entry"}
                      </Button>
                      <Button variant="ghost" onClick={() => setSelectedChakra(null)}>Cancel</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {meditationEntries.length > 0 && (
            <div className="space-y-4 mt-6">
              <h3 className="font-serif text-xl text-foreground">Meditation Journal</h3>
              {meditationEntries.map((entry: any) => (
                <Card key={entry.id} className="glass-card">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="border-accent/30 text-accent text-xs">{entry.entry_data.chakra}</Badge>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{format(new Date(entry.created_at), "MMM d, yyyy")}</span>
                        <Button variant="ghost" size="sm" className="text-destructive h-6 w-6 p-0" onClick={() => deleteEntry.mutate(entry.id)}><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{entry.entry_data.journal}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* DAILY CHECK-IN TAB */}
        <TabsContent value="checkin">
          <Card className="glass-card">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-serif text-lg text-foreground">Today's Chakra Check-in</h3>
              <p className="text-sm text-muted-foreground">How does each energy center feel right now?</p>
              {chakras.map((c, i) => (
                <div key={c.name} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full ${c.color} shrink-0`} />
                  <span className="text-sm text-foreground w-24">{c.name}</span>
                  <div className="flex gap-2 flex-1 flex-wrap">
                    {["blocked", "sluggish", "balanced", "overactive"].map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={(dailyCheckin[i] || "") === status ? "default" : "outline"}
                        className={
                          (dailyCheckin[i] || "") === status
                            ? "bg-accent text-accent-foreground text-xs"
                            : "border-accent/30 text-accent hover:bg-accent/10 text-xs"
                        }
                        onClick={() => setDailyCheckin({ ...dailyCheckin, [i]: status })}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              <Button onClick={saveDailyCheckin} disabled={saveEntry.isPending} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {saveEntry.isPending ? "Saving..." : "Save Check-in"}
              </Button>
            </CardContent>
          </Card>

          {checkinEntries.length > 0 && (
            <div className="space-y-4 mt-6">
              <h3 className="font-serif text-xl text-foreground">Check-in History</h3>
              {checkinEntries.map((entry: any) => (
                <Card key={entry.id} className="glass-card">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs text-muted-foreground">{format(new Date(entry.created_at), "MMM d, yyyy")}</span>
                      <Button variant="ghost" size="sm" className="text-destructive h-6 w-6 p-0" onClick={() => deleteEntry.mutate(entry.id)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(entry.entry_data.checkin || {}).map(([name, status]) => (
                        <Badge key={name} variant="outline" className="text-xs border-accent/30 text-accent">
                          {name}: {status as string}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
