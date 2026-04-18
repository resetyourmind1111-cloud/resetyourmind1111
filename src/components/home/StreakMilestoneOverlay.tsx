import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useHaptic } from "@/hooks/useHaptic";
import html2canvas from "html2canvas";

const MILESTONES = [7, 14, 21, 30, 60, 90, 111] as const;
type Milestone = (typeof MILESTONES)[number];

const COPY: Record<Milestone, { headline: string; body: string }> = {
  7: {
    headline: "7 days. The pattern is breaking.",
    body: "A week ago you made a choice. Look what you've done with it.",
  },
  14: {
    headline: "14 days. New neural pathways forming.",
    body: "Science says 14 days of consistent action begins to rewire the brain. You're doing it.",
  },
  21: {
    headline: "21 days. You're not the same person.",
    body: "The version of you from 3 weeks ago wouldn't recognize how far you've come.",
  },
  30: {
    headline: "30 days. This is who you are now.",
    body: "A month of choosing yourself. Every single day. This is not a habit anymore — this is identity.",
  },
  60: {
    headline: "60 days. You've broken the pattern.",
    body: "What used to be your default no longer runs your life. You changed the program.",
  },
  90: {
    headline: "90 days. The reset is complete.",
    body: "Three months of consistent inner work. Most people never get here. You did.",
  },
  111: {
    headline: "1 1 1.",
    body: "111 days.\nThis number wasn't an accident.\nIt never was.\nYou chose yourself 111 times.\nWelcome to the other side.",
  },
};

interface StreakMilestoneOverlayProps {
  streak: number;
}

export function StreakMilestoneOverlay({ streak }: StreakMilestoneOverlayProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { vibrate } = useHaptic();
  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || streak <= 0) return;
    if (!MILESTONES.includes(streak as Milestone)) return;
    const milestone = streak as Milestone;
    let cancelled = false;

    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("streak_milestones_shown")
        .eq("user_id", user.id)
        .single();
      const shown = ((data as any)?.streak_milestones_shown || {}) as Record<
        string,
        boolean
      >;
      if (!cancelled && !shown[String(milestone)]) {
        setActiveMilestone(milestone);
        vibrate("milestone");
        const next = { ...shown, [String(milestone)]: true };
        await supabase
          .from("profiles")
          .update({ streak_milestones_shown: next } as any)
          .eq("user_id", user.id);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, streak, vibrate]);

  const captureCard = useCallback(async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#06060e",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      return new Promise((resolve) =>
        canvas.toBlob((blob) => resolve(blob), "image/png")
      );
    } catch {
      return null;
    }
  }, []);

  const handleShare = async () => {
    if (!activeMilestone) return;
    const blob = await captureCard();
    const text = `I chose myself ${activeMilestone} days in a row.\n\n#ResetYourMind1111`;
    if (blob) {
      const file = new File([blob], `reset-${activeMilestone}.png`, {
        type: "image/png",
      });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            title: `${activeMilestone}-day reset`,
            text,
            files: [file],
          });
          return;
        } catch (err: any) {
          if (err.name === "AbortError") return;
        }
      }
    }
    await navigator.clipboard.writeText(text);
    toast({ title: "Milestone copied to clipboard ✨" });
  };

  const handleDownload = async () => {
    const blob = await captureCard();
    if (!blob || !activeMilestone) {
      toast({ title: "Couldn't generate image", variant: "destructive" });
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reset-${activeMilestone}-days.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Image saved ✨" });
  };

  if (!activeMilestone) return null;
  const copy = COPY[activeMilestone];
  const isOneOneOne = activeMilestone === 111;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] bg-[#06060e] flex items-center justify-center p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {isOneOneOne && <ConfettiBurst />}
        <div className="max-w-sm w-full space-y-6 py-12">
          {/* Animated 1111 */}
          <motion.p
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.8, 1.1, 1],
              opacity: [0, 1, 1],
            }}
            transition={{ duration: 1.2 }}
            className="font-serif text-5xl font-bold text-[#C9A84C] text-center tracking-wider"
            style={{ textShadow: "0 0 30px rgba(201,168,76,0.5)" }}
          >
            1111
          </motion.p>

          {/* Headline + body */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center space-y-3"
          >
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground leading-tight whitespace-pre-line">
              {copy.headline}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
              {copy.body}
            </p>
          </motion.div>

          {/* Shareable card (rendered for capture + visible) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            ref={cardRef}
            className="rounded-2xl border-2 border-[#C9A84C] p-6 text-center"
            style={{ backgroundColor: "#0A0A0A" }}
          >
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "64px",
                fontWeight: 700,
                color: "#C9A84C",
                lineHeight: 1,
              }}
            >
              {activeMilestone}
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "rgba(249,246,240,0.5)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginTop: "8px",
              }}
            >
              Days
            </p>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "16px",
                color: "#F9F6F0",
                marginTop: "20px",
                lineHeight: 1.5,
              }}
            >
              I chose myself {activeMilestone} days in a row.
            </p>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "13px",
                color: "#C9A84C",
                marginTop: "16px",
                fontWeight: 600,
              }}
            >
              Reset Your Mind 1111™
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="space-y-2"
          >
            <Button
              onClick={() => setActiveMilestone(null)}
              className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-semibold rounded-xl py-6"
            >
              Keep going →
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={handleDownload}
                variant="outline"
                className="flex-1 border-[#C9A84C]/50 text-[#C9A84C] hover:bg-[#C9A84C]/10 rounded-xl"
              >
                <Download className="w-4 h-4 mr-2" /> Save
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex-1 border-[#C9A84C]/50 text-[#C9A84C] hover:bg-[#C9A84C]/10 rounded-xl"
              >
                <Share2 className="w-4 h-4 mr-2" /> Share my reset
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/** Dense gold confetti burst — only for the 111 milestone. */
function ConfettiBurst() {
  const pieces = Array.from({ length: 60 });
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = 4 + Math.random() * 4;
        const size = 4 + Math.random() * 6;
        return (
          <motion.span
            key={i}
            initial={{ y: -20, opacity: 0, rotate: 0 }}
            animate={{
              y: "110vh",
              opacity: [0, 1, 1, 0],
              rotate: 360,
            }}
            transition={{ duration, delay, repeat: 1, ease: "linear" }}
            style={{
              position: "absolute",
              left: `${left}%`,
              top: 0,
              width: size,
              height: size,
              backgroundColor: "#C9A84C",
              borderRadius: 2,
            }}
          />
        );
      })}
    </div>
  );
}
