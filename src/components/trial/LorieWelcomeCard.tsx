import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { MeditationPlayer } from "@/components/meditations/MeditationPlayer";

const WELCOME_AUDIO_URL =
  "https://yolulmwfrjhnxykghvpg.supabase.co/storage/v1/object/public/Onboarding/Welcome%20to%20your%20reset%20KI7mjPpBjDKiNh6w4NO0.mp3";
const WELCOME_AUDIO_TITLE = "Welcome to Your Reset";

const WELCOME_FALLBACK_TEXT = [
  "If you're here, something in you already knows it's time.",
  "You don't have to have it all figured out. You just have to be willing to see yourself clearly — for the next 7 days.",
  "That's all I'm asking. Show up. Press play. Read the prompts. Let the work do what it does.",
  "I'll meet you here every day. — Lorie",
];

export function LorieWelcomeCard() {
  const { user } = useAuth();
  const { trialDay, isTrialActive } = useTrialStatus();
  const [show, setShow] = useState(false);
  const [audioFailed, setAudioFailed] = useState(false);


  useEffect(() => {
    // Show on Day 1 of trial OR for paid/post-trial users — until dismissed forever
    if (!user) return;
    if (isTrialActive && trialDay > 1) return;

    const check = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("lorie_welcome_shown")
        .eq("user_id", user.id)
        .single();
      if (data && !(data as any).lorie_welcome_shown) {
        setShow(true);
      }
    };
    check();
  }, [user, isTrialActive, trialDay]);

  const handleDismissLater = () => setShow(false);

  const handleDismissForever = async () => {
    setShow(false);
    if (user) {
      await supabase
        .from("profiles")
        .update({ lorie_welcome_shown: true } as any)
        .eq("user_id", user.id);
    }
  };

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="p-5 bg-[#2A1F3D] border-t-2 border-t-[#C9A84C] border-[#2A1F3D] lorie-welcome-pulse">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold mb-2">
          A Message From Lorie
        </p>

        <p className="font-serif text-[#F9F6F0] text-base sm:text-lg leading-snug mb-1">
          Lorie recorded this for you. Press play when you're ready.
        </p>
        <p className="text-[#F9F6F0]/50 text-xs mb-4">
          2 min · Listen with headphones if you can.
        </p>

        <div className="mb-4">
          {audioFailed ? (
            <div className="rounded-2xl bg-[#06060e] border border-[#C9A84C]/20 p-5 sm:p-6 space-y-3">
              <p className="text-[#F9F6F0] font-serif text-base text-center mb-2">{WELCOME_AUDIO_TITLE}</p>
              {WELCOME_FALLBACK_TEXT.map((line, i) => (
                <p key={i} className="text-[#F9F6F0]/75 text-sm leading-relaxed">{line}</p>
              ))}
              <p className="text-[#C9A84C]/60 text-[10px] text-center pt-2">
                (Audio unavailable — Lorie's words above.)
              </p>
            </div>
          ) : (
            <MeditationPlayer
              title={WELCOME_AUDIO_TITLE}
              audioUrl={WELCOME_AUDIO_URL}
              onError={() => setAudioFailed(true)}
            />
          )}
        </div>

        <div className="mb-3">
          <p className="text-[#F9F6F0]/80 text-sm font-medium">Lorie Wu</p>
          <p className="text-[#F9F6F0]/40 text-xs">
            CEO, Reset Your Mind 1111™ | Author, The Emotional Surgeon™
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleDismissLater}
            className="text-xs text-[#F9F6F0]/40 hover:text-[#F9F6F0]/60 transition-colors"
          >
            I'll listen later
          </button>
          <button
            onClick={handleDismissForever}
            className="text-[10px] text-[#F9F6F0]/25 hover:text-[#F9F6F0]/40 transition-colors"
          >
            Don't show again
          </button>
        </div>
      </Card>
    </motion.div>
  );
}
