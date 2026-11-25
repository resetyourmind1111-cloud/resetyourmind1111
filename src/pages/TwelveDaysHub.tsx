import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const SERIF = "'Cormorant Garamond', serif";
const SANS = "'Montserrat', sans-serif";

const DAYS = [
  { day: 1, date: "Sat, December 12", opens: "Dec 12", title: "Receive", gift: "🎁 Surprise Gift 1 unlocks today: your Abundance Oracle card" },
  { day: 2, date: "Sun, December 13", opens: "Dec 13", title: "Want More", gift: "" },
  { day: 3, date: "Mon, December 14", opens: "Dec 14", title: "Stop Proving Yourself", gift: "" },
  { day: 4, date: "Tue, December 15", opens: "Dec 15", title: "Outgrow Your Old Identity", gift: "" },
  { day: 5, date: "Wed, December 16", opens: "Dec 16", title: "Feel Safe With Success", gift: "🎁 Surprise Gift 2 unlocks today: Discover Your Worth Thermostat™" },
  { day: 6, date: "Thu, December 17", opens: "Dec 17", title: "Enjoy Your Life", gift: "" },
  { day: 7, date: "Fri, December 18", opens: "Dec 18", title: "Be Seen", gift: "" },
  { day: 8, date: "Sat, December 19", opens: "Dec 19", title: "Receive Fair Compensation", gift: "" },
  { day: 9, date: "Sun, December 20", opens: "Dec 20", title: "Stop Apologizing", gift: "" },
  { day: 10, date: "Mon, December 21", opens: "Dec 21", title: "Set Higher Standards", gift: "" },
  { day: 11, date: "Tue, December 22", opens: "Dec 22", title: "Trust Yourself", gift: "" },
  { day: 12, date: "Wed, December 23", opens: "Dec 23", title: "Become More", gift: "🎁 Surprise Gift 3 unlocks today: your personalized 2027 Permission Granted™ Blueprint" },
];

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl sm:text-3xl md:text-4xl text-center mb-6 text-primary" style={{ fontFamily: SERIF }}>{children}</h2>
);

export default function TwelveDaysHub() {
  useEffect(() => {
    const prev = document.title;
    document.title = "12 Days of Permission Granted™ — Participant Hub";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => { document.title = prev; meta.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: SERIF }}>
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
        <header className="text-center mb-14">
          <h1 className="text-4xl sm:text-5xl md:text-6xl leading-tight mb-5 text-primary">12 Days of Permission Granted™ — The Abundance Edition</h1>
          <p className="text-xl sm:text-2xl italic mb-5">Welcome in. Your 12 days live here — a new day opens each morning, December 12–23, 2026.</p>
          <p className="text-xs sm:text-sm tracking-[0.15em] uppercase text-muted-foreground" style={{ fontFamily: SANS }}>Permission Granted™ — the gift you don't need anyone else to give you.</p>
        </header>

        <section className="mb-16">
          <H2>Welcome</H2>
          <p className="text-center text-xs sm:text-sm tracking-[0.2em] uppercase mb-6 text-muted-foreground" style={{ fontFamily: SANS }}>Opens December 11</p>
          <div className="rounded-xl p-6 sm:p-8 border-2 border-primary/30 bg-card text-center">
            <h3 className="text-2xl sm:text-3xl mb-4 text-primary">Start Here — Discover Your Pattern (December 11)</h3>
            <p className="text-lg sm:text-xl leading-relaxed mb-7">Before Day 1, take the six-question Pattern Discovery™ and note the pattern you receive — your 12 days are personalized around it.</p>
            <Button asChild className="inline-block h-auto px-8 py-4 rounded-md font-semibold tracking-wider uppercase text-sm" style={{ fontFamily: SANS }}><a href="#">Discover Your Pattern</a></Button>
          </div>
        </section>

        <section className="mb-16">
          <H2>The 12 Days</H2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DAYS.map((d) => (
              <a key={d.day} href="#" className="block rounded-xl p-5 border border-primary/30 bg-card transition hover:-translate-y-0.5 hover:border-primary">
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground" style={{ fontFamily: SANS }}>Day {d.day} · {d.date}</span>
                </div>
                <h3 className="text-2xl leading-snug mb-3 text-primary">{d.title}</h3>
                {d.gift && <p className="text-base leading-relaxed mb-3 italic">{d.gift}</p>}
                <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground" style={{ fontFamily: SANS }}>Opens {d.opens}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-10 text-sm leading-relaxed opacity-80" style={{ fontFamily: SANS }}>
          <p>Pattern Discovery™ and the Worth Thermostat™ are self-reflection tools created by Lorie Wu — not medical, psychological, or financial assessments. This program is a practical educational experience, not therapy. Participation in every exercise is voluntary.</p>
        </section>

        <footer className="text-center text-sm text-muted-foreground" style={{ fontFamily: SANS }}>
          Questions: <a href="mailto:resetyourmind1111@gmail.com" className="underline">resetyourmind1111@gmail.com</a>
        </footer>
      </div>
    </div>
  );
}
