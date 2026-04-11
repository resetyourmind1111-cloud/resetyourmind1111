import { useState } from "react";
import { Music } from "lucide-react";

const SUNO_EMBED_URL = "https://suno.com/embed/wP487osdtsq9Kl4S";

interface AnthemPlayerProps {
  title?: string;
  artist?: string;
  compact?: boolean;
}

export function AnthemPlayer({ title = "Permission Granted", artist = "Lorie Wu", compact = false }: AnthemPlayerProps) {
  const [showPlayer, setShowPlayer] = useState(false);

  if (compact) {
    return (
      <div className="space-y-2">
        <button
          onClick={() => setShowPlayer(!showPlayer)}
          className="text-sm text-[#C9A84C] hover:text-[#C9A84C]/80 transition-colors flex items-center gap-1.5"
        >
          <Music className="w-3 h-3" />
          {showPlayer ? "Hide anthem" : "▶ Play my reset anthem"}
        </button>
        {showPlayer && (
          <iframe
            src={SUNO_EMBED_URL}
            width="100%"
            height="120"
            style={{ border: "none", borderRadius: "12px" }}
            allow="autoplay"
            title="Permission Granted - Lorie Wu"
          />
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#2A1F3D] border border-[#2A1F3D] overflow-hidden">
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#C9A84C]/20 flex items-center justify-center shrink-0">
          <Music className="w-5 h-5 text-[#C9A84C]" />
        </div>
        <div className="text-left">
          <p className="text-[#F9F6F0] text-sm font-semibold">{title}</p>
          {artist && <p className="text-[#F9F6F0]/50 text-xs">{artist}</p>}
        </div>
      </div>
      <iframe
        src={SUNO_EMBED_URL}
        width="100%"
        height="120"
        style={{ border: "none" }}
        allow="autoplay"
        title="Permission Granted - Lorie Wu"
      />
    </div>
  );
}
