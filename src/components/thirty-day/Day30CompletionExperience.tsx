import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Play, Pause } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { AnthemPlayer } from "@/components/anthem/AnthemPlayer";

const LORIE_30DAY_AUDIO_URL = "https://cdn.pixabay.com/audio/2022/03/15/audio_115f9bda3a.mp3"; // placeholder

interface Day30CompletionProps {
  onDismiss: () => void;
}

export function Day30CompletionExperience({ onDismiss }: Day30CompletionProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [screen, setScreen] = useState(0);
  const [stats, setStats] = useState({
    interrupts: 0, resets: 0, reflections: 0, meditations: 0, streak: 0,
  });
  const [day7Reflection, setDay7Reflection] = useState<string | null>(null);
  const [day30Reflection, setDay30Reflection] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const { count: interruptCount } = await supabase
        .from("pattern_interrupts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

      const { data: progress } = await supabase
        .from("pattern_progress")
        .select("total_interrupts, self_trust_streak")
        .eq("user_id", user.id)
        .maybeSingle();

      const { count: reflectionCount } = await (supabase.from("daily_shifts" as any) as any)
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

      const { count: meditationCount } = await supabase
        .from("lesson_completions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

      setStats({
        interrupts: Math.max(interruptCount ?? 1, 1),
        resets: Math.max((progress as any)?.total_interrupts ?? 1, 1),
        reflections: Math.max(reflectionCount ?? 1, 1),
        meditations: Math.max(meditationCount ?? 1, 1),
        streak: Math.max((progress as any)?.self_trust_streak ?? 1, 1),
      });

      // Fetch reflections
      const { data: day7 } = await (supabase.from("daily_shifts" as any) as any)
        .select("response")
        .eq("user_id", user.id)
        .eq("prompt_type", "weekly_reflection")
        .eq("day_number", 7)
        .maybeSingle();

      const { data: day30 } = await (supabase.from("daily_shifts" as any) as any)
        .select("response")
        .eq("user_id", user.id)
        .eq("prompt_type", "weekly_reflection")
        .eq("day_number", 30)
        .maybeSingle();

      if (day7) setDay7Reflection(day7.response);
      if (day30) setDay30Reflection(day30.response);
    };
    fetchData();

    const audio = new Audio(LORIE_30DAY_AUDIO_URL);
    audioRef.current = audio;
    audio.addEventListener("ended", () => setPlaying(false));
    return () => { audio.pause(); audio.remove(); };
  }, [user]);

  useEffect(() => {
    if (screen === 0) {
      const t = setTimeout(() => setScreen(1), 3000);
      return () => clearTimeout(t);
    }
  }, [screen]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play();
    setPlaying(!playing);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "30 Days. Permission Granted.",
        text: "I completed the Reset Your Mind 1111™ 30-Day Recalibration Experience. #ResetYourMind1111 #PermissionGranted #30DayReset",
      });
    }
  };

  const handleDownload = async () => {
    if (!shareCardRef.current) return;
    const canvas = await html2canvas(shareCardRef.current, { backgroundColor: "#06060e" });
    const link = document.createElement("a");
    link.download = "reset-your-mind-30-day.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleUpgrade = (route: string) => {
    onDismiss();
    navigate(route);
  };

  return (
    <AnimatePresence mode="wait">
      {/* Screen 0: The Arrival */}
      {screen === 0 && (
        <motion.div
          key="arrival"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setScreen(1)}
          className="fixed inset-0 z-[80] bg-[#06060e] flex items-center justify-center p-6 cursor-pointer"
        >
          <div className="text-center">
            <motion.div
              className="text-6xl font-serif font-bold text-[#C9A84C] mb-6"
              animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              1111
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-serif text-4xl font-bold text-[#F9F6F0]"
            >
              You did it.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-[#F9F6F0]/60 text-sm mt-4"
            >
              30 days. 30 times you chose yourself.<br />
              That is a transformed foundation.
            </motion.p>
          </div>
        </motion.div>
      )}

      {/* Screen 1: Journey in Numbers */}
      {screen === 1 && (
        <motion.div
          key="numbers"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-[#06060e] flex items-center justify-center p-6 overflow-y-auto"
        >
          <div className="max-w-md w-full text-center space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#F9F6F0]">Here's what you built.</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Days completed", value: 30 },
                { label: "Pattern interrupts", value: stats.interrupts },
                { label: "Resets completed", value: stats.resets },
                { label: "Reflections saved", value: stats.reflections },
                { label: "Meditations completed", value: stats.meditations },
                { label: "Day self-trust streak", value: stats.streak },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-xl border border-[#C9A84C]/20 bg-[#C9A84C]/5">
                  <p className="text-2xl font-bold text-[#C9A84C]">✦ {s.value}</p>
                  <p className="text-xs text-[#F9F6F0]/50 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <Button onClick={() => setScreen(2)} className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-semibold">
              See my transformation →
            </Button>
          </div>
        </motion.div>
      )}

      {/* Screen 2: Day 1 vs Day 30 Reflection */}
      {screen === 2 && (
        <motion.div
          key="reflection"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-[#06060e] flex items-center justify-center p-6 overflow-y-auto"
        >
          <div className="max-w-md w-full text-center space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#F9F6F0]">Your own words.<br />Then and now.</h2>
            {day7Reflection || day30Reflection ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-[#C9A84C]/20 bg-[#C9A84C]/5 text-left">
                  <p className="text-[10px] uppercase tracking-wider text-[#C9A84C] font-semibold mb-2">Day 7</p>
                  <p className="text-[#F9F6F0]/80 text-sm italic">
                    {day7Reflection || "You were here. The shift happened whether you wrote it down or not."}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-[#C9A84C]/20 bg-[#C9A84C]/5 text-left">
                  <p className="text-[10px] uppercase tracking-wider text-[#C9A84C] font-semibold mb-2">Day 30</p>
                  <p className="text-[#F9F6F0]/80 text-sm italic">
                    {day30Reflection || "You were here every day. The shift happened whether you wrote it down or not."}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-[#F9F6F0]/50 text-sm italic">
                You were here every day.<br />The shift happened whether you wrote it down or not.
              </p>
            )}
            <Button onClick={() => setScreen(3)} className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-semibold">
              Continue →
            </Button>
          </div>
        </motion.div>
      )}

      {/* Screen 3: Shareable Card */}
      {screen === 3 && (
        <motion.div
          key="share"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-[#06060e] flex items-center justify-center p-6 overflow-y-auto"
        >
          <div className="max-w-md w-full text-center space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#F9F6F0]">You earned this.</h2>
            <div ref={shareCardRef} className="p-8 rounded-2xl border border-[#C9A84C]/30 bg-[#06060e]">
              <p className="font-serif text-3xl font-bold text-[#C9A84C] mb-2">30 Days.</p>
              <p className="font-serif text-xl text-[#C9A84C]">Permission Granted.</p>
              <p className="text-[#F9F6F0]/60 text-sm mt-4">
                I completed the Reset Your Mind 1111™<br />30-Day Recalibration Experience.
              </p>
              <p className="text-[#C9A84C]/60 text-xs mt-4">Reset Your Mind 1111™</p>
              <p className="text-[#F9F6F0]/30 text-[10px] mt-2">
                #ResetYourMind1111 #PermissionGranted #30DayReset
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleShare} className="flex-1 bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-semibold">
                Share my reset
              </Button>
              <Button onClick={handleDownload} variant="outline" className="flex-1 border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C]/10">
                Download card
              </Button>
            </div>
            <button onClick={() => setScreen(4)} className="text-sm text-[#F9F6F0]/40 hover:text-[#F9F6F0]/60">
              Continue →
            </button>
          </div>
        </motion.div>
      )}

      {/* Screen 4: Lorie's Message */}
      {screen === 4 && (
        <motion.div
          key="lorie"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-[#06060e] flex items-center justify-center p-6 overflow-y-auto"
        >
          <div className="max-w-md w-full text-center space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#F9F6F0]">A message from Lorie.</h2>
            <div className="p-5 rounded-xl bg-[#2A1F3D] border border-[#2A1F3D]">
              <div className="flex items-center gap-4 mb-3">
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-[#C9A84C] flex items-center justify-center shrink-0 hover:bg-[#C9A84C]/90 transition-colors"
                >
                  {playing ? <Pause className="w-5 h-5 text-[#06060e]" /> : <Play className="w-5 h-5 text-[#06060e] ml-0.5" />}
                </button>
                <div className="text-left">
                  <p className="text-[#F9F6F0] text-sm font-semibold">You Did The Work</p>
                </div>
              </div>
              <p className="text-[#F9F6F0]/80 text-sm font-medium text-left">Lorie Wu</p>
              <p className="text-[#F9F6F0]/40 text-xs text-left">CEO, Reset Your Mind 1111™</p>
            </div>
            <Button
              onClick={async () => {
                if (user) {
                  await supabase.from("profiles").update({ lorie_30day_shown: true } as any).eq("user_id", user.id);
                }
                setScreen(5);
              }}
              className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-semibold"
            >
              Continue to my next level →
            </Button>
          </div>
        </motion.div>
      )}

      {/* Screen 5b: Anthem */}
      {screen === 5 && (
        <motion.div
          key="anthem"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-[#06060e] flex items-center justify-center p-6 overflow-y-auto"
        >
          <div className="max-w-md w-full text-center space-y-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold">YOUR ANTHEM</p>
            <h2 className="font-serif text-2xl font-bold text-[#F9F6F0]">This was written for you.</h2>
            <p className="text-[#F9F6F0]/60 text-sm">
              Thirty days ago you gave yourself permission.<br />This is what that sounds like.
            </p>
            <AnthemPlayer />
            <Button onClick={() => setScreen(6)} className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-semibold">
              Continue to my next level →
            </Button>
          </div>
        </motion.div>
      )}

      {/* Screen 6: The Upgrade Moment */}
      {screen === 6 && (
        <motion.div
          key="upgrade"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-[#06060e] flex items-center justify-center p-6 overflow-y-auto"
        >
          <div className="max-w-md w-full text-center space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#F9F6F0]">
              You just reset your foundation.<br />Now build on it.
            </h2>
            <p className="text-[#F9F6F0]/60 text-sm leading-relaxed">
              The 30-Day Experience was the beginning. Your patterns are still being rewired.
              Your nervous system is still recalibrating. The work isn't done — it's just getting real.
            </p>

            {/* Founding Member */}
            <div className="p-5 rounded-xl border-2 border-[#C9A84C] bg-[#C9A84C]/5 text-left">
              <div className="flex items-center gap-2 mb-2">
                <span>⭐</span>
                <p className="text-[#C9A84C] font-bold text-sm">Founding Member — $44/month</p>
              </div>
              <p className="text-[#F9F6F0]/60 text-xs mb-1">Locked in for life while you stay active</p>
              <p className="text-[#F9F6F0]/60 text-xs mb-3">Full Embody access — everything</p>
              <span className="text-[10px] uppercase tracking-wider text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded-full">
                LIMITED — founding rate
              </span>
              <Button onClick={() => handleUpgrade("/upgrade")} className="w-full mt-3 bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-semibold text-sm">
                Lock in my founder rate
              </Button>
            </div>

            {/* Embody */}
            <div className="p-5 rounded-xl border border-[#F9F6F0]/10 bg-[#F9F6F0]/5 text-left">
              <p className="text-[#F9F6F0] font-bold text-sm mb-1">Embody — $111/month</p>
              <p className="text-[#F9F6F0]/50 text-xs mb-3">Everything in the app. All future features.</p>
              <Button onClick={() => handleUpgrade("/upgrade")} variant="outline" className="w-full border-[#F9F6F0]/20 text-[#F9F6F0] hover:bg-[#F9F6F0]/10 text-sm">
                Continue with Embody
              </Button>
            </div>

            {/* Lifetime */}
            <div className="p-4 rounded-xl border border-[#F9F6F0]/10 bg-[#F9F6F0]/5 text-left">
              <p className="text-[#F9F6F0] font-bold text-xs mb-1">Lifetime Access — $1,111 one-time</p>
              <p className="text-[#F9F6F0]/50 text-[10px] mb-2">Never pay again. Full access forever.</p>
              <Button onClick={() => handleUpgrade("/upgrade")} variant="outline" size="sm" className="w-full border-[#F9F6F0]/10 text-[#F9F6F0]/70 hover:bg-[#F9F6F0]/10 text-xs">
                Get lifetime access
              </Button>
            </div>

            <p className="text-[#F9F6F0]/40 text-xs">
              Your reset doesn't stop here. You've already done the hardest part.
            </p>

            <button
              onClick={() => handleUpgrade("/home")}
              className="text-[10px] text-[#F9F6F0]/30 hover:text-[#F9F6F0]/50 transition-colors"
            >
              I'll decide later
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
