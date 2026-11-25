import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const PURPLE = "#2d1a4d";
const GOLD = "#c9a84c";
const LAVENDER = "#9b7fc7";
const SERIF = "'Cormorant Garamond', serif";
const SANS = "'Montserrat', sans-serif";
const ZELLE = "[ZELLE ID PLACEHOLDER]";

const TIERS = [
  { id: "experience", name: "The Abundance Experience", price: "$11.11", desc: "12 days of Permission Granted™ · 12 emotional resets · three surprise Christmas gifts · automated daily delivery." },
  { id: "reset", name: "The Abundance Reset", price: "$33", desc: "Everything in The Abundance Experience, plus a 45-minute Live Group Reset on Google Meet and seven days of guided reset support after the live session.", note: "This is a different offering from the $33 Live Reset — this one is the 12 Days package with the live group session included." },
  { id: "personalized", name: "The Personalized Abundance Experience", price: "$88", desc: "Everything in The Abundance Reset, plus a private 45-minute Personalized Reset on Google Meet, tailored to your individual patterns." },
] as const;

const schema = z.object({
  first_name: z.string().trim().min(1, "Please enter your first name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  tier: z.enum(["experience", "reset", "personalized"], { errorMap: () => ({ message: "Please choose your tier" }) }),
  program_consent: z.literal(true, { errorMap: () => ({ message: "Please confirm you'd like to receive the program emails" }) }),
  marketing_consent: z.boolean(),
});

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl sm:text-3xl md:text-4xl text-center mb-6" style={{ fontFamily: SERIF, color: GOLD }}>{children}</h2>
);

export default function TwelveDaysAbundance() {
  const [tier, setTier] = useState<string>("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const prev = document.title;
    document.title = "12 Days of Permission Granted™ — The Abundance Edition";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => { document.title = prev; meta.remove(); };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const parsed = schema.safeParse({ first_name: firstName, email, tier, program_consent: consent, marketing_consent: marketing });
    if (!parsed.success) { setError(parsed.error.errors[0].message); return; }
    setLoading(true);
    const { error: dbErr } = await supabase.from("abundance_registrations").insert(parsed.data as any);
    setLoading(false);
    if (dbErr) { setError("Something went wrong. Please try again or email resetyourmind1111@gmail.com."); return; }
    setDone(true);
  };

  const input = "w-full rounded-md px-4 py-3 bg-white/5 border border-white/20 focus:outline-none focus:border-[#c9a84c]";

  return (
    <div className="min-h-screen" style={{ backgroundColor: PURPLE, color: "#ffffff", fontFamily: SERIF }}>
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
        <header className="text-center mb-14">
          <h1 className="text-4xl sm:text-5xl md:text-6xl leading-tight mb-5" style={{ color: GOLD }}>12 Days of Permission Granted™ — The Abundance Edition</h1>
          <p className="text-xl sm:text-2xl italic mb-5">Permission Granted™ — the gift you don't need anyone else to give you.</p>
          <p className="text-xs sm:text-sm tracking-[0.15em] uppercase" style={{ fontFamily: SANS, color: LAVENDER }}>December 12–23, 2026 · 12 days · about 10 minutes a day, delivered to your inbox.</p>
        </header>

        <p className="text-lg sm:text-xl leading-relaxed mb-16 text-center">This December, give yourself the gift you keep waiting for someone else to give you: permission. For 12 days you'll receive a daily permission, a short teaching, a guided emotional reset, and a declaration — built around your own pattern, so it lands where you actually live. Three surprise Christmas gifts are tucked inside the 12 days, including the Worth Thermostat™ assessment and your personalized 2027 Permission Granted™ Blueprint.</p>

        <section className="mb-16">
          <H2>Choose your experience</H2>
          <div className="grid gap-4">
            {TIERS.map((t) => {
              const sel = tier === t.id;
              return (
                <button type="button" key={t.id} onClick={() => setTier(t.id)} aria-pressed={sel}
                  className="text-left rounded-xl p-6 border-2 transition"
                  style={{ borderColor: sel ? GOLD : "rgba(255,255,255,0.15)", backgroundColor: sel ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.03)" }}>
                  <div className="flex justify-between items-baseline gap-4 mb-2">
                    <h3 className="text-2xl" style={{ color: GOLD }}>{t.name}</h3>
                    <span className="text-2xl font-semibold" style={{ fontFamily: SANS }}>{t.price}</span>
                  </div>
                  <p className="text-lg leading-relaxed">{t.desc}</p>
                  {"note" in t && t.note && <p className="text-sm mt-3 italic" style={{ color: LAVENDER }}>{t.note}</p>}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-16">
          <H2>How it works</H2>
          <ol className="space-y-4 text-lg">
            {["Register below with your name and email, and choose your tier.",
              `Pay by Zelle to ${ZELLE} — or pay cash if you are registering with Lorie in person.`,
              "We confirm your payment and email your confirmation and access instructions. Your welcome experience opens December 11, and Day 1 arrives December 12."].map((s, i) => (
              <li key={i} className="flex gap-4"><span className="font-semibold" style={{ color: GOLD, fontFamily: SANS }}>{i + 1}.</span><span>{s}</span></li>
            ))}
          </ol>
        </section>

        <section className="mb-16 rounded-xl p-6 sm:p-8 border" style={{ borderColor: "rgba(201,168,76,0.4)" }}>
          <H2>Register</H2>
          {done ? (
            <p className="text-xl text-center leading-relaxed">You're registered! Next step: complete your payment by Zelle to {ZELLE}. We'll email your confirmation once payment is verified.</p>
          ) : (
            <form onSubmit={submit} className="space-y-5" style={{ fontFamily: SANS }}>
              <label className="block text-sm">First name *<input className={input + " mt-1"} value={firstName} onChange={(e) => setFirstName(e.target.value)} maxLength={100} required /></label>
              <label className="block text-sm">Email address *<input type="email" className={input + " mt-1"} value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} required /></label>
              <fieldset>
                <legend className="text-sm mb-2">Choose your tier *</legend>
                {TIERS.map((t) => (
                  <label key={t.id} className="flex items-center gap-3 py-1 text-sm">
                    <input type="radio" name="tier" value={t.id} checked={tier === t.id} onChange={() => setTier(t.id)} required />
                    {t.name} — {t.price}
                  </label>
                ))}
              </fieldset>
              <label className="flex gap-3 text-sm"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required className="mt-1" />Yes, email me the program materials and delivery emails for the 12 Days of Permission Granted™.</label>
              <label className="flex gap-3 text-sm"><input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-1" />Also send me occasional news and offers from Reset Your Mind 1111™.</label>
              {error && <p className="text-sm" style={{ color: "#f5b5b5" }}>{error}</p>}
              <button type="submit" disabled={loading} className="w-full py-4 rounded-md font-semibold tracking-wider uppercase disabled:opacity-60" style={{ backgroundColor: GOLD, color: PURPLE }}>{loading ? "Registering…" : "Register"}</button>
            </form>
          )}
        </section>

        <section className="mb-10 text-sm leading-relaxed opacity-80" style={{ fontFamily: SANS }}>
          <h3 className="uppercase tracking-[0.2em] text-xs mb-2" style={{ color: GOLD }}>Please note</h3>
          <p>Pattern Discovery™ and the Worth Thermostat™ are self-reflection tools created by Lorie Wu. They are not medical, psychological, or financial assessments, and this program is a practical educational experience — not therapy. Participation in every exercise is voluntary, and you always choose how much you share.</p>
        </section>

        <section className="mb-14 text-sm leading-relaxed opacity-80" style={{ fontFamily: SANS }}>
          <h3 className="uppercase tracking-[0.2em] text-xs mb-2" style={{ color: GOLD }}>Refund terms</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Full refund if you cancel before the program begins on December 12, 2026 — just email us.</li>
            <li>If you cancel after the program begins, days already delivered aren't refundable, but the unused portion can be applied as credit toward a future Reset Your Mind 1111™ program or session.</li>
            <li>Private Personalized Reset sessions ($88 tier) may be rescheduled once with at least 24 hours' notice; a missed session without notice is forfeited.</li>
            <li>If we ever have to cancel the program, every buyer receives a full refund.</li>
          </ul>
        </section>

        <footer className="text-center text-sm" style={{ fontFamily: SANS, color: LAVENDER }}>
          Questions: <a href="mailto:resetyourmind1111@gmail.com" className="underline">resetyourmind1111@gmail.com</a>
        </footer>
      </div>
    </div>
  );
}
