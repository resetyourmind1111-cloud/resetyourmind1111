import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { BottomNav } from "@/components/BottomNav";
import { CHECKIN_OPTIONS, CHECKIN_MAPPING, TRAP_SLUGS } from "@/data/identityTrapData";
import { useSubscription } from "@/hooks/useSubscription";
import { LockedContent } from "@/components/LockedContent";
import { PatternAiChatPanel, PatternAiTriggerButton } from "@/components/patterns/PatternAiChatPanel";

export default function PatternCheckin() {
  const navigate = useNavigate();
  const { effectiveTier } = useSubscription();
  const [selected, setSelected] = useState<string[]>([]);
  const [mappedTrap, setMappedTrap] = useState<string | null>(null);
  const [showAiChat, setShowAiChat] = useState(false);

  const toggleOption = (opt: string) => {
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );
  };

  const handleSubmit = () => {
    if (selected.length === 0) return;
    // Count which trap each selection maps to
    const trapCounts: Record<string, number> = {};
    selected.forEach((s) => {
      const trap = CHECKIN_MAPPING[s];
      if (trap) trapCounts[trap] = (trapCounts[trap] || 0) + 1;
    });
    const topTrap = Object.entries(trapCounts).sort((a, b) => b[1] - a[1])[0][0];
    setMappedTrap(topTrap);
  };

  const content = (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20 md:pt-24 pb-24 md:pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-lg">
          <AnimatePresence mode="wait">
            {!mappedTrap ? (
              <motion.div
                key="checkin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
                    What's coming up for you today?
                  </h1>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  {CHECKIN_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => toggleOption(opt)}
                      className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all border-2 ${
                        selected.includes(opt)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/50 bg-card/60 text-foreground hover:border-primary/40"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <Button
                  variant="gold"
                  size="lg"
                  className="w-full py-6"
                  disabled={selected.length === 0}
                  onClick={handleSubmit}
                >
                  See My Pattern →
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6 py-8"
              >
                <p className="text-sm text-muted-foreground">
                  It looks like
                </p>
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  {mappedTrap}
                </h2>
                <p className="text-muted-foreground">
                  may be active right now.
                </p>
                <p className="text-sm text-muted-foreground italic">Here's a 3-minute reset.</p>

                <Button
                  variant="gold"
                  size="lg"
                  className="w-full py-6"
                  onClick={() => navigate(`/patterns/${TRAP_SLUGS[mappedTrap]}`, { state: { startAt: 7 } })}
                >
                  Start My Reset
                </Button>

                <button
                  onClick={() => { setMappedTrap(null); setSelected([]); }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Not quite right? Choose a different pattern
                </button>

                <PatternAiTriggerButton
                  label="Ask AI For Help →"
                  onClick={() => setShowAiChat(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <BottomNav />
      {mappedTrap && (
        <PatternAiChatPanel
          trapName={mappedTrap}
          show={showAiChat}
          onClose={() => setShowAiChat(false)}
        />
      )}
    </div>
  );

  return (
    <LockedContent requiredTier="reset" currentTier={effectiveTier}>
      {content}
    </LockedContent>
  );
}
