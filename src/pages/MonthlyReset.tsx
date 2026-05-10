import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { AnthemPlayer } from "@/components/anthem/AnthemPlayer";
import { allPermissionSlips } from "@/data/permissionSlipsData";
import { useToast } from "@/hooks/use-toast";
import { incrementGiftedCounter } from "@/hooks/useGiftedAccess";
import html2canvas from "html2canvas";

const monthlyThemes: Record<number, { theme: string; question: string; teaching: string }> = {
  0: { theme: "Identity", question: "Who are you becoming this year?", teaching: "Every January the world tells you to set goals. But goals built on an old identity rarely stick. This month we reset the identity first — so everything you build actually lasts." },
  1: { theme: "Love", question: "What do you owe yourself first?", teaching: "Before you can fully receive love, you have to stop abandoning yourself. This month we reset the pattern of giving everything and keeping nothing." },
  2: { theme: "Money", question: "What is your worth set to this month?", teaching: "Your income follows your identity. This month we recalibrate what you believe you deserve — because the pattern always matches the belief." },
  3: { theme: "Visibility", question: "What are you ready to stop hiding?", teaching: "Playing small is a nervous system strategy. This month we practice being seen — safely, intentionally, on your terms." },
  4: { theme: "Boundaries", question: "What are you done tolerating?", teaching: "Boundaries aren't walls. They're the edges of your self-respect. This month we draw the line — and hold it." },
  5: { theme: "Healing", question: "What are you finally ready to release?", teaching: "Healing isn't about forgetting. It's about no longer letting the wound drive the decisions. This month we let go." },
  6: { theme: "Expansion", question: "What would you do if you knew it was safe?", teaching: "Your nervous system confuses expansion with danger. This month we teach it the difference." },
  7: { theme: "Consistency", question: "What does showing up really look like?", teaching: "Motivation fades. Identity stays. This month we stop waiting to feel ready and practice showing up as who we're becoming." },
  8: { theme: "Clarity", question: "What do you actually want?", teaching: "Most people are running someone else's script. This month we get ruthlessly clear about what you actually want — not what you think you should want." },
  9: { theme: "Release", question: "What needs to die so something new can grow?", teaching: "Every transformation requires a death. This month we honor what's ending so we can make room for what's next." },
  10: { theme: "Gratitude", question: "What has this year made possible?", teaching: "Gratitude isn't toxic positivity. It's evidence that the reset is working. This month we name what's changed." },
  11: { theme: "Completion", question: "What did you become this year?", teaching: "Before the new year begins, we close this one with intention. This month we honor every version of you that showed up." },
};

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function MonthlyReset() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [screen, setScreen] = useState(0);
  const [readyClicked, setReadyClicked] = useState(false);
  const [releasing, setReleasing] = useState("");
  const [callingIn, setCallingIn] = useState("");
  const [savedReleasing, setSavedReleasing] = useState(false);
  const [savedCallingIn, setSavedCallingIn] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const monthIdx = now.getMonth();
  const monthName = monthNames[monthIdx];
  const year = now.getFullYear();
  const theme = monthlyThemes[monthIdx];
  const randomSlip = allPermissionSlips[Math.floor(Math.random() * allPermissionSlips.length)];

  const saveReflection = async (prompt: string, response: string) => {
    if (!user || !response.trim()) return;
    await supabase.from("daily_shifts").insert({
      user_id: user.id,
      prompt,
      response: response.trim(),
      prompt_type: "monthly_ceremony",
    } as any);
  };

  const completeCeremony = async () => {
    if (!user) return;
    const { data } = await supabase.from("profiles").select("monthly_ceremonies_completed").eq("user_id", user.id).single();
    const completed = ((data as any)?.monthly_ceremonies_completed || {}) as Record<string, boolean>;
    const key = `${monthName.toLowerCase()}_${year}`;
    completed[key] = true;
    await supabase.from("profiles").update({ monthly_ceremonies_completed: completed } as any).eq("user_id", user.id);
    incrementGiftedCounter(user.id, "resets_completed_count").catch(() => {});
    toast({ title: `Your ${monthName} reset is set.`, description: "✦" });
    navigate("/home");
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${monthName} Reset`,
        text: `${callingIn || "Permission granted. ✦"}\n#ResetYourMind1111 #MonthlyReset`,
      });
    }
  };

  const handleDownload = async () => {
    if (!shareCardRef.current) return;
    const canvas = await html2canvas(shareCardRef.current, { backgroundColor: "#06060e" });
    const link = document.createElement("a");
    link.download = `monthly-reset-${monthName.toLowerCase()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#06060e]">
      <AnimatePresence mode="wait">
        {/* Screen 0: Anthem Opening */}
        {screen === 0 && (
          <motion.div key="anthem" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-8">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold">BEGIN YOUR CEREMONY</p>
              <p className="text-[#F9F6F0]/60 text-sm">Press play. Let it land.<br />Then we begin.</p>
              <AnthemPlayer />
              <div className="space-y-3">
                {!readyClicked && (
                  <button onClick={() => setReadyClicked(true)} className="text-[#F9F6F0]/30 text-xs hover:text-[#F9F6F0]/50">Skip →</button>
                )}
                <Button onClick={() => setScreen(1)} className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-semibold">
                  I'm ready — begin my reset →
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Screen 1: This Month's Theme */}
        {screen === 1 && (
          <motion.div key="theme" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold">{monthName.toUpperCase()} RESET THEME</p>
              <h1 className="font-serif text-3xl font-bold text-[#F9F6F0]">{theme.theme}</h1>
              <p className="font-serif text-lg text-[#C9A84C] italic">{theme.question}</p>
              <p className="text-[#F9F6F0]/60 text-sm leading-relaxed">{theme.teaching}</p>
              <Button onClick={() => setScreen(2)} className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-semibold">
                Continue to my ceremony →
              </Button>
            </div>
          </motion.div>
        )}

        {/* Screen 2: Monthly Reflection */}
        {screen === 2 && (
          <motion.div key="reflection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex items-center justify-center p-6">
            <div className="max-w-md w-full space-y-8">
              <div className="space-y-4">
                <p className="font-serif text-lg text-[#F9F6F0] italic text-center">
                  "What are you releasing this month?<br />Name it. Let it go."
                </p>
                <Textarea
                  value={releasing}
                  onChange={(e) => setReleasing(e.target.value)}
                  placeholder="What I'm releasing..."
                  className="min-h-[100px] bg-[#F9F6F0]/5 border-[#C9A84C]/20 text-[#F9F6F0] placeholder:text-[#F9F6F0]/30"
                />
                <Button
                  size="sm"
                  onClick={() => { saveReflection("What are you releasing this month?", releasing); setSavedReleasing(true); }}
                  disabled={savedReleasing || !releasing.trim()}
                  className="bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 text-xs"
                >
                  {savedReleasing ? "✓ Saved" : "Save"}
                </Button>
              </div>

              <div className="border-t border-[#C9A84C]/20" />

              <div className="space-y-4">
                <p className="font-serif text-lg text-[#F9F6F0] italic text-center">
                  "What are you calling in?<br />Say it like it's already true."
                </p>
                <Textarea
                  value={callingIn}
                  onChange={(e) => setCallingIn(e.target.value)}
                  placeholder="What I'm calling in..."
                  className="min-h-[100px] bg-[#F9F6F0]/5 border-[#C9A84C]/20 text-[#F9F6F0] placeholder:text-[#F9F6F0]/30"
                />
                <Button
                  size="sm"
                  onClick={() => { saveReflection("What are you calling in?", callingIn); setSavedCallingIn(true); }}
                  disabled={savedCallingIn || !callingIn.trim()}
                  className="bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 text-xs"
                >
                  {savedCallingIn ? "✓ Saved" : "Save"}
                </Button>
              </div>

              <Button onClick={() => setScreen(3)} className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-semibold">
                Continue →
              </Button>
            </div>
          </motion.div>
        )}

        {/* Screen 3: Monthly Permission + Shareable */}
        {screen === 3 && (
          <motion.div key="permission" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-6">
              <h2 className="font-serif text-2xl font-bold text-[#F9F6F0]">Your permission for this month:</h2>
              <div className="p-6 rounded-xl border-2 border-[#C9A84C]/40 bg-[#C9A84C]/5">
                <p className="font-serif text-lg text-[#F9F6F0] italic leading-relaxed">"{randomSlip.text}"</p>
              </div>
              <p className="text-[#C9A84C] text-sm">This is yours for {monthName}.</p>

              <div ref={shareCardRef} className="p-8 rounded-2xl border border-[#C9A84C]/30 bg-[#06060e]">
                <p className="font-serif text-2xl font-bold text-[#C9A84C] mb-2">{monthName} Reset</p>
                <p className="text-[#F9F6F0]/80 text-sm italic mb-4">
                  {callingIn || "Permission granted. ✦"}
                </p>
                <p className="text-[#C9A84C]/60 text-xs">Reset Your Mind 1111™</p>
                <p className="text-[#F9F6F0]/30 text-[10px] mt-2">#ResetYourMind1111 #MonthlyReset</p>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleShare} className="flex-1 bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-semibold">Share</Button>
                <Button onClick={handleDownload} variant="outline" className="flex-1 border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C]/10">Download</Button>
              </div>

              <Button onClick={completeCeremony} className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-semibold">
                Complete my ceremony
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
