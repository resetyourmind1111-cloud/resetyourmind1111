import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { RefreshCw, Zap, BarChart3, RotateCcw } from "lucide-react";
import { TrialBackButton } from "@/components/TrialBackButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { TRAP_SLUGS } from "@/data/identityTrapData";
import { PatternProgressDashboard } from "@/components/patterns/PatternProgressDashboard";

export default function Patterns() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [primaryTrap, setPrimaryTrap] = useState<string | null>(null);
  const [hasTaken, setHasTaken] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) { navigate("/auth"); return; }
    if (!user) return;

    supabase
      .from("identity_trap_results")
      .select("primary_trap")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setPrimaryTrap(data[0].primary_trap);
          setHasTaken(true);
        }
        setLoading(false);
      });
  }, [user, isLoading, navigate]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20 md:pt-24 pb-24 md:pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <TrialBackButton fallbackPath="/home" label="Back to Home" className="mb-4" />
          {!hasTaken ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 space-y-6"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                Your patterns are not your personality.
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto">
                They are the protection strategies your nervous system learned. And they can be reset.
              </p>
              <Button
                variant="gold"
                size="lg"
                className="text-lg px-10 py-6"
                onClick={() => navigate("/patterns/quiz")}
              >
                Discover My Pattern
              </Button>
              <p className="text-xs text-muted-foreground">Takes 2 minutes</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-2">Your primary pattern</p>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">{primaryTrap}</h1>
              </div>

              <div className="grid gap-3">
                <Link to={`/patterns/${TRAP_SLUGS[primaryTrap!]}`} state={{ startAt: 7 }}>
                  <Card className="p-5 bg-card/80 border-primary/30 hover:border-primary/60 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">Do Today's Reset</p>
                        <p className="text-xs text-muted-foreground">3-minute pattern interrupt</p>
                      </div>
                    </div>
                  </Card>
                </Link>

                <Link to="/patterns/check-in">
                  <Card className="p-5 bg-card/80 border-border/50 hover:border-primary/40 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <RefreshCw className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">Daily Check-In</p>
                        <p className="text-xs text-muted-foreground">What's coming up for you?</p>
                      </div>
                    </div>
                  </Card>
                </Link>

                <a href="#progress-dashboard">
                  <Card className="p-5 bg-card/80 border-border/50 hover:border-primary/40 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">My Progress</p>
                        <p className="text-xs text-muted-foreground">Track your pattern interrupts</p>
                      </div>
                    </div>
                  </Card>
                </a>
              </div>

              <div className="text-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => navigate("/patterns/quiz")}
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Retake Quiz
                </Button>
              </div>

              <div id="progress-dashboard" className="pt-4">
                <PatternProgressDashboard />
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
