import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { healingTools } from "@/data/healingToolsData";
import { TrialLockedContent } from "@/components/TrialLockedContent";
import { useTrialStatus, getTrialAllowedTools } from "@/hooks/useTrialStatus";
import { Sparkles, TrendingUp, Calendar, ArrowRight, CheckCircle2, Lock } from "lucide-react";

interface ToolEntry {
  id: string;
  tool_id: string;
  created_at: string;
  entry_data: Record<string, any>;
}

export default function HealingToolsDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isTrialActive, onboardingReason, trialTool1, trialTool2 } = useTrialStatus();

  const { data: profile } = useQuery({
    queryKey: ["profile-dashboard", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("user_id", user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const tier = profile?.subscription_tier || "free";
  const allowedTools = getTrialAllowedTools(onboardingReason, trialTool1, trialTool2);

  const { data: allEntries = [] } = useQuery({
    queryKey: ["all-healing-entries", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("healing_tool_entries")
        .select("id, tool_id, created_at, entry_data")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ToolEntry[];
    },
    enabled: !!user,
  });

  // Compute stats per tool
  const toolStats = healingTools.map((tool) => {
    const entries = allEntries.filter((e) => e.tool_id === tool.id);
    const lastUsed = entries.length > 0 ? new Date(entries[0].created_at) : null;
    return { ...tool, entryCount: entries.length, lastUsed };
  });

  const toolsStarted = toolStats.filter((t) => t.entryCount > 0).length;
  const totalEntries = allEntries.length;

  // Category breakdown
  const categories = [...new Set(healingTools.map((t) => t.category))];
  const categoryStats = categories.map((cat) => {
    const tools = toolStats.filter((t) => t.category === cat);
    const started = tools.filter((t) => t.entryCount > 0).length;
    const entries = tools.reduce((sum, t) => sum + t.entryCount, 0);
    return { category: cat, total: tools.length, started, entries };
  });

  // Recent activity (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentEntries = allEntries.filter((e) => new Date(e.created_at) > sevenDaysAgo);

  // Active days this week
  const activeDays = new Set(
    recentEntries.map((e) => new Date(e.created_at).toDateString())
  ).size;

  // Most used tool
  const mostUsed = toolStats.reduce(
    (best, t) => (t.entryCount > best.entryCount ? t : best),
    toolStats[0]
  );

  const overallProgress = (toolsStarted / healingTools.length) * 100;

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Tools Started", value: `${toolsStarted}/${healingTools.length}`, icon: Sparkles, detail: `${Math.round(overallProgress)}% explored` },
          { label: "Total Entries", value: totalEntries, icon: TrendingUp, detail: "across all tools" },
          { label: "Active Days", value: `${activeDays}/7`, icon: Calendar, detail: "this week" },
          { label: "Most Used", value: mostUsed?.entryCount || 0, icon: CheckCircle2, detail: mostUsed?.name || "—" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="glass-card">
                <CardContent className="p-5 text-center">
                  <Icon className="w-7 h-7 text-accent mx-auto mb-2" />
                  <div className="font-serif text-2xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{stat.detail}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Overall Progress Bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-lg font-semibold text-foreground">Overall Exploration</h3>
              <span className="text-sm text-accent font-medium">{toolsStarted} of {healingTools.length} tools</span>
            </div>
            <Progress value={overallProgress} className="h-3 bg-muted" />
            <p className="text-xs text-muted-foreground mt-2">
              {toolsStarted === healingTools.length
                ? "🎉 You've explored every tool! Keep deepening your practice."
                : `${healingTools.length - toolsStarted} tools waiting for you to discover`}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Breakdown */}
      <div>
        <h3 className="font-serif text-xl font-bold text-foreground mb-4">By Category</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categoryStats.map((cat, i) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.04 }}
            >
              <Card className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs border-accent/30 text-accent">
                      {cat.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {cat.started}/{cat.total} started
                    </span>
                  </div>
                  <Progress value={(cat.started / cat.total) * 100} className="h-1.5 bg-muted" />
                  <p className="text-xs text-muted-foreground mt-2">{cat.entries} total entries</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* All Tools Grid */}
      <div>
        <h3 className="font-serif text-xl font-bold text-foreground mb-4">All Tools</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {toolStats.map((tool, i) => {
            const isTrialTool = allowedTools.includes(tool.id);
            const isLockedDuringTrial = isTrialActive && tier === "free" && !isTrialTool;

            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.03 }}
              >
                <TrialLockedContent isLocked={isLockedDuringTrial}>
                  <Card
                    className={`glass-card-hover cursor-pointer ${tool.entryCount === 0 ? "opacity-60" : ""} ${isTrialTool && isTrialActive && tier === "free" ? "border-[#C9A84C]/40" : ""}`}
                    onClick={() => navigate(`/healing-tools/${tool.id}`)}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <span className="text-2xl">{tool.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-sm font-semibold text-foreground truncate">{tool.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {tool.entryCount > 0
                            ? `${tool.entryCount} entries · Last ${formatRelative(tool.lastUsed!)}`
                            : "Not started yet"}
                        </p>
                      </div>
                      {isLockedDuringTrial ? (
                        <Lock className="w-4 h-4 text-[#C9A84C] shrink-0" />
                      ) : tool.entryCount > 0 ? (
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                    </CardContent>
                  </Card>
                </TrialLockedContent>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function formatRelative(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
