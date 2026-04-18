import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Headphones, Play, Clock, Lock, Bell, Sparkles, Check } from "lucide-react";

import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrialBackButton } from "@/components/TrialBackButton";
import { MeditationPlayer } from "@/components/meditations/MeditationPlayer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { toast } from "@/hooks/use-toast";

interface Meditation {
  id: string;
  title: string;
  library: string;
  audio_url: string | null;
  tier_required: string;
  sort_order: number;
}

const TIER_RANK: Record<string, number> = {
  free: 0,
  trial: 0,
  reset: 1,
  expand: 2,
  embody: 3,
  founding_full_access: 3,
};

const SOUL_COMING_SOON = [
  "Abundance Activation", "Financial Freedom Flow", "Love Magnetism",
  "Career Alignment and Success", "Radiant Health and Vitality", "Prosperity Consciousness",
  "Opportunity Activation", "Magnetic Presence", "Overflow Abundance",
  "Gratitude Amplification", "Quantum Leap Abundance", "Generational Wealth Activation",
];
const SOUL_DURATIONS = ["20 min","20 min","20 min","20 min","15 min","20 min","15 min","18 min","20 min","15 min","22 min","22 min"];

const BODY_COMING_SOON = [
  "Full Body Scan and Healing", "Chakra Balancing and Alignment", "Reiki Energy Healing",
  "Cutting Energy Cords", "Pain Relief and Inflammation", "Cellular Regeneration and Anti-Aging",
  "Immune System Activation", "Digestive Healing and Gut Health", "Heart Healing and Circulation",
  "Nervous System Reset", "Ancestral Body Healing", "Womb and Sacral Healing",
];
const BODY_DURATIONS = ["20 min","25 min","20 min","15 min","15 min","20 min","15 min","15 min","15 min","20 min","25 min","20 min"];

function ComingSoonCard({ title, duration, library, index, notified, onNotify }: {
  title: string; duration: string; library: string; index: number; notified: boolean; onNotify: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Card className="relative overflow-hidden bg-[#06060e] border border-[#3D1A6E]/40">
        <Badge className="absolute top-3 right-3 bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/30 text-[10px] tracking-widest uppercase font-semibold">
          Coming Soon
        </Badge>
        <CardContent className="p-5 pr-28">
          <h3 className="font-serif text-lg text-[#C9A84C] mb-1">{title}</h3>
          <div className="flex items-center gap-2 text-xs text-[#F9F6F0]/50 mb-3">
            <Clock className="w-3.5 h-3.5" /> <span>{duration}</span>
          </div>
          <p className="text-sm text-[#F9F6F0]/70 mb-4 italic">
            Dropping soon — you'll be notified when this is ready.
          </p>
          <Button
            size="sm"
            variant="outline"
            disabled={notified}
            onClick={onNotify}
            className="border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C]/10 hover:text-[#C9A84C]"
          >
            {notified ? (<><Check className="w-3.5 h-3.5 mr-1.5" /> You'll be notified</>) : (<><Bell className="w-3.5 h-3.5 mr-1.5" /> Notify Me</>)}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function MindCard({ meditation, index, locked, onPlay }: {
  meditation: Meditation; index: number; locked: boolean; onPlay: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Card
        onClick={locked ? undefined : onPlay}
        className={`group transition-all ${locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:border-[#C9A84C]/40"} bg-[#06060e] border border-[#C9A84C]/15`}
      >
        <CardContent className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center shrink-0">
            {locked ? <Lock className="w-5 h-5 text-[#C9A84C]/60" /> : <Headphones className="w-5 h-5 text-[#C9A84C]" />}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-serif font-semibold text-[#F9F6F0] truncate">{meditation.title}</h3>
            <div className="flex items-center gap-2 text-xs text-[#F9F6F0]/50 mt-0.5">
              <Clock className="w-3 h-3" />
              <span>Guided meditation</span>
            </div>
          </div>
          {!locked && (
            <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
              <Play className="w-5 h-5 text-[#C9A84C] ml-0.5" />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TierLockOverlay({ tierLabel }: { tierLabel: string }) {
  return (
    <div className="rounded-2xl border border-[#C9A84C]/30 bg-[#06060e]/80 p-10 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
        <Lock className="w-8 h-8 text-[#C9A84C]" />
      </div>
      <h3 className="font-serif text-xl text-[#F9F6F0] mb-2">Available with {tierLabel} membership</h3>
      <p className="text-sm text-[#F9F6F0]/60 max-w-sm mx-auto mb-6">
        These meditations open when you upgrade your membership.
      </p>
      <Link to="/upgrade">
        <Button variant="gold" size="lg">
          <Sparkles className="w-4 h-4 mr-2" /> See membership options
        </Button>
      </Link>
    </div>
  );
}

export default function MeditationLibrary() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { effectiveTier } = useSubscription();
  const { isTrialActive, trialExpired } = useTrialStatus();
  const isTrialUser = isTrialActive || trialExpired;
  const tierRank = TIER_RANK[effectiveTier] ?? 0;

  const [activePlayer, setActivePlayer] = useState<Meditation | null>(null);
  const [showTrialNudge, setShowTrialNudge] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const { data: meditations = [] } = useQuery({
    queryKey: ["meditations"],
    queryFn: async () => {
      const { data } = await supabase
        .from("meditations" as any)
        .select("*")
        .order("sort_order", { ascending: true });
      return ((data || []) as unknown) as Meditation[];
    },
  });

  const { data: notifyList = [], refetch: refetchNotify } = useQuery({
    queryKey: ["meditation-notify", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("meditation_notify_requests" as any)
        .select("meditation_title")
        .eq("user_id", user.id);
      return (data || []).map((r: any) => r.meditation_title as string);
    },
    enabled: !!user,
  });

  const mind = meditations.filter((m) => m.library === "Mind Library");

  const canPlayMind = (m: Meditation) => {
    if (isTrialUser && effectiveTier === "free") return m.tier_required === "trial";
    return tierRank >= (TIER_RANK[m.tier_required] ?? 1);
  };

  const handlePlay = (m: Meditation) => {
    if (!canPlayMind(m)) return;
    setActivePlayer(m);
    if (isTrialUser && effectiveTier === "free") {
      const next = completedCount + 1;
      setCompletedCount(next);
      if (next >= 3) setShowTrialNudge(true);
    }
  };

  const handleNotify = async (title: string, library: string) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Sign in to save notifications." });
      return;
    }
    const { error } = await supabase
      .from("meditation_notify_requests" as any)
      .insert({ user_id: user.id, meditation_title: title, library });
    if (!error) {
      toast({ title: "You're on the list", description: `We'll notify you when "${title}" is ready.` });
      refetchNotify();
    }
  };

  const soulBodyUnlocked = tierRank >= 2; // expand and above

  return (
    <AuthenticatedLayout title="Meditation Library" subtitle="34 guided meditations for mind, soul, and body">
      <TrialBackButton fallbackPath="/home" label="Back to Home" className="mb-4" />

      {isTrialActive && effectiveTier === "free" && (
        <div className="mb-6 p-4 rounded-xl bg-[#3D1A6E]/20 border border-[#3D1A6E]/30">
          <p className="text-[#F9F6F0]/85 text-sm italic">
            3 meditations are yours to explore during your 7-day preview.
          </p>
          <p className="text-[#F9F6F0]/50 text-xs mt-1">
            Upgrade to unlock all 34 guided meditations.
          </p>
        </div>
      )}

      <Tabs defaultValue="mind" className="space-y-6">
        <TabsList className="bg-[#06060e]/60 border border-[#C9A84C]/15">
          <TabsTrigger value="mind">🧠 Mind ({mind.length})</TabsTrigger>
          <TabsTrigger value="soul">💜 Soul (12)</TabsTrigger>
          <TabsTrigger value="body">🧘 Body (12)</TabsTrigger>
        </TabsList>

        <TabsContent value="mind" className="space-y-3">
          {mind.map((m, i) => (
            <MindCard
              key={m.id}
              meditation={m}
              index={i}
              locked={!canPlayMind(m)}
              onPlay={() => handlePlay(m)}
            />
          ))}
          {isTrialUser && effectiveTier === "free" && (
            <p className="text-xs text-[#F9F6F0]/50 text-center pt-3 italic">
              Unlock all meditations — <Link to="/upgrade" className="text-[#C9A84C] hover:underline">upgrade your membership</Link>
            </p>
          )}
        </TabsContent>

        <TabsContent value="soul" className="space-y-3">
          {!soulBodyUnlocked ? (
            <TierLockOverlay tierLabel="Expand" />
          ) : (
            SOUL_COMING_SOON.map((title, i) => (
              <ComingSoonCard
                key={title}
                title={title}
                duration={SOUL_DURATIONS[i]}
                library="Soul Library"
                index={i}
                notified={notifyList.includes(title)}
                onNotify={() => handleNotify(title, "Soul Library")}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="body" className="space-y-3">
          {!soulBodyUnlocked ? (
            <TierLockOverlay tierLabel="Expand" />
          ) : (
            BODY_COMING_SOON.map((title, i) => (
              <ComingSoonCard
                key={title}
                title={title}
                duration={BODY_DURATIONS[i]}
                library="Body Library"
                index={i}
                notified={notifyList.includes(title)}
                onNotify={() => handleNotify(title, "Body Library")}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Player modal */}
      <AnimatePresence>
        {activePlayer && activePlayer.audio_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#06060e]/90 backdrop-blur-sm p-4"
            onClick={() => setActivePlayer(null)}
          >
            <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <MeditationPlayer
                meditationId={activePlayer.id}
                title={activePlayer.title}
                audioUrl={activePlayer.audio_url}
                onClose={() => setActivePlayer(null)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trial nudge after 3 plays */}
      <AnimatePresence>
        {showTrialNudge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#06060e]/85 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="max-w-md w-full rounded-2xl border border-[#C9A84C]/30 bg-[#0A0A0A] p-8 text-center shadow-2xl"
            >
              <p className="text-4xl mb-4">🧘</p>
              <h2 className="font-serif text-2xl font-bold text-[#F9F6F0] mb-2">You've explored all 3.</h2>
              <p className="text-[#F9F6F0]/85 text-sm mb-1">Your nervous system is already learning to settle.</p>
              <p className="text-[#F9F6F0]/55 text-sm mb-6">
                31 more meditations — for mind, soul, and body — are ready when you are.
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
                className="text-xs text-[#F9F6F0]/50 hover:text-[#F9F6F0]/80 transition-colors"
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
