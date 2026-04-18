import { useEffect, useRef, useState } from "react";
import { Play, Pause, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface MeditationPlayerProps {
  meditationId?: string;
  title: string;
  audioUrl: string;
  onClose?: () => void;
  onComplete?: () => void;
}

function formatTime(seconds: number) {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MeditationPlayer({ meditationId, title, audioUrl, onClose, onComplete }: MeditationPlayerProps) {
  const { user } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const completionLoggedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audio.preload = "metadata";
    audioRef.current = audio;

    const onLoaded = () => setDuration(audio.duration);
    const onTime = () => setCurrent(audio.currentTime);
    const onEnded = async () => {
      setPlaying(false);
      setCompleted(true);
      onComplete?.();
      if (user && meditationId && !completionLoggedRef.current) {
        completionLoggedRef.current = true;
        await supabase.from("meditation_completions").insert({
          user_id: user.id,
          meditation_id: meditationId,
          meditation_title: title,
        });
      }
    };
    const onErr = () => setError("Audio unavailable. Please try again later.");

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onErr);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onErr);
      audioRef.current = null;
    };
  }, [audioUrl, meditationId, title, user]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => setError("Tap play again to start."));
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * duration;
  };

  const progress = duration ? (current / duration) * 100 : 0;

  return (
    <div className="rounded-2xl bg-[#06060e] border border-[#C9A84C]/20 p-6 sm:p-8">
      <p className="text-[#F9F6F0] font-serif text-lg sm:text-xl text-center mb-6">{title}</p>

      <div className="flex justify-center mb-6">
        <button
          onClick={toggle}
          className="w-20 h-20 rounded-full bg-[#C9A84C] flex items-center justify-center hover:bg-[#C9A84C]/90 transition-colors shadow-lg shadow-[#C9A84C]/20"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <Pause className="w-9 h-9 text-[#06060e]" />
          ) : (
            <Play className="w-9 h-9 text-[#06060e] ml-1" />
          )}
        </button>
      </div>

      <div
        className="h-1.5 bg-[#F9F6F0]/10 rounded-full overflow-hidden cursor-pointer mb-2"
        onClick={seek}
      >
        <div
          className="h-full bg-[#C9A84C] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-[#F9F6F0]/60">
        <span>{formatTime(current)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {error && (
        <p className="text-xs text-red-400/80 text-center mt-4">{error}</p>
      )}

      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 rounded-full bg-[#C9A84C]/20 flex items-center justify-center animate-pulse">
              <Check className="w-6 h-6 text-[#C9A84C]" />
            </div>
            <p className="text-sm text-[#C9A84C] font-medium">Session complete</p>
          </motion.div>
        )}
      </AnimatePresence>

      {onClose && (
        <button
          onClick={onClose}
          className="mt-6 w-full text-xs text-[#F9F6F0]/40 hover:text-[#F9F6F0]/70 transition-colors"
        >
          Close
        </button>
      )}
    </div>
  );
}
