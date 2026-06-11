// Single source of truth for "is this user activated?"
// Activated = they have taken at least one meaningful action in the app.
import { supabase } from "@/integrations/supabase/client";

const ACTIVATION_TABLES = [
  "daily_shifts",
  "lesson_completions",
  "card_pulls",
  "permission_slips_accepted",
  "assessment_results",
] as const;

export async function isActivated(userId: string): Promise<boolean> {
  if (!userId) return false;
  // Run all checks in parallel; any non-zero count means activated.
  const checks = await Promise.all(
    ACTIVATION_TABLES.map((table) =>
      supabase
        .from(table as any)
        .select("user_id", { count: "exact", head: true })
        .eq("user_id", userId)
        .then(({ count }) => (count ?? 0) > 0, () => false),
    ),
  );
  return checks.some(Boolean);
}
