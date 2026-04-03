import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface NotificationPreferences {
  daily_affirmation_enabled: boolean;
  daily_affirmation_time: string;
  checkin_reminder_enabled: boolean;
  checkin_reminder_time: string;
  quiet_phase_alerts_enabled: boolean;
  streak_protection_enabled: boolean;
  milestone_celebrations_enabled: boolean;
}

const defaults: NotificationPreferences = {
  daily_affirmation_enabled: true,
  daily_affirmation_time: "08:00:00",
  checkin_reminder_enabled: true,
  checkin_reminder_time: "18:00:00",
  quiet_phase_alerts_enabled: true,
  streak_protection_enabled: true,
  milestone_celebrations_enabled: true,
};

export function useNotificationPreferences() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ["notification_preferences", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return defaults;

      return {
        daily_affirmation_enabled: data.daily_affirmation_enabled,
        daily_affirmation_time: data.daily_affirmation_time,
        checkin_reminder_enabled: data.checkin_reminder_enabled,
        checkin_reminder_time: data.checkin_reminder_time,
        quiet_phase_alerts_enabled: data.quiet_phase_alerts_enabled,
        streak_protection_enabled: data.streak_protection_enabled,
        milestone_celebrations_enabled: data.milestone_celebrations_enabled,
      } as NotificationPreferences;
    },
    enabled: !!user,
  });

  const mutation = useMutation({
    mutationFn: async (updates: Partial<NotificationPreferences>) => {
      const { data: existing } = await supabase
        .from("notification_preferences")
        .select("id")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("notification_preferences")
          .update(updates)
          .eq("user_id", user!.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("notification_preferences")
          .insert({ user_id: user!.id, ...defaults, ...updates });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification_preferences", user?.id] });
      toast.success("Notification preferences updated");
    },
    onError: () => {
      toast.error("Failed to update preferences");
    },
  });

  return {
    preferences: preferences || defaults,
    isLoading,
    updatePreferences: mutation.mutate,
  };
}
