import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { BottomNav } from "@/components/BottomNav";
import { PastDueBanner } from "@/components/PastDueBanner";
import { TrialWelcomeFlow } from "@/components/trial/TrialWelcomeFlow";
import { TrialWelcomeBanner } from "@/components/trial/TrialWelcomeBanner";
import { DailyFeaturedCard } from "@/components/trial/DailyFeaturedCard";
import { DailyPermissionSlipCard } from "@/components/trial/DailyPermissionSlipCard";
import { Day7BottomBanner } from "@/components/trial/Day7BottomBanner";
import { TrialDayBanner } from "@/components/TrialDayBanner";
import { TrialExpiredOverlay } from "@/components/TrialExpiredOverlay";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { JourneyCheckinCard } from "@/components/journey/JourneyCheckinCard";
import { VisualResetMap } from "@/components/home/VisualResetMap";
import { TodaysResetToolCard } from "@/components/home/TodaysResetToolCard";
import { ResetPlanWidget } from "@/components/home/ResetPlanWidget";
import { TrialJourneyBar } from "@/components/trial/TrialJourneyBar";
import { Day7CompletionModal } from "@/components/trial/Day7CompletionModal";
import { Day3AcknowledgmentCard } from "@/components/trial/Day3AcknowledgmentCard";
import { LorieWelcomeCard } from "@/components/trial/LorieWelcomeCard";
import { DailyShiftWidget } from "@/components/home/DailyShiftWidget";
import { LongTermMilestoneCard } from "@/components/home/LongTermMilestoneCard";
import { MonthlyThermostatNudge } from "@/components/home/MonthlyThermostatNudge";
import { MonthlyResetNudge } from "@/components/home/MonthlyResetNudge";
import { DailySurpriseCard } from "@/components/home/DailySurpriseCard";
import { StreakCard } from "@/components/home/StreakCard";
import { AiCheckinCard } from "@/components/home/AiCheckinCard";
import { TransformationCard } from "@/components/home/TransformationCard";
import { OraclePreviewCard } from "@/components/home/OraclePreviewCard";
import { WelcomeBackCard } from "@/components/home/WelcomeBackCard";
const stateOptions = [
  { label: "I feel overwhelmed", emoji: "🌊", module: "Recognition" },
  { label: "I feel emotional", emoji: "💧", module: "Release" },
  { label: "I feel blank", emoji: "🌫️", module: "The Quiet Phase" },
  { label: "I feel clear", emoji: "☀️", module: "Recalibration" },
  { label: "I feel activated", emoji: "⚡", module: "Embodiment" },
];

export default function Home() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { isTrialActive, trialDay, onboardingReason, isLoading: trialLoading } = useTrialStatus();
  const [firstName, setFirstName] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [lastModule, setLastModule] = useState<string | null>(null);
  const [tapping, setTapping] = useState<number | null>(null);
  const [showWelcomeFlow, setShowWelcomeFlow] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
      return;
    }
    if (!user) return;

    supabase
      .from("profiles")
      .select("full_name, current_streak, onboarding_reason, onboarding_complete, total_sessions, longest_streak")
      .eq("user_id", user.id)
      .single()
      .then(async ({ data }) => {
        if (data) {
          setFirstName((data as any).full_name?.split(" ")[0] || null);
          setStreak((data as any).current_streak || 0);
          setTotalSessions(((data as any).total_sessions || 0) + 1);
          setLongestStreak(Math.max((data as any).longest_streak || 0, (data as any).current_streak || 0));

          // Increment total_sessions and update longest_streak
          const newTotal = ((data as any).total_sessions || 0) + 1;
          const newLongest = Math.max((data as any).longest_streak || 0, (data as any).current_streak || 0);
          await supabase.from("profiles").update({
            total_sessions: newTotal,
            longest_streak: newLongest,
          } as any).eq("user_id", user.id);
          // Redirect to personalized onboarding if not complete
          if (!(data as any).onboarding_complete) {
            navigate("/onboarding");
            return;
          }
          // Legacy: show welcome flow if no onboarding_reason set yet
          if (!(data as any).onboarding_reason) {
            setShowWelcomeFlow(true);
          }
        }
      });

    supabase
      .from("user_checkins")
      .select("routed_to_module")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data?.[0]) setLastModule((data[0] as any).routed_to_module);
      });
  }, [user, isLoading, navigate]);

  const handleStateSelect = async (index: number) => {
    if (!user) return;
    setTapping(index);
    const option = stateOptions[index];

    await supabase.from("user_checkins").insert({
      user_id: user.id,
      daily_state: option.label,
      routed_to_module: option.module,
    });

    navigate(`/emotional-surgery?module=${index}`);
  };

  if (isLoading || trialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  if (showWelcomeFlow) {
    return (
      <TrialWelcomeFlow onComplete={() => setShowWelcomeFlow(false)} />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <PastDueBanner />
      <TrialWelcomeBanner />
      <TrialDayBanner />
      <TrialExpiredOverlay />
      <Day7CompletionModal />
      <main className="pt-20 md:pt-24 pb-24 md:pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          {/* Lorie Welcome Card (Day 1 only) */}
          <LorieWelcomeCard />

          {/* Welcome Back Card (Day 2+ trial users) */}
          <WelcomeBackCard />

          {/* Day 3 Acknowledgment Card */}
          <Day3AcknowledgmentCard />

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              Welcome back{firstName ? `, ${firstName}` : ""}.
              {isTrialActive ? "" : <><br />Where are you today?</>}
            </h1>
            {isTrialActive ? (
              <p className="text-muted-foreground text-base md:text-lg">
                Pick up where you left off. Your guided reset continues.
              </p>
            ) : (
              <p className="text-muted-foreground text-base md:text-lg">
                Your transformation is not linear. Let's meet you where you are.
              </p>
            )}
          </motion.div>

          {/* ===== TRIAL USER: Focused guided experience ===== */}
          {isTrialActive && (
            <>
              {/* Trial Journey Bar — primary guided action */}
              <TrialJourneyBar />

              {/* Oracle Preview Card */}
              <OraclePreviewCard />

              {/* Daily Featured Card */}
              <div className="mb-6 space-y-4">
                <DailyFeaturedCard />
                <DailyPermissionSlipCard />
              </div>

              {/* Daily Surprise Card */}
              <DailySurpriseCard />

              {/* AI Proactive Check-in */}
              <AiCheckinCard />

              {/* Daily Shift Widget */}
              <DailyShiftWidget />

              {/* Reset Plan Widget */}
              <ResetPlanWidget />

              {/* Upgrade seed */}
              {trialDay >= 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-6 text-center"
                >
                  <p className="text-muted-foreground text-xs">
                    Want to take this further? Your full reset is one step away.{" "}
                    <Link to="/upgrade" className="text-primary underline">See options</Link>
                  </p>
                </motion.div>
              )}

              {/* Day 1 bottom guidance text */}
              {trialDay <= 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-8 mb-4 text-center"
                >
                  <p className="text-muted-foreground/60 text-xs leading-relaxed">
                    More tools unlock as your reset progresses.<br />
                    Start with what's above — it's where the shift begins.
                  </p>
                </motion.div>
              )}
            </>
          )}

          {/* ===== PAID USER: Full dashboard experience ===== */}
          {!isTrialActive && (
            <>
              {/* Daily Surprise Card */}
              <DailySurpriseCard />

              {/* AI Proactive Check-in */}
              <AiCheckinCard />

              {/* Trial Journey Bar */}
              <TrialJourneyBar />

              {/* Oracle Preview Card */}
              <OraclePreviewCard />

              {/* Long-term Milestone Cards (Day 60/90/180) */}
              <LongTermMilestoneCard />

              {/* Monthly Reset Nudge */}
              <MonthlyResetNudge />

              {/* Monthly Thermostat Nudge */}
              <MonthlyThermostatNudge />

              {/* Reset Plan Widget */}
              <ResetPlanWidget />

              {/* Daily Shift Widget */}
              <DailyShiftWidget />

              {/* Visual Reset Map */}
              <VisualResetMap />

              {/* Today's Reset Tool */}
              <TodaysResetToolCard />

              {/* My Patterns Quick Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <Link to="/patterns">
                  <Card className="p-5 bg-card/80 border-border/50 hover:border-primary/40 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                        <RefreshCw className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-primary font-semibold">My Patterns</p>
                        <p className="text-sm text-muted-foreground">Discover your pattern</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>

              {/* State Selector */}
              <div className="grid gap-3 mb-8">
                {stateOptions.map((option, i) => (
                  <motion.button
                    key={option.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleStateSelect(i)}
                    disabled={tapping !== null}
                    className={`
                      flex items-center gap-4 w-full p-5 rounded-xl border-2 text-left transition-all duration-200
                      border-secondary/40 bg-card/60 hover:border-primary/60 hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)]
                      active:border-primary active:shadow-[0_0_30px_hsl(var(--primary)/0.25)]
                      disabled:opacity-60
                    `}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="font-medium text-foreground text-base">{option.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Support Flow Entry */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mb-8"
              >
                <Link to="/support-flow">
                  <Button className="w-full bg-[#3D1A6E] text-primary hover:bg-[#3D1A6E]/90 font-serif font-semibold text-base py-6 rounded-xl">
                    What Do You Need Right Now?
                  </Button>
                </Link>
              </motion.div>

              {/* Journey Check-in Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.47 }}
                className="mb-8"
              >
                <JourneyCheckinCard />
              </motion.div>

              {/* Streak Card */}
              <StreakCard
                streak={streak}
                totalSessions={totalSessions}
                longestStreak={longestStreak}
                lastModule={lastModule}
              />

              {/* Transformation Card */}
              <div className="mt-6">
                <TransformationCard />
              </div>
            </>
          )}
        </div>
      </main>
      <Day7BottomBanner />
      <BottomNav />
    </div>
  );
}
