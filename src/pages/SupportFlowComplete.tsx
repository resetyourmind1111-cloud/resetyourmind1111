import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Home, ArrowRight } from "lucide-react";

const outcomes = [
  { emoji: "😌", label: "Better", value: "better" },
  { emoji: "😐", label: "Same", value: "same" },
  { emoji: "😔", label: "Still processing", value: "still_processing" },
] as const;

export default function SupportFlowComplete() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const entryState = sessionStorage.getItem("support_flow_state") || "unknown";
  const toolUsed = sessionStorage.getItem("support_flow_tool") || "unknown";

  const handleOutcome = async (value: string) => {
    if (!user || saved) return;
    setSelected(value);

    await supabase.from("support_flow_outcomes" as any).insert({
      user_id: user.id,
      entry_state: entryState,
      tool_used: toolUsed,
      outcome: value,
    } as any);

    setSaved(true);
    toast.success("Thank you for checking in.");

    // Clean up
    sessionStorage.removeItem("support_flow_state");
    sessionStorage.removeItem("support_flow_tool");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20 md:pt-24 pb-24 md:pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
            {/* Header */}
            <div className="space-y-3">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#C9A84C]">
                You just shifted your state.
              </h1>
              <p className="text-muted-foreground text-lg">
                That took less than 5 minutes. That's what a reset looks like.
              </p>
            </div>

            {/* Feeling check */}
            <div className="space-y-3 pt-4">
              <p className="text-foreground font-medium">How do you feel now?</p>
              <div className="flex gap-3 justify-center">
                {outcomes.map((o) => (
                  <motion.button
                    key={o.value}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOutcome(o.value)}
                    disabled={saved}
                    className={`flex flex-col items-center gap-1 px-5 py-4 rounded-2xl border-2 transition-all min-w-[90px] ${
                      selected === o.value
                        ? "border-[#C9A84C] bg-[#C9A84C]/10"
                        : "border-border/50 bg-card/60 hover:border-[#C9A84C]/40"
                    } ${saved && selected !== o.value ? "opacity-40" : ""}`}
                  >
                    <span className="text-2xl">{o.emoji}</span>
                    <span className="text-xs text-muted-foreground">{o.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Next step */}
            <div className="space-y-3 pt-6">
              <p className="text-foreground font-medium text-sm">Take one small step:</p>
              <div className="grid grid-cols-1 gap-3">
                <Card
                  className="p-5 bg-card/60 border-border/50 hover:border-[#C9A84C]/40 cursor-pointer transition-all"
                  onClick={() => navigate("/home")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 flex items-center justify-center shrink-0">
                      <Home className="w-5 h-5 text-[#C9A84C]" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">Go to Today's Reset</p>
                      <p className="text-xs text-muted-foreground">Start fresh from your Home screen</p>
                    </div>
                  </div>
                </Card>

                <Card
                  className="p-5 bg-card/60 border-border/50 hover:border-[#3D1A6E]/60 cursor-pointer transition-all"
                  onClick={() => navigate("/emotional-surgery")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#3D1A6E]/15 flex items-center justify-center shrink-0">
                      <ArrowRight className="w-5 h-5 text-[#3D1A6E]" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">Continue My Phase</p>
                      <p className="text-xs text-muted-foreground">Pick up where you left off</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
