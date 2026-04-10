import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Flame, Sun, RefreshCw, ArrowUp, Star, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CelebrationOverlay } from "@/components/trial/CelebrationOverlay";
import { MilestoneShareCard } from "./MilestoneShareCard";

interface Zone {
  name: string;
  range: [number, number];
  icon: React.ReactNode;
  color: string;
  message: string;
}

const ZONES: Zone[] = [
  { name: "The Starting Point", range: [0, 25], icon: <Flame className="w-4 h-4" />, color: "rgba(201, 116, 143, 0.6)", message: "Your reset has begun. Every step forward matters." },
  { name: "The Awakening", range: [26, 45], icon: <Sun className="w-4 h-4" />, color: "rgba(201, 168, 76, 0.7)", message: "You're seeing clearly now. Keep going." },
  { name: "The Shift", range: [46, 65], icon: <RefreshCw className="w-4 h-4" />, color: "hsl(var(--primary))", message: "Something is changing. Trust the process." },
  { name: "The Rise", range: [66, 85], icon: <ArrowUp className="w-4 h-4" />, color: "#3D1A6E", message: "You're rising. The pattern is breaking." },
  { name: "The Summit", range: [86, 100], icon: <Crown className="w-4 h-4" />, color: "hsl(var(--primary))", message: "You are living your reset. This is celebration." },
];

function getZoneIndex(score: number): number {
  if (score <= 25) return 0;
  if (score <= 45) return 1;
  if (score <= 65) return 2;
  if (score <= 85) return 3;
  return 4;
}

export function VisualResetMap() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [todayPoints, setTodayPoints] = useState(0);
  const [thermostatType, setThermostatType] = useState<string | undefined>();
  const [showCelebration, setShowCelebration] = useState(false);
  const [showMilestoneCard, setShowMilestoneCard] = useState(false);
  const [milestoneZoneName, setMilestoneZoneName] = useState("");
  const prevZoneRef = useRef<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // Worth Thermostat score (latest assessment)
      const { data: assessment } = await supabase
        .from("assessment_results")
        .select("percentage_score, thermostat_type")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })
        .limit(1);
      const worthScore = assessment?.[0]?.percentage_score ?? 0;
      setThermostatType(assessment?.[0]?.thermostat_type ?? undefined);

      // Lessons completed count
      const { count: lessonsCount } = await supabase
        .from("lesson_completions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .not("completed_at", "is", null);

      // 30-day progress completed
      const { count: thirtyDayCount } = await supabase
        .from("thirty_day_progress")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("marked_complete", true);

      // Card pulls as meditation proxy
      const { count: meditationCount } = await supabase
        .from("healing_tool_entries")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

      // Normalize each to 0-100
      const worthNorm = Math.min(worthScore, 100);
      const meditationNorm = Math.min(((meditationCount ?? 0) / 34) * 100, 100);
      const lessonsNorm = Math.min(((lessonsCount ?? 0) / 20) * 100, 100);
      const thirtyDayNorm = Math.min(((thirtyDayCount ?? 0) / 30) * 100, 100);

      const weighted = Math.round(
        worthNorm * 0.4 +
        meditationNorm * 0.2 +
        lessonsNorm * 0.2 +
        thirtyDayNorm * 0.2
      );

      setScore(weighted);

      // Detect zone change
      const newZone = getZoneIndex(weighted);
      const storedZone = localStorage.getItem(`reset-map-zone-${user.id}`);
      const prevZone = storedZone !== null ? parseInt(storedZone) : null;
      
      if (prevZone !== null && newZone > prevZone) {
        // User entered a new zone!
        setMilestoneZoneName(ZONES[newZone].name);
        setShowCelebration(true);
        setTimeout(() => {
          setShowCelebration(false);
          setShowMilestoneCard(true);
        }, 2600);
      }
      localStorage.setItem(`reset-map-zone-${user.id}`, String(newZone));

      // Get streak
      const { data: profile } = await supabase
        .from("profiles")
        .select("current_streak, total_points")
        .eq("user_id", user.id)
        .single();
      setStreak(profile?.current_streak ?? 0);
      setTodayPoints(profile?.total_points ?? 0);
    };

    fetchData();
  }, [user]);

  const zoneIndex = getZoneIndex(score);
  const currentZone = ZONES[zoneIndex];
  const nextZone = ZONES[zoneIndex + 1];
  const pointsToNext = nextZone ? nextZone.range[0] - score : 0;

  // Recommend next action
  const getRecommendedAction = () => {
    return { label: "Keep Going", route: "/home" };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="mb-6"
    >
      <Card className="p-5 bg-card/80 border-border/50 overflow-hidden">
        {/* Collapsed Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              {currentZone.icon}
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">Your Journey</p>
              <p className="text-sm font-semibold text-foreground">{currentZone.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{score}/100</p>
            </div>
            {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        </button>

        {/* Thin progress bar always visible */}
        <Progress value={score} className="h-1.5 mt-3 bg-muted [&>[data-state]]:bg-primary" />

        {/* Expanded View */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-6 space-y-6">
                {/* Journey Bar */}
                <div className="relative px-2">
                  {/* Connection line */}
                  <div className="absolute top-4 left-6 right-6 h-0.5 bg-muted-foreground/20 z-0" />
                  <div
                    className="absolute top-4 left-6 h-0.5 bg-primary z-[1] transition-all duration-700"
                    style={{ width: `${Math.max(0, (zoneIndex / 4) * 100)}%`, maxWidth: "calc(100% - 48px)" }}
                  />

                  <div className="flex items-start justify-between relative z-10">
                    {ZONES.map((zone, i) => {
                      const isCurrent = i === zoneIndex;
                      const isPast = i < zoneIndex;
                      return (
                        <div key={zone.name} className="flex flex-col items-center" style={{ width: "20%" }}>
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              isPast
                                ? "bg-primary text-primary-foreground shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
                                : isCurrent
                                ? "bg-primary/20 text-primary border-2 border-primary shadow-[0_0_8px_hsl(var(--primary)/0.3)] scale-110"
                                : "bg-muted text-muted-foreground border border-muted-foreground/30"
                            }`}
                          >
                            {zone.icon}
                          </div>
                          <span className={`text-[9px] mt-2 text-center leading-tight ${
                            isCurrent ? "text-primary font-semibold" : "text-muted-foreground"
                          }`}>
                            {zone.name.replace("The ", "")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Current Zone Info */}
                <div className="text-center space-y-2">
                  <h3 className="font-serif text-lg font-bold text-foreground">{currentZone.name}</h3>
                  <p className="text-sm text-muted-foreground italic">{currentZone.message}</p>
                  {nextZone && (
                    <p className="text-xs text-primary font-medium">
                      {pointsToNext} points to {nextZone.name}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="flex justify-around text-center">
                  <div>
                    <p className="text-lg font-bold text-foreground">{score}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Reset Score</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{streak}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Day Streak</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{todayPoints}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Points</p>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-xl"
                  onClick={() => navigate("/emotional-surgery")}
                >
                  Keep Going →
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}