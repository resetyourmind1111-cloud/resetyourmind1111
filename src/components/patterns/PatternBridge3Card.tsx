import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { TRAP_SLUGS } from "@/data/identityTrapData";

export function PatternBridge3Card() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trapSlug, setTrapSlug] = useState<string | null>(null);
  const [hasQuiz, setHasQuiz] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("identity_trap_results")
      .select("primary_trap")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setHasQuiz(true);
          setTrapSlug(TRAP_SLUGS[data[0].primary_trap] || null);
        }
      });
  }, [user]);

  const handleTap = () => {
    if (hasQuiz && trapSlug) {
      navigate(`/patterns/${trapSlug}`, { state: { startAt: 7 } });
    } else {
      navigate("/patterns/quiz");
    }
  };

  return (
    <div className="p-5 rounded-xl border border-[#C9A84C]/30 bg-[#2A1F3D]">
      <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold mb-2">
        While You Have Access
      </p>
      <h3 className="font-serif text-lg font-bold text-[#F9F6F0] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        You've completed Day 2. Now meet the pattern behind it.
      </h3>
      <p className="text-sm text-[#F9F6F0]/60 mb-4 leading-relaxed">
        The 30-Day Experience shows you what to reset. Your Identity Pattern shows you why it keeps coming back. Before your preview ends, do your first Pattern Reset.
      </p>
      <Button variant="gold" className="w-full" onClick={handleTap}>
        Start My Pattern Reset
      </Button>
      <p className="text-xs text-[#F9F6F0]/40 text-center mt-2">Free during your 7-day experience</p>
    </div>
  );
}
