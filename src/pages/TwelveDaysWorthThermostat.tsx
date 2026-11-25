import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Gift, Thermometer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { QUESTIONS, QUESTION_COUNT, RESULTS, scoreAnswers } from "@/data/worthThermostatFormB";
import { participantSchema, saveWorthReflection, saveWorthResult } from "@/lib/worthThermostatFormB";
import "./TwelveDaysWorthThermostat.css";

type Stage = "reveal" | "details" | "questions" | "pending" | "result";

export default function TwelveDaysWorthThermostat() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>("reveal");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<ReturnType<typeof scoreAnswers> | null>(null);
  const [reflection, setReflection] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const receipt = useRef(crypto.randomUUID());
  const heading = useRef<HTMLHeadingElement>(null);
  const question = QUESTIONS[index];
  const result = score ? RESULTS[score.result_type] : null;
  const details = { first_name: firstName, email, consent };
  const detailsValid = participantSchema.safeParse(details).success;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Surprise Gift 2 — Discover Your Worth Thermostat™";
    const previousRobots = Array.from(document.head.querySelectorAll<HTMLMetaElement>('meta[name="robots"]'));
    const previousContents = previousRobots.map(meta => meta.content);
    previousRobots.forEach(meta => { meta.content = "noindex, nofollow"; });
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.title = previousTitle;
      meta.remove();
      previousRobots.forEach((item, i) => { item.content = previousContents[i]; });
    };
  }, []);

  useEffect(() => { heading.current?.focus(); }, [stage, index]);

  async function advance() {
    if (!answers[index] || busy) return;
    if (index + 1 < QUESTIONS.length) { setIndex(index + 1); return; }
    if (QUESTIONS.length !== QUESTION_COUNT) { setStage("pending"); return; }
    setBusy(true);
    setError("");
    try {
      const saved = await saveWorthResult(receipt.current, details, answers);
      setScore(saved);
      setStage("result");
    } catch {
      setError("Your result couldn’t be saved. Please try again.");
    } finally { setBusy(false); }
  }

  async function returnToHub() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await saveWorthReflection(receipt.current, reflection);
      navigate("/12-days-hub");
    } catch {
      setError("Your reflection couldn’t be saved. Please try again.");
    } finally { setBusy(false); }
  }

  function retake() {
    receipt.current = crypto.randomUUID();
    setAnswers([]); setIndex(0); setScore(null); setReflection(""); setError(""); setStage("details");
  }

  const titleClass = "text-3xl sm:text-4xl md:text-5xl leading-tight text-primary outline-none";
  return (
    <main className="worth-gift min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8 sm:py-16">
        <p className="worth-label mb-8 text-center text-xs text-muted-foreground">12 Days of Permission Granted™ — The Abundance Edition</p>

        {stage === "reveal" && <section className="text-center space-y-6">
          <Gift className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
          <h1 ref={heading} tabIndex={-1} className={titleClass}>Surprise Gift 2 — Discover Your Worth Thermostat™</h1>
          <p className="text-2xl italic">Your second gift is a mirror…</p>
          <p className="text-xl leading-relaxed">Your worth thermostat is set low in one area—and it's affecting everything. Answer 25 honest questions to see exactly where you're set and what to do about it.</p>
          <p className="worth-label text-sm text-muted-foreground">✨ 25 Questions · 2 Minutes · Instant Results</p>
          <Button className="w-full sm:w-auto px-10 py-4" onClick={() => setStage("details")}>Begin <ArrowRight /></Button>
        </section>}

        {stage === "details" && <section>
          <h1 ref={heading} tabIndex={-1} className={titleClass + " mb-8"}>Your Gift 2 result</h1>
          <form className="space-y-6" onSubmit={event => { event.preventDefault(); if (detailsValid) setStage("questions"); }}>
            <label className="worth-label block text-sm" htmlFor="gift-first-name">First name <span aria-hidden="true">*</span>
              <Input id="gift-first-name" autoComplete="given-name" required maxLength={100} value={firstName} onChange={event => setFirstName(event.target.value)} className="mt-2 h-12" />
            </label>
            <label className="worth-label block text-sm" htmlFor="gift-email">Email <span aria-hidden="true">*</span>
              <Input id="gift-email" autoComplete="email" type="email" required maxLength={255} value={email} onChange={event => setEmail(event.target.value)} className="mt-2 h-12" />
            </label>
            <div className="flex items-start gap-3">
              <Checkbox id="gift-consent" checked={consent} onCheckedChange={value => setConsent(value === true)} className="mt-1" aria-required="true" />
              <label htmlFor="gift-consent" className="worth-label text-sm leading-relaxed">Email me my result and save it to my program record.</label>
            </div>
            <p className="worth-label text-xs leading-relaxed text-muted-foreground">The Worth Thermostat™ is a self-reflection tool, not a psychological or medical diagnosis.</p>
            <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={() => setStage("reveal")}><ArrowLeft /> Back</Button>
              <Button type="submit" disabled={!detailsValid} className="flex-1">Continue <ArrowRight /></Button>
            </div>
          </form>
        </section>}

        {stage === "questions" && question && <section>
          <p className="worth-label mb-3 text-sm text-muted-foreground">Question {index + 1} of 25</p>
          <progress value={index + 1} max={QUESTION_COUNT} className="mb-8 h-2 w-full accent-primary" aria-label="Assessment progress" />
          <p className="worth-label mb-3 text-sm text-primary">{question.category}</p>
          <h1 ref={heading} tabIndex={-1} className="text-2xl sm:text-3xl leading-snug outline-none mb-6">{question.text}</h1>
          <div role="radiogroup" aria-label={question.text} className="space-y-3">
            {question.options.map((option, optionIndex) => {
              const selected = answers[index] === optionIndex + 1;
              return <Button key={option} role="radio" aria-checked={selected} variant="outline" disabled={busy}
                className={"w-full justify-start text-left font-normal p-4 border " + (selected ? "bg-primary text-primary-foreground border-primary" : "border-input/40 text-foreground")}
                onClick={() => { setError(""); setAnswers(previous => { const next = [...previous]; next[index] = optionIndex + 1; return next; }); }}>
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current" aria-hidden="true">{selected && <Check className="h-3 w-3" />}</span>
                <span className="text-sm leading-relaxed">{option}</span>
              </Button>;
            })}
          </div>
          <div className="mt-8 flex gap-3">
            <Button variant="ghost" disabled={busy} onClick={() => { setError(""); if (index > 0) setIndex(index - 1); else setStage("details"); }}><ArrowLeft /> Back</Button>
            <Button className="flex-1" disabled={!answers[index] || busy} onClick={advance}>{busy ? "Saving…" : index === QUESTION_COUNT - 1 ? "Reveal My Result" : "Continue"}<ArrowRight /></Button>
          </div>
        </section>}

        {stage === "pending" && <section className="text-center space-y-6">
          <Thermometer className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
          <h1 ref={heading} tabIndex={-1} className={titleClass}>Your next questions are coming soon</h1>
          <p className="text-xl">The full Gift 2 assessment isn’t ready yet. Please come back for all 25 questions.</p>
          <Button variant="ghost" onClick={() => setStage("questions")}><ArrowLeft /> Back</Button>
          <Button asChild><Link to="/12-days-hub">Return to Day 5 <ArrowRight /></Link></Button>
        </section>}

        {stage === "result" && result && score && <section className="space-y-8">
          <header className="text-center space-y-4">
            <Thermometer className="mx-auto h-9 w-9 text-primary" aria-hidden="true" />
            <h1 ref={heading} tabIndex={-1} className={titleClass}>{score.result_type}</h1>
            <p className="text-3xl text-primary">{result.temperature}</p>
            <p className="worth-label text-sm text-muted-foreground">{result.setting}</p>
            <p className="text-5xl text-primary">{score.percentage}%</p>
            <p className="worth-label text-sm">Where your worth is set</p>
            {result.tagline && <blockquote className="text-2xl italic">"{result.tagline}"</blockquote>}
          </header>
          <p className="text-xl leading-relaxed">{result.description}</p>
          {result.meaning && <div><h2 className="text-2xl text-primary mb-3">What this means for you</h2><ul className="list-disc pl-5 space-y-2 text-lg">{result.meaning.map(item => <li key={item}>{item}</li>)}</ul></div>}
          {result.goodNews && <div><h2 className="text-2xl text-primary mb-3">The good news</h2><p className="text-xl leading-relaxed">{result.goodNews}</p></div>}
          <div><h2 className="text-2xl text-primary mb-3">What you need</h2><p className="text-xl leading-relaxed">{result.needs}</p></div>
          <div><h2 className="text-2xl text-primary mb-3">First steps</h2><p className="text-lg leading-relaxed">{result.firstSteps.join(" · ")}</p></div>
          <div className="border-t border-primary/30 pt-8 space-y-6">
            <h2 className="text-3xl text-primary">Your Gift 2 package</h2>
            <div className="rounded-lg border border-primary bg-card px-6 py-8 text-center">
              <Gift className="h-7 w-7 text-primary mx-auto mb-5" aria-hidden="true" />
              <p className="worth-label text-xs text-muted-foreground mb-3">Permission Slip</p>
              <p className="text-3xl text-primary leading-snug">{result.slip}</p>
            </div>
            <div><h3 className="worth-label text-sm text-muted-foreground mb-2">Recommended meditation</h3><p className="text-2xl">{result.meditation}</p></div>
            <div><h3 className="worth-label text-sm text-muted-foreground mb-2">Recommended tool</h3><p className="text-2xl">{result.tool}</p><p className="text-lg leading-relaxed mt-2">{result.toolDescription}</p></div>
          </div>
          <label htmlFor="gift-reflection" className="block text-xl">One thing I now see about what I believe I deserve…
            <textarea id="gift-reflection" value={reflection} onChange={event => setReflection(event.target.value)} maxLength={5000} rows={4} className="mt-3 w-full rounded-md border border-input/50 bg-background p-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </label>
          <Button className="w-full" disabled={busy} onClick={returnToHub}>{busy ? "Saving…" : "Return to Day 5"}<ArrowRight /></Button>
          <p className="worth-label text-xs text-muted-foreground leading-relaxed">You can retake this anytime — your December 16 result is the one your 2027 Blueprint uses.</p>
          <Button variant="ghost" onClick={retake} disabled={busy}>Retake assessment</Button>
        </section>}

        {error && <p role="alert" className="worth-label mt-5 text-sm text-destructive">{error}</p>}
        <p className="worth-label mt-12 border-t border-primary/20 pt-6 text-center text-xs leading-relaxed text-muted-foreground">Form B canonical, approved Nov 25, 2026 · Cut-points owner-approved Nov 25, 2026</p>
      </div>
    </main>
  );
}