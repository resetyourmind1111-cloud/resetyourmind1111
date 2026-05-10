import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Diamond, Heart, Flame, Crown, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ResetPlanCards } from "@/components/onboarding/ResetPlanCards";
import { MissionIntroScreen } from "@/components/onboarding/MissionIntroScreen";

const TOTAL_STEPS = 8; // screens 1–8 have dots (name through notification)

const woundOptions = [
  {
    key: "wealth",
    label: "Money & Wealth",
    icon: Diamond,
    desc: "I keep self-sabotaging, playing small, or never feeling like there's enough.",
  },
  {
    key: "love",
    label: "Love & Relationships",
    icon: Heart,
    desc: "I attract the wrong people, give too much, or feel deeply alone even in a room full of people.",
  },
  {
    key: "health",
    label: "Health & Body",
    icon: Flame,
    desc: "I struggle with consistency, my energy, or feeling at home in my own body.",
  },
  {
    key: "identity",
    label: "Identity & Leadership",
    icon: Crown,
    desc: "I know I'm capable of more but something keeps holding me back from being fully seen.",
  },
];

const durationOptions = [
  "A few months",
  "About a year",
  "Several years",
  "Most of my life",
];

const triedOptions = [
  "Therapy or counseling",
  "Coaching or mentorship",
  "Journaling or self-help books",
  "Meditation or breathwork",
  "Online courses or programs",
  "Affirmations or mindset work",
  "Nothing yet — this is my first step",
  "All of the above and nothing has fully stuck",
];

const goalOptions = [
  "I wake up and actually feel like myself.",
  "I stop second-guessing every decision I make.",
  "I stop shrinking and start showing up fully.",
  "I feel free from the patterns that have been running my life.",
];

const hourOptions = Array.from({ length: 24 }, (_, i) => i);

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            i <= current ? "bg-primary scale-110" : "bg-muted"
          }`}
        />
      ))}
    </div>
  );
}

function PulseAnimation() {
  return (
    <motion.div
      className="text-6xl font-serif font-bold text-primary"
      animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      1111
    </motion.div>
  );
}

export function PersonalizedOnboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [screen, setScreen] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [primaryWound, setPrimaryWound] = useState<string | null>(null);
  const [stuckDuration, setStuckDuration] = useState<string | null>(null);
  const [triedBefore, setTriedBefore] = useState<string[]>([]);
  const [resetGoal, setResetGoal] = useState<string | null>(null);
  const [notifHour, setNotifHour] = useState(8);
  const [notifMinute, setNotifMinute] = useState(0);
  const [notifEnabled, setNotifEnabled] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.full_name) {
          setFirstName(data.full_name.split(" ")[0]);
        }
      });
  }, [user]);

  const goBack = () => setScreen((s) => Math.max(0, s - 1));
  const goNext = () => setScreen((s) => s + 1);

  const toggleTried = (option: string) => {
    setTriedBefore((prev) =>
      prev.includes(option) ? prev.filter((t) => t !== option) : [...prev, option]
    );
  };

  const handleProcessing = async () => {
    if (!user) return;

    // Map primary wound to onboarding reason & trial tools
    const woundToReason: Record<string, string> = {
      wealth: "sabotage",
      love: "relationships",
      health: "stuck",
      identity: "levelup",
    };
    const reasonKey = woundToReason[primaryWound || ""] || "stuck";

    // Import trial tool map inline
    const toolMap: Record<string, [string, string]> = {
      stuck: ["nervous-system-diagnostic", "limiting-belief-rewriter"],
      sabotage: ["limiting-belief-rewriter", "money-story-audit"],
      relationships: ["boundary-builder", "limiting-belief-rewriter"],
      levelup: ["limiting-belief-rewriter", "manifestation-tracker"],
    };
    const [tool1, tool2] = toolMap[reasonKey] || toolMap.stuck;

    // Save all onboarding data — retry once on failure
    const doSave = () =>
      supabase
        .from("profiles")
        .update({
          full_name: firstName,
          primary_wound: primaryWound,
          stuck_duration: stuckDuration,
          tried_before: triedBefore as any,
          reset_goal: resetGoal,
          onboarding_complete: true,
          reset_plan_generated: true,
          onboarding_reason: reasonKey,
          trial_tool_1: tool1,
          trial_tool_2: tool2,
        } as any)
        .eq("user_id", user.id);

    const { error } = await doSave();
    if (error) {
      console.error("Onboarding save failed, retrying…", error);
      await doSave();
    }

    // Fire-and-forget: notify admin + send the user their welcome email.
    // Idempotent on the server (won't double-send on retry).
    supabase.functions.invoke("notify-trial-started").catch((e) =>
      console.error("notify-trial-started failed:", e),
    );

    setTimeout(() => setScreen(7), 2500);
  };

  const handleNotificationSave = async () => {
    if (!user) return;
    const timeStr = `${notifHour.toString().padStart(2, "0")}:${notifMinute.toString().padStart(2, "0")}:00`;
    await supabase
      .from("profiles")
      .update({
        notification_time: notifEnabled ? timeStr : null,
        notifications_enabled: notifEnabled,
      } as any)
      .eq("user_id", user.id);
    // Route directly to /home — the LorieWelcomeCard there will deliver the
    // ceremonial Day 1 experience (Lorie message → Permission Slip → Assessment).
    navigate("/home");
  };

  const handleGoToDashboard = () => {
    // Go to notification screen first (screen 8)
    setScreen(8);
  };

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnimatePresence mode="wait">
        {/* Screen 0: Welcome */}
        {screen === 0 && (
          <motion.div
            key="welcome"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col items-center justify-center px-6 text-center"
          >
            <PulseAnimation />
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-8 mb-4">
              Welcome to your reset.
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-md mb-2">
              Before we show you everything, let's find out exactly where you need to begin.
            </p>
            <p className="text-muted-foreground/70 text-sm max-w-sm mb-8">
              This takes 3 minutes. Your answers shape everything you see next.
            </p>
            <Button
              onClick={goNext}
              className="w-full max-w-sm bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base py-6 rounded-xl"
            >
              I'm ready — let's go
            </Button>
            <p className="text-muted-foreground/50 text-xs mt-4">
              You can always change your answers later in settings.
            </p>
          </motion.div>
        )}

        {/* Screen 1: Name */}
        {screen === 1 && (
          <motion.div
            key="name"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col px-6 pt-16"
          >
            <button onClick={goBack} className="self-start mb-6 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <ProgressDots current={0} total={TOTAL_STEPS} />
            <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                First, what should we call you?
              </h1>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Your first name"
                className="text-center text-lg py-6 mb-8 bg-muted border-border/50"
              />
              <Button
                onClick={goNext}
                disabled={!firstName.trim()}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base py-6 rounded-xl"
              >
                Continue →
              </Button>
            </div>
          </motion.div>
        )}

        {/* Screen 2: Primary Wound */}
        {screen === 2 && (
          <motion.div
            key="wound"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col px-6 pt-16"
          >
            <button onClick={goBack} className="self-start mb-6 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <ProgressDots current={1} total={TOTAL_STEPS} />
            <div className="flex-1 flex flex-col items-center max-w-md mx-auto w-full mt-8">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
                Where do you feel most stuck right now?
              </h1>
              <p className="text-muted-foreground text-sm mb-6 text-center">
                Choose the one that hits hardest.
              </p>
              <div className="grid gap-3 w-full mb-8">
                {woundOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = primaryWound === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => setPrimaryWound(isSelected ? null : opt.key)}
                      className={`flex items-start gap-4 w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-[0_0_20px_hsl(var(--primary)/0.15)]"
                          : "border-border/40 bg-card/60 hover:border-primary/40"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{opt.label}</p>
                        <p className="text-muted-foreground text-xs mt-1 leading-relaxed">{opt.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <Button
                onClick={goNext}
                disabled={!primaryWound}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base py-6 rounded-xl"
              >
                This is me — continue →
              </Button>
            </div>
          </motion.div>
        )}

        {/* Screen 3: Duration */}
        {screen === 3 && (
          <motion.div
            key="duration"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col px-6 pt-16"
          >
            <button onClick={goBack} className="self-start mb-6 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <ProgressDots current={2} total={TOTAL_STEPS} />
            <div className="flex-1 flex flex-col items-center max-w-md mx-auto w-full mt-8">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
                How long has this been going on?
              </h1>
              <p className="text-muted-foreground text-sm mb-8 text-center">
                Be honest. This is just for you.
              </p>
              <div className="grid gap-3 w-full mb-8">
                {durationOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setStuckDuration(stuckDuration === opt ? null : opt)}
                    className={`w-full p-4 rounded-xl border-2 text-center font-medium transition-all duration-200 ${
                      stuckDuration === opt
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border/40 bg-card/60 text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <Button
                onClick={goNext}
                disabled={!stuckDuration}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base py-6 rounded-xl"
              >
                Continue →
              </Button>
            </div>
          </motion.div>
        )}

        {/* Screen 4: Tried Before */}
        {screen === 4 && (
          <motion.div
            key="tried"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col px-6 pt-16 pb-8 overflow-y-auto"
          >
            <button onClick={goBack} className="self-start mb-6 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <ProgressDots current={3} total={TOTAL_STEPS} />
            <div className="flex-1 flex flex-col items-center max-w-md mx-auto w-full mt-8">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
                What have you already tried?
              </h1>
              <p className="text-muted-foreground text-sm mb-6 text-center">
                Select all that apply.
              </p>
              <div className="flex flex-wrap gap-2 w-full mb-6">
                {triedOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => toggleTried(opt)}
                    className={`px-4 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 ${
                      triedBefore.includes(opt)
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border/40 bg-card/60 text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <p className="text-muted-foreground/70 text-sm italic text-center mb-8 leading-relaxed">
                If you've tried everything and still feel stuck — that's not a you problem.
                That's a nervous system problem. And that's exactly what we work on here.
              </p>
              <Button
                onClick={goNext}
                disabled={triedBefore.length === 0}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base py-6 rounded-xl"
              >
                Continue →
              </Button>
            </div>
          </motion.div>
        )}

        {/* Screen 5: Goal */}
        {screen === 5 && (
          <motion.div
            key="goal"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col px-6 pt-16"
          >
            <button onClick={goBack} className="self-start mb-6 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <ProgressDots current={4} total={TOTAL_STEPS} />
            <div className="flex-1 flex flex-col items-center max-w-md mx-auto w-full mt-8">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
                What does your reset look like when it works?
              </h1>
              <p className="text-muted-foreground text-sm mb-6 text-center">
                Choose the one that feels most true.
              </p>
              <div className="grid gap-3 w-full mb-8">
                {goalOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setResetGoal(resetGoal === opt ? null : opt)}
                    className={`w-full p-4 rounded-xl border-2 text-left font-medium text-sm leading-relaxed transition-all duration-200 ${
                      resetGoal === opt
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border/40 bg-card/60 text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    "{opt}"
                  </button>
                ))}
              </div>
              <Button
                onClick={() => {
                  goNext();
                  handleProcessing();
                }}
                disabled={!resetGoal}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base py-6 rounded-xl"
              >
                That's it — show me my plan →
              </Button>
            </div>
          </motion.div>
        )}

        {/* Screen 6: Processing */}
        {screen === 6 && (
          <motion.div
            key="processing"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col items-center justify-center px-6 text-center"
          >
            <ProgressDots current={5} total={TOTAL_STEPS} />
            <div className="mt-12">
              <PulseAnimation />
              <h2 className="font-serif text-xl md:text-2xl italic text-foreground mt-8 mb-3">
                Building your personal reset plan…
              </h2>
              <p className="text-muted-foreground text-sm">
                Based on your answers, we're finding exactly where to start.
              </p>
            </div>
          </motion.div>
        )}

        {/* Screen 7: Reset Plan */}
        {screen === 7 && (
          <motion.div
            key="plan"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col px-6 pt-16 pb-12 overflow-y-auto"
          >
            <div className="max-w-md mx-auto w-full">
              <ProgressDots current={6} total={TOTAL_STEPS} />
              <div className="mt-8">
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
                  {firstName}, here's where you begin.
                </h1>
                <p className="text-muted-foreground text-sm text-center mb-8">
                  Your reset plan is built around your primary focus:{" "}
                  <span className="text-primary font-semibold">
                    {woundOptions.find((w) => w.key === primaryWound)?.label}
                  </span>
                </p>

                <ResetPlanCards primaryWound={primaryWound || "wealth"} />

                <div className="border-t border-border/30 my-8" />

                <p className="text-[10px] uppercase tracking-[0.15em] text-primary font-semibold text-center mb-2">
                  Your Full Reset Toolkit
                </p>
                <p className="text-muted-foreground text-sm text-center mb-8 leading-relaxed">
                  Everything else in the app is also available to you. But start here.
                  One thing at a time. The shift happens in the doing, not the browsing.
                </p>

                <Button
                  onClick={handleGoToDashboard}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base py-6 rounded-xl mb-3"
                >
                  Continue →
                </Button>
                <p className="text-muted-foreground/50 text-xs text-center">
                  Your plan is saved. You can find it anytime under "My Reset Plan" in the navigation.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Screen 8: Notification Time */}
        {screen === 8 && (
          <motion.div
            key="notifications"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col px-6 pt-16"
          >
            <button onClick={() => setScreen(7)} className="self-start mb-6 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <ProgressDots current={7} total={TOTAL_STEPS} />
            <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
                When should we check in with you?
              </h1>
              <p className="text-muted-foreground text-sm mb-8 text-center">
                One reminder per day. No spam. Ever.
              </p>

              {notifEnabled && (
                <div className="flex items-center gap-3 mb-6">
                  <select
                    value={notifHour}
                    onChange={(e) => setNotifHour(Number(e.target.value))}
                    className="bg-muted border border-border/50 rounded-lg px-3 py-2 text-foreground text-sm"
                  >
                    {hourOptions.map((h) => (
                      <option key={h} value={h}>
                        {h === 0 ? "12" : h > 12 ? h - 12 : h}
                      </option>
                    ))}
                  </select>
                  <span className="text-foreground font-bold">:</span>
                  <select
                    value={notifMinute}
                    onChange={(e) => setNotifMinute(Number(e.target.value))}
                    className="bg-muted border border-border/50 rounded-lg px-3 py-2 text-foreground text-sm"
                  >
                    {[0, 15, 30, 45].map((m) => (
                      <option key={m} value={m}>
                        {m.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <span className="text-muted-foreground text-sm">
                    {notifHour < 12 ? "AM" : "PM"}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-8">
                <Switch
                  checked={notifEnabled}
                  onCheckedChange={setNotifEnabled}
                />
                <span className="text-sm text-foreground">Yes, remind me daily</span>
              </div>

              <Button
                onClick={handleNotificationSave}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base py-6 rounded-xl"
              >
                Set my reminder →
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
