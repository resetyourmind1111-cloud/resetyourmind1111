import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ToolOption {
  title: string;
  description: string;
  route?: string;
  journalPrompt?: string;
  journalTags?: string[];
}

interface StateConfig {
  header: string;
  subtext: string;
  tools: ToolOption[];
}

const stateConfigs: Record<string, StateConfig> = {
  stuck: {
    header: "Let's get you unstuck.",
    subtext: "You don't need to figure this out alone.",
    tools: [
      { title: "Calm your body in 2 minutes", description: "Your nervous system is signaling. Let's reset it.", route: "/healing-tools/nervous-system-diagnostic" },
      { title: "Understand what's really going on", description: "Stuck usually means something wants your attention.", route: "/module/recognition" },
      { title: "Rewrite the story keeping you frozen", description: "The belief under the stuck feeling is the real block.", route: "/healing-tools/limiting-belief-rewriter" },
    ],
  },
  avoiding: {
    header: "Avoidance is information.",
    subtext: "Let's find out what it's protecting you from.",
    tools: [
      { title: "Name what you're resisting", description: "Resistance always points to something that matters.", journalPrompt: "What am I avoiding right now, and what am I afraid will happen if I face it?", journalTags: ["support_flow", "avoidance"] },
      { title: "Release the weight of it", description: "You don't have to carry this anymore.", route: "/module/release" },
      { title: "Make one small decision", description: "Avoidance ends with one small action, not a big one.", route: "/module/recalibration" },
    ],
  },
  overthinking: {
    header: "Your mind is working overtime.",
    subtext: "Let's give it somewhere to land.",
    tools: [
      { title: "Breathe first", description: "You can't think your way out of overthinking. Breathe your way out.", route: "/healing-tools/somatic-breathing" },
      { title: "Write it all out", description: "Get it out of your head and onto the page.", journalPrompt: "What is the thought that keeps looping? Write it out completely — don't edit yourself.", journalTags: ["support_flow", "overthinking"] },
      { title: "Find what's true right now", description: "Most overthinking is about the future. Come back to now.", route: "/module/quiet-phase" },
    ],
  },
  triggered: {
    header: "Something activated you.",
    subtext: "That's not a flaw. That's data.",
    tools: [
      { title: "Regulate your body first", description: "You can't process what you can't calm.", route: "/healing-tools/nervous-system-diagnostic" },
      { title: "Trace the trigger", description: "Find the root, not just the reaction.", route: "/module/recognition" },
      { title: "Release what got stirred up", description: "Triggered means something old got touched. Let's move it.", route: "/module/release" },
    ],
  },
  abundance: {
    header: "Abundance starts in the mind.",
    subtext: "Let's find out what's blocking the flow.",
    tools: [
      { title: "Audit your money story", description: "Your income ceiling is set by your subconscious, not your skills.", route: "/healing-tools/money-story-audit" },
      { title: "Rewrite a limiting belief about money", description: "The belief is the block. Let's remove it.", route: "/healing-tools/limiting-belief-rewriter" },
      { title: "Log evidence of abundance", description: "Train your brain to see what's already flowing.", route: "/healing-tools/abundance-evidence-log" },
    ],
  },
  aligned: {
    header: "Alignment is available right now.",
    subtext: "You don't have to earn it. You just have to choose it.",
    tools: [
      { title: "Reset your nervous system", description: "Alignment lives in a regulated body.", route: "/healing-tools/nervous-system-diagnostic" },
      { title: "Pull an oracle card", description: "Let your subconscious speak.", route: "/oracle" },
      { title: "Ask your highest self", description: "You already know. Let's access it.", journalPrompt: "If I were fully aligned right now, what would I think, feel, and do differently?", journalTags: ["support_flow", "alignment"] },
    ],
  },
};

export default function SupportFlowCategory() {
  const { state } = useParams<{ state: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeJournal, setActiveJournal] = useState<ToolOption | null>(null);
  const [journalText, setJournalText] = useState("");
  const [saving, setSaving] = useState(false);

  const config = state ? stateConfigs[state] : null;
  if (!config) {
    navigate("/support-flow");
    return null;
  }

  const handleToolStart = (tool: ToolOption) => {
    if (tool.journalPrompt) {
      setActiveJournal(tool);
    } else if (tool.route) {
      // Store flow context for completion screen
      sessionStorage.setItem("support_flow_state", state!);
      sessionStorage.setItem("support_flow_tool", tool.title);
      navigate(tool.route);
    }
  };

  const handleJournalSave = async () => {
    if (!user || !journalText.trim()) return;
    setSaving(true);

    await supabase.from("healing_tool_entries").insert({
      user_id: user.id,
      tool_id: "support-flow-journal",
      entry_data: {
        prompt: activeJournal!.journalPrompt,
        response: journalText,
        tags: activeJournal!.journalTags,
        state,
      },
    });

    // Store flow context
    sessionStorage.setItem("support_flow_state", state!);
    sessionStorage.setItem("support_flow_tool", activeJournal!.title);

    setSaving(false);
    toast.success("Saved");
    navigate("/support-flow/complete");
  };

  // Inline journal screen
  if (activeJournal) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20 md:pt-24 pb-24 md:pb-16">
          <div className="container mx-auto px-4 md:px-6 max-w-xl">
            <button onClick={() => setActiveJournal(null)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <h2 className="font-serif text-2xl font-bold text-foreground text-center">{activeJournal.title}</h2>

              <p className="text-center text-[#C9A84C] text-lg italic leading-relaxed px-4">
                "{activeJournal.journalPrompt}"
              </p>

              <Textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="Start writing..."
                className="min-h-[200px] bg-card/60 border-border/50 text-foreground text-base leading-relaxed resize-none"
              />

              <Button
                onClick={handleJournalSave}
                disabled={!journalText.trim() || saving}
                className="w-full bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-semibold py-6 text-lg rounded-xl"
              >
                {saving ? "Saving..." : "Save & Continue"}
              </Button>
            </motion.div>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20 md:pt-24 pb-24 md:pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <button onClick={() => navigate("/support-flow")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">{config.header}</h1>
            <p className="text-muted-foreground">{config.subtext}</p>
          </motion.div>

          <div className="space-y-4">
            {config.tools.map((tool, i) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="rounded-2xl border border-border/50 bg-card/60 p-5 space-y-3">
                  <div className="border-l-4 border-l-[#C9A84C] pl-4">
                    <h3 className="font-bold text-foreground text-lg">{tool.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{tool.description}</p>
                  </div>
                  <Button
                    onClick={() => handleToolStart(tool)}
                    className="bg-[#3D1A6E] text-[#C9A84C] hover:bg-[#3D1A6E]/80 font-semibold rounded-xl min-h-[48px]"
                  >
                    Start here →
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
