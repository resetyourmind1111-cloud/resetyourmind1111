import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Lock, Play, ChevronDown, ChevronUp, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { TRAP_MODULES, SLUG_TO_TRAP } from "@/data/identityTrapData";
import { useToast } from "@/hooks/use-toast";
import { CelebrationOverlay } from "@/components/trial/CelebrationOverlay";
import { LockedContent } from "@/components/LockedContent";

const TOTAL_SCREENS = 12;

export default function PatternModule() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { effectiveTier, hasAccess } = useSubscription();
  const { toast } = useToast();

  const startAt = (location.state as any)?.startAt ?? 0;
  const [screen, setScreen] = useState(startAt);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [selectedBody, setSelectedBody] = useState<string | null>(null);
  const [showScript, setShowScript] = useState(false);
  const [recodeIndex, setRecodeIndex] = useState(0);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [customAction, setCustomAction] = useState("");
  const [reflection, setReflection] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);

  const trap = slug ? TRAP_MODULES[slug] : null;

  useEffect(() => { window.scrollTo(0, 0); }, [screen]);

  useEffect(() => {
    if (!trap) navigate("/patterns");
  }, [trap, navigate]);

  useEffect(() => {
    if (screen === TOTAL_SCREENS - 1 && trap) handleComplete();
  }, [screen]);

  if (!trap) return null;

  const progressPercent = ((screen + 1) / TOTAL_SCREENS) * 100;

  // Lock screens 3-12 (index 2-11) for free users
  const isLockedScreen = screen >= 2 && !hasAccess("reset");

  const next = () => setScreen((s) => Math.min(s + 1, TOTAL_SCREENS - 1));
  const handleSaveExit = () => navigate("/patterns");

  const handleSaveAction = async () => {
    const action = selectedAction || customAction;
    if (!action || !user) return;
    await supabase.from("pattern_interrupts").insert({
      user_id: user.id,
      trap_name: trap.name,
      action_taken: action,
    });
    // Update progress
    await supabase.from("pattern_progress").upsert({
      user_id: user.id,
      total_interrupts: 1,
      self_trust_streak: 1,
      last_updated: new Date().toISOString(),
    }, { onConflict: "user_id" });
    next();
  };

  const handleSaveReflection = async () => {
    if (!reflection.trim() || !user) return;
    await supabase.from("healing_tool_entries").insert({
      user_id: user.id,
      tool_id: `pattern-reflect-${slug}`,
      entry_data: { reflection, trap: trap.name },
    });
    toast({ title: "Reflection saved ✨" });
    next();
  };

  const handleComplete = async () => {
    if (!user) return;
    setShowCelebration(true);
    // Update progress
    const { data: existing } = await supabase
      .from("pattern_progress")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      await supabase.from("pattern_progress").update({
        total_interrupts: (existing.total_interrupts || 0) + 1,
        recodes_completed: (existing.recodes_completed || 0) + 1,
        self_trust_streak: (existing.self_trust_streak || 0) + 1,
        last_updated: new Date().toISOString(),
      }).eq("user_id", user.id);
    } else {
      await supabase.from("pattern_progress").insert({
        user_id: user.id,
        total_interrupts: 1,
        recodes_completed: 1,
        self_trust_streak: 1,
      });
    }

    setTimeout(() => setShowCelebration(false), 2500);
  };

  useEffect(() => {
    if (screen === TOTAL_SCREENS - 1) handleComplete();
  }, [screen]);

  const renderScreen = () => {
    if (isLockedScreen) {
      return (
        <div className="space-y-6 text-center py-12">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            You've reached the end of your preview.
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            The first 2 days show you the pattern. The rest of the experience is where you change it. You've already started. Don't stop here.
          </p>
          <Button variant="gold" size="lg" onClick={() => navigate("/upgrade")}>
            Continue My Reset — Unlock Full Access
          </Button>
          <p className="text-xs text-muted-foreground">Founding rate: $44/month — locked in for life.</p>
        </div>
      );
    }

    switch (screen) {
      case 0: // Title Card
        return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 rounded-2xl p-8"
            style={{ background: "linear-gradient(180deg, rgba(61,26,110,0.4) 0%, rgba(10,10,10,0.8) 100%)" }}>
            <div className="w-full h-1 bg-primary rounded-full mb-4" />
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">{trap.name}</h1>
            <p className="text-muted-foreground text-base italic">{trap.subtitle}</p>
            <Button variant="gold" onClick={next}>Begin →</Button>
          </div>
        );
      case 1: // What This Really Is
        return (
          <div className="space-y-6">
            <h2 className="font-serif text-xl font-bold text-foreground">What This Really Is</h2>
            <Card className="p-6 border-l-4 border-l-primary bg-card/80">
              <p className="text-foreground/90 leading-relaxed whitespace-pre-line">{trap.whatItIs}</p>
            </Card>
            <Button variant="gold" onClick={next} className="w-full">Continue →</Button>
          </div>
        );
      case 2: // How It Shows Up
        return (
          <div className="space-y-6">
            <h2 className="font-serif text-xl font-bold text-foreground">How It Shows Up</h2>
            <div className="space-y-3">
              {trap.checklist.map((item, i) => (
                <label key={i} className="flex items-start gap-3 p-3 rounded-lg bg-card/60 border border-border/30 cursor-pointer hover:border-primary/30 transition-colors">
                  <Checkbox
                    checked={checkedItems[i] || false}
                    onCheckedChange={() => setCheckedItems(prev => ({ ...prev, [i]: !prev[i] }))}
                    className="mt-0.5"
                  />
                  <span className="text-sm text-foreground">{item}</span>
                </label>
              ))}
            </div>
            <Button variant="gold" onClick={next} className="w-full">Continue →</Button>
          </div>
        );
      case 3: // Why Your Body Repeats It
        return (
          <div className="space-y-6">
            <h2 className="font-serif text-xl font-bold text-foreground">Why Your Body Repeats It</h2>
            <Card className="p-6 bg-[#3D1A6E]/10 border-[#3D1A6E]/20">
              <p className="text-foreground/90 leading-relaxed">{trap.whyBodyRepeats}</p>
            </Card>
            <Button variant="gold" onClick={next} className="w-full">Continue →</Button>
          </div>
        );
      case 4: // What This Is Costing You
        return (
          <div className="space-y-6">
            <h2 className="font-serif text-xl font-bold text-foreground">What This Is Costing You</h2>
            <div className="space-y-3">
              {trap.costs.map((c, i) => (
                <div key={i} className="flex gap-3 items-start p-3 rounded-lg bg-card/40">
                  <span className="text-primary font-semibold text-sm min-w-[90px]">{c.category}</span>
                  <span className="text-sm text-muted-foreground">— {c.description}</span>
                </div>
              ))}
            </div>
            <Button variant="gold" onClick={next} className="w-full">Continue →</Button>
          </div>
        );
      case 5: // What It's Trying To Protect You From
        return (
          <div className="space-y-6">
            <h2 className="font-serif text-xl font-bold text-foreground">What It's Trying To Protect You From</h2>
            <Card className="p-6 bg-card/80 border-border/30">
              <p className="text-foreground/90 leading-relaxed whitespace-pre-line">{trap.protectsFrom}</p>
            </Card>
            <Button variant="gold" onClick={next} className="w-full">Continue →</Button>
          </div>
        );
      case 6: // Catch It In Real Time
        return (
          <div className="space-y-6">
            <h2 className="font-serif text-xl font-bold text-foreground">Catch It In Real Time</h2>
            <p className="text-muted-foreground">{trap.bodyQuestion}</p>
            <div className="flex flex-wrap gap-2">
              {trap.bodyOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelectedBody(opt)}
                  className={`px-5 py-3 rounded-full text-sm font-medium transition-all border-2 ${
                    selectedBody === opt
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/50 bg-card/60 text-foreground hover:border-primary/40"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <Button variant="gold" onClick={next} className="w-full" disabled={!selectedBody}>Continue →</Button>
          </div>
        );
      case 7: // Do The Reset (Audio)
        return (
          <div className="space-y-6">
            <h2 className="font-serif text-xl font-bold text-foreground">Do The Reset</h2>
            <Card className="p-6 space-y-4" style={{ background: "linear-gradient(135deg, rgba(61,26,110,0.3), rgba(10,10,10,0.8))" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{trap.audioTitle}</p>
                  <p className="text-xs text-muted-foreground">{trap.audioDuration}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:bg-primary/80 transition-colors">
                  <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                </div>
              </div>
              <div className="bg-muted/20 rounded-full h-1.5">
                <div className="h-full w-0 bg-primary rounded-full" />
              </div>
            </Card>
            <button
              onClick={() => setShowScript(!showScript)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {showScript ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              No audio yet? Read the reset instead
            </button>
            {showScript && (
              <Card className="p-5 bg-card/60 border-border/30">
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{trap.audioScript}</p>
              </Card>
            )}
            <Button variant="gold" onClick={next} className="w-full">Mark Complete →</Button>
          </div>
        );
      case 8: // Recode The Identity
        return (
          <div className="space-y-6">
            <h2 className="font-serif text-xl font-bold text-foreground">Recode The Identity</h2>
            <div className="min-h-[200px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={recodeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center px-4"
                >
                  <p className="text-primary text-4xl mb-4">"</p>
                  <p className="font-serif text-lg text-foreground italic leading-relaxed">
                    {trap.recodeStatements[recodeIndex]}
                  </p>
                  <p className="text-primary text-4xl mt-4">"</p>
                </motion.div>
              </AnimatePresence>
            </div>
            {recodeIndex < trap.recodeStatements.length - 1 ? (
              <Button variant="outline" onClick={() => setRecodeIndex(recodeIndex + 1)} className="w-full border-primary text-primary">
                Reveal Next →
              </Button>
            ) : (
              <Button variant="gold" onClick={next} className="w-full">Continue →</Button>
            )}
          </div>
        );
      case 9: // One Small Action Today
        return (
          <div className="space-y-6">
            <h2 className="font-serif text-xl font-bold text-foreground">One Small Action Today</h2>
            <div className="space-y-3">
              {trap.actions.map((action) => (
                <button
                  key={action}
                  onClick={() => setSelectedAction(action)}
                  className={`w-full p-4 rounded-xl border-2 text-left text-sm transition-all ${
                    selectedAction === action
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/50 bg-card/60 text-foreground hover:border-primary/40"
                  }`}
                >
                  {action}
                </button>
              ))}
              <Textarea
                placeholder="Or write your own…"
                value={customAction}
                onChange={(e) => { setCustomAction(e.target.value); setSelectedAction(null); }}
                className="bg-card/60 border-border/30"
              />
            </div>
            <Button variant="gold" onClick={handleSaveAction} className="w-full" disabled={!selectedAction && !customAction.trim()}>
              Save Action →
            </Button>
          </div>
        );
      case 10: // Reflect
        return (
          <div className="space-y-6">
            <h2 className="font-serif text-xl font-bold text-foreground">Reflect</h2>
            <p className="font-serif text-base text-foreground/80 italic text-center leading-relaxed whitespace-pre-line">
              {trap.reflectPrompt}
            </p>
            <Textarea
              placeholder="Write what comes up. No filter needed."
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={6}
              className="bg-card/60 border-border/30"
            />
            <Button variant="gold" onClick={handleSaveReflection} className="w-full" disabled={!reflection.trim()}>
              Save Reflection
            </Button>
            {hasAccess("expand") ? (
              <button className="w-full text-sm text-muted-foreground hover:text-foreground text-center transition-colors">
                Ask AI to help me reflect →
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/50">
                <Lock className="w-3 h-3" /> Available on Expand plan
              </div>
            )}
          </div>
        );
      case 11: // Completion
        return (
          <div className="text-center space-y-6 py-8">
            <h2 className="font-serif text-2xl font-bold text-foreground whitespace-pre-line leading-relaxed">
              {trap.completionText}
            </h2>
            <p className="text-muted-foreground italic">You interrupted the pattern. That matters.</p>

            <div className="flex flex-wrap gap-2 justify-center">
              {["Trap interrupted", "Streak updated", "Action saved"].map((s) => (
                <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/30 text-xs text-primary font-medium">
                  <Check className="w-3 h-3" /> {s}
                </span>
              ))}
            </div>

            <div className="space-y-3 pt-4">
              <Button variant="gold" className="w-full" onClick={() => navigate(`/patterns/${slug}`)}>
                Repeat Tomorrow
              </Button>
              <Button variant="outline" className="w-full border-primary text-primary" onClick={() => navigate("/patterns")}>
                Return to My Patterns
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm p-4 space-y-2 border-b border-border/20">
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {Array.from({ length: TOTAL_SCREENS }).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i <= screen ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
          <button onClick={handleSaveExit} className="text-sm text-muted-foreground hover:text-foreground">
            Save & Exit
          </button>
        </div>
        <Progress value={progressPercent} className="h-1 bg-muted [&>[data-state]]:bg-primary" />
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-lg py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>

      <CelebrationOverlay show={showCelebration} message="Pattern interrupted! ✦" />
    </div>
  );
}
