import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ChevronRight, Sparkles, Check, Wind, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

type Category = "All" | "Mindset" | "Emotional" | "Abundance" | "Relationships" | "Nervous System" | "Shadow Work";

const categories: Category[] = ["All", "Mindset", "Emotional", "Abundance", "Relationships", "Nervous System", "Shadow Work"];

interface ToolDef {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: Category;
  /** route to existing tool page */
  route?: string;
  /** if inline multi-step journal */
  steps?: string[];
  tags?: string[];
  /** special types */
  variant?: "manifestation" | "nervous-system" | "evidence-log";
}

const tools: ToolDef[] = [
  {
    id: "limiting-belief-rewriter",
    name: "Limiting Belief Rewriter",
    icon: "🔄",
    description: "Identify the thought. Rewrite the story. Reclaim the truth.",
    category: "Mindset",
    route: "/healing-tools/limiting-belief-rewriter",
  },
  {
    id: "money-story-audit",
    name: "Money Story Audit",
    icon: "💰",
    description: "Your relationship with money started long before your first paycheck.",
    category: "Abundance",
    route: "/healing-tools/money-story-audit",
  },
  {
    id: "boundary-builder",
    name: "Boundary Builder",
    icon: "🛡️",
    description: "Boundaries are not walls. They are the blueprint for how you deserve to be treated.",
    category: "Relationships",
    route: "/healing-tools/boundary-builder",
  },
  {
    id: "manifestation-tracker",
    name: "Manifestation Tracker",
    icon: "🌟",
    description: "Track what you are calling in. Celebrate when it arrives.",
    category: "Abundance",
    route: "/healing-tools/manifestation-tracker",
  },
  {
    id: "nervous-system-reset",
    name: "Nervous System Reset",
    icon: "🧠",
    description: "Regulation before transformation. Always.",
    category: "Nervous System",
    variant: "nervous-system",
  },
  {
    id: "abundance-evidence-log",
    name: "Abundance Evidence Log",
    icon: "✨",
    description: "Your brain looks for what you train it to find. Train it to find abundance.",
    category: "Abundance",
    route: "/healing-tools/abundance-evidence-log",
  },
];

const shadowTools = [
  { name: "Shadow Integration Journal", icon: "🌑", description: "Meet the parts of you that have been hiding in the dark." },
  { name: "Core Wound Excavation", icon: "🔮", description: "Go to the root. Heal the origin, not the symptom." },
  { name: "Shadow Self Dialogue", icon: "🪞", description: "Have the conversation your conscious mind has been avoiding." },
];

/* ------------------------------------------------------------------ */
/*  Breathing animation sub-component                                  */
/* ------------------------------------------------------------------ */

const AFFIRMATIONS = [
  "I am safe in my body right now.",
  "My nervous system is resetting to peace.",
  "I release what is not mine to carry.",
];

function NervousSystemInline() {
  const [mode, setMode] = useState<"menu" | "breathing" | "grounding" | "affirmation">("menu");
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [breathCount, setBreathCount] = useState(0);
  const [groundingStep, setGroundingStep] = useState(5);
  const [affIdx, setAffIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const startBreathing = () => {
    setMode("breathing");
    setBreathCount(0);
    let phase: "inhale" | "hold" | "exhale" = "inhale";
    let count = 0;
    const cycle = () => {
      if (phase === "inhale") { setBreathPhase("inhale"); setTimeout(() => { phase = "hold"; setBreathPhase("hold"); }, 4000); }
      if (phase === "hold") { setTimeout(() => { phase = "exhale"; setBreathPhase("exhale"); }, 4000); }
      if (phase === "exhale") { setTimeout(() => { count++; setBreathCount(count); phase = "inhale"; if (count < 6) cycle(); else setMode("menu"); }, 6000); }
    };
    // Simplified: just run phases sequentially
    let elapsed = 0;
    const phases = [
      { name: "inhale" as const, dur: 4000 },
      { name: "hold" as const, dur: 4000 },
      { name: "exhale" as const, dur: 6000 },
    ];
    const runCycle = (cycleNum: number) => {
      if (cycleNum >= 4) { setMode("menu"); return; }
      let i = 0;
      const nextPhase = () => {
        if (i >= phases.length) { runCycle(cycleNum + 1); return; }
        setBreathPhase(phases[i].name);
        setBreathCount(cycleNum + 1);
        setTimeout(() => { i++; nextPhase(); }, phases[i].dur);
      };
      nextPhase();
    };
    runCycle(0);
  };

  if (mode === "breathing") {
    return (
      <div className="flex flex-col items-center py-8 gap-4">
        <motion.div
          animate={{
            scale: breathPhase === "inhale" ? 1.4 : breathPhase === "hold" ? 1.4 : 1,
          }}
          transition={{ duration: breathPhase === "exhale" ? 6 : 4, ease: "easeInOut" }}
          className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center"
        >
          <span className="text-primary font-semibold capitalize">{breathPhase}</span>
        </motion.div>
        <p className="text-xs text-muted-foreground">4-4-6 Breathing · Cycle {breathCount}/4</p>
        <Button variant="ghost" size="sm" onClick={() => setMode("menu")} className="text-muted-foreground">
          Back
        </Button>
      </div>
    );
  }

  if (mode === "grounding") {
    const prompts: Record<number, string> = {
      5: "Name 5 things you can SEE right now.",
      4: "Name 4 things you can TOUCH right now.",
      3: "Name 3 things you can HEAR right now.",
      2: "Name 2 things you can SMELL right now.",
      1: "Name 1 thing you can TASTE right now.",
    };
    return (
      <div className="flex flex-col items-center py-6 gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
          <span className="text-2xl font-bold text-primary">{groundingStep}</span>
        </div>
        <p className="text-base text-foreground font-medium text-center px-4">{prompts[groundingStep]}</p>
        <div className="flex gap-3">
          {groundingStep > 1 ? (
            <Button variant="outline" className="border-primary text-primary" onClick={() => setGroundingStep(groundingStep - 1)}>
              Next →
            </Button>
          ) : (
            <Button variant="outline" className="border-primary text-primary" onClick={() => { setGroundingStep(5); setMode("menu"); }}>
              Done ✓
            </Button>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={() => { setGroundingStep(5); setMode("menu"); }} className="text-muted-foreground">
          Back
        </Button>
      </div>
    );
  }

  if (mode === "affirmation") {
    return (
      <div className="flex flex-col items-center py-6 gap-5">
        <AnimatePresence mode="wait">
          <motion.p
            key={affIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-lg font-serif text-foreground text-center leading-relaxed px-6"
          >
            "{AFFIRMATIONS[affIdx]}"
          </motion.p>
        </AnimatePresence>
        <div className="flex gap-2">
          {AFFIRMATIONS.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i === affIdx ? "bg-primary" : "bg-muted-foreground/30"}`} />
          ))}
        </div>
        <Button
          variant="outline"
          className="border-primary text-primary"
          onClick={() => {
            if (affIdx < AFFIRMATIONS.length - 1) setAffIdx(affIdx + 1);
            else { setAffIdx(0); setMode("menu"); }
          }}
        >
          {affIdx < AFFIRMATIONS.length - 1 ? "Next Affirmation →" : "Done ✓"}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => { setAffIdx(0); setMode("menu"); }} className="text-muted-foreground">
          Back
        </Button>
      </div>
    );
  }

  // Menu
  return (
    <div className="space-y-2 pt-2">
      {[
        { label: "2-Minute Breathing Reset", sub: "4-4-6 animated breath", onClick: startBreathing, icon: <Wind className="w-4 h-4" /> },
        { label: "Grounding Exercise", sub: "5-4-3-2-1 sensory technique", onClick: () => setMode("grounding"), icon: <Eye className="w-4 h-4" /> },
        { label: "Affirmation Reset", sub: "3 rotating affirmations", onClick: () => setMode("affirmation"), icon: <Heart className="w-4 h-4" /> },
      ].map((opt) => (
        <button
          key={opt.label}
          onClick={opt.onClick}
          className="w-full flex items-center gap-3 p-3 rounded-xl border border-border/30 bg-muted/20 hover:border-primary/40 hover:bg-primary/[0.03] transition-all text-left"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">{opt.icon}</div>
          <div>
            <p className="text-sm font-semibold text-foreground">{opt.label}</p>
            <p className="text-xs text-muted-foreground">{opt.sub}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function Tools() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { effectiveTier, hasAccess } = useSubscription();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

  const filtered = activeCategory === "All"
    ? tools
    : tools.filter((t) => t.category === activeCategory);

  const handleToolClick = (tool: ToolDef) => {
    if (tool.route) {
      navigate(tool.route);
    } else if (tool.variant === "nervous-system") {
      setExpandedTool(expandedTool === tool.id ? null : tool.id);
    }
  };

  return (
    <AuthenticatedLayout title="Tools">
      <div className="min-h-screen pt-24 pb-32 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">Tools</h1>
            <p className="text-muted-foreground text-sm">Everything you need to do the work.</p>
          </motion.div>

          {/* Category Filter Pills */}
          <div className="overflow-x-auto -mx-4 px-4 mb-8 scrollbar-hide">
            <div className="flex gap-2 w-max">
              {categories.filter((c) => c !== "Shadow Work").map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground shadow-[0_0_12px_hsl(var(--primary)/0.3)]"
                      : "border border-secondary/40 text-secondary hover:border-primary/60 hover:text-primary bg-transparent"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tool Cards */}
          <div className="space-y-3 mb-12">
            {filtered.map((tool, idx) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
              >
                <button
                  onClick={() => handleToolClick(tool)}
                  className={`w-full text-left rounded-2xl border transition-all p-5 group ${
                    expandedTool === tool.id
                      ? "border-primary/40 bg-primary/[0.03]"
                      : "border-border/40 bg-card hover:border-primary/40 hover:bg-primary/[0.02]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl shrink-0">{tool.icon}</span>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                          {tool.name}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                    {tool.route && (
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-2" />
                    )}
                  </div>
                </button>

                {/* Nervous System Reset inline */}
                <AnimatePresence>
                  {tool.variant === "nervous-system" && expandedTool === tool.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-2 border border-t-0 border-primary/20 rounded-b-2xl bg-card">
                        <NervousSystemInline />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Shadow Work Section */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="mb-5">
              <h2 className="font-serif text-xl font-bold text-foreground mb-1">Shadow Work</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The deepest healing happens in the parts of yourself you've been afraid to look at.
              </p>
            </div>

            <div className="space-y-3">
              {shadowTools.map((tool, idx) => (
                <div key={idx} className="relative rounded-2xl overflow-hidden">
                  {/* Card content (blurred if locked) */}
                  <div
                    className={`p-5 border border-border/30 bg-card rounded-2xl ${
                      !hasAccess("embody") ? "blur-[6px] select-none pointer-events-none" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{tool.icon}</span>
                      <div>
                        <p className="font-semibold text-foreground">{tool.name}</p>
                        <p className="text-xs text-muted-foreground">{tool.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Lock overlay */}
                  {!hasAccess("embody") && (
                    <button
                      onClick={() => navigate("/#pricing")}
                      className="absolute inset-0 flex items-center justify-center gap-2 rounded-2xl bg-background/40 backdrop-blur-[1px] z-10"
                    >
                      <Lock className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-primary">Available in EMBODY</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
