import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

interface NextStep {
  title: string;
  body: string;
  route: string;
  buttonText: string;
}

export default function WhatsNext() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [steps, setSteps] = useState<NextStep[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const { data: profile } = await supabase.from("profiles").select("full_name, whats_next_shown").eq("user_id", user.id).single();
      if (profile) {
        setFirstName((profile as any).full_name?.split(" ")[0] || "");
        if (!(profile as any).whats_next_shown) {
          await supabase.from("profiles").update({ whats_next_shown: true } as any).eq("user_id", user.id);
        }
      }

      const nextSteps: NextStep[] = [];

      // Check meditations
      const { count: meditationCount } = await supabase.from("lesson_completions").select("id", { count: "exact", head: true }).eq("user_id", user.id);
      if ((meditationCount ?? 0) >= 5) {
        nextSteps.push({ title: "Go deeper — Advanced Meditation Library", body: "You've built the habit. Now go further.", route: "/meditations", buttonText: "Open library" });
      }

      // Check identity trap modules
      const { count: trapCount } = await supabase.from("identity_trap_results").select("id", { count: "exact", head: true }).eq("user_id", user.id);
      if ((trapCount ?? 0) >= 2) {
        nextSteps.push({ title: "3-Day Trap Reset Challenges", body: "Go deeper into the pattern that showed up most.", route: "/patterns", buttonText: "Start challenge" });
      }

      // Check daily shifts
      const { count: shiftCount } = await supabase.from("daily_shifts").select("id", { count: "exact", head: true }).eq("user_id", user.id);
      if ((shiftCount ?? 0) >= 5) {
        nextSteps.push({ title: "Shadow Work Library", body: "You're already doing the reflection work. This takes it to the root.", route: "/healing-tools", buttonText: "Open library" });
      }

      // Check thermostat
      const { count: assessmentCount } = await supabase.from("assessment_results").select("id", { count: "exact", head: true }).eq("user_id", user.id);
      if ((assessmentCount ?? 0) >= 1) {
        nextSteps.push({ title: "Your Monthly Thermostat Check-In", body: "See how your score moves month by month.", route: "/assessment", buttonText: "Take check-in" });
      }

      // Default if no strong signals
      if (nextSteps.length < 3) {
        const defaults: NextStep[] = [
          { title: "Monthly Reset Ceremony", body: "A monthly ritual to anchor your transformation.", route: "/monthly-reset", buttonText: "Begin ceremony" },
          { title: "Identity Trap Deep Dive", body: "Explore the patterns that keep you stuck.", route: "/patterns", buttonText: "Explore" },
          { title: "Worth Thermostat Check-In", body: "Track your worth score over time.", route: "/assessment", buttonText: "Take check-in" },
        ];
        for (const d of defaults) {
          if (nextSteps.length >= 3) break;
          if (!nextSteps.find(s => s.route === d.route)) nextSteps.push(d);
        }
      }

      setSteps(nextSteps.slice(0, 3));
    };

    fetchData();
  }, [user]);

  return (
    <AuthenticatedLayout title="What's Next" subtitle="Based on your first 30 days">
      <div className="max-w-2xl mx-auto pb-16">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-3">
            {firstName ? `${firstName}, here's` : "Here's"} what's next for you.
          </h1>
          <p className="text-muted-foreground">Based on your first 30 days.</p>
        </motion.div>

        <div className="space-y-4 mb-8">
          {steps.map((step, i) => (
            <motion.div key={step.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="p-5 bg-card/80 border-border/50 hover:border-primary/40 transition-all">
                <h3 className="font-serif text-base font-bold text-foreground mb-1">{step.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{step.body}</p>
                <Link to={step.route}>
                  <Button size="sm" className="bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-semibold text-xs">
                    {step.buttonText} →
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>

        <p className="text-muted-foreground text-xs text-center italic">
          Everything in the app is yours. But start here. One thing at a time.
        </p>
      </div>
    </AuthenticatedLayout>
  );
}
