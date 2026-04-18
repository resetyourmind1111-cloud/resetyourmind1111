import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Check, BookOpen, ChevronRight, Sparkles, TrendingUp, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { EmptySlate } from "@/components/ui/empty-slate";
import { SkeletonCardList } from "@/components/ui/brand-skeleton";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const PHASE_INFO = [
  { phase: 1, title: "Recognition", desc: "You can't change what you won't see.", route: "/module/recognition" },
  { phase: 2, title: "Release", desc: "Let go of what is no longer true.", route: "/module/release" },
  { phase: 3, title: "The Quiet Phase™", desc: "The space between who you were and who you're becoming.", route: "/module/quiet-phase" },
  { phase: 4, title: "Recalibration", desc: "Reset your internal standard.", route: "/module/recalibration" },
  { phase: 5, title: "Embodiment", desc: "Become it. Live it. Prove it.", route: "/module/embodiment" },
];

const STATE_META: Record<string, { emoji: string; label: string }> = {
  overwhelmed: { emoji: "🌊", label: "Overwhelmed" },
  emotional: { emoji: "💧", label: "Emotional" },
  blank: { emoji: "🌫️", label: "Blank" },
  clear: { emoji: "☀️", label: "Clear" },
  activated: { emoji: "⚡", label: "Activated" },
};

const STATE_INSIGHTS: Record<string, string> = {
  overwhelmed: "You've been carrying a lot. Recognition is the first act of self-respect.",
  emotional: "Feeling deeply is not a weakness. It's the signal that something wants to move.",
  blank: "The quiet is not emptiness. It's integration. You are between identities.",
  clear: "Clarity is your natural state. You are returning to yourself.",
  activated: "Your energy is moving. Channel it with intention.",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Progress() {
  const navigate = useNavigate();
  const { user } = useAuth();

  /* ---- Profile (streak) ---- */
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("current_streak").eq("user_id", user!.id).single();
      return data;
    },
    enabled: !!user,
  });

  /* ---- Tool entries (count + unique tools) ---- */
  const { data: toolEntries = [] } = useQuery({
    queryKey: ["tool-entries-progress", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("healing_tool_entries")
        .select("id, tool_id, created_at, entry_data")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  /* ---- Lesson completions (active phase) ---- */
  const { data: lessonCompletions = [] } = useQuery({
    queryKey: ["lesson-completions-progress", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("lesson_completions")
        .select("lesson_number, completed_at")
        .eq("user_id", user!.id)
        .not("completed_at", "is", null);
      return data || [];
    },
    enabled: !!user,
  });

  /* ---- Daily check-ins (last 14) ---- */
  const { data: checkins = [] } = useQuery({
    queryKey: ["checkins-progress", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_checkins")
        .select("daily_state, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(14);
      return (data || []).reverse();
    },
    enabled: !!user,
  });

  /* ---- Assessment results ---- */
  const { data: assessments = [] } = useQuery({
    queryKey: ["assessments-progress", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("assessment_results")
        .select("percentage_score, completed_at")
        .eq("user_id", user!.id)
        .order("completed_at", { ascending: true });
      return data || [];
    },
    enabled: !!user,
  });

  /* ---- Derived data ---- */

  // Active phase
  const activePhase = useMemo(() => {
    const phaseCounts: Record<number, number> = {};
    lessonCompletions.forEach((lc: any) => {
      phaseCounts[lc.lesson_number] = (phaseCounts[lc.lesson_number] || 0) + 1;
    });
    for (let i = 1; i <= 5; i++) {
      if ((phaseCounts[i] || 0) < 4) return PHASE_INFO[i - 1];
    }
    return PHASE_INFO[4];
  }, [lessonCompletions]);

  // Unique tools used
  const uniqueTools = useMemo(() => {
    const set = new Set(toolEntries.map((e: any) => e.tool_id));
    return Array.from(set);
  }, [toolEntries]);

  // Journal entries count (tool entries that have text)
  const journalCount = toolEntries.length;

  // Most frequent check-in state
  const mostFrequentState = useMemo(() => {
    if (checkins.length < 3) return null;
    const counts: Record<string, number> = {};
    checkins.forEach((c: any) => {
      counts[c.daily_state] = (counts[c.daily_state] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  }, [checkins]);

  // Assessment chart data
  const assessmentChartData = useMemo(() => {
    return assessments.map((a: any, i: number) => ({
      label: `#${i + 1}`,
      score: a.percentage_score,
      date: new Date(a.completed_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }));
  }, [assessments]);

  // Recent journal entries (last 3 with text)
  const recentJournals = useMemo(() => {
    return toolEntries
      .filter((e: any) => (e.entry_data as any)?.text)
      .slice(0, 3)
      .map((e: any) => ({
        id: e.id,
        text: (e.entry_data as any).text,
        tags: (e.entry_data as any).tags || [],
        toolId: e.tool_id,
        date: e.created_at,
      }));
  }, [toolEntries]);

  return (
    <AuthenticatedLayout title="Your Progress">
      <div className="min-h-screen pt-24 pb-32 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">Your Progress</h1>
            <p className="text-muted-foreground text-sm italic">You are not starting over. You are evolving.</p>
          </motion.div>

          {profileLoading && (
            <div className="mb-8" aria-busy="true" aria-label="Loading your progress">
              <SkeletonCardList count={3} />
            </div>
          )}

          {/* SECTION 1 — Current Phase Card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-8">
            <div className="rounded-2xl p-6 md:p-8 bg-secondary text-secondary-foreground relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-secondary/80" />
              <div className="relative z-10">
                <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-1">
                  Phase {activePhase.phase} of 5
                </p>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary mb-2">
                  {activePhase.title}
                </h2>
                <p className="text-sm text-secondary-foreground/80 leading-relaxed mb-5">
                  {activePhase.desc}
                </p>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl"
                  onClick={() => navigate(activePhase.route)}
                >
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* SECTION 2 — Streak + Stats */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
            <div className="grid grid-cols-3 gap-3">
              {[
                { emoji: "🔥", label: "Current Streak", value: `${profile?.current_streak || 0}`, sub: "days" },
                { emoji: "✅", label: "Tools Completed", value: `${uniqueTools.length}`, sub: "total" },
                { emoji: "📓", label: "Journal Entries", value: `${journalCount}`, sub: "total" },
              ].map((stat, idx) => (
                <div key={stat.label} className="rounded-2xl border border-border/40 bg-card p-4 text-center">
                  <span className="text-2xl">{stat.emoji}</span>
                  <p className="font-serif text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{stat.sub}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SECTION 3 — Emotional Trends */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8">
            <h2 className="font-serif text-lg font-bold text-foreground mb-4">How You've Been Showing Up</h2>
            {checkins.length < 3 ? (
              <div className="rounded-2xl border border-border/30 bg-card p-6 text-center">
                <p className="text-sm text-muted-foreground italic">
                  Check in daily from Home to reveal your emotional pattern.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-border/30 bg-card p-5">
                {/* Icon grid of last 14 */}
                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  {checkins.map((c: any, i: number) => {
                    const meta = STATE_META[c.daily_state] || { emoji: "❓", label: c.daily_state };
                    return (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-xl bg-muted/50 border border-border/30 flex items-center justify-center text-lg"
                        title={`${meta.label} — ${new Date(c.created_at).toLocaleDateString()}`}
                      >
                        {meta.emoji}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center mb-4">
                  {Object.entries(STATE_META).map(([key, meta]) => (
                    <span key={key} className="text-[10px] text-muted-foreground flex items-center gap-1">
                      {meta.emoji} {meta.label}
                    </span>
                  ))}
                </div>

                {/* Insight */}
                {mostFrequentState && STATE_INSIGHTS[mostFrequentState] && (
                  <p className="text-sm text-foreground/80 italic text-center leading-relaxed border-t border-border/20 pt-4">
                    "{STATE_INSIGHTS[mostFrequentState]}"
                  </p>
                )}
              </div>
            )}
          </motion.div>

          {/* SECTION 4 — Completed Tools */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
            <h2 className="font-serif text-lg font-bold text-foreground mb-4">Tools You've Used</h2>
            {uniqueTools.length === 0 ? (
              <div className="rounded-2xl border border-border/30 bg-card p-6 text-center">
                <p className="text-sm text-muted-foreground italic mb-4">
                  Your toolkit is waiting. Every tool you use is a rep for your mind.
                </p>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => navigate("/tools")}
                >
                  Explore Tools <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
                <div className="flex gap-2 w-max">
                  {uniqueTools.map((tid: string) => (
                    <div
                      key={tid}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-primary/40 text-primary text-sm font-medium whitespace-nowrap"
                    >
                      <Check className="w-3.5 h-3.5" />
                      {tid.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).replace(/^Es /, "")}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* SECTION 5 — Journal Highlights */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-8">
            <h2 className="font-serif text-lg font-bold text-foreground mb-4">Your Recent Reflections</h2>
            {recentJournals.length === 0 ? (
              <div className="rounded-2xl border border-border/30 bg-card p-6 text-center">
                <p className="text-sm text-muted-foreground italic">No journal entries yet. Start writing to see your reflections here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentJournals.map((entry: any) => (
                  <div key={entry.id} className="rounded-2xl border border-border/30 bg-card p-4">
                    <p className="text-sm text-foreground/80 leading-relaxed line-clamp-2 mb-2">
                      {entry.text}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {entry.tags.map((tag: string) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                          {tag}
                        </span>
                      ))}
                      <span className="text-[10px] text-muted-foreground ml-auto">
                        {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* SECTION 6 — Worth Thermostat™ History */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-10">
            <h2 className="font-serif text-lg font-bold text-foreground mb-4">Worth Thermostat™ History</h2>
            {assessments.length === 0 ? (
              <div className="rounded-2xl border border-border/30 bg-card p-6 text-center">
                <p className="text-sm text-muted-foreground italic mb-4">
                  The Worth Thermostat™ is where your reset begins.
                </p>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl"
                  onClick={() => navigate("/assessment")}
                >
                  Take the Assessment
                </Button>
              </div>
            ) : assessments.length === 1 ? (
              <div className="rounded-2xl border border-border/30 bg-card p-6 text-center">
                <div className="mb-3">
                  <span className="font-serif text-4xl font-bold text-primary">{(assessments[0] as any).percentage_score}%</span>
                </div>
                <p className="text-sm text-muted-foreground italic mb-4">
                  Take it again after completing a full phase to see your growth.
                </p>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-xl"
                  onClick={() => navigate("/assessment")}
                >
                  Retake Worth Thermostat™
                </Button>
              </div>
            ) : (
              <div className="rounded-2xl border border-border/30 bg-card p-5">
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={assessmentChartData}>
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [`${value}%`, "Score"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2.5}
                      dot={{ fill: "hsl(var(--primary))", r: 4, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="text-center mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-xl"
                    onClick={() => navigate("/assessment")}
                  >
                    Retake Worth Thermostat™
                  </Button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Footer */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-center pb-4">
            <p className="text-sm text-muted-foreground italic flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Every day you show up is evidence that you have already decided to change.
              <Sparkles className="w-4 h-4 text-primary" />
            </p>
          </motion.div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
