import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause, Sparkles, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { ModuleContent, ModuleActivity } from "@/data/emotionalSurgeryModules";

interface Props {
  module: ModuleContent;
}

interface JournalEntry {
  id: string;
  text: string;
  tags: string[];
  created_at: string;
}

export default function ModuleScreen({ module }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [openJournal, setOpenJournal] = useState<string | null>(null);
  const [journalText, setJournalText] = useState("");
  const [dailyText, setDailyText] = useState("");
  const [recentEntries, setRecentEntries] = useState<Record<string, JournalEntry[]>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const toolId = (tags: string[]) => `es-${tags.join("-")}`;

  // Load recent entries for all journal activities
  useEffect(() => {
    if (!user) return;
    const allToolIds = [
      ...module.activities
        .filter((a) => a.type === "journal" && a.tags)
        .map((a) => toolId(a.tags!)),
      toolId(module.dailyJournal.tags),
    ];

    supabase
      .from("healing_tool_entries")
      .select("id, tool_id, entry_data, created_at")
      .eq("user_id", user.id)
      .in("tool_id", allToolIds)
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data) {
          const grouped: Record<string, JournalEntry[]> = {};
          data.forEach((r: any) => {
            const tid = r.tool_id;
            if (!grouped[tid]) grouped[tid] = [];
            grouped[tid].push({
              id: r.id,
              text: (r.entry_data as any)?.text || "",
              tags: (r.entry_data as any)?.tags || [],
              created_at: r.created_at,
            });
          });
          setRecentEntries(grouped);
        }
      });
  }, [user, module.slug]);

  const saveJournalEntry = async (text: string, tags: string[]) => {
    if (!user || !text.trim()) return;
    const tid = toolId(tags);
    const { error } = await supabase.from("healing_tool_entries").insert({
      user_id: user.id,
      tool_id: tid,
      entry_data: { text: text.trim(), tags },
    });
    if (!error) {
      toast({ title: "Saved ✨", description: "Your journal entry has been saved." });
      // Update local state
      setRecentEntries((prev) => ({
        ...prev,
        [tid]: [
          { id: crypto.randomUUID(), text: text.trim(), tags, created_at: new Date().toISOString() },
          ...(prev[tid] || []),
        ],
      }));
    }
  };

  const handleActivityClick = (activity: ModuleActivity) => {
    if (activity.type === "route" && activity.route) {
      navigate(activity.route);
    } else if (activity.type === "journal") {
      const key = activity.label;
      setOpenJournal(openJournal === key ? null : key);
      setJournalText("");
    } else if (activity.type === "audio") {
      setIsPlaying(!isPlaying);
    }
  };

  // Show last 7 days for action tracker in embodiment
  const isActionTracker = module.slug === "embodiment";

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/emotional-surgery")}
        className="mb-6 text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Emotional Surgery™
      </Button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-2">
          Phase {module.phase}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
          {module.title}
        </h1>
        <p className="text-base text-primary/80 italic font-medium mb-4">
          {module.subheader}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
          {module.body}
        </p>
      </motion.div>

      {/* Activity Buttons */}
      <div className="space-y-3 mb-10">
        {module.activities.map((activity, idx) => (
          <motion.div
            key={activity.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.07 }}
          >
            <button
              onClick={() => handleActivityClick(activity)}
              className={`w-full text-left rounded-2xl border transition-all p-5 group ${
                openJournal === activity.label
                  ? "border-primary bg-primary/5"
                  : "border-border/50 bg-card hover:border-primary/50 hover:bg-primary/[0.02]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{activity.icon}</span>
                  <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {activity.label}
                  </span>
                </div>
                {activity.type === "route" && (
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
                {activity.type === "audio" && (
                  <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                    {isPlaying ? (
                      <Pause className="w-4 h-4 text-primary" />
                    ) : (
                      <Play className="w-4 h-4 text-primary ml-0.5" />
                    )}
                  </div>
                )}
              </div>
            </button>

            {/* Inline guided journal */}
            <AnimatePresence>
              {activity.type === "journal" && openJournal === activity.label && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 py-6 border border-t-0 border-primary/20 rounded-b-2xl bg-card">
                    {activity.intro && (
                      <p className="text-sm text-foreground/70 italic mb-4 leading-relaxed">
                        "{activity.intro}"
                      </p>
                    )}
                    <p className="text-base text-foreground font-medium mb-4 leading-relaxed text-center px-4">
                      "{activity.prompt}"
                    </p>
                    <Textarea
                      placeholder="Write your response…"
                      value={journalText}
                      onChange={(e) => setJournalText(e.target.value)}
                      className="min-h-[140px] bg-muted/50 border-border/50 mb-4"
                    />
                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      onClick={() => {
                        if (activity.tags) {
                          saveJournalEntry(journalText, activity.tags);
                          setJournalText("");
                        }
                      }}
                      disabled={!journalText.trim()}
                    >
                      Save Entry
                    </Button>

                    {/* Recent entries */}
                    {activity.tags && (recentEntries[toolId(activity.tags)] || []).length > 0 && (
                      <div className="mt-5 space-y-2">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                          Recent entries
                        </p>
                        {(recentEntries[toolId(activity.tags)] || [])
                          .slice(0, isActionTracker && activity.label === "Daily Action Tracker" ? 7 : 3)
                          .map((entry) => (
                            <div
                              key={entry.id}
                              className="p-3 rounded-xl bg-muted/30 border border-border/30 text-sm text-foreground/80"
                            >
                              <p className="leading-relaxed">{entry.text}</p>
                              <p className="text-[10px] text-muted-foreground mt-1">
                                {new Date(entry.created_at).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Audio placeholder for meditation */}
      {module.activities.some((a) => a.type === "audio") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-10 p-5 rounded-2xl border border-border/30 bg-muted/20 text-center"
        >
          <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-3">
            <Play className="w-6 h-6 text-primary ml-0.5" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">Guided Release Meditation</p>
          <p className="text-xs text-muted-foreground">Audio coming soon — check back shortly</p>
        </motion.div>
      )}

      {/* Daily Journal Prompt */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mb-10"
      >
        <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4 text-center">
            Daily Journal Prompt
          </p>
          <p className="text-lg md:text-xl text-foreground font-serif text-center leading-relaxed mb-6 px-4">
            "{module.dailyJournal.prompt}"
          </p>
          <Textarea
            placeholder="Write your response…"
            value={dailyText}
            onChange={(e) => setDailyText(e.target.value)}
            className="min-h-[120px] bg-muted/50 border-border/50 mb-4"
          />
          <Button
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => {
              saveJournalEntry(dailyText, module.dailyJournal.tags);
              setDailyText("");
            }}
            disabled={!dailyText.trim()}
          >
            Save Daily Entry
          </Button>

          {/* Recent daily entries */}
          {(recentEntries[toolId(module.dailyJournal.tags)] || []).length > 0 && (
            <div className="mt-5 space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Recent entries
              </p>
              {(recentEntries[toolId(module.dailyJournal.tags)] || []).slice(0, 3).map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 rounded-xl bg-muted/30 border border-border/30 text-sm text-foreground/80"
                >
                  <p className="leading-relaxed">{entry.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(entry.created_at).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* CTA or Completion */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="mb-8"
      >
        {module.cta ? (
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base py-6 rounded-2xl"
            size="lg"
            onClick={() => navigate(module.cta!.route)}
          >
            {module.cta.label}
          </Button>
        ) : module.completionMessage ? (
          <div className="text-center space-y-5">
            <div className="p-6 rounded-2xl border border-primary/30 bg-primary/[0.05]">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-base md:text-lg text-foreground font-serif leading-relaxed">
                {module.completionMessage}
              </p>
            </div>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base py-6 rounded-2xl"
              size="lg"
              onClick={() => navigate("/home")}
            >
              <Home className="w-5 h-5 mr-2" /> Return to Home
            </Button>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}
