import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { BottomNav } from "@/components/BottomNav";
import { PastDueBanner } from "@/components/PastDueBanner";

const stateOptions = [
  { label: "I feel overwhelmed", emoji: "🌊", module: "Recognition" },
  { label: "I feel emotional", emoji: "💧", module: "Release" },
  { label: "I feel blank", emoji: "🌫️", module: "The Quiet Phase" },
  { label: "I feel clear", emoji: "☀️", module: "Recalibration" },
  { label: "I feel activated", emoji: "⚡", module: "Embodiment" },
];

const dailyAffirmations = [
  "Nothing is wrong. Something is integrating.",
  "What would someone who feels deeply loved do right now?",
  "Today is a new chance to choose yourself.",
  "I am not lost. I am between identities.",
  "Stop settling for crumbs. Choose celebration.",
  "I am safe in this space. I am becoming in this space.",
  "Transformation is what you do consistently.",
];

export default function Home() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [lastModule, setLastModule] = useState<string | null>(null);
  const [tapping, setTapping] = useState<number | null>(null);

  const dayOfWeek = new Date().getDay();
  const affirmation = dailyAffirmations[dayOfWeek];

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
      return;
    }
    if (!user) return;

    // Fetch profile
    supabase
      .from("profiles")
      .select("full_name, current_streak")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setFirstName(data.full_name?.split(" ")[0] || null);
          setStreak(data.current_streak || 0);
        }
      });

    // Fetch last check-in module
    supabase
      .from("user_checkins" as any)
      .select("routed_to_module")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data }: any) => {
        if (data?.[0]) setLastModule(data[0].routed_to_module);
      });
  }, [user, isLoading, navigate]);

  const handleStateSelect = async (index: number) => {
    if (!user) return;
    setTapping(index);
    const option = stateOptions[index];

    // Save to Supabase
    await supabase.from("user_checkins" as any).insert({
      user_id: user.id,
      daily_state: option.label,
      routed_to_module: option.module,
    } as any);

    // Navigate to Emotional Surgery with the track index
    // Map modules to track indices: the ES page uses track index from the emotionalSurgeryTracks array
    navigate(`/emotional-surgery?module=${index}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <PastDueBanner />
      <main className="pt-20 md:pt-24 pb-24 md:pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              Welcome back{firstName ? `, ${firstName}` : ""}. <br />
              Where are you today?
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Your transformation is not linear. Let's meet you where you are.
            </p>
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
              <Button className="w-full bg-[#3D1A6E] text-[#C9A84C] hover:bg-[#3D1A6E]/90 font-serif font-semibold text-base py-6 rounded-xl">
                What Do You Need Right Now?
              </Button>
            </Link>
          </motion.div>

          {/* Daily Snapshot Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-5 bg-card/80 border-border/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {streak > 0 ? `${streak}-day streak` : "Start your streak today"}
                  </p>
                  {lastModule && (
                    <p className="text-xs text-muted-foreground">
                      Last module: {lastModule}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-2 pt-3 border-t border-border/50">
                <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  "{affirmation}"
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
