import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

/**
 * Maps a user's `primary_wound` (set during PersonalizedOnboarding)
 * to the matching Emotional Surgery track. Trial users get Phase 1
 * (Foundation) for ALL tracks, plus Phases 2–5 for THEIR track only.
 *
 * Wound → Track:
 *   wealth   → Wealth
 *   love     → Love
 *   identity → Identity
 *   health   → Visibility (closest match — body/visibility work)
 */
const WOUND_TO_TRACK: Record<string, string> = {
  wealth: "Wealth",
  love: "Love",
  identity: "Identity",
  health: "Visibility",
};

export function useRecommendedTrack() {
  const { user } = useAuth();
  const [track, setTrack] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    supabase
      .from("profiles")
      .select("primary_wound")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        const wound = (data as any)?.primary_wound as string | null;
        setTrack(wound ? WOUND_TO_TRACK[wound] ?? null : null);
        setLoading(false);
      });
  }, [user]);

  return { recommendedTrack: track, loading };
}

/**
 * Trial gating rule for Emotional Surgery:
 *  - Phase 1 (Recognition / Foundation) is unlocked for trial users on ALL tracks.
 *  - Phases 2–5 are unlocked only on the user's recommended track.
 *  - Paid users always see everything they have tier access to.
 */
export function isTrialPhaseUnlocked(
  phaseNumber: number,
  trackName: string | null,
  recommendedTrack: string | null,
): boolean {
  if (phaseNumber === 1) return true;
  if (!recommendedTrack) return false;
  return trackName === recommendedTrack;
}