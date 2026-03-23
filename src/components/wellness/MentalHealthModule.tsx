import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Brain, Heart, Shield, Phone, CheckCircle2 } from "lucide-react";
import { useWellnessSectionProgress } from "@/hooks/useWellnessSectionProgress";
import { MedicalDisclaimer } from "./MedicalDisclaimer";
import { CredentialsBadge } from "./CredentialsBadge";
import { AviniProductLink } from "./AviniProductLink";

const sections = [
  { id: "anxiety", title: "Anxiety is Not a Character Flaw — It is a Nervous System Signal", icon: Brain },
  { id: "depression", title: "Depression is Not Sadness — It is Disconnection", icon: Heart },
  { id: "trauma", title: "Your Patterns Are Not Personality — They Are Protection", icon: Shield },
  { id: "professional-help", title: "Knowing When to Reach Further", icon: Phone },
];

export function MentalHealthModule() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  if (activeSection) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Button variant="ghost" onClick={() => setActiveSection(null)} className="mb-4 gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Mental Health
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
          Mental Health Awareness
        </h2>
        <p className="text-accent font-medium italic mb-1">You Are Not Broken. You Are Responding.</p>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
          Everything you have been labeled is actually a response to something that happened to you. Let's find the root.
        </p>
      </div>

      <MedicalDisclaimer />

      <Card className="border-accent/10 bg-card/80">
        <CardContent className="pt-6 space-y-3 text-sm text-foreground/85">
          <p>This module is built on over a decade of deep transformational work.</p>
          <p>Lorie Wu is a Master Certified Practitioner in:</p>
          <ul className="space-y-1 pl-2">
            <li>✦ Neuro-Linguistic Programming (NLP)</li>
            <li>✦ Timeline Therapy™</li>
            <li>✦ Hypnotherapy</li>
            <li>✦ 6 MindShifting Techniques — addressing problems, blockages, trauma, identity, reality and beliefs</li>
          </ul>
          <p>These are not surface-level wellness tools. These are clinically developed modalities used by therapists, coaches and change workers worldwide to create deep, lasting transformation at the root level.</p>
          <p>What makes this module different from anything else you will find in a wellness app is that the techniques and frameworks here are drawn from these master-certified modalities — adapted into daily accessible practices that work on your nervous system, your subconscious beliefs and your emotional patterns simultaneously.</p>
          <p className="font-medium text-foreground">This is not therapy. And it is far more than mindset work.</p>
          <p className="italic">This is emotional surgery — performed by someone trained to go all the way to the root.</p>
          <p>If you have been told you have anxiety, depression, PTSD or any other mental health condition — this module helps you understand what is happening beneath the label, how it connects to your Worth Thermostat and what tools can support your healing journey.</p>
          <Card className="bg-destructive/5 border-destructive/20 mt-2"><CardContent className="pt-4">
            <p className="text-sm font-medium">Important: If you are in crisis please call <span className="font-bold">988</span> (Suicide and Crisis Lifeline) or go to your nearest emergency room. For ongoing support, consider working directly with Lorie through private coaching sessions which go deeper than this app into subconscious root cause healing.</p>
          </CardContent></Card>
        </CardContent>
      </Card>

      <CredentialsBadge />

      <div className="grid gap-4">
        {sections.map((section, i) => {
          const Icon = section.icon;
          return (
            <motion.div key={section.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="cursor-pointer hover:border-accent/30 transition-all duration-300 hover:shadow-md" onClick={() => setActiveSection(section.id)}>
                <CardHeader className="flex flex-row items-center gap-4 py-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <CardTitle className="text-base font-semibold">{section.title}</CardTitle>
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
    case "anxiety": return <AnxietySection />;
    case "depression": return <DepressionSection />;
    case "trauma": return <TraumaSection />;
    case "professional-help": return <ProfessionalHelpSection />;
    default: return null;
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

function AnxietySection() {
  return (
    <SectionWrapper title="Anxiety is Not a Character Flaw — It is a Nervous System Signal">
      <p>Anxiety is not weakness. It is not irrational. It is not something to be ashamed of.</p>
      <p>Anxiety is your nervous system doing exactly what it was designed to do — detect threat and prepare you to respond.</p>
      <p>The problem is when your nervous system learned — usually in childhood or through trauma — that the world is not safe. That other people are not safe. That YOU are not safe to be fully yourself.</p>
      <p>That learning gets encoded in your body. And then it fires as anxiety — even when there is no real threat present.</p>

      <Card className="border-accent/20 bg-accent/5"><CardContent className="pt-4 space-y-2">
        <h4 className="font-semibold text-accent">The Worth Thermostat connection</h4>
        <p className="text-sm">Anxiety and a low Worth Thermostat feed each other in a cycle:</p>
        <p className="text-sm italic">Low worth → people-pleasing → loss of boundaries → more stress → more anxiety → more people-pleasing to manage the anxiety → worth drops further</p>
        <p className="text-sm font-medium">Breaking this cycle requires nervous system regulation AND worth recalibration — both at the same time.</p>
      </CardContent></Card>

      <Card className="bg-muted/30"><CardContent className="pt-4 space-y-2">
        <h4 className="font-semibold">Common anxiety patterns and their worth connection:</h4>
        <ul className="space-y-2 text-sm">
          <li><strong>Social anxiety</strong> — fear of being seen, judged or rejected — often rooted in early experiences of conditional love or criticism</li>
          <li><strong>Performance anxiety</strong> — fear of not being good enough — often rooted in achievement-based worth</li>
          <li><strong>Separation anxiety</strong> — fear of abandonment — often rooted in inconsistent early attachment</li>
          <li><strong>Health anxiety</strong> — hypervigilance about the body — often rooted in lack of safety and control</li>
        </ul>
      </CardContent></Card>

      <h4 className="font-semibold">Tools for anxiety support:</h4>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Nervous System Diagnostic — identify your specific pattern</li>
        <li>Somatic Breathing — regulate in real time</li>
        <li>Inner Child Healing — address the root of the threat response</li>
        <li>Attachment Style Analyzer — understand relationship anxiety</li>
        <li>Boundary Builder — reduce the anxiety of over-commitment</li>
        <li>Daily Mood Check-In — track patterns and triggers</li>
      </ul>

      <AviniProductLink products={["Plus Mind and Vision", "Zmunity Mushrooms", "Plus Relief"]} />

      <p className="text-sm italic text-muted-foreground">If anxiety is significantly impacting your daily life please consider working with a practitioner who works at the subconscious level — someone trained in modalities like NLP, Timeline Therapy™ or Hypnotherapy that identify and dissolve root causes rather than simply managing symptoms at the conscious level.</p>
    </SectionWrapper>
  );
}

function DepressionSection() {
  return (
    <SectionWrapper title="Depression is Not Sadness — It is Disconnection">
      <p>Depression is one of the most misunderstood experiences in modern life.</p>
      <p>It is not simply sadness. It is not laziness. It is not a choice.</p>
      <p>Depression is often the result of long-term disconnection — from yourself, from your worth, from your authentic desires, from safe relationships and from the life your soul knows it deserves.</p>

      <Card className="bg-muted/30"><CardContent className="pt-4">
        <p className="text-sm mb-2">When you spend years:</p>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Suppressing your true feelings to keep others comfortable</li>
          <li>Performing a version of yourself that is not real</li>
          <li>Staying in situations that drain your spirit</li>
          <li>Ignoring your own needs in service of everyone else's</li>
          <li>Believing you are not worthy of the life you want</li>
        </ul>
        <p className="text-sm mt-3">Your nervous system eventually stops fighting. It goes quiet. It goes flat. It disconnects.</p>
        <p className="text-sm font-medium mt-1">That is depression.</p>
      </CardContent></Card>

      <Card className="border-accent/20 bg-accent/5"><CardContent className="pt-4 space-y-2">
        <h4 className="font-semibold text-accent">The Worth Thermostat connection</h4>
        <p className="text-sm">A Worth Thermostat set chronically low — especially The Settler pattern — is one of the most common precursors to depression. When you stop believing you deserve more you stop reaching for more. And when you stop reaching you stop feeling.</p>
        <h4 className="font-semibold mt-3">Signs your depression may be worth-rooted:</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>You feel most depressed in situations where you are not honoring yourself</li>
          <li>Your depression lifts temporarily when you set a boundary or choose yourself</li>
          <li>You feel numb rather than sad — disconnection from your own desires</li>
          <li>You have difficulty imagining a future that feels genuinely good</li>
        </ul>
      </CardContent></Card>

      <h4 className="font-semibold">Tools for depression support:</h4>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Inner Child Healing — reconnect with the self that got lost</li>
        <li>Shadow Work — integrate the parts of yourself that were shut down</li>
        <li>Manifesto — reconnect with what you actually want</li>
        <li>Abundance Evidence Log — retrain the brain toward possibility</li>
        <li>Angel Number Journal — reconnect with spiritual meaning and purpose</li>
        <li>Daily Mood Check-In and Healing Streak — build momentum through small wins</li>
        <li>Sacred Circle Community — reduce isolation through connection</li>
      </ul>

      <AviniProductLink products={["Plus Mind and Vision", "Zmunity Mushrooms", "Plus Energy"]} />

      <Card className="bg-destructive/5 border-destructive/20"><CardContent className="pt-4">
        <p className="text-sm font-medium">Important: If you are experiencing thoughts of self-harm please call <span className="font-bold">988</span> immediately. For persistent depression that has not responded to talk therapy or medication — that is often because those approaches work at the conscious level while the root cause lives in the subconscious. Subconscious root cause work using NLP, Timeline Therapy™ and MindShifting techniques often creates breakthroughs where years of talk therapy could not.</p>
      </CardContent></Card>
    </SectionWrapper>
  );
}

function TraumaSection() {
  return (
    <SectionWrapper title="Your Patterns Are Not Personality — They Are Protection">
      <p>Every pattern you have that feels self-destructive was once a survival strategy.</p>
      <p>The people-pleasing. The overachieving. The self-sabotage. The walls you build. The relationships you choose. The way you shrink in certain rooms and explode in others.</p>
      <p className="font-medium">None of it is random. None of it is broken. All of it made perfect sense given what you experienced.</p>

      <Card className="bg-muted/30"><CardContent className="pt-4 space-y-2">
        <h4 className="font-semibold">Trauma is also:</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>The consistent experience of not being seen or valued</li>
          <li>Growing up in an unpredictable or emotionally unsafe environment</li>
          <li>Being loved conditionally — only when you performed, achieved or complied</li>
          <li>Having your emotions dismissed, minimized or punished</li>
          <li>Witnessing conflict, addiction or instability without support</li>
          <li>Being the emotional caretaker for a parent or sibling</li>
        </ul>
      </CardContent></Card>

      <Card className="border-accent/20 bg-accent/5"><CardContent className="pt-4">
        <h4 className="font-semibold text-accent mb-2">The Worth Thermostat connection</h4>
        <p className="text-sm">Trauma directly sets your Worth Thermostat. The experiences that taught you that you were not safe, not valued, not worthy — those are the experiences that calibrated your thermostat low.</p>
        <p className="text-sm font-medium mt-2">Healing trauma means recalibrating the thermostat at its root.</p>
      </CardContent></Card>

      <Card className="bg-muted/30"><CardContent className="pt-4 space-y-3">
        <h4 className="font-semibold">Common trauma responses and their patterns:</h4>
        <div className="space-y-2 text-sm">
          <p><strong>FIGHT response</strong> → anger, control, perfectionism, aggression when boundaries are crossed</p>
          <p><strong>FLIGHT response</strong> → avoidance, workaholism, running from intimacy, staying busy</p>
          <p><strong>FREEZE response</strong> → numbness, dissociation, inability to make decisions, paralysis</p>
          <p><strong>FAWN response</strong> → people-pleasing, loss of self, inability to say no, chronic self-abandonment</p>
        </div>
        <h4 className="font-semibold mt-3">The Worth Thermostat types map directly to trauma responses:</h4>
        <ul className="space-y-1 text-sm">
          <li>The Settler → chronic fawn response</li>
          <li>The Seeker → alternating flight and fawn</li>
          <li>The Boundary Builder → moving from fawn toward fight</li>
          <li>The Rising Queen / King → integrated responses with occasional regression</li>
          <li>The Unapologetic → regulated nervous system — responds rather than reacts</li>
        </ul>
      </CardContent></Card>

      <h4 className="font-semibold">Tools for trauma support:</h4>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Nervous System Diagnostic — identify your dominant trauma response</li>
        <li>Inner Child Healing — heal the experiences that set the thermostat</li>
        <li>Shadow Work — integrate the parts that were abandoned</li>
        <li>Somatic Breathing — regulate the body's stored trauma response</li>
        <li>Attachment Style Analyzer — understand how trauma affects relationships</li>
        <li>Body Map Journal — locate where trauma lives in the body</li>
        <li>Emotional Surgery Lessons — all 4 tracks address trauma roots directly</li>
      </ul>

      <AviniProductLink products={["Cell Defender", "Plus Relief", "Zmunity Mushrooms", "Nano Silver"]} />

      <p className="text-sm italic text-muted-foreground">Complex trauma lives in the subconscious body and nervous system — not at the conscious level where talk therapy operates. That is why many people spend years in therapy without the patterns actually changing. Subconscious modalities like NLP, Timeline Therapy™ and Hypnotherapy work directly at the level where trauma is stored — creating faster, deeper and more lasting change. If you are ready to go to the root consider booking a private session with Lorie.</p>
    </SectionWrapper>
  );
}

function ProfessionalHelpSection() {
  return (
    <SectionWrapper title="Knowing When to Reach Further">
      <p>This app is a powerful tool for emotional healing and worth recalibration.</p>
      <p>And — there are times when you need more than an app can offer.</p>
      <p className="font-medium">There is a difference between managing symptoms and healing the root.</p>

      <p className="text-sm">Traditional talk therapy works at the conscious level — you talk about your experiences, your feelings and your patterns. For many people this provides relief and insight. But talking about trauma can also reinforce it by repeatedly activating the same neural pathways without resolving the subconscious root cause.</p>
      <p className="text-sm">What Lorie does — and what this app is built on — is subconscious root cause work. Using NLP, Timeline Therapy™, Hypnotherapy and MindShifting techniques she works at the level where patterns, beliefs, trauma and identity are actually stored and encoded.</p>
      <p className="text-sm italic">This is why clients often experience shifts in one session that years of talk therapy did not produce.</p>

      <Card className="bg-destructive/5 border-destructive/20"><CardContent className="pt-4 space-y-3">
        <h4 className="font-semibold text-destructive">If you are experiencing any of the following please reach out for immediate support:</h4>
        <ul className="space-y-2 text-sm">
          <li><strong>Thoughts of suicide or self-harm</strong> → call or text <span className="font-bold">988</span> immediately</li>
          <li><strong>Domestic violence or abuse</strong> → National DV Hotline: <span className="font-bold">1-800-799-7233</span></li>
          <li><strong>Active substance abuse crisis</strong> → SAMHSA: <span className="font-bold">1-800-662-4357</span></li>
          <li><strong>Psychosis or complete loss of reality</strong> → contact emergency services</li>
        </ul>
      </CardContent></Card>

      <p className="text-sm">For deeper healing work beyond what this app provides — Lorie offers 1:1 coaching sessions using her master-certified subconscious modalities. These sessions identify and dissolve root causes at the level where they live — in the subconscious mind — not just at the surface.</p>

      <Card className="border-accent/20 bg-accent/5"><CardContent className="pt-4 space-y-3">
        <p className="text-center font-medium text-foreground">You are not broken. You were never broken.</p>
        <p className="text-center text-sm">You just needed someone to go to the root.</p>
        <p className="text-center text-accent font-medium">That is what we do here.</p>
      </CardContent></Card>

      <Card className="bg-card border-border"><CardContent className="pt-4 space-y-3">
        <h4 className="font-serif text-lg font-bold text-foreground">A note from Lorie:</h4>
        <div className="text-sm space-y-3 text-foreground/85">
          <p>I watched my mother die.</p>
          <p>Not from a sudden disease. From stress. From worry. From holding onto negative emotions for decades until her body broke down.</p>
          <p>Here is what makes her story even more heartbreaking.</p>
          <p>My mother was a nurse her entire life.</p>
          <p>She understood medicine. She worked alongside doctors every single day. She knew the system from the inside.</p>
          <p>And the system still failed her.</p>
          <p>The doctors she worked with — the ones she trusted — were constantly diagnosing and misdiagnosing her. Telling her what to take. Treating her symptoms. Never once asking what was at the root.</p>
          <p>She went from prescription to prescription. Side effect to side effect. Never healed. Only managed.</p>
          <p>I was a Senior Pharmacy Technician. I had a B.S. in Pharmacology. I had studied graduate-level therapeutics. I knew exactly what those medications were doing to her body.</p>
          <p>And I could not stop it.</p>
          <p className="font-medium">Because the system is not designed to heal. It is designed to manage.</p>
          <p>That loss became everything you see in this app.</p>
          <p>I trained in NLP, Timeline Therapy™, Hypnotherapy and 6 MindShifting Techniques — modalities that work at the subconscious level where the root causes of stress, illness, trauma and limiting beliefs actually live.</p>
          <p>My mother — a woman who spent her life caring for others — never got someone to go to her root.</p>
          <p className="font-medium">I became that person.</p>
          <p>Not in time to save her.</p>
          <p>But in time to help you.</p>
          <p>If you are in a crisis situation please reach out for immediate help. Call or text <span className="font-bold">988</span>. Contact emergency services.</p>
          <p>For everything else — you are in exactly the right place.</p>
          <p className="text-accent font-medium">Permission granted to finally heal. 🙌</p>
        </div>
      </CardContent></Card>
    </SectionWrapper>
  );
}
