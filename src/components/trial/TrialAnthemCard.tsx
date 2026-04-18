import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { AnthemPlayer } from "@/components/anthem/AnthemPlayer";

export function TrialAnthemCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-6"
    >
      <Card className="p-5 bg-[#2A1F3D] border-t-2 border-t-[#C9A84C] border-[#2A1F3D]">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold mb-2">
          Your Reset Anthem
        </p>
        <p className="text-[#F9F6F0]/70 text-sm mb-4 leading-relaxed">
          Press play whenever you need to remember — this song was written for this moment.
        </p>
        <AnthemPlayer />
      </Card>
    </motion.div>
  );
}
