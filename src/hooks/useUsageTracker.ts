import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const DAILY_LIMIT = 50;

export function useUsageTracker() {
  const { user } = useAuth();
  const [sessionCount, setSessionCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const isLimitReached = sessionCount >= DAILY_LIMIT;

  const fetchUsage = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    try {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("user_usage")
        .select("session_count")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();
      setSessionCount(data?.session_count ?? 0);
    } catch (err) {
      console.error("Failed to fetch usage:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchUsage(); }, [fetchUsage]);

  const incrementUsage = useCallback(async (): Promise<boolean> => {
    if (!user || isLimitReached) return false;
    try {
      const { data, error } = await supabase.rpc("increment_user_usage");
      if (error) throw error;
      const newCount = data as number;
      setSessionCount(newCount);
      return newCount <= DAILY_LIMIT;
    } catch (err) {
      console.error("Failed to increment usage:", err);
      return false;
    }
  }, [user, isLimitReached]);

  return { sessionCount, dailyLimit: DAILY_LIMIT, isLimitReached, incrementUsage, loading };
}
