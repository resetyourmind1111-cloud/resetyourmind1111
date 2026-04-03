import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";
import { differenceInDays } from "date-fns";

export interface TrialStatus {
  isTrialActive: boolean;
  trialDay: number; // 0-based, so day 0 is signup day
  trialExpired: boolean;
  isLoading: boolean;
  trialStartDate: Date | null;
}

// Content allowed during trial
export const TRIAL_ALLOWED_TOOLS = ["limiting-belief-rewriter", "nervous-system-diagnostic"];
export const TRIAL_MAX_THIRTY_DAY = 3; // Days 1-3 only
export const TRIAL_MAX_MEDITATIONS = 3;

export function useTrialStatus(): TrialStatus {
  const { user } = useAuth();
  const { effectiveTier, isLoading: subLoading } = useSubscription();
  const [trialStartDate, setTrialStartDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTrialStartDate(null);
      setIsLoading(false);
      return;
    }

    const fetch = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("trial_start_date")
        .eq("user_id", user.id)
        .single();

      if (data?.trial_start_date) {
        setTrialStartDate(new Date(data.trial_start_date));
      } else {
        // Fallback: use account created_at
        setTrialStartDate(new Date(user.created_at));
      }
      setIsLoading(false);
    };

    fetch();
  }, [user]);

  const hasPaidTier = effectiveTier !== "free";

  if (isLoading || subLoading) {
    return { isTrialActive: false, trialDay: 0, trialExpired: false, isLoading: true, trialStartDate: null };
  }

  // If user has a paid subscription, trial doesn't matter
  if (hasPaidTier) {
    return { isTrialActive: false, trialDay: 0, trialExpired: false, isLoading: false, trialStartDate };
  }

  if (!trialStartDate || !user) {
    return { isTrialActive: false, trialDay: 0, trialExpired: false, isLoading: false, trialStartDate: null };
  }

  const trialDay = differenceInDays(new Date(), trialStartDate);
  const isTrialActive = trialDay <= 7;
  const trialExpired = trialDay > 7;

  return { isTrialActive, trialDay, trialExpired, isLoading: false, trialStartDate };
}
