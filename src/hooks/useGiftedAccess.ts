import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const GIFTED_TOTAL_DAYS = 30;

export type GiftedUrgency = "early" | "mid" | "late" | "final";

export interface GiftedAccessState {
  loading: boolean;
  isGifted: boolean;
  isExpired: boolean;
  daysRemaining: number;
  daysElapsed: number;
  urgency: GiftedUrgency;
  expiresAt: Date | null;
  toolsOpened: number;
  resetsCompleted: number;
  currentStreak: number;
  day15ModalShown: boolean;
  day21ModalShown: boolean;
  subscriptionTier: string | null;
  markModalShown: (key: "day15" | "day21", remindLater?: boolean) => Promise<void>;
  refresh: () => Promise<void>;
}

interface ProfileRow {
  user_source: string | null;
  access_expires_at: string | null;
  day15_modal_shown: boolean | null;
  day21_modal_shown: boolean | null;
  tools_opened_count: number | null;
  resets_completed_count: number | null;
  current_streak: number | null;
  subscription_tier: string | null;
}

function urgencyFromRemaining(daysRemaining: number): GiftedUrgency {
  if (daysRemaining >= 17) return "early";
  if (daysRemaining >= 10) return "mid";
  if (daysRemaining >= 2) return "late";
  return "final";
}

export function useGiftedAccess(): GiftedAccessState {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select(
        "user_source, access_expires_at, day15_modal_shown, day21_modal_shown, tools_opened_count, resets_completed_count, current_streak, subscription_tier"
      )
      .eq("user_id", user.id)
      .maybeSingle();
    setProfile((data as any) ?? null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const isGiftedSource = profile?.user_source === "gifted";
  const expiresAt = profile?.access_expires_at ? new Date(profile.access_expires_at) : null;
  const now = Date.now();
  const msRemaining = expiresAt ? expiresAt.getTime() - now : 0;
  const daysRemaining = expiresAt
    ? Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)))
    : 0;
  const isExpired = isGiftedSource && expiresAt !== null && msRemaining <= 0;
  const isGifted = isGiftedSource && !isExpired && (profile?.subscription_tier ?? "free") === "free";
  const daysElapsed = Math.min(GIFTED_TOTAL_DAYS, Math.max(0, GIFTED_TOTAL_DAYS - daysRemaining));

  const markModalShown = useCallback(
    async (key: "day15" | "day21", remindLater = false) => {
      if (!user) return;
      const updates: Record<string, any> = {};
      if (key === "day15") {
        updates.day15_modal_shown = true;
        if (remindLater) updates.day15_remind_later_at = new Date().toISOString();
      } else {
        updates.day21_modal_shown = true;
      }
      await supabase.from("profiles").update(updates).eq("user_id", user.id);
      await load();
    },
    [user, load]
  );

  return {
    loading,
    isGifted,
    isExpired,
    daysRemaining,
    daysElapsed,
    urgency: urgencyFromRemaining(daysRemaining),
    expiresAt,
    toolsOpened: profile?.tools_opened_count ?? 0,
    resetsCompleted: profile?.resets_completed_count ?? 0,
    currentStreak: profile?.current_streak ?? 0,
    day15ModalShown: !!profile?.day15_modal_shown,
    day21ModalShown: !!profile?.day21_modal_shown,
    subscriptionTier: profile?.subscription_tier ?? null,
    markModalShown,
    refresh: load,
  };
}

/**
 * Increments a gifted-progress counter on the user's profile.
 * No-ops if the user is not signed in or not a gifted user.
 */
export async function incrementGiftedCounter(
  userId: string | undefined,
  field: "tools_opened_count" | "resets_completed_count"
) {
  if (!userId) return;
  const { data } = await supabase
    .from("profiles")
    .select(`user_source, ${field}`)
    .eq("user_id", userId)
    .maybeSingle();
  if (!data || (data as any).user_source !== "gifted") return;
  const current = ((data as any)[field] as number) ?? 0;
  await supabase
    .from("profiles")
    .update({ [field]: current + 1 })
    .eq("user_id", userId);
}
