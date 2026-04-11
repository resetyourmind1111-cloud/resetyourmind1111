import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useTrialStatus } from "@/hooks/useTrialStatus";

const LORIE_WELCOME_AUDIO_URL = "https://cdn.pixabay.com/audio/2022/03/15/audio_115f9bda3a.mp3"; // placeholder silent/ambient

export function LorieWelcomeCard() {
  const { user } = useAuth();
  const { trialDay, isTrialActive } = useTrialStatus();
  const [show, setShow] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!user || !isTrialActive || trialDay > 1) return;

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

  useEffect(() => {
    const audio = new Audio(LORIE_WELCOME_AUDIO_URL);
    audioRef.current = audio;
    audio.addEventListener("loadedmetadata", () => {
      const mins = Math.floor(audio.duration / 60);
      const secs = Math.floor(audio.duration % 60);
      setDuration(`${mins}:${secs.toString().padStart(2, "0")}`);
    });
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.pause();
      audio.remove();
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleDismissLater = () => setShow(false);

  const handleDismissForever = async () => {
    setShow(false);
    if (audioRef.current) audioRef.current.pause();
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
      <Card className="p-5 bg-[#2A1F3D] border-t-2 border-t-[#C9A84C] border-[#2A1F3D]">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold mb-3">
          A Message From Lorie
        </p>

        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-[#C9A84C] flex items-center justify-center shrink-0 hover:bg-[#C9A84C]/90 transition-colors"
          >
            {playing ? (
              <Pause className="w-5 h-5 text-[#06060e]" />
            ) : (
              <Play className="w-5 h-5 text-[#06060e] ml-0.5" />
            )}
          </button>
          <div>
            <p className="text-[#F9F6F0] text-sm font-semibold">Welcome to Your Reset</p>
            {duration && (
              <p className="text-[#F9F6F0]/40 text-xs">{duration}</p>
            )}
          </div>
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
