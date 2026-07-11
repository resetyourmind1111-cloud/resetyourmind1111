import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Subscription {
  tier: string;
  status: string;
  plan_name: string | null;
  founding_member: boolean;
  cancel_at_period_end: boolean;
  current_period_end: string | null;
  billing_interval: string | null;
}

const TIER_ORDER = ["free", "reset", "expand", "embody", "founding_full_access"];

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [effectiveTier, setEffectiveTier] = useState("free");

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setEffectiveTier("free");
      setIsLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      const [{ data, error }, { data: profileData }] = await Promise.all([
        supabase
          .from("subscriptions")
          .select("tier, status, plan_name, founding_member, cancel_at_period_end, current_period_end, billing_interval")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("profiles")
          .select("subscription_tier, code_access_expires_at, access_source")
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);

      let baseTier = "free";
      if (data && !error && data.status === "active") {
        setSubscription(data as Subscription);
        baseTier = data.tier.toLowerCase();
      } else if (data && data.status === "past_due") {
        setSubscription(data as Subscription);
        baseTier = data.tier.toLowerCase();
      } else if (data && data.status === "canceled" && data.cancel_at_period_end && data.current_period_end) {
        const endDate = new Date(data.current_period_end);
        if (endDate > new Date()) {
          setSubscription(data as Subscription);
          baseTier = data.tier.toLowerCase();
        } else {
          setSubscription(data as Subscription);
          baseTier = "free";
        }
      } else {
        setSubscription(null);
      }

      // Code-redemption override: if the profile has active code access, honor it
      const codeExpires = (profileData as any)?.code_access_expires_at as string | null | undefined;
      const codeTier = (profileData as any)?.subscription_tier as string | null | undefined;
      const accessSource = (profileData as any)?.access_source as string | null | undefined;
      if (
        accessSource === "code_redemption" &&
        codeExpires &&
        new Date(codeExpires) > new Date() &&
        codeTier
      ) {
        const codeIdx = TIER_ORDER.indexOf(codeTier.toLowerCase());
        const baseIdx = TIER_ORDER.indexOf(baseTier);
        if (codeIdx > baseIdx) baseTier = codeTier.toLowerCase();
      }

      setEffectiveTier(baseTier);
      setIsLoading(false);
    };

    fetchSubscription();
  }, [user]);

  const hasAccess = (requiredTier: string): boolean => {
    const currentIdx = TIER_ORDER.indexOf(effectiveTier);
    const requiredIdx = TIER_ORDER.indexOf(requiredTier.toLowerCase());
    return currentIdx >= requiredIdx;
  };

  return { subscription, isLoading, effectiveTier, hasAccess };
}
