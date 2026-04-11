import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const dailyPrompts: Record<number, string> = {
  1: "What did you choose differently today, even in a small way?",
  2: "Where did you catch the pattern before it caught you?",
  3: "What are you no longer willing to accept?",
  4: "What felt easier today than it did last week?",
  5: "What is one thing you did this week that the old version of you wouldn't have?",
  6: "What truth did you honor today?",
  0: "What are you most proud of from this week?",
};

export function DailyShiftWidget() {
  const { user } = useAuth();
  const [response, setResponse] = useState("");
  const [saved, setSaved] = useState(false);
  const [savedText, setSavedText] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const dayOfWeek = new Date().getDay();
  const prompt = dailyPrompts[dayOfWeek];
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!user) return;
    supabase
      .from("daily_shifts" as any)
      .select("response")
      .eq("user_id", user.id)
      .eq("entry_date", today)
      .maybeSingle()
      .then(({ data }: any) => {
        if (data?.response) {
          setSaved(true);
          setSavedText(data.response);
        }
      });
  }, [user, today]);

  const handleSave = async () => {
    if (!user || !response.trim()) return;
    setSaving(true);
    await (supabase.from("daily_shifts" as any) as any).insert({
      user_id: user.id,
      entry_date: today,
      prompt,
      response: response.trim(),
    });
    setSaved(true);
    setSavedText(response.trim());
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="mb-6"
    >
      <Card className="p-5 bg-card/80 border-border/50 border-l-2 border-l-primary">
        <p className="text-[10px] uppercase tracking-[0.15em] text-primary font-semibold mb-2">
          What Shifted Today
        </p>

        <p className="font-serif text-sm italic text-foreground leading-relaxed mb-4">
          "{prompt}"
        </p>

        {saved ? (
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">{savedText}</p>
            </div>
            <p className="text-xs text-primary">Saved. ✦ That shift is real.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <Input
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Even something small counts…"
              className="bg-muted border-border/50 text-sm"
            />
            <div className="flex items-center justify-between">
              <Link
                to="/my-shifts"
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                View my shifts
              </Link>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!response.trim() || saving}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
