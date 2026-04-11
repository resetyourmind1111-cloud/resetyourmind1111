import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { allPermissionSlips } from "@/data/permissionSlipsData";
import { resetWords } from "@/data/resetWordsData";
import { useNavigate } from "react-router-dom";

function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function DailySurpriseCard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);
  const [glowing, setGlowing] = useState(false);

  const dayOfYear = getDayOfYear();
  const cycleType = dayOfYear % 3; // 0=permission, 1=oracle, 2=word

  const dailyPermission = useMemo(() => {
    if (cycleType !== 0) return null;
    const index = dayOfYear % allPermissionSlips.length;
    return allPermissionSlips[index];
  }, [cycleType, dayOfYear]);

  const dailyWord = useMemo(() => {
    if (cycleType !== 2) return null;
    const index = dayOfYear % resetWords.length;
    return resetWords[index];
  }, [cycleType, dayOfYear]);

  const handleAcceptPermission = async () => {
    if (!user || !dailyPermission) return;
    setGlowing(true);
    setAccepted(true);

    await supabase.from("permission_slips_accepted").insert({
      user_id: user.id,
      slip_text: dailyPermission.text,
      category: dailyPermission.category,
    });

    toast("Permission accepted. ✦", { duration: 2000 });
    setTimeout(() => setGlowing(false), 1000);
  };

  const handleShare = async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ text: `${text}\n#ResetYourMind1111` });
      } catch {}
    } else {
      await navigator.clipboard.writeText(`${text}\n#ResetYourMind1111`);
      toast("Copied to clipboard ✦");
    }
  };

  // Permission Slip Day
  if (cycleType === 0 && dailyPermission) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card
          className={`p-6 border-2 border-primary/60 bg-[#2D1B4E] transition-all duration-500 ${
            glowing ? "shadow-[0_0_30px_hsl(var(--primary)/0.5)]" : ""
          }`}
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-3">
            Today's Permission
          </p>
          <p className="font-serif text-xl md:text-2xl italic text-foreground leading-relaxed mb-4">
            {dailyPermission.text}
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            This one is yours today.
          </p>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleAcceptPermission}
              disabled={accepted}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {accepted ? "Accepted ✦" : "Accept"}
            </Button>
            <button
              onClick={() => handleShare(`My permission today: "${dailyPermission.text}"`)}
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Oracle Pull Day
  if (cycleType === 1) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card className="p-6 border-2 border-primary/60 bg-[#2D1B4E]">
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-3">
            Today's Oracle
          </p>
          <p className="font-serif text-xl text-foreground mb-2">
            Your daily card is waiting.
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Pull your card and see what today holds.
          </p>
          <Button
            onClick={() => navigate("/oracle")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Go deeper with this card →
          </Button>
        </Card>
      </motion.div>
    );
  }

  // Reset Word Day
  if (cycleType === 2 && dailyWord) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card className="p-8 border-2 border-primary/40 bg-background text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-4">
            Today's Reset Word
          </p>
          <p className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-3">
            {dailyWord.word}
          </p>
          <p className="text-sm italic text-muted-foreground mb-6">
            {dailyWord.intention}
          </p>
          <button
            onClick={() =>
              handleShare(`My reset word today is ${dailyWord.word}. ${dailyWord.intention}`)
            }
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </Card>
      </motion.div>
    );
  }

  return null;
}
