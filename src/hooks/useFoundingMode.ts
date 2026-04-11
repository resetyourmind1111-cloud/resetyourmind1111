import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

let cachedValue: boolean | null = null;

export function useFoundingMode() {
  const [foundingMode, setFoundingMode] = useState<boolean>(cachedValue ?? true);
  const [spotsRemaining, setSpotsRemaining] = useState<number>(111);
  const [loading, setLoading] = useState(cachedValue === null);

  useEffect(() => {
    const fetch = async () => {
      const [settingRes, spotsRes] = await Promise.all([
        supabase.from("app_settings").select("setting_value").eq("setting_key", "founding_mode").single(),
        supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("founding_member", true),
      ]);

      const mode = settingRes.data?.setting_value === "true";
      const taken = spotsRes.count ?? 0;
      const remaining = Math.max(0, 111 - taken);

      cachedValue = mode;
      setFoundingMode(remaining > 0 ? mode : false);
      setSpotsRemaining(remaining);
      setLoading(false);
    };
    fetch();
  }, []);

  return { foundingMode, spotsRemaining, loading };
}
