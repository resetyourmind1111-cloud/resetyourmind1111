import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { Button } from "@/components/ui/button";
import { MomentOneScreen } from "@/components/trial/MomentOneScreen";

const WELCOME_AUDIO_URL =
  "https://hxhwqprtkqwjbdqhulrn.supabase.co/storage/v1/object/public/audio/lorie-welcome.mp3";

const WELCOME_FALLBACK_TEXT = [
  "If you're here, something in you already knows it's time.",
  "You don't have to have it all figured out. You just have to be willing to see yourself clearly — for the next 7 days.",
  "That's all I'm asking. Show up. Press play. Read the prompts. Let the work do what it does.",
  "I'll meet you here every day. — Lorie",
];

// How long (ms) before we reveal the "I'm ready to begin" CTA even if the
// user never taps play. Spec: 10 seconds.
const REVEAL_CTA_DELAY_MS = 10_000;

export function LorieWelcomeCard() {
  const { user } = useAuth();
  const { trialDay, isTrialActive } = useTrialStatus();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [audioFailed, setAudioFailed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [ctaReady, setCtaReady] = useState(false);
  const [showMomentOne, setShowMomentOne] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Show on Day 1 of trial (trialDay 0 or 1) OR for paid users — until dismissed.
  // Note: useTrialStatus returns isTrialActive=false for paid users, so we must
  // also allow the card through for them. We only suppress it for trial users
  // who are past Day 1.
  useEffect(() => {
    if (!user) return;
    if (isTrialActive && trialDay > 1) return; // past Day 1 of an active trial

    const check = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("lorie_welcome_shown")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) {
        console.error("[LorieWelcomeCard] profile fetch failed", error);
        return;
      }
      if (!data || !(data as any).lorie_welcome_shown) {
        setShow(true);
      }
    };
    check();
  }, [user, isTrialActive, trialDay]);

  // Reveal the "I'm ready to begin" CTA after 10s even if they never tap play.
  useEffect(() => {
    if (!show) return;
    const t = window.setTimeout(() => setCtaReady(true), REVEAL_CTA_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [show]);

  const markShown = async () => {
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ lorie_welcome_shown: true } as any)
      .eq("user_id", user.id);
  };

  const handleTogglePlay = () => {
    setHasInteracted(true);
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => setAudioFailed(true));
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCtaReady(true); // Reveal CTA immediately when message finishes.
  };

  const handleBegin = async () => {
    await markShown();
    setShow(false);
    setShowMomentOne(true);
  };

  const handleMomentOneComplete = () => {
    setShowMomentOne(false);
    navigate("/assessment");
  };

  // After MomentOne, route into Worth Thermostat. We render it inline so the
  // ceremonial flow doesn't break with a full nav between screens.
  if (showMomentOne) {
    return <MomentOneScreen onComplete={handleMomentOneComplete} />;
  }

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="lorie-welcome-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[95] bg-[#06060e] flex items-center justify-center p-6 overflow-y-auto"
      >
        {/* Hidden audio element — controlled by the ceremonial play button */}
        <audio
          ref={audioRef}
          src={WELCOME_AUDIO_URL}
          preload="auto"
          onEnded={handleAudioEnded}
          onError={() => setAudioFailed(true)}
          onPause={() => setIsPlaying(false)}
        />

        <div className="max-w-md w-full text-center space-y-10">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-[11px] uppercase tracking-[0.35em] text-[#C9A84C]/80 font-medium"
          >
            A message from Lorie
          </motion.p>

          {/* The gift: gold pulse + tap-to-play */}
          {!audioFailed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
              className="relative flex items-center justify-center mx-auto"
              style={{ width: 240, height: 240 }}
            >
              {/* Outer ceremonial pulse ring (slowest) */}
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(201,168,76,0.18) 0%, rgba(201,168,76,0) 70%)",
                }}
                animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.2, 0.6] }}
                transition={{
                  duration: 3.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* Mid pulse */}
              <motion.span
                aria-hidden
                className="absolute rounded-full border border-[#C9A84C]/40"
                style={{ width: 180, height: 180 }}
                animate={{ scale: [1, 1.12, 1], opacity: [0.7, 0.35, 0.7] }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* Inner pulse */}
              <motion.span
                aria-hidden
                className="absolute rounded-full border border-[#C9A84C]/60"
                style={{ width: 130, height: 130 }}
                animate={{ scale: [1, 1.08, 1], opacity: [0.9, 0.5, 0.9] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* THE play button — the most prominent thing on the screen */}
              <button
                type="button"
                onClick={handleTogglePlay}
                aria-label={isPlaying ? "Pause Lorie's message" : "Play Lorie's message"}
                className="relative z-10 flex items-center justify-center rounded-full bg-[#C9A84C] text-[#06060e] shadow-[0_0_60px_-10px_rgba(201,168,76,0.7)] hover:bg-[#d8b863] active:scale-95 transition-all duration-200"
                style={{ width: 112, height: 112 }}
              >
                {isPlaying ? (
                  <Pause className="w-12 h-12" strokeWidth={2.5} fill="currentColor" />
                ) : (
                  <Play
                    className="w-12 h-12 ml-1.5"
                    strokeWidth={2.5}
                    fill="currentColor"
                  />
                )}
              </button>
            </motion.div>
          ) : (
            // Audio failed → show Lorie's words inline as the ceremonial gift.
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl border border-[#C9A84C]/25 bg-[#0e0e1a] p-6 sm:p-7 text-left space-y-3"
            >
              {WELCOME_FALLBACK_TEXT.map((line, i) => (
                <p
                  key={i}
                  className="text-[#F9F6F0]/85 font-serif text-base leading-relaxed"
                >
                  {line}
                </p>
              ))}
              <p className="text-[#C9A84C]/60 text-[11px] text-center pt-2">
                (Audio unavailable — Lorie's words above.)
              </p>
            </motion.div>
          )}

          {/* Subtitle prompt */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="text-[#F9F6F0]/70 text-base sm:text-lg font-serif italic leading-relaxed px-2"
          >
            {audioFailed
              ? "Read this before you begin."
              : hasInteracted
                ? isPlaying
                  ? "Listening…"
                  : "Paused — tap again when you're ready."
                : "Tap to hear a personal message before you begin."}
          </motion.p>

          {/* Signature */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="space-y-1"
          >
            <p className="text-[#F9F6F0]/60 text-sm">Lorie Wu</p>
            <p className="text-[#F9F6F0]/35 text-[11px]">
              CEO, Reset Your Mind 1111™ · Author, The Emotional Surgeon™
            </p>
          </motion.div>

          {/* "I'm ready to begin →" CTA — appears after audio finishes OR 10s */}
          <AnimatePresence>
            {ctaReady && (
              <motion.div
                key="begin-cta"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Button
                  size="lg"
                  onClick={handleBegin}
                  className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#d8b863] font-serif font-bold text-lg py-6 shadow-[0_0_40px_-10px_rgba(201,168,76,0.6)]"
                >
                  I'm ready to begin →
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
