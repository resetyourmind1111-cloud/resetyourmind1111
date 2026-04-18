import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";
import { differenceInDays } from "date-fns";

export interface TrialStatus {
  isTrialActive: boolean;
  trialDay: number;
  trialExpired: boolean;
  isLoading: boolean;
  trialStartDate: Date | null;
  onboardingReason: string | null;
  trialTool1: string | null;
  trialTool2: string | null;
  welcomeBannerDismissed: boolean;
  founderBannerDismissedCount: number;
  trialReflectionSaved: boolean;
}

// Tool mapping based on onboarding reason
export const TRIAL_TOOL_MAP: Record<string, [string, string]> = {
  stuck: ["nervous-system-diagnostic", "limiting-belief-rewriter"],
  sabotage: ["limiting-belief-rewriter", "money-story-audit"],
  relationships: ["boundary-builder", "limiting-belief-rewriter"],
  levelup: ["limiting-belief-rewriter", "manifestation-tracker"],
};

// Friendly names for tools
export const TRIAL_TOOL_NAMES: Record<string, string> = {
  "nervous-system-diagnostic": "Nervous System Reset",
  "limiting-belief-rewriter": "Limiting Belief Rewriter",
  "money-story-audit": "Money Story Audit",
  "boundary-builder": "Boundary Builder",
  "manifestation-tracker": "Manifestation Tracker",
};

// Legacy exports for backward compat
export const TRIAL_ALLOWED_TOOLS = ["limiting-belief-rewriter", "nervous-system-diagnostic"];
export const TRIAL_MAX_THIRTY_DAY = 3;
export const TRIAL_MAX_MEDITATIONS = 3;

// The 7 daily permission slips for trial
export const TRIAL_PERMISSION_SLIPS = [
  "I give myself permission to begin — even before I feel ready.",
  "I give myself permission to feel what I've been avoiding.",
  "I give myself permission to take up space.",
  "I give myself permission to want more without guilt.",
  "I give myself permission to release what was never mine to carry.",
  "I give myself permission to be seen — exactly as I am.",
  "I give myself permission to choose myself — fully, finally, now.",
];

export function useTrialStatus(): TrialStatus {
  const { user } = useAuth();
  const { effectiveTier, isLoading: subLoading } = useSubscription();
  const [trialStartDate, setTrialStartDate] = useState<Date | null>(null);
  const [onboardingReason, setOnboardingReason] = useState<string | null>(null);
  const [trialTool1, setTrialTool1] = useState<string | null>(null);
  const [trialTool2, setTrialTool2] = useState<string | null>(null);
  const [welcomeBannerDismissed, setWelcomeBannerDismissed] = useState(true);
  const [founderBannerDismissedCount, setFounderBannerDismissedCount] = useState(0);
  const [trialReflectionSaved, setTrialReflectionSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTrialStartDate(null);
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("trial_start_date, onboarding_reason, trial_tool_1, trial_tool_2, welcome_banner_dismissed, founder_banner_dismissed_count, trial_reflection_saved")
        .eq("user_id", user.id)
        .single();

      if (data) {
        if ((data as any).trial_start_date) {
          setTrialStartDate(new Date((data as any).trial_start_date));
        } else {
          setTrialStartDate(new Date(user.created_at));
        }
        setOnboardingReason((data as any).onboarding_reason || null);
        setTrialTool1((data as any).trial_tool_1 || null);
        setTrialTool2((data as any).trial_tool_2 || null);
        setWelcomeBannerDismissed((data as any).welcome_banner_dismissed ?? true);
        setFounderBannerDismissedCount((data as any).founder_banner_dismissed_count ?? 0);
        setTrialReflectionSaved((data as any).trial_reflection_saved ?? false);
      } else {
        setTrialStartDate(new Date(user.created_at));
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, [user]);

  const hasPaidTier = effectiveTier !== "free";

  if (isLoading || subLoading) {
    return {
      isTrialActive: false, trialDay: 0, trialExpired: false, isLoading: true,
      trialStartDate: null, onboardingReason: null, trialTool1: null, trialTool2: null,
      welcomeBannerDismissed: true, founderBannerDismissedCount: 0, trialReflectionSaved: false,
    };
  }

  if (hasPaidTier) {
    return {
      isTrialActive: false, trialDay: 0, trialExpired: false, isLoading: false,
      trialStartDate, onboardingReason, trialTool1, trialTool2,
      welcomeBannerDismissed: true, founderBannerDismissedCount: 0, trialReflectionSaved: false,
    };
  }

  if (!trialStartDate || !user) {
    return {
      isTrialActive: false, trialDay: 0, trialExpired: false, isLoading: false,
      trialStartDate: null, onboardingReason: null, trialTool1: null, trialTool2: null,
      welcomeBannerDismissed: true, founderBannerDismissedCount: 0, trialReflectionSaved: false,
    };
  }

  const trialDay = differenceInDays(new Date(), trialStartDate);
  const isTrialActive = trialDay <= 6;
  const trialExpired = trialDay >= 7;

  return {
    isTrialActive, trialDay, trialExpired, isLoading: false,
    trialStartDate, onboardingReason, trialTool1, trialTool2,
    welcomeBannerDismissed, founderBannerDismissedCount, trialReflectionSaved,
  };
}

// All 21 healing tools are open during the 7-day trial.
// Trial users get full preview access — no per-tool gating.
const ALL_HEALING_TOOL_IDS = [
  "limiting-belief-rewriter",
  "emotional-trigger-tracker",
  "inner-child-healing",
  "shadow-work-library",
  "money-story-audit",
  "abundance-evidence-log",
  "income-frequency-tracker",
  "manifestation-tracker",
  "boundary-builder",
  "attachment-style-analyzer",
  "moon-phase-tracker",
  "angel-number-journal",
  "somatic-breathing",
  "body-map-journal",
  "affirmation-builder",
  "visibility-challenge",
  "ceo-self-assessment",
  "values-clarity-tool",
  "chakra-balancing",
  "energy-cord-cutting",
  "nervous-system-diagnostic",
];

export function getTrialAllowedTools(_reason: string | null, _tool1: string | null, _tool2: string | null): string[] {
  // Trial users get all 21 tools unlocked. The previous 2-tool restriction
  // created too many recommendation variations and confused new users.
  return ALL_HEALING_TOOL_IDS;
}
