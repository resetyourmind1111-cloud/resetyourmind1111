import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

/**
 * Applies streak grace-day logic on app open.
 *
 * Rules:
 *  - 0–1 day gap → streak continues, last_active_date updated
 *  - 2 day gap + no grace used this calendar month → grace activates,
 *    streak preserved, banner shown
 *  - 2 day gap + grace already used this month → streak resets to 0
 *  - 3+ day gap → streak resets to 0
 *
 * Returns the current streak plus flags for UI banners.
 */
export function useStreakActivity() {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);
  const [graceActivated, setGraceActivated] = useState(false);
  const [streakReset, setStreakReset] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;

    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select(
          "current_streak, last_active_date, streak_grace_used_date, longest_streak"
        )
        .eq("user_id", user.id)
        .single();

      if (cancelled || !data) {
        setLoading(false);
        return;
      }

      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      const last = (data as any).last_active_date as string | null;
      const graceUsed = (data as any).streak_grace_used_date as string | null;
      const currentStreak = ((data as any).current_streak as number) || 0;
      const longest = ((data as any).longest_streak as number) || 0;

      // First-ever visit → seed last_active_date
      if (!last) {
        const newStreak = Math.max(currentStreak, 1);
        await supabase
          .from("profiles")
          .update({
            last_active_date: todayStr,
            current_streak: newStreak,
            longest_streak: Math.max(longest, newStreak),
          } as any)
          .eq("user_id", user.id);
        if (!cancelled) {
          setStreak(newStreak);
          setLoading(false);
        }
        return;
      }

      const lastDate = new Date(last + "T00:00:00");
      const diffDays = Math.floor(
        (new Date(todayStr + "T00:00:00").getTime() - lastDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      let nextStreak = currentStreak;
      let didGrace = false;
      let didReset = false;

      if (diffDays <= 0) {
        // Same day — no streak change
      } else if (diffDays === 1) {
        nextStreak = currentStreak + 1;
      } else if (diffDays === 2) {
        const graceThisMonth =
          graceUsed &&
          new Date(graceUsed).getUTCFullYear() === today.getUTCFullYear() &&
          new Date(graceUsed).getUTCMonth() === today.getUTCMonth();
        if (!graceThisMonth) {
          // Activate grace day → streak preserved
          didGrace = true;
        } else {
          nextStreak = 0;
          didReset = true;
        }
      } else {
        nextStreak = 0;
        didReset = true;
      }

      const updates: Record<string, any> = {
        last_active_date: todayStr,
        current_streak: nextStreak,
        longest_streak: Math.max(longest, nextStreak),
      };
      if (didGrace) updates.streak_grace_used_date = todayStr;

      await supabase
        .from("profiles")
        .update(updates as any)
        .eq("user_id", user.id);

      if (!cancelled) {
        setStreak(nextStreak);
        setGraceActivated(didGrace);
        setStreakReset(didReset);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const dismissGrace = () => setGraceActivated(false);
  const dismissReset = () => setStreakReset(false);

  return { streak, graceActivated, streakReset, dismissGrace, dismissReset, loading };
}
