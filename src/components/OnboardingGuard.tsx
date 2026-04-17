import { ReactNode, useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Routes that don't require onboarding completion
const PUBLIC_ROUTES = ["/", "/auth", "/assessment", "/onboarding", "/payment-success"];

interface OnboardingGuardProps {
  children: ReactNode;
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { user, isLoading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const [lastUserId, setLastUserId] = useState<string | null>(null);

  const checkOnboarding = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("onboarding_complete")
      .eq("user_id", userId)
      .single();
    const complete = !!(data as any)?.onboarding_complete;
    setOnboardingComplete(complete);
    setChecked(true);
  }, []);

  // Re-check when user changes or when navigating away from onboarding
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setChecked(true);
      setOnboardingComplete(null);
      setLastUserId(null);
      return;
    }

    // Always re-fetch when user changes or when navigating from /onboarding to another route
    const needsRefresh = user.id !== lastUserId || location.pathname !== "/onboarding";
    if (needsRefresh) {
      setLastUserId(user.id);
      checkOnboarding(user.id);
    }
  }, [user, authLoading, location.pathname, lastUserId, checkOnboarding]);

  useEffect(() => {
    if (!checked || authLoading) return;
    if (!user) return;

    const isPublic = PUBLIC_ROUTES.some(
      (r) => location.pathname === r || location.pathname.startsWith(r + "/")
    );

    if (onboardingComplete === false && !isPublic) {
      navigate("/onboarding", { replace: true });
    }
  }, [checked, authLoading, user, onboardingComplete, location.pathname, navigate]);

  if (authLoading || (!checked && user)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
