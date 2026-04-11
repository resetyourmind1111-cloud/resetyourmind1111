import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function MonthlyResetNudge() {
  const { user } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!user) return;
    const today = new Date();
    if (today.getDate() > 7) return;

    supabase
      .from("profiles")
      .select("monthly_ceremonies_completed, subscription_tier")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (!data) return;
        if ((data as any).subscription_tier === "free") return;
        const completed = ((data as any).monthly_ceremonies_completed || {}) as Record<string, boolean>;
        const key = `${monthNames[today.getMonth()].toLowerCase()}_${today.getFullYear()}`;
        if (!completed[key]) setShow(true);
      });
  }, [user]);

  if (!show) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
      <Link to="/monthly-reset">
        <Card className="p-4 bg-[#2A1F3D] border-t-2 border-t-[#C9A84C] border-[#2A1F3D] hover:border-[#C9A84C]/40 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <span className="text-xl">🌙</span>
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#C9A84C] font-semibold">NEW THIS MONTH</p>
              <p className="text-sm font-medium text-[#F9F6F0]">{monthNames[new Date().getMonth()]} Reset Ceremony</p>
              <p className="text-xs text-[#F9F6F0]/50">Your monthly ritual is ready</p>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
