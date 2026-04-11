import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

export function MonthlyThermostatNudge() {
  const { user } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!user) return;
    const today = new Date();
    if (today.getDate() > 7) return; // Only show first 7 days of month

    supabase
      .from("profiles")
      .select("last_thermostat_date, subscription_tier")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (!data) return;
        const tier = (data as any).subscription_tier;
        if (tier === "free") return;
        
        const lastDate = (data as any).last_thermostat_date;
        if (!lastDate) {
          setShow(true);
          return;
        }
        const daysSince = Math.floor((Date.now() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24));
        if (daysSince > 25) setShow(true);
      });
  }, [user]);

  if (!show) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
      <Card className="p-5 bg-card/80 border-l-2 border-l-[#C9A84C] border-border/50">
        <p className="text-[10px] uppercase tracking-[0.15em] text-[#C9A84C] font-semibold mb-1">MONTHLY THERMOSTAT CHECK</p>
        <h3 className="font-serif text-base font-bold text-foreground mb-1">Where is your thermostat set this month?</h3>
        <p className="text-muted-foreground text-sm mb-3">Track your growth. See how far you've come.</p>
        <Link to="/assessment">
          <Button size="sm" className="bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-semibold text-xs">
            Take my monthly check-in →
          </Button>
        </Link>
        <p className="text-muted-foreground text-[10px] mt-2">Takes 3 minutes. Your results are saved.</p>
      </Card>
    </motion.div>
  );
}
