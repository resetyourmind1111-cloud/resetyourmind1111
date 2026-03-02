import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wellnessTips, wellnessTipCategories, type WellnessTipCategory, type WellnessTip } from "@/data/wellnessTipsData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Droplets, Brain, Footprints, Apple, Moon, Heart, RefreshCw, Sparkles, Check } from "lucide-react";

const categoryIcons: Record<WellnessTipCategory, React.ReactNode> = {
  Hydration: <Droplets className="w-4 h-4" />,
  Mindset: <Brain className="w-4 h-4" />,
  Movement: <Footprints className="w-4 h-4" />,
  Nutrition: <Apple className="w-4 h-4" />,
  Rest: <Moon className="w-4 h-4" />,
  "Self-Care": <Heart className="w-4 h-4" />,
};

const STORAGE_KEY = "wellness-tips-history";

interface TipHistory {
  shownIds: number[];
  lastDate: string;
  todayTipId: number;
  completedIds: number[];
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadHistory(): TipHistory {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { shownIds: [], lastDate: "", todayTipId: -1, completedIds: [] };
}

function saveHistory(h: TipHistory) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(h));
}

function pickTodayTip(history: TipHistory): { tip: WellnessTip; updatedHistory: TipHistory } {
  const today = getToday();

  // Already picked for today
  if (history.lastDate === today && history.todayTipId >= 0) {
    const existing = wellnessTips.find((t) => t.id === history.todayTipId);
    if (existing) return { tip: existing, updatedHistory: history };
  }

  // Filter out recently shown (up to 60-day window)
  let recentIds = history.shownIds.slice(-59); // last 59 shown, so we pick the 60th unique
  let available = wellnessTips.filter((t) => !recentIds.includes(t.id));

  // If all exhausted, reset
  if (available.length === 0) {
    recentIds = [];
    available = [...wellnessTips];
  }

  // Deterministic daily pick using date seed
  const seed = today.split("-").reduce((a, b) => a + parseInt(b, 10), 0);
  const tip = available[seed % available.length];

  const updatedHistory: TipHistory = {
    shownIds: [...recentIds, tip.id],
    lastDate: today,
    todayTipId: tip.id,
    completedIds: history.completedIds,
  };
  saveHistory(updatedHistory);
  return { tip, updatedHistory };
}

export function DailyWellnessTips() {
  const [history, setHistory] = useState<TipHistory>(() => loadHistory());
  const [filter, setFilter] = useState<WellnessTipCategory | "All">("All");

  const { tip: todayTip } = useMemo(() => pickTodayTip(history), [history]);

  const isCompleted = history.completedIds.includes(todayTip.id);

  const markComplete = useCallback(() => {
    setHistory((prev) => {
      const updated = {
        ...prev,
        completedIds: [...new Set([...prev.completedIds, todayTip.id])],
      };
      saveHistory(updated);
      return updated;
    });
  }, [todayTip.id]);

  const filteredTips = useMemo(
    () => (filter === "All" ? wellnessTips : wellnessTips.filter((t) => t.category === filter)),
    [filter]
  );

  const completedCount = history.completedIds.length;

  return (
    <div className="space-y-8">
      {/* Today's Tip Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Today's Wellness Tip</span>
              <Badge variant="secondary" className="ml-auto text-xs">
                {categoryIcons[todayTip.category]} <span className="ml-1">{todayTip.category}</span>
              </Badge>
            </div>
            <p className="font-serif text-xl md:text-2xl text-foreground leading-relaxed mb-6">
              "{todayTip.text}"
            </p>
            <div className="flex items-center gap-3">
              {isCompleted ? (
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                  <Check className="w-3 h-3 mr-1" /> Completed today
                </Badge>
              ) : (
                <Button variant="default" size="sm" onClick={markComplete}>
                  <Check className="w-4 h-4 mr-1" /> Mark as Done
                </Button>
              )}
              <span className="text-xs text-muted-foreground ml-auto">
                {completedCount} tip{completedCount !== 1 ? "s" : ""} completed
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === "All" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("All")}
        >
          All
        </Button>
        {wellnessTipCategories.map((cat) => (
          <Button
            key={cat}
            variant={filter === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(cat)}
            className="gap-1"
          >
            {categoryIcons[cat]} {cat}
          </Button>
        ))}
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredTips.map((tip, i) => {
            const done = history.completedIds.includes(tip.id);
            return (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.02 }}
              >
                <Card className={`h-full transition-colors ${done ? "border-green-500/20 bg-green-500/5" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-muted-foreground">{categoryIcons[tip.category]}</span>
                      <span className="text-xs text-muted-foreground">{tip.category}</span>
                      {done && <Check className="w-3 h-3 text-green-500 ml-auto" />}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{tip.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
