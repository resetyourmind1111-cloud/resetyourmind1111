import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Day5EmotionalPeakProps {
  open: boolean;
  onClose: () => void;
}

type Part = 1 | 2 | 3 | 4;

/**
 * Day 5 Emotional Peak — 4-part guided experience replacing the journal-only Day 5.
 * Saves journal response to daily_shifts with prompt_type='day5_cost_of_settling'.
 * Sets profiles.day5_emotional_peak_completed=true upon reaching Part 4.
 */
export function Day5EmotionalPeak({ open, onClose }: Day5EmotionalPeakProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [part, setPart] = useState<Part>(1);
  const [breathCycle, setBreathCycle] = useState(0); // 0, 1, then 2 = done
  const [breathPhase, setBreathPhase] = useState<"in" | "out">("in");
  const [areaText, setAreaText] = useState("");
  const [costText, setCostText] = useState("");
  const [savedReflection, setSavedReflection] = useState(false);
  const [saving, setSaving] = useState(false);

  // Reset state when reopened
  useEffect(() => {
    if (open) {
      setPart(1);
      setBreathCycle(0);
      setBreathPhase("in");
      setAreaText("");
      setCostText("");
      setSavedReflection(false);
    }
  }, [open]);

  // Breathing animation: 4 in, 6 out — runs twice
  useEffect(() => {
    if (part !== 2) return;
    if (breathCycle >= 2) return;
    const inMs = 4000;
    const outMs = 6000;
    if (breathPhase === "in") {
      const t = setTimeout(() => setBreathPhase("out"), inMs);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setBreathCycle((c) => c + 1);
        setBreathPhase("in");
      }, outMs);
      return () => clearTimeout(t);
    }
  }, [part, breathCycle, breathPhase]);

  const markCompletedOnce = async () => {
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ day5_emotional_peak_completed: true } as any)
      .eq("user_id", user.id);
  };

  const handleSaveReflection = async () => {
    if (!user) return;
    if (!areaText.trim() || !costText.trim()) {
      toast.error("Fill in both blanks before continuing.");
      return;
    }
    setSaving(true);
    try {
      const response = `The area of my life where I've been settling most is ${areaText.trim()}, and the real cost of staying there is ${costText.trim()}.`;
      const { error } = await supabase.from("daily_shifts").insert({
        user_id: user.id,
        prompt_type: "day5_cost_of_settling",
        prompt:
          "The area of my life where I've been settling most is ___, and the real cost of staying there is ___.",
        response,
        day_number: 5,
      } as any);
      if (error) throw error;
      setSavedReflection(true);
      toast.success("Saved.");
    } catch (e) {
      toast.error("Could not save your reflection. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const goPart = (p: Part) => {
    setPart(p);
    if (p === 4) markCompletedOnce();
  };

  const handleSaveAndContinue = () => {
    onClose();
    navigate("/home");
  };

  if (!open) return null;

  const breathScale = breathPhase === "in" ? 1.6 : 0.7;
  const breathDuration = breathPhase === "in" ? 4 : 6;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] bg-[#06060e] overflow-y-auto"
      >
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            {/* PART 1 — Setup */}
            {part === 1 && (
              <motion.div
                key="p1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="border-l-2 border-[#C9A84C] pl-5 space-y-5">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] font-semibold">
                    Day 5 — The Cost of Settling
                  </p>
                  <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#F9F6F0] leading-tight">
                    The Cost of Settling
                  </h1>
                  <div className="text-[#F9F6F0]/85 text-base md:text-lg leading-relaxed space-y-4">
                    <p>Before we go deeper today —</p>
                    <p>
                      I want you to think of one area of your life<br />
                      where you know you've been settling.
                    </p>
                    <p>
                      Not the area you tell people about.<br />
                      <span className="text-[#C9A84C]">The real one.</span>
                    </p>
                    <p>
                      The relationship that drains you.<br />
                      The income that isn't enough.<br />
                      The version of yourself you keep putting off.
                    </p>
                    <p>Got it?</p>
                    <p>Hold it in your mind.</p>
                    <p>Now keep reading.</p>
                  </div>
                </div>
                <Button
                  onClick={() => goPart(2)}
                  className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-serif font-semibold rounded-xl py-6 text-base"
                >
                  I'm holding it →
                </Button>
                <button
                  onClick={onClose}
                  className="block mx-auto text-xs text-[#F9F6F0]/40 hover:text-[#F9F6F0]/70 transition-colors"
                >
                  Not right now
                </button>
              </motion.div>
            )}

            {/* PART 2 — Somatic Moment */}
            {part === 2 && (
              <motion.div
                key="p2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 text-center"
              >
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] font-semibold">
                  Day 5 — Feel the cost
                </p>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#F9F6F0]">
                  Feel the cost.
                </h2>

                {/* Breathing circle */}
                <div className="flex items-center justify-center h-56">
                  <motion.div
                    animate={{ scale: breathScale }}
                    transition={{ duration: breathDuration, ease: "easeInOut" }}
                    className="w-32 h-32 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(201,168,76,0.6) 0%, rgba(201,168,76,0.15) 60%, rgba(201,168,76,0) 100%)",
                      boxShadow: "0 0 60px rgba(201,168,76,0.35)",
                    }}
                  />
                </div>
                <p className="text-[#C9A84C] text-sm uppercase tracking-[0.3em] -mt-4">
                  {breathCycle >= 2
                    ? "Complete"
                    : breathPhase === "in"
                    ? "Breathe in · 4"
                    : "Breathe out · 6"}
                </p>

                <div className="text-[#F9F6F0]/85 text-base leading-relaxed space-y-3 text-left">
                  <p>Place one hand on your chest.</p>
                  <p>Take a breath in through your nose.</p>
                  <p>
                    As you exhale — feel the weight of staying<br />
                    exactly where you are for another year.
                  </p>
                  <p className="text-[#F9F6F0]/65 italic">
                    Same patterns.<br />Same results.<br />Same settling.
                  </p>
                  <p>Now take another breath in.</p>
                  <p>
                    This time — as you exhale — imagine<br />
                    what it would feel like to actually change it.
                  </p>
                  <p className="text-[#F9F6F0]/65 italic">
                    Not hope. Not wish. Actually change it.
                  </p>
                  <p>Feel that in your body.</p>
                  <p className="text-[#C9A84C]">
                    That gap between where you are and where you know you could be —<br />
                    that is what we're resetting.
                  </p>
                </div>

                {breathCycle >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      onClick={() => goPart(3)}
                      className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-serif font-semibold rounded-xl py-6 text-base"
                    >
                      I felt that →
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* PART 3 — Reflection */}
            {part === 3 && (
              <motion.div
                key="p3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-3">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] font-semibold">
                    Day 5 — Name it
                  </p>
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#F9F6F0]">
                    Name it.
                  </h2>
                </div>

                {!savedReflection ? (
                  <>
                    <div className="rounded-2xl border border-[#C9A84C]/30 bg-[#0d0d18] p-6 space-y-4 text-[#F9F6F0]">
                      <p className="font-serif text-base md:text-lg leading-relaxed text-center">
                        The area of my life where I've been settling most is
                      </p>
                      <Textarea
                        value={areaText}
                        onChange={(e) => setAreaText(e.target.value)}
                        placeholder="…"
                        className="bg-[#06060e] border-[#C9A84C]/30 text-[#F9F6F0] min-h-[60px]"
                      />
                      <p className="font-serif text-base md:text-lg leading-relaxed text-center">
                        and the real cost of staying there is
                      </p>
                      <Textarea
                        value={costText}
                        onChange={(e) => setCostText(e.target.value)}
                        placeholder="…"
                        className="bg-[#06060e] border-[#C9A84C]/30 text-[#F9F6F0] min-h-[80px]"
                      />
                    </div>
                    <Button
                      onClick={handleSaveReflection}
                      disabled={saving}
                      className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-serif font-semibold rounded-xl py-6 text-base"
                    >
                      {saving ? "Saving…" : "Save reflection →"}
                    </Button>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="rounded-2xl border border-[#C9A84C]/40 bg-[#0d0d18] p-6 text-center">
                      <p className="font-serif text-lg text-[#F9F6F0] leading-relaxed">
                        You just named what most people<br />
                        spend a lifetime avoiding.
                      </p>
                      <p className="text-[#C9A84C] text-sm italic mt-3">
                        That awareness is the beginning of the reset.
                      </p>
                    </div>
                    <Button
                      onClick={() => goPart(4)}
                      className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-serif font-semibold rounded-xl py-6 text-base"
                    >
                      Continue →
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* PART 4 — Bridge */}
            {part === 4 && (
              <motion.div
                key="p4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-3">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] font-semibold">
                    Day 5 — What changes this
                  </p>
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#F9F6F0]">
                    What changes this.
                  </h2>
                </div>

                <div className="text-[#F9F6F0]/85 text-base md:text-lg leading-relaxed space-y-4">
                  <p>The pattern you just named has a root.</p>
                  <p className="text-[#F9F6F0]/65 italic">
                    It's not a discipline problem.<br />
                    It's not a motivation problem.
                  </p>
                  <p>
                    It's a nervous system pattern that learned,<br />
                    a long time ago, that staying small was safer.
                  </p>
                  <p className="text-[#C9A84C]">
                    The full reset goes to that root.
                  </p>
                  <p>
                    Not in 5 days.<br />
                    In 30.
                  </p>
                  <p className="text-[#F9F6F0]/65 italic">
                    Day by day. Pattern by pattern.<br />
                    Until settling stops feeling like an option.
                  </p>
                </div>

                <Button
                  onClick={() => navigate("/upgrade")}
                  className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-serif font-bold rounded-xl py-6 text-base"
                >
                  See My Full Reset →
                </Button>
                <button
                  onClick={handleSaveAndContinue}
                  className="block mx-auto text-xs text-[#F9F6F0]/40 hover:text-[#F9F6F0]/70 transition-colors"
                >
                  Save this and continue my preview →
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
