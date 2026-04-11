import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ReflectionData {
  eyebrow: string;
  prompt: string;
  subtext: string;
  continueText: string;
  dayNumber: number;
}

const reflections: Record<number, ReflectionData> = {
  7: {
    eyebrow: "WEEK 1 REFLECTION",
    prompt: "Compare where you were on Day 1\nto where you are right now.\n\nWhat's different —\neven something small?",
    subtext: "There are no wrong answers. Write what's true.",
    continueText: "Continue to Day 8 →",
    dayNumber: 7,
  },
  14: {
    eyebrow: "WEEK 2 REFLECTION",
    prompt: "What pattern have you interrupted\nmost this week?\n\nWhat does that tell you\nabout who you're becoming?",
    subtext: "There are no wrong answers. Write what's true.",
    continueText: "Continue to Day 15 →",
    dayNumber: 14,
  },
  21: {
    eyebrow: "WEEK 3 REFLECTION",
    prompt: "What are you no longer\nwilling to go back to?\n\nName it. Claim it.",
    subtext: "There are no wrong answers. Write what's true.",
    continueText: "Continue to Day 22 →",
    dayNumber: 21,
  },
  30: {
    eyebrow: "YOUR RESET REFLECTION",
    prompt: "Who were you on Day 1?\n\nWho are you now?\n\nWhat did this 30 days\nshow you about yourself?",
    subtext: "There are no wrong answers. Write what's true.",
    continueText: "See my full journey →",
    dayNumber: 30,
  },
};

interface WeeklyReflectionScreenProps {
  dayNumber: number;
  onContinue: () => void;
}

export function WeeklyReflectionScreen({ dayNumber, onContinue }: WeeklyReflectionScreenProps) {
  const { user } = useAuth();
  const [response, setResponse] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const data = reflections[dayNumber];
  if (!data) return null;

  const handleSave = async () => {
    if (!user || !response.trim()) return;
    setSaving(true);
    await (supabase.from("daily_shifts" as any) as any).insert({
      user_id: user.id,
      entry_date: new Date().toISOString().split("T")[0],
      prompt: data.prompt.replace(/\n/g, " "),
      response: response.trim(),
      prompt_type: "weekly_reflection",
      day_number: dayNumber,
    });
    setSaved(true);
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[70] bg-[#06060e] flex items-center justify-center p-6 overflow-y-auto"
    >
      <div className="max-w-md w-full text-center space-y-6">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] font-semibold">
          {data.eyebrow}
        </p>

        <h2 className="font-serif text-xl md:text-2xl italic text-[#F9F6F0] leading-relaxed whitespace-pre-line">
          {data.prompt}
        </h2>

        <p className="text-[#F9F6F0]/40 text-xs">
          {data.subtext}
        </p>

        <Textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Write what's true..."
          className="min-h-[120px] bg-[#F9F6F0]/5 border-[#C9A84C]/20 text-[#F9F6F0] placeholder:text-[#F9F6F0]/30"
        />

        <div className="space-y-3">
          {!saved ? (
            <Button
              onClick={handleSave}
              disabled={!response.trim() || saving}
              className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-semibold"
            >
              {saving ? "Saving..." : "Save my reflection"}
            </Button>
          ) : (
            <p className="text-[#C9A84C] text-sm">✦ Reflection saved.</p>
          )}

          <Button
            onClick={onContinue}
            variant="outline"
            className="w-full border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C]/10"
          >
            {data.continueText}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
