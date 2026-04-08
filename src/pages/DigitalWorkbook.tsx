import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Lock, Brain, Eye, Heart, Shield, AlertTriangle, Loader2, FileText, Star, Target, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { journeyWeeks } from "@/data/journeyData";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { toast as sonnerToast } from "sonner";
import { useUsage } from "@/contexts/UsageContext";

// ─── Tier access logic ───
const TIER_LEVEL: Record<string, number> = { free: 0, trial: 0.5, reset: 1, expand: 2, embody: 3, founding_full_access: 3 };
function canAccessScreen(tier: string, screen: number, isTrialActive: boolean): boolean {
  const level = TIER_LEVEL[tier] ?? 0;
  if (isTrialActive) return screen === 2 || screen === 3;
  if (level >= 2) return true; // expand+ gets all including AI report
  if (level >= 1) return screen <= 3; // reset gets 1-3
  return false;
}

// ─── Tab definitions ───
const TABS = [
  { id: 1, icon: "📅", label: "30-Day Tracker" },
  { id: 2, icon: "🔍", label: "Recognition Deficit" },
  { id: 3, icon: "💛", label: "How Would Love Respond?" },
  { id: 4, icon: "🌡", label: "Before & After" },
  { id: 5, icon: "✨", label: "AI Report" },
];

// ─── Recognition deficit items ───
const DEFICIT_CATEGORIES = [
  {
    title: "In Relationships",
    items: [
      "I stay in relationships that drain me",
      "I minimize my needs to keep the peace",
      "I tolerate disrespect to avoid conflict",
      "I give more than I receive and call it love",
      "I shrink myself so others feel comfortable",
      "I wait to be chosen instead of choosing myself",
    ],
  },
  {
    title: "In Money & Career",
    items: [
      "I undercharge for my work",
      "I stay in situations that underpay me",
      "I believe money is hard to come by",
      "I feel guilty when I receive abundantly",
      "I self-sabotage when success gets close",
      "I wait for permission to pursue what I want",
    ],
  },
  {
    title: "In Health & Body",
    items: [
      "I put my health last",
      "I use food, alcohol, or substances to cope",
      "I ignore what my body is telling me",
      "I don't rest without guilt",
    ],
  },
  {
    title: "In Self-Worth",
    items: [
      "I need external validation to feel good enough",
      "I apologize for taking up space",
      "I downplay my achievements",
      "I believe I have to earn love",
      "I feel guilty when things go well",
      "I compare myself to others constantly",
    ],
  },
];

// ─── Before/After prompts ───
const BA_PROMPTS = [
  { before: "I used to believe about myself…", after: "Now I know…" },
  { before: "I used to tolerate…", after: "My new standard is…" },
  { before: "I used to feel…", after: "Now I feel…" },
  { before: "I used to think about money…", after: "Now I know money…" },
  { before: "My relationships used to look like…", after: "Now I only accept…" },
  { before: "I used to need permission to…", after: "Now I give myself permission to…" },
];

// ─── Locked Screen Overlay ───
function LockedScreen() {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-[300px] flex items-center justify-center">
      <div className="absolute inset-0 bg-muted/30 backdrop-blur-md rounded-xl" />
      <div className="relative z-10 text-center p-8">
        <Lock className="w-8 h-8 text-[#C9A84C] mx-auto mb-3" />
        <p className="text-sm text-foreground font-medium mb-1">This section unlocks when you upgrade.</p>
        <Button onClick={() => navigate("/upgrade")} className="mt-3 bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#06060e] font-semibold">Upgrade →</Button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// SCREEN 1 — 30-Day Tracker
// ═════════════════════════════════════════════════════════════════
function TrackerScreen() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [progressMap, setProgressMap] = useState<Record<number, boolean>>({});
  const [weekJournals, setWeekJournals] = useState<Record<number, string>>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!user) return;
    supabase.from("thirty_day_progress").select("day_number, marked_complete").eq("user_id", user.id)
      .then(({ data }) => {
        if (data) {
          const map: Record<number, boolean> = {};
          data.forEach((r: any) => { if (r.marked_complete) map[r.day_number] = true; });
          setProgressMap(map);
        }
      });
    // Load week journals
    supabase.from("healing_tool_entries").select("entry_data").eq("user_id", user.id).eq("tool_id", "workbook_tracker")
      .then(({ data }) => {
        if (data?.[0]) setWeekJournals((data[0] as any).entry_data?.weeks || {});
      });
  }, [user]);

  const completedDays = Object.values(progressMap).filter(Boolean).length;

  const saveWeekJournal = useCallback((week: number, text: string) => {
    setWeekJournals(prev => ({ ...prev, [week]: text }));
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (!user) return;
      const updated = { ...weekJournals, [week]: text };
      await supabase.from("healing_tool_entries").upsert({
        user_id: user.id,
        tool_id: "workbook_tracker",
        entry_data: { weeks: updated } as any,
      }, { onConflict: "user_id,tool_id" } as any);
    }, 1000);
  }, [user, weekJournals]);

  const weekPrompts: Record<number, string> = {
    1: "What pattern did I see most clearly this week?",
    2: "What standard did I raise this week?",
    3: "What did I do this week that my old self wouldn't have done?",
    4: "Who am I now, compared to Day 1?",
  };

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-foreground mb-1">Your 30-Day Reset Tracker</h2>
      <p className="text-sm text-muted-foreground italic mb-6">Check off each day. Watch who you become.</p>
      <Progress value={(completedDays / 30) * 100} className="h-3 mb-6 [&>div]:bg-[#C9A84C]" />
      <p className="text-xs text-muted-foreground mb-8">{completedDays} of 30 days completed</p>

      {journeyWeeks.map(week => (
        <div key={week.week} className="mb-8">
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className="font-serif text-lg font-bold text-foreground">Week {week.week} — {week.theme}</h3>
          </div>
          <p className="text-xs italic mb-3" style={{ color: week.accentHex }}>{week.tagline}</p>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {week.days.map(day => (
              <div key={day.day} className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-center ${progressMap[day.day] ? "border-[#C9A84C]/40 bg-[#C9A84C]/5" : "border-border/30 bg-muted/10"}`}>
                <span className="text-[10px] text-muted-foreground">Day</span>
                <span className="text-sm font-bold text-foreground">{day.day}</span>
                {progressMap[day.day] ? <Check className="w-4 h-4 text-[#C9A84C]" /> : <div className="w-4 h-4" />}
              </div>
            ))}
          </div>
          <div className="mb-2">
            <p className="text-xs font-medium text-foreground mb-1">Week {week.week} Journal:</p>
            <p className="text-xs text-muted-foreground italic mb-2">{weekPrompts[week.week]}</p>
            <Textarea
              value={weekJournals[week.week] || ""}
              onChange={e => saveWeekJournal(week.week, e.target.value)}
              placeholder="Write your reflection..."
              className="min-h-[80px] bg-muted/30 border-border/30 text-sm"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// SCREEN 2 — Recognition Deficit
// ═════════════════════════════════════════════════════════════════
function RecognitionScreen() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState("");
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!user) return;
    supabase.from("recognition_deficit_items" as any).select("item_text, checked").eq("user_id", user.id)
      .then(({ data }) => {
        if (data) {
          const set = new Set<string>();
          (data as any[]).forEach(r => { if (r.checked) set.add(r.item_text); });
          setCheckedItems(set);
        }
      });
    supabase.from("healing_tool_entries").select("entry_data").eq("user_id", user.id).eq("tool_id", "workbook_recognition")
      .then(({ data }) => {
        if (data?.[0]) {
          const d = (data[0] as any).entry_data;
          setNotes(d?.notes || "");
          if (d?.aiInsight) setAiInsight(d.aiInsight);
        }
      });
  }, [user]);

  const toggleItem = async (text: string) => {
    if (!user) return;
    const newChecked = new Set(checkedItems);
    const isNowChecked = !newChecked.has(text);
    if (isNowChecked) newChecked.add(text); else newChecked.delete(text);
    setCheckedItems(newChecked);

    await supabase.from("recognition_deficit_items" as any).upsert({
      user_id: user.id,
      item_text: text,
      checked: isNowChecked,
      updated_at: new Date().toISOString(),
    } as any, { onConflict: "user_id,item_text" } as any);

    await supabase.from("profiles").update({ recognition_deficit_count: newChecked.size } as any).eq("user_id", user.id);
  };

  const saveNotes = useCallback(() => {
    if (!user) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      await supabase.from("healing_tool_entries").upsert({
        user_id: user.id,
        tool_id: "workbook_recognition",
        entry_data: { notes, aiInsight } as any,
      }, { onConflict: "user_id,tool_id" } as any);
    }, 1000);
  }, [user, notes, aiInsight]);

  const saveReflection = async () => {
    if (!user) return;
    await supabase.from("healing_tool_entries").upsert({
      user_id: user.id,
      tool_id: "workbook_recognition",
      entry_data: { notes, aiInsight } as any,
    }, { onConflict: "user_id,tool_id" } as any);
    toast({ title: "Reflection saved ✨" });
  };

  const decodePatterns = async () => {
    if (checkedItems.size === 0) { sonnerToast.error("Check at least one item first"); return; }
    setAiLoading(true);
    try {
      const allItems = DEFICIT_CATEGORIES.flatMap(c => c.items);
      const { data, error } = await supabase.functions.invoke("healing-tool-insight", {
        body: { toolType: "workbook-recognition", checkedItems: Array.from(checkedItems), totalItems: allItems.length, notes },
      });
      if (error) throw error;
      setAiInsight(data);
      // Persist
      if (user) {
        await supabase.from("healing_tool_entries").upsert({
          user_id: user.id,
          tool_id: "workbook_recognition",
          entry_data: { notes, aiInsight: data } as any,
        }, { onConflict: "user_id,tool_id" } as any);
      }
    } catch (e) { console.error(e); sonnerToast.error("Could not generate insight"); }
    setAiLoading(false);
  };

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-foreground mb-1">Recognition Deficit</h2>
      <p className="text-sm text-muted-foreground italic mb-4">Check every area where you are settling for less than you deserve.</p>
      <div className="p-3 rounded-xl bg-muted/20 border border-border/20 mb-6">
        <p className="text-xs text-muted-foreground italic">Be honest. No one is watching. This is your starting point — not your sentence.</p>
      </div>

      {DEFICIT_CATEGORIES.map(cat => (
        <div key={cat.title} className="mb-6">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">{cat.title}</h3>
          <div className="space-y-2">
            {cat.items.map(item => (
              <label key={item} className="flex items-start gap-3 p-3 rounded-xl border border-border/20 bg-card/50 hover:bg-card/80 cursor-pointer transition-colors">
                <Checkbox
                  checked={checkedItems.has(item)}
                  onCheckedChange={() => toggleItem(item)}
                  className="mt-0.5 data-[state=checked]:bg-[#C9A84C] data-[state=checked]:border-[#C9A84C]"
                />
                <span className="text-sm text-foreground leading-relaxed">{item}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Running count */}
      <div className="p-4 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 mb-6 text-center">
        <p className="text-sm text-foreground">
          You flagged <span className="text-[#C9A84C] font-bold text-lg">{checkedItems.size}</span> areas.
        </p>
        <p className="text-xs text-muted-foreground mt-1">That's not failure. That's awareness. That's where we begin.</p>
      </div>

      {/* Notes */}
      <div className="mb-4">
        <p className="text-sm font-medium text-foreground mb-2 italic">What do you notice about what you checked?</p>
        <Textarea
          value={notes}
          onChange={e => { setNotes(e.target.value); saveNotes(); }}
          placeholder="Write your observations..."
          className="min-h-[100px] bg-muted/30 border-border/30"
        />
      </div>
      <Button onClick={saveReflection} className="w-full bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#06060e] font-semibold mb-4">Save My Reflection →</Button>

      {/* AI Decode */}
      <Button onClick={decodePatterns} disabled={aiLoading || checkedItems.size === 0} variant="outline" className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10 mb-4">
        {aiLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Decoding your patterns...</> : <><Brain className="w-4 h-4 mr-2" />✨ Decode My Patterns</>}
      </Button>

      {aiInsight && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mt-2">
          <Card className="p-4 bg-purple-500/5 border-purple-500/20">
            <div className="flex items-start gap-2 mb-2"><Eye className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" /><h4 className="text-sm font-bold text-foreground">Dominant Pattern</h4></div>
            <p className="text-sm text-muted-foreground">{aiInsight.dominantPattern}</p>
          </Card>
          <Card className="p-4 bg-purple-500/5 border-purple-500/20">
            <div className="flex items-start gap-2 mb-2"><Heart className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" /><h4 className="text-sm font-bold text-foreground">Root Wound</h4></div>
            <p className="text-sm text-muted-foreground">{aiInsight.rootWound}</p>
          </Card>
          <Card className="p-4 bg-purple-500/5 border-purple-500/20">
            <div className="flex items-start gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" /><h4 className="text-sm font-bold text-foreground">Blind Spot</h4></div>
            <p className="text-sm text-muted-foreground">{aiInsight.blindSpot}</p>
          </Card>
          <Card className="p-4 bg-[#C9A84C]/5 border-[#C9A84C]/20">
            <div className="flex items-start gap-2 mb-2"><Shield className="w-4 h-4 text-[#C9A84C] mt-0.5 shrink-0" /><h4 className="text-sm font-bold text-foreground">Compassionate Reframe</h4></div>
            <p className="text-sm text-muted-foreground">{aiInsight.compassionateReframe}</p>
          </Card>
          <Card className="p-4 bg-emerald-500/5 border-emerald-500/20">
            <div className="flex items-start gap-2 mb-2"><Sparkles className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" /><h4 className="text-sm font-bold text-foreground">Your Next Step</h4></div>
            <p className="text-sm text-muted-foreground">{aiInsight.nextStep}</p>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// SCREEN 3 — How Would Love Respond?
// ═════════════════════════════════════════════════════════════════
function LoveResponseScreen() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [scenario, setScenario] = useState("");
  const [fearResponse, setFearResponse] = useState("");
  const [loveResponse, setLoveResponse] = useState("");
  const [pastEntries, setPastEntries] = useState<any[]>([]);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("healing_tool_entries").select("*").eq("user_id", user.id).eq("tool_id", "workbook_love_response").order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setPastEntries(data);
      });
  }, [user]);

  const coachMe = async () => {
    if (!scenario.trim()) { sonnerToast.error("Describe a situation first"); return; }
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("healing-tool-insight", {
        body: { toolType: "workbook-love-response", scenario, fearResponse, loveResponse },
      });
      if (error) throw error;
      setAiInsight(data);
    } catch (e) { console.error(e); sonnerToast.error("Could not generate coaching"); }
    setAiLoading(false);
  };

  const savePractice = async () => {
    if (!user || !scenario.trim()) return;
    const { data, error } = await supabase.from("healing_tool_entries").insert({
      user_id: user.id,
      tool_id: "workbook_love_response",
      entry_data: { scenario, fearResponse, loveResponse, aiInsight } as any,
    }).select();
    if (!error && data) {
      setPastEntries(prev => [data[0], ...prev]);
      setScenario(""); setFearResponse(""); setLoveResponse(""); setAiInsight(null);
      toast({ title: "Practice saved ✨" });
    }
  };

  const STEPS = [
    { num: 1, title: "PAUSE", body: 'Before you react, respond, or decide — pause.\nAsk: "Am I operating from fear or from love right now?"' },
    { num: 2, title: "IDENTIFY", body: 'Fear responses sound like:\n"I have to." "I should." "What will they think?" "I can\'t."\n\nLove responses sound like:\n"I choose to." "This aligns with me." "What do I need?" "I am allowed."' },
    { num: 3, title: "ASK THE QUESTION", body: '"How would love respond to this?"\nNot romantic love. Self-love. Sovereign love.\nThe kind that protects, chooses, and does not abandon itself.' },
    { num: 4, title: "ACT FROM LOVE", body: "Choose the response that expands your worth — not the one that keeps you safe but small." },
  ];

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-foreground mb-1">How Would Love Respond?</h2>
      <p className="text-sm text-muted-foreground italic mb-8">A 4-step framework for every decision, reaction, and relationship.</p>

      {/* Framework */}
      <div className="space-y-4 mb-10">
        {STEPS.map(step => (
          <div key={step.num} className="flex gap-4">
            <div className="w-8 h-8 shrink-0 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 flex items-center justify-center">
              <span className="text-sm font-bold text-[#C9A84C]">{step.num}</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground mb-1">{step.title}</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{step.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Practice Section */}
      <div className="border-t border-border/30 pt-8">
        <h3 className="font-serif text-lg font-bold text-foreground mb-4">Practice It</h3>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block italic">What situation are you facing right now?</label>
            <Textarea value={scenario} onChange={e => setScenario(e.target.value)} placeholder="Describe the situation..." className="min-h-[80px] bg-muted/30 border-border/30" />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block italic">What is the fear-based response?</label>
            <Textarea value={fearResponse} onChange={e => setFearResponse(e.target.value)} placeholder="The fear says..." className="min-h-[60px] bg-muted/30 border-border/30" />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block italic">How would love respond?</label>
            <Textarea value={loveResponse} onChange={e => setLoveResponse(e.target.value)} placeholder="Love would..." className="min-h-[60px] bg-muted/30 border-border/30" />
          </div>
        </div>

        {/* AI Coach */}
        <Button onClick={coachMe} disabled={aiLoading || !scenario.trim()} variant="outline" className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10 mb-4">
          {aiLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Coaching you...</> : <><Brain className="w-4 h-4 mr-2" />✨ Coach Me Deeper</>}
        </Button>

        {aiInsight && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mb-6">
            <Card className="p-4 bg-purple-500/5 border-purple-500/20">
              <div className="flex items-start gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" /><h4 className="text-sm font-bold text-foreground">Fear Decoded</h4></div>
              <p className="text-sm text-muted-foreground">{aiInsight.fearDecode}</p>
            </Card>
            <Card className="p-4 bg-emerald-500/5 border-emerald-500/20">
              <div className="flex items-start gap-2 mb-2"><Heart className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" /><h4 className="text-sm font-bold text-foreground">Your Love Response Shows…</h4></div>
              <p className="text-sm text-muted-foreground">{aiInsight.loveValidation}</p>
            </Card>
            <Card className="p-4 bg-[#C9A84C]/5 border-[#C9A84C]/20">
              <div className="flex items-start gap-2 mb-2"><Sparkles className="w-4 h-4 text-[#C9A84C] mt-0.5 shrink-0" /><h4 className="text-sm font-bold text-foreground">An Even Deeper Love Response</h4></div>
              <p className="text-sm text-muted-foreground italic">"{aiInsight.deeperLoveResponse}"</p>
            </Card>
            <Card className="p-4 bg-purple-500/5 border-purple-500/20">
              <div className="flex items-start gap-2 mb-2"><Eye className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" /><h4 className="text-sm font-bold text-foreground">Body Check</h4></div>
              <p className="text-sm text-muted-foreground">{aiInsight.bodyCheck}</p>
            </Card>
            <div className="p-4 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-center">
              <p className="text-sm text-foreground italic">"{aiInsight.affirmation}"</p>
            </div>
          </motion.div>
        )}

        <Button onClick={savePractice} disabled={!scenario.trim()} className="w-full bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#06060e] font-semibold">Save This Practice →</Button>
      </div>

      {/* Past entries */}
      {pastEntries.length > 0 && (
        <div className="mt-8 border-t border-border/30 pt-6">
          <h4 className="text-sm font-bold text-foreground mb-3">Past Practices</h4>
          <div className="space-y-2">
            {pastEntries.map((entry: any) => (
              <button
                key={entry.id}
                onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                className="w-full text-left p-3 rounded-xl border border-border/20 bg-card/50 hover:bg-card/80 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm text-foreground truncate max-w-[75%]">{entry.entry_data?.scenario}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(entry.created_at).toLocaleDateString()}</p>
                </div>
                <AnimatePresence>
                  {expandedEntry === entry.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="mt-3 space-y-2 text-xs">
                        <div><span className="font-bold text-red-400">Fear:</span> <span className="text-muted-foreground">{entry.entry_data?.fearResponse}</span></div>
                        <div><span className="font-bold text-[#C9A84C]">Love:</span> <span className="text-muted-foreground">{entry.entry_data?.loveResponse}</span></div>
                        {entry.entry_data?.aiInsight && (
                          <div className="mt-2 p-2 rounded-lg bg-purple-500/5 border border-purple-500/10">
                            <p className="text-[10px] uppercase tracking-wider text-purple-400 mb-1">AI Coaching</p>
                            <p className="text-muted-foreground">{entry.entry_data.aiInsight.affirmation}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// SCREEN 4 — Before & After
// ═════════════════════════════════════════════════════════════════
function BeforeAfterScreen() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [scoreBefore, setScoreBefore] = useState("");
  const [scoreAfter, setScoreAfter] = useState("");
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("worth_score_before, worth_score_after, worth_score_day1, worth_score_day24").eq("user_id", user.id).single()
      .then(({ data }) => {
        if (data) {
          const d = data as any;
          setScoreBefore(String(d.worth_score_before ?? d.worth_score_day1 ?? ""));
          setScoreAfter(String(d.worth_score_after ?? d.worth_score_day24 ?? ""));
        }
      });
    supabase.from("healing_tool_entries").select("entry_data").eq("user_id", user.id).eq("tool_id", "workbook_before_after")
      .then(({ data }) => {
        if (data?.[0]) {
          const d = (data[0] as any).entry_data;
          setResponses(d?.responses || {});
          if (d?.aiInsight) setAiInsight(d.aiInsight);
        }
      });
  }, [user]);

  const autoSave = useCallback((key: string, value: string) => {
    setResponses(prev => ({ ...prev, [key]: value }));
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (!user) return;
      const updated = { ...responses, [key]: value };
      await supabase.from("healing_tool_entries").upsert({
        user_id: user.id,
        tool_id: "workbook_before_after",
        entry_data: { responses: updated, aiInsight } as any,
      }, { onConflict: "user_id,tool_id" } as any);
    }, 1000);
  }, [user, responses, aiInsight]);

  const analyzeTransformation = async () => {
    const pairs = BA_PROMPTS.map((p, i) => ({
      before: responses[`before_${i}`] || "",
      after: responses[`after_${i}`] || "",
    })).filter(p => p.before || p.after);
    if (pairs.length === 0) { sonnerToast.error("Fill in at least one Before & After pair first"); return; }
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("healing-tool-insight", {
        body: { toolType: "workbook-before-after", pairs, scoreBefore, scoreAfter },
      });
      if (error) throw error;
      setAiInsight(data);
      // Persist
      if (user) {
        await supabase.from("healing_tool_entries").upsert({
          user_id: user.id,
          tool_id: "workbook_before_after",
          entry_data: { responses, aiInsight: data } as any,
        }, { onConflict: "user_id,tool_id" } as any);
      }
    } catch (e) { console.error(e); sonnerToast.error("Could not analyze transformation"); }
    setAiLoading(false);
  };

  const saveAll = async () => {
    if (!user) return;
    const bNum = parseInt(scoreBefore) || null;
    const aNum = parseInt(scoreAfter) || null;
    await supabase.from("profiles").update({
      worth_score_before: bNum,
      worth_score_after: aNum,
    } as any).eq("user_id", user.id);
    await supabase.from("healing_tool_entries").upsert({
      user_id: user.id,
      tool_id: "workbook_before_after",
      entry_data: { responses, aiInsight } as any,
    }, { onConflict: "user_id,tool_id" } as any);
    setSaved(true);
    toast({ title: "Before & After saved ✨" });
  };

  const diff = (parseInt(scoreAfter) || 0) - (parseInt(scoreBefore) || 0);

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-foreground mb-1">Before & After</h2>
      <p className="text-sm text-muted-foreground italic mb-8">The gap between who you were and who you are now is the evidence of your reset.</p>

      {/* Scores */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl border border-border/30 bg-muted/10 text-center">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Before (Day 1)</p>
          <input
            type="number"
            value={scoreBefore}
            onChange={e => setScoreBefore(e.target.value)}
            className="w-full text-center text-3xl font-bold text-foreground bg-transparent border-b border-border/30 focus:border-[#C9A84C] outline-none pb-1"
            placeholder="—"
          />
        </div>
        <div className="p-4 rounded-xl border border-border/30 bg-muted/10 text-center">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">After (Day 24/30)</p>
          <input
            type="number"
            value={scoreAfter}
            onChange={e => setScoreAfter(e.target.value)}
            className="w-full text-center text-3xl font-bold text-foreground bg-transparent border-b border-border/30 focus:border-[#C9A84C] outline-none pb-1"
            placeholder="—"
          />
        </div>
      </div>
      {scoreBefore && scoreAfter && diff > 0 && (
        <div className="p-3 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 mb-8 text-center">
          <p className="text-sm text-foreground">Your Worth Thermostat™ rose <span className="font-bold text-[#C9A84C]">{diff}</span> points.</p>
          <p className="text-xs text-[#C9A84C]">That is {diff} points of recalibration.</p>
        </div>
      )}

      {/* Reflection Fields */}
      <div className="space-y-6 mb-8">
        {BA_PROMPTS.map((prompt, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">{prompt.before}</label>
              <Textarea
                value={responses[`before_${i}`] || ""}
                onChange={e => autoSave(`before_${i}`, e.target.value)}
                className="min-h-[70px] bg-muted/20 border-border/30 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#C9A84C] mb-1 block">{prompt.after}</label>
              <Textarea
                value={responses[`after_${i}`] || ""}
                onChange={e => autoSave(`after_${i}`, e.target.value)}
                className="min-h-[70px] bg-muted/20 border-border/30 text-sm"
              />
            </div>
          </div>
        ))}
      </div>

      <Button onClick={saveAll} className="w-full bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#06060e] font-semibold mb-4">Save My Before & After →</Button>

      {/* AI Transformation Analysis */}
      <Button onClick={analyzeTransformation} disabled={aiLoading} variant="outline" className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10 mb-4">
        {aiLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing your transformation...</> : <><Brain className="w-4 h-4 mr-2" />✨ Reveal My Transformation</>}
      </Button>

      {aiInsight && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mb-4">
          <Card className="p-4 bg-[#C9A84C]/5 border-[#C9A84C]/20">
            <div className="flex items-start gap-2 mb-2"><Sparkles className="w-4 h-4 text-[#C9A84C] mt-0.5 shrink-0" /><h4 className="text-sm font-bold text-foreground">Transformation Theme</h4></div>
            <p className="text-sm text-muted-foreground">{aiInsight.transformationTheme}</p>
          </Card>
          <Card className="p-4 bg-purple-500/5 border-purple-500/20">
            <div className="flex items-start gap-2 mb-2"><Eye className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" /><h4 className="text-sm font-bold text-foreground">Biggest Shift</h4></div>
            <p className="text-sm text-muted-foreground">{aiInsight.biggestShift}</p>
          </Card>
          <Card className="p-4 bg-emerald-500/5 border-emerald-500/20">
            <div className="flex items-start gap-2 mb-2"><Shield className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" /><h4 className="text-sm font-bold text-foreground">Hidden Growth</h4></div>
            <p className="text-sm text-muted-foreground">{aiInsight.hiddenGrowth}</p>
          </Card>
          <Card className="p-4 bg-[#C9A84C]/5 border-[#C9A84C]/20">
            <div className="flex items-start gap-2 mb-2"><Heart className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" /><h4 className="text-sm font-bold text-foreground">Worth Evidence</h4></div>
            <p className="text-sm text-muted-foreground">{aiInsight.worthEvidence}</p>
          </Card>
          <div className="p-4 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-center">
            <p className="text-xs uppercase tracking-wider text-[#C9A84C] mb-2">Your Celebration</p>
            <p className="text-sm text-foreground italic">"{aiInsight.celebrationMessage}"</p>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {saved && !aiInsight && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 text-center">
            <p className="text-sm text-foreground"><Sparkles className="w-4 h-4 inline mr-1 text-[#C9A84C]" />You just wrote the proof of your transformation.</p>
            <p className="text-xs text-muted-foreground italic mt-1">This is evidence. Come back and read it on hard days.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// SCREEN 5 — AI Transformation Report
// ═════════════════════════════════════════════════════════════════
function TransformationReportScreen() {
  const { user } = useAuth();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState("");

  // Load saved report
  useEffect(() => {
    if (!user) return;
    supabase.from("healing_tool_entries").select("entry_data").eq("user_id", user.id).eq("tool_id", "workbook_transformation_report")
      .then(({ data }) => {
        if (data?.[0]) {
          const d = (data[0] as any).entry_data;
          if (d?.report) setReport(d.report);
        }
      });
  }, [user]);

  const generateReport = async () => {
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      // Gather all data in parallel
      const [profileRes, deficitRes, beforeAfterRes, loveRes, journeyRes, toolsRes, checkinsRes, assessmentRes] = await Promise.all([
        supabase.from("profiles").select("full_name, current_streak, total_points, journey_current_day, recognition_deficit_count, worth_score_before, worth_score_after, worth_score_day1, worth_score_day24").eq("user_id", user.id).single(),
        supabase.from("recognition_deficit_items" as any).select("item_text, checked").eq("user_id", user.id),
        supabase.from("healing_tool_entries").select("entry_data").eq("user_id", user.id).eq("tool_id", "workbook_before_after"),
        supabase.from("healing_tool_entries").select("entry_data, created_at").eq("user_id", user.id).eq("tool_id", "workbook_love_response").order("created_at", { ascending: false }).limit(5),
        supabase.from("thirty_day_progress").select("day_number, marked_complete").eq("user_id", user.id),
        supabase.from("healing_tool_entries").select("tool_id").eq("user_id", user.id),
        supabase.from("user_checkins").select("daily_state").eq("user_id", user.id).order("created_at", { ascending: false }).limit(30),
        supabase.from("assessment_results").select("percentage_score, thermostat_type, completed_at").eq("user_id", user.id).order("completed_at", { ascending: false }).limit(5),
      ]);

      const profile = profileRes.data ? {
        fullName: (profileRes.data as any).full_name,
        streak: (profileRes.data as any).current_streak,
        points: (profileRes.data as any).total_points,
        journeyDay: (profileRes.data as any).journey_current_day,
      } : null;

      // Recognition deficit
      const deficitItems = (deficitRes.data as any[] || []);
      const checkedItems = deficitItems.filter((d: any) => d.checked).map((d: any) => d.item_text);
      const allDeficitItems = DEFICIT_CATEGORIES.flatMap(c => c.items);

      // Categorize checked items
      const catCounts: Record<string, number> = {};
      DEFICIT_CATEGORIES.forEach(cat => {
        const count = cat.items.filter(i => checkedItems.includes(i)).length;
        if (count > 0) catCounts[cat.title] = count;
      });
      const topCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).map(([k]) => k).join(", ");

      const recognitionDeficit = checkedItems.length > 0 ? {
        checkedCount: checkedItems.length,
        totalItems: allDeficitItems.length,
        topCategories: topCats,
        checkedItems: checkedItems.slice(0, 10),
      } : null;

      // Before/After
      const baData = beforeAfterRes.data?.[0] ? (beforeAfterRes.data[0] as any).entry_data : null;
      const beforeAfter = baData ? {
        scoreBefore: (profileRes.data as any)?.worth_score_before ?? (profileRes.data as any)?.worth_score_day1,
        scoreAfter: (profileRes.data as any)?.worth_score_after ?? (profileRes.data as any)?.worth_score_day24,
        pairs: BA_PROMPTS.map((p, i) => ({
          before: baData.responses?.[`before_${i}`] || "",
          after: baData.responses?.[`after_${i}`] || "",
        })),
      } : null;

      // Love responses
      const loveResponses = (loveRes.data || []).map((e: any) => e.entry_data);

      // Journey
      const completedDays = (journeyRes.data || []).filter((d: any) => d.marked_complete).length;
      const journeyProgress = { completedDays, currentPhase: completedDays <= 7 ? "Recognition" : completedDays <= 14 ? "Release" : completedDays <= 21 ? "Quiet Phase" : "Recalibration" };

      // Unique tools
      const toolsUsed = [...new Set((toolsRes.data || []).map((t: any) => t.tool_id))].filter(t => !t.startsWith("workbook_"));

      // Check-in states
      const checkinStates = (checkinsRes.data || []).map((c: any) => c.daily_state);

      // Assessments
      const assessmentScores = (assessmentRes.data || []).map((a: any) => ({
        score: a.percentage_score,
        type: a.thermostat_type,
        date: new Date(a.completed_at).toLocaleDateString(),
      }));

      const { data, error: fnError } = await supabase.functions.invoke("transformation-report", {
        body: {
          profile,
          recognitionDeficit,
          beforeAfter,
          loveResponses,
          journeyProgress,
          toolsUsed,
          checkinStates,
          assessmentScores,
        },
      });

      if (fnError) throw fnError;
      setReport(data);

      // Persist
      await supabase.from("healing_tool_entries").upsert({
        user_id: user.id,
        tool_id: "workbook_transformation_report",
        entry_data: { report: data, generatedAt: new Date().toISOString() } as any,
      }, { onConflict: "user_id,tool_id" } as any);

    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to generate report");
      sonnerToast.error("Could not generate report");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-foreground mb-1">Your Transformation Report</h2>
      <p className="text-sm text-muted-foreground italic mb-6">AI-powered analysis of your entire healing journey — every tool, every reflection, every shift.</p>

      {!report && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center">
            <FileText className="w-8 h-8 text-[#C9A84C]" />
          </div>
          <p className="text-sm text-muted-foreground mb-2">This report analyzes your Recognition Deficit, Before & After reflections,<br/>Love Response practices, healing tools, check-ins, and assessment scores.</p>
          <p className="text-xs text-muted-foreground italic mb-6">The more you've completed, the deeper your report will be.</p>
          <Button onClick={generateReport} className="bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#06060e] font-semibold px-8">
            <Brain className="w-4 h-4 mr-2" />Generate My Report
          </Button>
        </div>
      )}

      {loading && (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin mx-auto mb-4" />
          <p className="text-sm text-foreground font-medium">Analyzing your entire journey…</p>
          <p className="text-xs text-muted-foreground mt-1">Reading your reflections, patterns, and growth across all tools.</p>
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-8">
          <p className="text-sm text-destructive mb-4">{error}</p>
          <Button onClick={generateReport} variant="outline">Try Again</Button>
        </div>
      )}

      {report && !loading && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Report Title */}
          <div className="text-center py-6 rounded-xl bg-gradient-to-b from-[#C9A84C]/10 to-transparent border border-[#C9A84C]/20">
            <Sparkles className="w-6 h-6 text-[#C9A84C] mx-auto mb-2" />
            <h3 className="font-serif text-xl font-bold text-foreground">{report.reportTitle}</h3>
          </div>

          {/* Summary */}
          <Card className="p-5 bg-card/80 border-border/30">
            <p className="text-sm text-foreground leading-relaxed">{report.transformationSummary}</p>
          </Card>

          {/* Top Insights */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Key Insights</h4>
            <div className="space-y-3">
              {(report.topInsights || []).map((insight: any, i: number) => (
                <Card key={i} className="p-4 bg-purple-500/5 border-purple-500/20">
                  <div className="flex items-start gap-2 mb-2">
                    <Star className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                    <h5 className="text-sm font-bold text-foreground">{insight.title}</h5>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.insight}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Growth Evidence */}
          <Card className="p-4 bg-emerald-500/5 border-emerald-500/20">
            <div className="flex items-start gap-2 mb-2"><Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" /><h4 className="text-sm font-bold text-foreground">Growth Evidence</h4></div>
            <p className="text-sm text-muted-foreground">{report.growthEvidence}</p>
          </Card>

          {/* Blind Spot */}
          <Card className="p-4 bg-amber-500/5 border-amber-500/20">
            <div className="flex items-start gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" /><h4 className="text-sm font-bold text-foreground">Your Blind Spot</h4></div>
            <p className="text-sm text-muted-foreground">{report.blindSpot}</p>
          </Card>

          {/* Strength Profile */}
          <Card className="p-4 bg-[#C9A84C]/5 border-[#C9A84C]/20">
            <div className="flex items-start gap-2 mb-2"><Shield className="w-4 h-4 text-[#C9A84C] mt-0.5 shrink-0" /><h4 className="text-sm font-bold text-foreground">Your Core Strength</h4></div>
            <p className="text-sm text-muted-foreground">{report.strengthProfile}</p>
          </Card>

          {/* Next Chapter */}
          {report.nextChapter && (
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
              <h4 className="text-xs uppercase tracking-wider text-purple-400 mb-3">Your Next Chapter</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                  <div><p className="text-xs font-bold text-foreground mb-0.5">Focus</p><p className="text-sm text-muted-foreground">{report.nextChapter.focus}</p></div>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#C9A84C] mt-0.5 shrink-0" />
                  <div><p className="text-xs font-bold text-foreground mb-0.5">This Week's Action</p><p className="text-sm text-muted-foreground">{report.nextChapter.action}</p></div>
                </div>
                <div className="p-3 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/20 text-center">
                  <p className="text-sm text-foreground italic">"{report.nextChapter.affirmation}"</p>
                </div>
              </div>
            </div>
          )}

          {/* Celebration */}
          <div className="p-5 rounded-xl bg-gradient-to-b from-[#C9A84C]/10 to-[#C9A84C]/5 border border-[#C9A84C]/30 text-center">
            <Heart className="w-5 h-5 text-rose-400 mx-auto mb-2" />
            <p className="text-xs uppercase tracking-wider text-[#C9A84C] mb-2">A Letter From Your Future Self</p>
            <p className="text-sm text-foreground italic leading-relaxed">"{report.celebrationMessage}"</p>
          </div>

          {/* Download & Regenerate */}
          <div className="flex gap-3 mt-2">
            <Button
              onClick={async () => {
                setPdfLoading(true);
                try {
                  const profileRes = await supabase.from("profiles").select("full_name").eq("user_id", user!.id).single();
                  const userName = (profileRes.data as any)?.full_name || "";
                  const { data, error: fnErr } = await supabase.functions.invoke("generate-report-pdf", {
                    body: { report, userName },
                  });
                  if (fnErr) throw fnErr;
                  // Decode base64 and download
                  const byteChars = atob(data.pdf);
                  const byteArray = new Uint8Array(byteChars.length);
                  for (let i = 0; i < byteChars.length; i++) byteArray[i] = byteChars.charCodeAt(i);
                  const blob = new Blob([byteArray], { type: "application/pdf" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "Transformation-Report.pdf";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  sonnerToast.success("PDF downloaded!");
                } catch (e) {
                  console.error(e);
                  sonnerToast.error("Could not generate PDF");
                }
                setPdfLoading(false);
              }}
              className="flex-1 bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#06060e] font-semibold"
              disabled={pdfLoading}
            >
              {pdfLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating PDF...</> : <><Download className="w-4 h-4 mr-2" />Download PDF</>}
            </Button>
            <Button onClick={generateReport} variant="outline" className="flex-1 border-border/30 text-muted-foreground hover:text-foreground">
              <Brain className="w-4 h-4 mr-2" />Regenerate
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// Main Workbook Page
// ═════════════════════════════════════════════════════════════════
export default function DigitalWorkbook() {
  const [searchParams] = useSearchParams();
  const { effectiveTier } = useSubscription();
  const { isTrialActive } = useTrialStatus();
  const initialTab = parseInt(searchParams.get("screen") || "1");
  const [activeTab, setActiveTab] = useState(initialTab);

  const tier = effectiveTier || "free";
  const trialActive = isTrialActive || false;

  const renderScreen = () => {
    if (!canAccessScreen(tier, activeTab, trialActive)) return <LockedScreen />;
    switch (activeTab) {
      case 1: return <TrackerScreen />;
      case 2: return <RecognitionScreen />;
      case 3: return <LoveResponseScreen />;
      case 4: return <BeforeAfterScreen />;
      case 5: return <TransformationReportScreen />;
      default: return <TrackerScreen />;
    }
  };

  return (
    <AuthenticatedLayout title="Digital Workbook" subtitle="Your transformation in writing">
      <div className="pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Tab Navigation */}
          <div className="overflow-x-auto -mx-4 px-4 mb-8 scrollbar-hide">
            <div className="flex gap-1 w-max border-b border-border/30">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all relative ${
                    activeTab === tab.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="mr-1.5">{tab.icon}</span>
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="workbook-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A84C]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Screen Content */}
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

