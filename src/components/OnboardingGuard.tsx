import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Routes that don't require onboarding completion
const PUBLIC_ROUTES = ["/", "/auth", "/assessment", "/onboarding"];

interface OnboardingGuardProps {
  children: ReactNode;
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { user, isLoading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setChecked(true);
      setOnboardingComplete(null);
      return;
    }

    supabase
      .from("profiles")
      .select("onboarding_complete")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        const complete = !!(data as any)?.onboarding_complete;
        setOnboardingComplete(complete);
        setChecked(true);
      });
  }, [user, authLoading]);

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
