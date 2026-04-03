import { Bell, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";

export function NotificationSettings() {
  const { preferences, updatePreferences } = useNotificationPreferences();

  const formatTimeForInput = (time: string) => time.slice(0, 5); // "08:00:00" → "08:00"
  const formatTimeForDb = (time: string) => time + ":00"; // "08:00" → "08:00:00"

  const toggleItems = [
    {
      key: "daily_affirmation_enabled" as const,
      label: "Daily Affirmation",
      description: "Morning message to anchor your reset",
      timeKey: "daily_affirmation_time" as const,
    },
    {
      key: "checkin_reminder_enabled" as const,
      label: "Daily Check-In Reminder",
      description: "Evening nudge if you haven't checked in",
      timeKey: "checkin_reminder_time" as const,
    },
    {
      key: "quiet_phase_alerts_enabled" as const,
      label: "Quiet Phase™ Alerts",
      description: "Smart triggers after deep work sessions",
    },
    {
      key: "streak_protection_enabled" as const,
      label: "Streak Protection",
      description: "Reminder before your streak resets",
    },
    {
      key: "milestone_celebrations_enabled" as const,
      label: "Milestone Celebrations",
      description: "Celebrate when you complete a module",
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <Card className="glass-card">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-5 h-5 text-accent" />
            <h2 className="font-serif text-xl font-bold text-foreground">Notifications</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            These preferences will be used when push notifications are enabled.
          </p>

          {toggleItems.map((item, index) => (
            <div key={item.key}>
              {index > 0 && <Separator className="my-2" />}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1 mr-4">
                  <span className="text-foreground text-sm font-medium">{item.label}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                </div>
                <Switch
                  checked={preferences[item.key]}
                  onCheckedChange={(checked) => updatePreferences({ [item.key]: checked })}
                />
              </div>

              {item.timeKey && preferences[item.key] && (
                <div className="flex items-center gap-2 ml-1 mt-1 mb-2">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <Label className="text-xs text-muted-foreground">Time:</Label>
                  <Input
                    type="time"
                    value={formatTimeForInput(preferences[item.timeKey])}
                    onChange={(e) =>
                      updatePreferences({ [item.timeKey!]: formatTimeForDb(e.target.value) })
                    }
                    className="w-28 h-8 text-xs"
                  />
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
