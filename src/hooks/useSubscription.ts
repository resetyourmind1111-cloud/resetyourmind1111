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
      const { data, error } = await supabase
        .from("subscriptions")
        .select("tier, status, plan_name, founding_member, cancel_at_period_end, current_period_end, billing_interval")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data && !error && data.status === "active") {
        setSubscription(data as Subscription);
        setEffectiveTier(data.tier.toLowerCase());
      } else if (data && data.status === "past_due") {
        // Still grant access during past_due (Stripe retry period)
        setSubscription(data as Subscription);
        setEffectiveTier(data.tier.toLowerCase());
      } else if (data && data.status === "canceled" && data.cancel_at_period_end && data.current_period_end) {
        // Check if still within paid period
        const endDate = new Date(data.current_period_end);
        if (endDate > new Date()) {
          setSubscription(data as Subscription);
          setEffectiveTier(data.tier.toLowerCase());
        } else {
          setSubscription(data as Subscription);
          setEffectiveTier("free");
        }
      } else {
        setSubscription(null);
        setEffectiveTier("free");
      }
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
