import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { supabase } from "@/integrations/supabase/client";

const HARD_STOP_SEC = 60;
const FADE_START_SEC = 45;

/**
 * Day 6.5 cliffhanger — shown after the Day 6 gift is interacted with.
 * Plays exactly 60 seconds of a tier-locked Embody preview audio,
 * then reveals an upgrade CTA.
 */
export function Day65CliffhangerCard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isTrialActive, trialDay } = useTrialStatus();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [show, setShow] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [audioMissing, setAudioMissing] = useState(false);

  // Eligibility: Day 6, trial active, gift used (i.e. day6_gift_shown=true), not yet shown
  useEffect(() => {
    if (!user || !isTrialActive || trialDay !== 6) {
      setShow(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("day6_gift_shown, day6_cliffhanger_shown")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled || !profile) return;
      const p: any = profile;
      if (p.day6_gift_shown && !p.day6_cliffhanger_shown) {
        // Pick audio source — preference order
        const { data: meds } = await supabase
          .from("meditations")
          .select("title, audio_url")
          .not("audio_url", "is", null)
          .limit(20);
        const candidates = (meds ?? []) as Array<{ title: string; audio_url: string | null }>;
        const score = (t: string) => {
          const s = t.toLowerCase();
          if (s.includes("day 8")) return 3;
          if (s.includes("releasing resistance")) return 2;
          if (s.includes("permission granted") && s.includes("foundation")) return 1;
          return 0;
        };
        const picked = candidates
          .filter((m) => m.audio_url && score(m.title) > 0)
          .sort((a, b) => score(b.title) - score(a.title))[0];
        if (picked?.audio_url) {
          setAudioUrl(picked.audio_url);
        } else {
          setAudioMissing(true);
        }
        setShow(true);
        // Mark shown so it never repeats — even if user dismisses
        await supabase
          .from("profiles")
          .update({ day6_cliffhanger_shown: true } as any)
          .eq("user_id", user.id);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, isTrialActive, trialDay]);

  // Audio progress + 60s hard stop + 45s fade
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => {
      const t = a.currentTime;
      setProgress(Math.min(t / HARD_STOP_SEC, 1));
      // Fade
      if (t >= FADE_START_SEC) {
        const remaining = Math.max(HARD_STOP_SEC - t, 0);
        const fadeRange = HARD_STOP_SEC - FADE_START_SEC;
        a.volume = Math.max(remaining / fadeRange, 0);
      } else {
        a.volume = 1;
      }
      // Hard stop
      if (t >= HARD_STOP_SEC) {
        a.pause();
        a.currentTime = HARD_STOP_SEC;
        setPlaying(false);
        setRevealed(true);
      }
    };
    const onEnded = () => {
      setPlaying(false);
      setRevealed(true);
    };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnded);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnded);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) {
      // No audio available — instantly reveal
      setRevealed(true);
      return;
    }
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().catch(() => {
        setRevealed(true);
      });
      setPlaying(true);
    }
  };

  const skipPreview = () => {
    audioRef.current?.pause();
    setPlaying(false);
    setRevealed(true);
  };

  const dismissTomorrow = () => setShow(false);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mb-6"
      >
        <Card
          className="relative overflow-hidden p-6 md:p-7 border-2 rounded-xl"
          style={{
            background: "linear-gradient(140deg, #1a0b3d 0%, #0d0723 100%)",
            borderImage: "linear-gradient(135deg, #C9A84C, #6b4d1c, #C9A84C) 1",
            borderColor: "#C9A84C",
            boxShadow: "0 0 40px rgba(201, 168, 76, 0.18)",
          }}
        >
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] font-semibold mb-3">
            A preview of what's next
          </p>

          {!revealed ? (
            <>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#F9F6F0] mb-3 leading-tight">
                Day 8 of your reset is waiting.
              </h3>
              <p className="text-sm md:text-base text-[#F9F6F0]/80 leading-relaxed mb-6">
                You've done the hardest part — you stayed.<br />
                Here's 60 seconds of what's behind the door.
              </p>

              {audioUrl && (
                <audio ref={audioRef} src={audioUrl} preload="auto" />
              )}

              <div className="flex items-center gap-4 mb-2">
                <button
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#06060e] flex items-center justify-center transition-colors shrink-0"
                  aria-label={playing ? "Pause preview" : "Play preview"}
                >
                  {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>
                <div className="flex-1">
                  <div className="h-1.5 rounded-full bg-[#F9F6F0]/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-[#C9A84C]"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-[#F9F6F0]/40 mt-1.5 uppercase tracking-wider">
                    {audioMissing ? "Preview locked" : "60-second preview"}
                  </p>
                </div>
              </div>

              <button
                onClick={skipPreview}
                className="text-xs text-[#F9F6F0]/40 hover:text-[#F9F6F0]/70 transition-colors mt-3"
              >
                Skip preview →
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4 text-[#C9A84C]" />
                <h3 className="font-serif text-xl md:text-2xl font-bold text-[#F9F6F0] leading-tight">
                  That's the door.
                </h3>
              </div>
              <p className="text-sm md:text-base text-[#F9F6F0]/85 leading-relaxed mb-6">
                The full Day 8 — and Days 9 through 30 — are inside your full reset.
              </p>
              <Button
                onClick={() => navigate("/upgrade")}
                className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-serif font-semibold rounded-xl py-6 text-base"
              >
                Unlock My Full Reset →
              </Button>
              <button
                onClick={dismissTomorrow}
                className="block mx-auto mt-4 text-xs text-[#F9F6F0]/40 hover:text-[#F9F6F0]/70 transition-colors"
              >
                I'll see it tomorrow
              </button>
            </>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
