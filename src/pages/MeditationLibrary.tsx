import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { LockedContent } from "@/components/LockedContent";
import { TrialLockedContent } from "@/components/TrialLockedContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Headphones, Play, Clock, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useTrialStatus } from "@/hooks/useTrialStatus";

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

function MeditationCard({ meditation, index, onPlay }: { meditation: { id: string; title: string; duration: string; category: string }; index: number; onPlay?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="glass-card-hover group cursor-pointer" onClick={onPlay}>
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
  const navigate = useNavigate();
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
  const { isTrialActive, trialExpired } = useTrialStatus();
  const isTrialUser = isTrialActive || trialExpired;

  const [playedIds, setPlayedIds] = useState<Set<string>>(new Set());
  const [showTrialNudge, setShowTrialNudge] = useState(false);

  const handlePlay = (meditationId: string) => {
    if (!isTrialActive || tier !== "free") return;

    const updated = new Set(playedIds);
    updated.add(meditationId);
    setPlayedIds(updated);

    // Show nudge when all 3 trial meditations have been played
    if (updated.size >= 3) {
      setShowTrialNudge(true);
    }
  };

  return (
    <AuthenticatedLayout title="Meditation Library" subtitle="34 guided meditations for mind, soul, and body">
      {/* Trial banner */}
      {isTrialActive && tier === "free" && (
        <div className="mb-6 p-4 rounded-xl bg-[#3D1A6E]/20 border border-[#3D1A6E]/30">
          <p className="text-[#F9F6F0]/80 text-sm italic">
            3 meditations are yours to explore during your 7-day preview.
          </p>
          <p className="text-muted-foreground text-xs mt-1">
            Upgrade to unlock all 34 guided meditations.
          </p>
        </div>
      )}

      <Tabs defaultValue="mind" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="mind">🧠 Mind ({isTrialUser ? "3 preview" : "10"})</TabsTrigger>
          <TabsTrigger value="soul">💜 Soul (12)</TabsTrigger>
          <TabsTrigger value="body">🧘 Body (12)</TabsTrigger>
        </TabsList>

        <TabsContent value="mind" className="space-y-3">
          {mindMeditations.slice(0, isTrialUser ? 3 : 10).map((m, i) => (
            <MeditationCard
              key={m.id}
              meditation={m}
              index={i}
              onPlay={isTrialActive && tier === "free" ? () => handlePlay(m.id) : undefined}
            />
          ))}
          {isTrialUser && (
            <TrialLockedContent isLocked={true}>
              <div className="space-y-3">
                {mindMeditations.slice(3).map((m, i) => (
                  <MeditationCard key={m.id} meditation={m} index={i} />
                ))}
              </div>
            </TrialLockedContent>
          )}
        </TabsContent>

        <TabsContent value="soul">
          {isTrialUser ? (
            <TrialLockedContent isLocked={true}>
              <div className="space-y-3">
                {soulMeditations.map((m, i) => (
                  <MeditationCard key={m.id} meditation={m} index={i} />
                ))}
              </div>
            </TrialLockedContent>
          ) : (
            <LockedContent requiredTier="expand" currentTier={tier}>
              <div className="space-y-3">
                {soulMeditations.map((m, i) => (
                  <MeditationCard key={m.id} meditation={m} index={i} />
                ))}
              </div>
            </LockedContent>
          )}
        </TabsContent>

        <TabsContent value="body">
          {isTrialUser ? (
            <TrialLockedContent isLocked={true}>
              <div className="space-y-3">
                {bodyMeditations.map((m, i) => (
                  <MeditationCard key={m.id} meditation={m} index={i} />
                ))}
              </div>
            </TrialLockedContent>
          ) : (
            <LockedContent requiredTier="expand" currentTier={tier}>
              <div className="space-y-3">
                {bodyMeditations.map((m, i) => (
                  <MeditationCard key={m.id} meditation={m} index={i} />
                ))}
              </div>
            </LockedContent>
          )}
        </TabsContent>
      </Tabs>

      {/* Trial meditation nudge modal */}
      <AnimatePresence>
        {showTrialNudge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="max-w-md w-full rounded-2xl border border-[#C9A84C]/30 bg-card p-8 text-center shadow-2xl"
            >
              <p className="text-4xl mb-4">🧘</p>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">You've explored all 3.</h2>
              <p className="text-foreground/90 text-sm mb-1">Your nervous system is already learning to settle.</p>
              <p className="text-muted-foreground text-sm mb-6">
                31 more meditations — for mind, soul, and body — are ready when you are. This is where stillness becomes strength.
              </p>
              <Button
                onClick={() => { setShowTrialNudge(false); navigate("/upgrade"); }}
                className="w-full bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#06060e] font-semibold mb-3"
                size="lg"
              >
                <Sparkles className="w-5 h-5 mr-2" /> Unlock All 34 Meditations
              </Button>
              <button
                onClick={() => setShowTrialNudge(false)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                I'll keep exploring the preview
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthenticatedLayout>
  );
}
