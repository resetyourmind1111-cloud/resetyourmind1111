import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { allPermissionSlips } from "@/data/permissionSlipsData";
import { AnthemPlayer } from "@/components/anthem/AnthemPlayer";

const bodyResponses = [
  "Something opened",
  "I needed that",
  "I feel resistance",
  "I'm not sure yet",
];

function getRandomSlip() {
  const idx = Math.floor(Math.random() * allPermissionSlips.length);
  return allPermissionSlips[idx];
}

const randomSlip = getRandomSlip();

interface MomentOneScreenProps {
  onComplete: () => void;
}

export function MomentOneScreen({ onComplete }: MomentOneScreenProps) {
  const { user } = useAuth();
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleComplete = async () => {
    if (!user) return;
    setSaving(true);
    await supabase
      .from("profiles")
      .update({
        first_moment_complete: true,
        first_moment_response: selectedResponse,
      } as any)
      .eq("user_id", user.id);
    setSaving(false);
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[90] bg-[#06060e] flex items-center justify-center p-6 overflow-y-auto"
    >
      <div className="max-w-md w-full text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#F9F6F0] leading-relaxed mb-3">
            Before you explore —<br />take 60 seconds.
          </h1>
          <p className="text-[#F9F6F0]/60 text-sm leading-relaxed">
            The shift doesn't start when you understand everything.<br />
            It starts with one small moment.<br />
            This is that moment.
          </p>
        </motion.div>

        {/* Permission Slip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="p-6 rounded-xl border-2 border-[#C9A84C]/40 bg-[#C9A84C]/5"
        >
          <p className="font-serif text-lg text-[#F9F6F0] italic leading-relaxed">
            "{randomSlip.text}"
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="text-[#C9A84C] text-xs tracking-wide"
        >
          Your first permission. Accepted.
        </motion.p>

        {/* Body Check-in */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="space-y-4"
        >
          <p className="text-[#F9F6F0]/80 text-sm font-medium">
            How does that land in your body?
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {bodyResponses.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedResponse(r)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                  selectedResponse === r
                    ? "border-[#C9A84C] bg-[#C9A84C]/15 text-[#C9A84C]"
                    : "border-[#F9F6F0]/20 text-[#F9F6F0]/60 hover:border-[#C9A84C]/40"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Anthem Moment */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3 }}
          className="space-y-3"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold">YOUR RESET ANTHEM</p>
          <p className="text-[#F9F6F0]/60 text-sm">This song was written for this moment.<br />For you. Right now.</p>
          <AnthemPlayer />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.0 }}
          className="space-y-3"
        >
          <Button
            onClick={handleComplete}
            disabled={saving}
            className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-serif font-bold text-base py-6 rounded-xl"
          >
            {saving ? "Saving..." : "Take me to my dashboard →"}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
