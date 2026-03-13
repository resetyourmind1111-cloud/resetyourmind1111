import { useState } from "react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { LockedContent } from "@/components/LockedContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Headphones, Play, Clock, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const mindMeditations = Array.from({ length: 10 }, (_, i) => ({
  id: `mind-${i + 1}`,
  title: `Mind Meditation ${i + 1}`,
  duration: `${8 + Math.floor(Math.random() * 12)} min`,
  category: "Mind" as const,
}));

const soulMeditations = Array.from({ length: 12 }, (_, i) => ({
  id: `soul-${i + 1}`,
  title: `Soul Meditation ${i + 1}`,
  duration: `${10 + Math.floor(Math.random() * 15)} min`,
  category: "Soul" as const,
}));

const bodyMeditations = Array.from({ length: 12 }, (_, i) => ({
  id: `body-${i + 1}`,
  title: `Body Meditation ${i + 1}`,
  duration: `${8 + Math.floor(Math.random() * 12)} min`,
  category: "Body" as const,
}));

function MeditationCard({ meditation, index }: { meditation: { id: string; title: string; duration: string; category: string }; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="glass-card-hover group cursor-pointer">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
            <Headphones className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-serif font-semibold text-foreground truncate">{meditation.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>{meditation.duration}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-5 h-5 text-accent ml-0.5" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function MeditationLibrary() {
  const { user } = useAuth();
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("user_id", user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const tier = profile?.subscription_tier || "free";

  return (
    <AuthenticatedLayout title="Meditation Library" subtitle="34 guided meditations for mind, soul, and body">
      <Tabs defaultValue="mind" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="mind">🧠 Mind (10)</TabsTrigger>
          <TabsTrigger value="soul">💜 Soul (12)</TabsTrigger>
          <TabsTrigger value="body">🧘 Body (12)</TabsTrigger>
        </TabsList>

        <TabsContent value="mind" className="space-y-3">
          {mindMeditations.map((m, i) => (
            <MeditationCard key={m.id} meditation={m} index={i} />
          ))}
        </TabsContent>

        <TabsContent value="soul">
          <LockedContent requiredTier="expand" currentTier={tier}>
            <div className="space-y-3">
              {soulMeditations.map((m, i) => (
                <MeditationCard key={m.id} meditation={m} index={i} />
              ))}
            </div>
          </LockedContent>
        </TabsContent>

        <TabsContent value="body">
          <LockedContent requiredTier="tier2" currentTier={tier}>
            <div className="space-y-3">
              {bodyMeditations.map((m, i) => (
                <MeditationCard key={m.id} meditation={m} index={i} />
              ))}
            </div>
          </LockedContent>
        </TabsContent>
      </Tabs>
    </AuthenticatedLayout>
  );
}
