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
import { MirrorCard } from "@/components/trial/MirrorCard";
import { LossFrameCard } from "@/components/trial/LossFrameCard";
import { TrialDayCurriculumCard } from "@/components/trial/TrialDayCurriculumCard";
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
import { Day7RetakeCard } from "@/components/trial/Day7RetakeCard";
import { Day65CliffhangerCard } from "@/components/trial/Day65CliffhangerCard";
import { Day3AcknowledgmentCard } from "@/components/trial/Day3AcknowledgmentCard";
import { LorieWelcomeCard } from "@/components/trial/LorieWelcomeCard";
import { TrialAnthemCard } from "@/components/trial/TrialAnthemCard";
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
import { useTrialResume } from "@/hooks/useTrialResume";
import { SkeletonCard } from "@/components/ui/brand-skeleton";
import { useStreakActivity } from "@/hooks/useStreakActivity";
import { StreakGraceBanner } from "@/components/home/StreakGraceBanner";
import { StreakResetCard } from "@/components/home/StreakResetCard";
import { StreakMilestoneOverlay } from "@/components/home/StreakMilestoneOverlay";
import { Day6GiftCard } from "@/components/home/Day6GiftCard";
import { RecommendedForYouCard } from "@/components/home/RecommendedForYouCard";
import { CheckInHeroCard } from "@/components/home/CheckInHeroCard";
import { track } from "@/lib/analytics";
import { isActivated } from "@/lib/activation";
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
  const { isTrialActive, trialDay, isLoading: trialLoading } = useTrialStatus();
  const { nextAction, step: trialStep, loading: resumeLoading } = useTrialResume(isTrialActive, trialDay);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [lastModule, setLastModule] = useState<string | null>(null);
  const [tapping, setTapping] = useState<number | null>(null);
  const [showWelcomeFlow, setShowWelcomeFlow] = useState(false);
  const [activated, setActivated] = useState<boolean | null>(null);
  // Retention: streak grace day + reset detection
  const {
    streak: liveStreak,
    graceActivated,
    streakReset: streakWasReset,
    dismissGrace,
    dismissReset,
  } = useStreakActivity();

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

    // Activation check — drives the hero "first action" card visibility.
    isActivated(user.id).then(setActivated);
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

    // First-action tracking. We intentionally fire on every check-in so we can
    // compute both "first ever" and ongoing engagement downstream.
    track("home_first_action", { state: option.label, module: option.module, was_activated: !!activated });

    navigate(`/emotional-surgery?module=${index}`);
  };


  if (isLoading || trialLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20 md:pt-24 pb-24 md:pb-16">
          <div className="container mx-auto px-4 md:px-6 max-w-2xl">
            <div className="space-y-4" aria-busy="true" aria-label="Loading your dashboard">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!user) return null;

  const isReturningTrialUser = isTrialActive && Math.min(trialDay + 1, 7) > 1;
  const shouldHoldTrialContent = isReturningTrialUser && resumeLoading;

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
          {/* Retention: streak grace + reset notices (top of dashboard) */}
          <StreakGraceBanner show={graceActivated} onDismiss={dismissGrace} />
          <StreakResetCard show={streakWasReset} onDismiss={dismissReset} />

          {/*
            Activation hero — one obvious first action above the fold for
            free/trial users who haven't yet taken any meaningful action.
            Collapses (returns null) once user has activated.
          */}
          {activated === false && (
            <CheckInHeroCard
              firstName={firstName}
              options={stateOptions}
              onSelect={handleStateSelect}
              disabled={tapping !== null}
            />
          )}


          {/* Day 6 Surprise Unlock (trial users only, fires once) — conversion-critical */}
          <Day6GiftCard trialDay={trialDay} isTrialActive={isTrialActive} />

          {/* Day 3 Acknowledgment Card — conversion-critical (always show during trial) */}
          {!shouldHoldTrialContent && <Day3AcknowledgmentCard />}

          {/* Lorie's personal welcome — shows on Day 1 of trial AND for paid users until dismissed */}
          <LorieWelcomeCard />

          {/* Paid-only: Welcome Back, Recommended For You */}
          {!isTrialActive && (
            <>
              {shouldHoldTrialContent ? (
                <Card className="mb-6 p-6 border-primary/20 bg-card/70">
                  <div className="h-3 w-24 rounded-full bg-muted animate-pulse mb-3" />
                  <div className="h-6 w-56 rounded-md bg-muted animate-pulse mb-2" />
                  <div className="h-4 w-40 rounded-md bg-muted animate-pulse mb-4" />
                  <div className="h-10 w-56 rounded-xl bg-muted animate-pulse" />
                </Card>
              ) : (
                <WelcomeBackCard loading={resumeLoading} nextAction={nextAction} />
              )}
              {!shouldHoldTrialContent && <RecommendedForYouCard />}
            </>
          )}

          {/* Header */}
          {!isReturningTrialUser && (
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
          )}

          {/* ===== TRIAL USER: Focused 5-card experience (conversion-optimized) ===== */}
          {isTrialActive && (
            <>
              {shouldHoldTrialContent ? (
                <Card className="mb-6 p-5 border-border/50 bg-card/70">
                  <div className="h-2 w-full rounded-full bg-muted animate-pulse mb-4" />
                  <div className="h-3 w-28 rounded-full bg-muted animate-pulse mb-3" />
                  <div className="h-5 w-52 rounded-md bg-muted animate-pulse mb-2" />
                  <div className="h-4 w-full rounded-md bg-muted animate-pulse mb-2" />
                  <div className="h-10 w-full rounded-xl bg-muted animate-pulse" />
                </Card>
              ) : (
                /* 1. Day X of 7 progress bar */
                <TrialJourneyBar loading={resumeLoading} step={trialStep} />
              )}

              {/* Day 7 retake invitation — first card under the journey bar on Day 7 */}
              {!shouldHoldTrialContent && <Day7RetakeCard />}

              {/* Day 6.5 cliffhanger — between Day 6 gift and Day 7 reveal */}
              {!shouldHoldTrialContent && <Day65CliffhangerCard />}

              {/* Day 6 Loss Frame — after the cliffhanger, before tomorrow */}
              {!shouldHoldTrialContent && <LossFrameCard />}

              {!shouldHoldTrialContent && (
                <>
                  {/* 2. Day-specific themed curriculum card (Days 1–7) */}
                  <TrialDayCurriculumCard />

                  {/* Day 4/5 Mirror Card — their own words back at them */}
                  <MirrorCard />

                  {/* 3. Daily Permission Slip */}
                  <div className="mb-6">
                    <DailyPermissionSlipCard />
                  </div>

                  {/* 3b. Reset Anthem — replayable any day during trial */}
                  <TrialAnthemCard />

                  {/* 4. Visual Reset Map — proof of progress */}
                  <div className="mb-6">
                    <VisualResetMap />
                  </div>

                  {/* 5. Single soft upgrade CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6"
                  >
                    <Link to="/upgrade">
                      <Card className="p-6 bg-[#06060e] border-2 border-[#C9A84C]/40 hover:border-[#C9A84C]/70 transition-all cursor-pointer text-center">
                        <p className="font-serif text-lg md:text-xl font-bold text-[#F9F6F0] mb-3">
                          Your full reset is one step away.
                        </p>
                        <Button
                          className="bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-serif font-semibold rounded-xl"
                        >
                          See what's waiting →
                        </Button>
                      </Card>
                    </Link>
                  </motion.div>

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

              {/* Long-term milestone cards replaced by StreakMilestoneOverlay (mounted at root) */}

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

              {/* Streak Card — uses live streak from grace-aware hook */}
              <StreakCard
                streak={liveStreak || streak}
                totalSessions={totalSessions}
                longestStreak={Math.max(longestStreak, liveStreak || 0)}
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
      {/* Streak milestone full-screen celebration (7/14/21/30/60/90/111) */}
      <StreakMilestoneOverlay streak={liveStreak || streak} />
    </div>
  );
}
