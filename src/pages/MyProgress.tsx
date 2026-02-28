import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Flame, Trophy, Star, Target, Zap, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const badges = [
  { name: "First Pull", icon: "🃏", description: "Pulled your first oracle card", earned: true },
  { name: "Assessment Complete", icon: "📊", description: "Completed the Worth Thermostat", earned: true },
  { name: "Week Warrior", icon: "🔥", description: "7-day streak", earned: false },
  { name: "Slip Collector", icon: "📜", description: "Accepted 25 permission slips", earned: false },
  { name: "Deep Diver", icon: "🌊", description: "Completed 10 meditations", earned: false },
  { name: "Month Master", icon: "👑", description: "30-day streak", earned: false },
  { name: "All Decks Explorer", icon: "✨", description: "Pulled from all 3 decks", earned: false },
  { name: "Journaler", icon: "📝", description: "Wrote 10 journal entries", earned: false },
];

export default function MyProgress() {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const { data: pullCount } = useQuery({
    queryKey: ["pull-count", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("card_pulls")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id);
      return count || 0;
    },
    enabled: !!user,
  });

  const stats = [
    { label: "Current Streak", value: profile?.current_streak || 0, icon: Flame, suffix: " days" },
    { label: "Total Points", value: profile?.total_points || 0, icon: Star, suffix: " pts" },
    { label: "Card Pulls", value: pullCount || 0, icon: Zap, suffix: "" },
    { label: "Badges Earned", value: badges.filter(b => b.earned).length, icon: Trophy, suffix: `/${badges.length}` },
  ];

  return (
    <AuthenticatedLayout title="My Progress" subtitle="Track your transformation journey">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card text-center">
                <CardContent className="p-6">
                  <Icon className="w-8 h-8 text-accent mx-auto mb-3" />
                  <div className="font-serif text-3xl font-bold text-foreground mb-1">
                    {stat.value}{stat.suffix}
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Badges */}
      <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Badges</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge, index) => (
          <motion.div
            key={badge.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`glass-card text-center ${!badge.earned ? "opacity-40" : ""}`}>
              <CardContent className="p-5">
                <div className="text-4xl mb-3">{badge.icon}</div>
                <h3 className="font-serif font-semibold text-foreground text-sm mb-1">{badge.name}</h3>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </AuthenticatedLayout>
  );
}
