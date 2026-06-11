// Lightweight first-party analytics. Writes to public.analytics_events.
// Fire-and-forget — never blocks UI, never throws.
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "rym_analytics_session_id";

function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = (crypto as any)?.randomUUID?.() ?? `s_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return `s_${Date.now()}`;
  }
}

export type AnalyticsEvent =
  | "landing_view"
  | "cta_click_start_reset"
  | "cta_click_assessment"
  | "auth_view"
  | "signup_success"
  | "onboarding_complete"
  | "home_first_action"
  | "card_pull"
  | "permission_slip_accepted"
  | "assessment_started"
  | "assessment_completed";

export function track(event: AnalyticsEvent | string, props: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  try {
    const path = window.location?.pathname ?? null;
    const session_id = getSessionId();
    // Best-effort capture of current user id without blocking
    supabase.auth.getUser().then(({ data }) => {
      const user_id = data?.user?.id ?? null;
      supabase
        .from("analytics_events")
        .insert({ event, props: props as any, path, session_id, user_id })
        .then(() => {}, () => {});
    }).catch(() => {});
  } catch {
    // swallow — analytics must never break the app
  }
}
