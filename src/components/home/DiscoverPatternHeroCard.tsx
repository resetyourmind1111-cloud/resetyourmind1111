import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Compass, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { track } from "@/lib/analytics";

/**
 * Primary hero card for unactivated users, surfacing the
 * "What's My Pattern?™" experience as the recommended first action.
 *
 * Purely additive — routes to existing /whats-my-pattern page.
 * No changes to auth, trial, subscription, or activation logic.
 */
export function DiscoverPatternHeroCard() {
  const navigate = useNavigate();

  const handleClick = () => {
    try {
      track("home_first_action", { action: "discover_pattern" });
    } catch {
      // fire-and-forget
    }
    navigate("/whats-my-pattern");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6"
    >
      <Card className="p-6 bg-gradient-to-br from-[#06060e] to-[#0a0a14] border-2 border-[#C9A84C]/60 shadow-[0_0_40px_hsl(var(--primary)/0.18)]">
        <div className="flex items-center gap-2 mb-3">
          <Compass className="w-4 h-4 text-[#C9A84C]" />
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#C9A84C] font-semibold">
            Recommended first step
          </p>
        </div>
        <h2 className="font-serif text-xl md:text-2xl font-bold text-[#F9F6F0] mb-2 leading-tight">
          Find the pattern keeping you stuck
        </h2>
        <p className="text-sm text-[#F9F6F0]/70 mb-5 leading-relaxed">
          Answer 6 quick questions and get your personalized reset starting point.
        </p>
        <Button
          onClick={handleClick}
          className="w-full bg-[#C9A84C] hover:bg-[#b8973f] text-[#0A0A0A] font-semibold group"
        >
          Discover My Pattern
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </Card>
    </motion.div>
  );
}
