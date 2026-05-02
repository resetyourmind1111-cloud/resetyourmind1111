import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Reads profiles.user_source for the current user.
 * Possible values: "live-reset" | "organic" | null
 *
 * "live-reset" = user arrived via /register?source=live-reset
 *                (i.e. they purchased a $33 live Zoom reset)
 * "organic"    = direct signup, no source tag
 */
export function useUserSource() {
  const { user } = useAuth();
  const [userSource, setUserSource] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserSource(null);
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    supabase
      .from("profiles")
      .select("user_source")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setUserSource((data as any)?.user_source ?? "organic");
        setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  return { userSource, isLiveReset: userSource === "live-reset", isLoading };
}
