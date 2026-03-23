import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Heart, Moon, Zap, Brain, Sparkles, CheckCircle2 } from "lucide-react";
import { useWellnessSectionProgress } from "@/hooks/useWellnessSectionProgress";
import { MedicalDisclaimer } from "./MedicalDisclaimer";
import { CredentialsBadge } from "./CredentialsBadge";
import { AviniProductLink } from "./AviniProductLink";

const sections = [
  { id: "hormones-emotions", title: "Why Your Hormones Affect Everything", icon: Brain, label: null },
  { id: "cycle-syncing", title: "Working With Your Cycle — Not Against It", icon: Moon, label: "Women's Health" },
  { id: "perimenopause", title: "The Great Recalibration — Perimenopause and Menopause", icon: Sparkles, label: "Women's Health" },
  { id: "thyroid-adrenal", title: "Your Thyroid and Adrenals — The Hidden Worth Connection", icon: Zap, label: null },
  { id: "emotional-root", title: "The Emotional Root of Hormonal Imbalance", icon: Heart, label: null },
];

export function HormoneHealthModule() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { markRead, isSectionRead, progress, readCount } = useWellnessSectionProgress("hormone-health", sections.length);

  useEffect(() => {
    if (activeSection) {
      markRead(activeSection);
    }
  }, [activeSection, markRead]);

  if (activeSection) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Button variant="ghost" onClick={() => setActiveSection(null)} className="mb-4 gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Hormone Health
        </Button>
        <SectionContent sectionId={activeSection} />
        <MedicalDisclaimer compact />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
          Hormone Health
        </h2>
        <p className="text-accent font-medium italic mb-1">When Your Body is Trying to Tell You Something</p>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
          Your hormones are not working against you. They are trying to get your attention.
        </p>
      </div>

      <MedicalDisclaimer />

      <Card className="border-accent/10 bg-card/80">
        <CardContent className="pt-6">
          <p className="text-sm text-foreground/80 leading-relaxed">
            Most people treat hormone health as a purely physical issue. But your hormones are deeply connected to your emotional state, your nervous system, your worth thermostat and your patterns in relationships and money.
          </p>
          <p className="text-sm text-foreground/80 leading-relaxed mt-3">
            When your hormones are dysregulated — your anxiety spikes, your boundaries weaken, your self-worth drops and your thermostat resets to survival mode.
          </p>
          <p className="text-sm text-foreground/80 leading-relaxed mt-3">
            This module bridges the gap between your hormonal health and your emotional healing journey.
          </p>
          <p className="text-xs text-muted-foreground italic mt-3">
            Note: While some content references female hormonal cycles, the connection between hormones, emotions and worth applies to everyone regardless of gender.
          </p>
        </CardContent>
      </Card>

      <CredentialsBadge />

      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">Your Progress</p>
            <p className="text-xs text-muted-foreground">{readCount} of {sections.length} sections read</p>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {sections.map((section, i) => {
          const Icon = section.icon;
          const isRead = isSectionRead(section.id);
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card
                className={`cursor-pointer hover:border-accent/30 transition-all duration-300 hover:shadow-md ${isRead ? 'border-accent/20' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <CardHeader className="flex flex-row items-center gap-4 py-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isRead ? 'bg-accent/20' : 'bg-accent/10'}`}>
                    <Icon className={`w-5 h-5 ${isRead ? 'text-accent' : 'text-accent'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-semibold">{section.title}</CardTitle>
                    {section.label && (
                      <Badge variant="secondary" className="mt-1 text-xs">{section.label}</Badge>
                    )}
                  </div>
                  {isRead && (
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  )}
                </CardHeader>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function SectionContent({ sectionId }: { sectionId: string }) {
  switch (sectionId) {
    case "hormones-emotions":
      return <HormonesEmotionsSection />;
    case "cycle-syncing":
      return <CycleSyncingSection />;
    case "perimenopause":
      return <PerimenopauseSection />;
    case "thyroid-adrenal":
      return <ThyroidAdrenalSection />;
    case "emotional-root":
      return <EmotionalRootSection />;
    default:
      return null;
  }
}

function SectionWrapper({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
      <div className="prose prose-sm max-w-none text-foreground/85 space-y-4">{children}</div>
    </div>
  );
}

function HormonesEmotionsSection() {
  return (
    <SectionWrapper title="Why Your Hormones Affect Everything">
      <p>Your hormones are chemical messengers that regulate nearly every system in your body — including your mood, your stress response, your energy, your libido, your sleep and your sense of self-worth.</p>

      <Card className="bg-muted/30"><CardContent className="pt-4 space-y-2">
        <h4 className="font-semibold text-foreground">When cortisol is chronically elevated:</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Suppresses your immune system</li>
          <li>Disrupts sleep</li>
          <li>Increases anxiety and depression</li>
          <li>Lowers your tolerance for boundaries</li>
          <li>Keeps your nervous system in fight or flight</li>
        </ul>
      </CardContent></Card>

      <Card className="bg-muted/30"><CardContent className="pt-4 space-y-2">
        <h4 className="font-semibold text-foreground">When estrogen and progesterone are out of balance:</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Mood swings and emotional volatility</li>
          <li>Brain fog and difficulty making decisions</li>
          <li>Increased self-criticism and worthlessness</li>
          <li>Heightened anxiety and sensitivity</li>
        </ul>
      </CardContent></Card>

      <Card className="bg-muted/30"><CardContent className="pt-4 space-y-2">
        <h4 className="font-semibold text-foreground">When testosterone is low (in all genders):</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Low motivation and drive</li>
          <li>Depression and disconnection</li>
          <li>Reduced confidence and assertiveness</li>
          <li>Difficulty taking action toward goals</li>
        </ul>
      </CardContent></Card>

      <Card className="border-accent/20 bg-accent/5"><CardContent className="pt-4">
        <h4 className="font-semibold text-accent mb-2">The Worth Thermostat Connection</h4>
        <p className="text-sm">A dysregulated hormonal system directly lowers your Worth Thermostat. When your body is in survival mode your nervous system does not feel safe enough to expand — which means your thermostat cannot rise no matter how much mindset work you do.</p>
        <p className="text-sm font-medium text-foreground mt-2">Healing your hormones is part of healing your worth.</p>
      </CardContent></Card>
    </SectionWrapper>
  );
}

function CycleSyncingSection() {
  const phases = [
    {
      name: "MENSTRUAL PHASE", days: "Days 1-5", hormones: "Estrogen and progesterone at their lowest",
      energy: "Low and inward", tone: "Reflective, intuitive, sometimes raw",
      impact: "This is when old wounds and limiting beliefs surface most strongly",
      needs: "Rest, warmth, solitude, journaling, gentle movement",
      tools: "Inner Child Healing, Shadow Work, Limiting Belief Rewriter",
      products: ["Plus Relief", "Plus Balance"],
    },
    {
      name: "FOLLICULAR PHASE", days: "Days 6-13", hormones: "Estrogen rising",
      energy: "Building, optimistic, curious", tone: "Fresh start energy, openness, creativity",
      impact: "This is when new beliefs take root most easily",
      needs: "New experiences, social connection, creative projects, learning",
      tools: "Vision work, Manifesto creation, Abundance Evidence Log",
      products: ["Plus Energy", "Plus Mind and Vision"],
    },
    {
      name: "OVULATORY PHASE", days: "Days 14-17", hormones: "Estrogen and testosterone peak",
      energy: "Highest of the month", tone: "Confident, magnetic, communicative",
      impact: "This is when your thermostat naturally peaks — lean into it",
      needs: "Visibility, connection, leadership, bold action",
      tools: "Visibility Challenge Tracker, CEO Self-Assessment, Values Clarity Tool",
      products: ["Plus Energy", "Zmunity Mushrooms"],
    },
    {
      name: "LUTEAL PHASE", days: "Days 18-28", hormones: "Progesterone rises then both drop",
      energy: "Decreasing, detail-oriented, then very low", tone: "Critical, sensitive, boundaries needed",
      impact: "This is when your thermostat is most vulnerable to dropping — protect it",
      needs: "Boundaries, less social demand, completion tasks, nourishment",
      tools: "Boundary Builder, Body Map Journal, Somatic Breathing",
      products: ["Plus Balance", "Plus Relief", "Plus Fiber"],
    },
  ];

  return (
    <SectionWrapper title="Working With Your Cycle — Not Against It">
      <Badge variant="secondary">Women's Health Content</Badge>
      <Card className="bg-muted/20 border-border"><CardContent className="pt-4">
        <p className="text-sm italic text-muted-foreground">This section is written for those with menstrual cycles. If this does not apply to you, skip to Section 3.</p>
      </CardContent></Card>
      <p>Your menstrual cycle is divided into four phases. Each phase affects your energy, emotions, creativity, social needs and productivity differently. When you understand your cycle you can stop fighting your natural rhythms and start working with them.</p>
      {phases.map((phase) => (
        <Card key={phase.name} className="bg-card border-border">
          <CardContent className="pt-4 space-y-3">
            <h4 className="font-bold text-foreground">{phase.name} <span className="font-normal text-muted-foreground">({phase.days})</span></h4>
            <div className="grid gap-2 text-sm">
              <p><span className="font-medium">Hormones:</span> {phase.hormones}</p>
              <p><span className="font-medium">Energy:</span> {phase.energy}</p>
              <p><span className="font-medium">Emotional tone:</span> {phase.tone}</p>
              <p><span className="font-medium text-accent">Worth Thermostat impact:</span> {phase.impact}</p>
              <p><span className="font-medium">What your body needs:</span> {phase.needs}</p>
              <p><span className="font-medium">Worth work for this phase:</span> {phase.tools}</p>
            </div>
            <AviniProductLink products={phase.products} />
          </CardContent>
        </Card>
      ))}
    </SectionWrapper>
  );
}

function PerimenopauseSection() {
  return (
    <SectionWrapper title="The Great Recalibration — Perimenopause and Menopause">
      <Badge variant="secondary">Women's Health Content</Badge>
      <p>Perimenopause and menopause are not endings. They are initiations.</p>
      <p>The hormonal shifts of this life stage — estrogen decline, progesterone fluctuation, testosterone changes — can feel like losing yourself. But what is actually happening is a stripping away of everything that no longer serves you.</p>
      <p className="font-medium text-foreground">Your body is forcing a recalibration.</p>

      <Card className="bg-muted/30"><CardContent className="pt-4 space-y-2">
        <h4 className="font-semibold text-foreground">Common experiences during this transition:</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li><strong>Hot flashes and night sweats</strong> — the nervous system releasing stored heat and stress</li>
          <li><strong>Sleep disruption</strong> — the body processing emotions that were suppressed</li>
          <li><strong>Mood changes and irritability</strong> — old wounds surfacing for healing</li>
          <li><strong>Brain fog</strong> — the mind clearing space for a new chapter</li>
          <li><strong>Increased desire for authenticity</strong> — the false self falling away</li>
        </ul>
      </CardContent></Card>

      <Card className="border-accent/20 bg-accent/5"><CardContent className="pt-4">
        <h4 className="font-semibold text-accent mb-2">The Worth Thermostat in perimenopause and menopause</h4>
        <p className="text-sm">Many women experience their Worth Thermostat actually RISING during this transition — once they stop fighting it. The urgency to stop settling, stop performing and stop tolerating what does not honor them becomes undeniable.</p>
        <p className="text-sm font-medium text-foreground mt-2">This is not a crisis. This is your worth calling you home.</p>
      </CardContent></Card>

      <h4 className="font-semibold text-foreground">Tools recommended for this phase:</h4>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Inner Child Healing — healing the younger self who learned to shrink</li>
        <li>Boundary Builder — strengthening what you will and will not accept</li>
        <li>Shadow Work — integrating the parts of yourself you have been hiding</li>
        <li>Body Map Journal — reconnecting with your body as an ally not an enemy</li>
        <li>Somatic Breathing — regulating the nervous system through the transition</li>
      </ul>

      <AviniProductLink products={["Plus Balance", "Plus Relief", "Plus Mind and Vision", "Plus Hydration"]} />
    </SectionWrapper>
  );
}

function ThyroidAdrenalSection() {
  return (
    <SectionWrapper title="Your Thyroid and Adrenals — The Hidden Worth Connection">
      <p>Your thyroid and adrenal glands are your body's pacemakers. When they are dysregulated — everything slows down or speeds up in ways that directly affect your emotional state, your energy and your worth thermostat.</p>

      <h3 className="font-serif text-xl font-bold text-foreground mt-4">Thyroid Health</h3>
      <Card className="bg-muted/30"><CardContent className="pt-4 space-y-2">
        <h4 className="font-semibold">When your thyroid is underactive (hypothyroidism):</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Fatigue and low motivation</li>
          <li>Depression and emotional flatness</li>
          <li>Weight changes and body image struggles</li>
          <li>Difficulty taking action toward goals</li>
          <li>Brain fog and indecisiveness</li>
        </ul>
        <p className="text-sm text-accent italic">Worth connection: Low thyroid function mimics low worth. It becomes difficult to distinguish between a hormonal issue and an emotional pattern. Both need attention.</p>
      </CardContent></Card>

      <Card className="bg-muted/30"><CardContent className="pt-4 space-y-2">
        <h4 className="font-semibold">When your thyroid is overactive (hyperthyroidism):</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Anxiety and hypervigilance</li>
          <li>Difficulty slowing down or resting</li>
          <li>Irritability and emotional reactivity</li>
          <li>Feeling like you can never do enough</li>
        </ul>
        <p className="text-sm text-accent italic">Worth connection: Overactive thyroid can fuel the overachiever pattern — doing more and more to prove worth.</p>
      </CardContent></Card>

      <h3 className="font-serif text-xl font-bold text-foreground mt-4">Adrenal Health</h3>
      <Card className="bg-muted/30"><CardContent className="pt-4 space-y-2">
        <h4 className="font-semibold">Chronic stress leads to adrenal fatigue:</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Exhaustion that sleep does not fix</li>
          <li>Difficulty saying no — the body too depleted to hold boundaries</li>
          <li>Emotional numbness or overwhelm</li>
          <li>Cravings for sugar, salt and stimulants</li>
          <li>Feeling like you are running on empty</li>
        </ul>
        <p className="text-sm text-accent italic">Worth connection: Adrenal fatigue is often the physical manifestation of years of over-giving, over-performing and under-receiving. Your body is showing you what your thermostat has been doing.</p>
      </CardContent></Card>

      <Card className="bg-destructive/5 border-destructive/20"><CardContent className="pt-4">
        <p className="text-sm font-medium">Important: If you suspect a thyroid or adrenal condition please consult your healthcare provider. These tools support your wellness journey but do not replace medical diagnosis or treatment.</p>
      </CardContent></Card>

      <AviniProductLink products={["Cell Defender", "Plus Balance", "Plus Energy", "Plus Hydration", "Nano Silver"]} />
    </SectionWrapper>
  );
}

function EmotionalRootSection() {
  return (
    <SectionWrapper title="The Emotional Root of Hormonal Imbalance">
      <p>Research increasingly shows that chronic emotional stress — unprocessed grief, suppressed anger, long-term anxiety, childhood trauma — directly disrupts hormonal balance.</p>
      <p className="font-medium text-foreground">Your body keeps the score. What you have not allowed yourself to feel is stored in your endocrine system.</p>

      <Card className="bg-muted/30"><CardContent className="pt-4 space-y-2">
        <h4 className="font-semibold text-foreground">Common emotional-hormonal connections:</h4>
        <ul className="space-y-2 text-sm">
          <li><strong>Chronic people-pleasing</strong> → elevated cortisol → adrenal fatigue</li>
          <li><strong>Suppressed anger</strong> → inflammatory response → hormonal disruption</li>
          <li><strong>Unprocessed grief</strong> → immune suppression → thyroid impact</li>
          <li><strong>Hypervigilance from trauma</strong> → chronic cortisol → hormonal imbalance</li>
          <li><strong>Low worth</strong> → chronic stress → full-body hormonal dysregulation</li>
        </ul>
      </CardContent></Card>

      <Card className="border-accent/20 bg-accent/5"><CardContent className="pt-4">
        <h4 className="font-semibold text-accent mb-2">The emotional surgery approach</h4>
        <p className="text-sm">Healing hormonal imbalance is not just about supplements and lifestyle changes. It requires going into the emotional root — the patterns, the wounds, the beliefs that keep your nervous system in a state of chronic stress.</p>
        <p className="text-sm mt-2">That is why this module lives inside Reset Your Mind 1111™ and not in a nutrition app.</p>
      </CardContent></Card>

      <h4 className="font-semibold text-foreground">Recommended healing sequence for hormonal balance:</h4>
      <ol className="list-decimal pl-5 space-y-1 text-sm">
        <li>Nervous System Diagnostic — find your pattern (Fight/Flight/Freeze/Fawn)</li>
        <li>Somatic Breathing — regulate your stress response daily</li>
        <li>Inner Child Healing — address the root of chronic stress patterns</li>
        <li>Shadow Work — integrate suppressed emotions</li>
        <li>Boundary Builder — reduce the cortisol load of over-giving</li>
        <li>Body Map Journal — reconnect with your body's signals</li>
      </ol>
    </SectionWrapper>
  );
}
