import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";

const ANTHEM_URL = "https://suno.com/s/wP487osdtsq9Kl4S";

interface AnthemPlayerProps {
  title?: string;
  artist?: string;
  compact?: boolean;
}

export function AnthemPlayer({ title = "Permission Granted", artist = "Lorie Wu", compact = false }: AnthemPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(ANTHEM_URL);
      audioRef.current.addEventListener("ended", () => setPlaying(false));
    }
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  if (compact) {
    return (
      <button
        onClick={togglePlay}
        className="text-sm text-[#C9A84C] hover:text-[#C9A84C]/80 transition-colors flex items-center gap-1.5"
      >
        {playing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        ▶ Play my reset anthem
      </button>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-[#2A1F3D] border border-[#2A1F3D]">
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-[#C9A84C] flex items-center justify-center shrink-0 hover:bg-[#C9A84C]/90 transition-colors"
        >
          {playing ? <Pause className="w-5 h-5 text-[#06060e]" /> : <Play className="w-5 h-5 text-[#06060e] ml-0.5" />}
        </button>
        <div className="text-left">
          <p className="text-[#F9F6F0] text-sm font-semibold">{title}</p>
          {artist && <p className="text-[#F9F6F0]/50 text-xs">{artist}</p>}
        </div>
      </div>
    </div>
  );
}
