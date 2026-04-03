import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { allJourneyDays, getWeekForDay } from "@/data/journeyData";

export function JourneyCheckinCard() {
  const { user } = useAuth();
  const [currentDay, setCurrentDay] = useState<number | null>(null);
  const [todayComplete, setTodayComplete] = useState(false);
  const [tier, setTier] = useState("free");

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("subscription_tier").eq("user_id", user.id).single()
      .then(({ data }) => { if (data) setTier((data as any).subscription_tier || "free"); });
    supabase.from("thirty_day_progress").select("day_number, marked_complete").eq("user_id", user.id)
      .then(({ data }) => {
        if (!data) return;
        const completed = new Set(data.filter((r: any) => r.marked_complete).map((r: any) => r.day_number));
        for (let i = 1; i <= 30; i++) {
          if (!completed.has(i)) { setCurrentDay(i); return; }
        }
        setCurrentDay(30);
        setTodayComplete(true);
      });
  }, [user]);

  if (!["embody", "founding_full_access"].includes(tier) || currentDay === null) return null;

  const dayData = allJourneyDays.find(d => d.day === currentDay);
  const week = getWeekForDay(currentDay);
  if (!dayData) return null;

  return (
    <Card className="p-4 border-l-[3px] bg-card/80" style={{ borderLeftColor: week.accentHex }}>
      {todayComplete ? (
        <div className="flex items-center gap-3">
          <Check className="w-5 h-5 text-[#C9A84C]" />
          <p className="text-sm text-muted-foreground">Day {currentDay} complete. See you tomorrow.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4" style={{ color: week.accentHex }} />
            <p className="text-xs font-medium text-muted-foreground">Day {currentDay} of 30 — {week.theme}</p>
          </div>
          <p className="text-sm font-semibold text-foreground mb-3">{dayData.title}</p>
          <Link to="/30-day-experience">
            <Button size="sm" className="bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#06060e] font-semibold text-xs">
              Open Today →
            </Button>
          </Link>
        </>
      )}
    </Card>
  );
}
