import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useFoundingMode } from "@/hooks/useFoundingMode";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Check } from "lucide-react";
import logo from "@/assets/logo.png";

// TODO(lorie): Replace these with real beta-member quotes (first name + initial only is fine).
const TESTIMONIALS: { quote: string; attribution: string }[] = [];

export default function Landing() {
  const { foundingMode, spotsRemaining, loading: foundingLoading } = useFoundingMode();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/home");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-[#C9A84C] font-display text-4xl font-bold tracking-widest"
        >
          1111
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F9F6F0]">
      {/* Top nav — Sign In demoted to text link */}
      <header className="w-full px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Reset Your Mind 1111" className="h-8 w-auto" />
        </Link>
        <Link
          to="/auth"
          className="text-sm text-[#F9F6F0]/70 hover:text-[#C9A84C] transition-colors"
        >
          Sign in →
        </Link>
      </header>

      <main className="px-6 pb-20">
        {/* Hero */}
        <section className="max-w-xl mx-auto text-center pt-10 pb-16">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="" aria-hidden="true" className="h-20 w-auto" />
          </div>

          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mb-10" />

          <h1 className="font-display text-3xl md:text-5xl text-[#F9F6F0] leading-tight mb-5">
            In 7 days, name the exact pattern keeping you stuck —
            <span className="text-[#C9A84C]"> and get the first tool to interrupt it.</span>
          </h1>

          <p className="text-[#F9F6F0]/70 font-sans text-base md:text-lg mb-8 max-w-md mx-auto">
            Reset Your Mind 1111™ works at the nervous system level — where the
            patterns around money, love, health and leadership actually live.
          </p>

          {/* Founding badge — only after fetch settles so it doesn't flash */}
          {!foundingLoading && foundingMode && spotsRemaining > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-[#3D1A6E]/30 border border-[#3D1A6E]/50 rounded-full px-4 py-2">
                <span className="text-sm">⭐</span>
                <span className="text-sm font-medium">
                  Founding Member rate — $44/month locked in as long as you stay
                </span>
              </div>
              <p className="text-[#F9F6F0]/40 text-xs mt-2">
                {spotsRemaining} of 111 spots remaining
              </p>
            </motion.div>
          )}

          {/* Primary CTA */}
          <div className="space-y-3">
            <Button
              asChild
              className="w-full bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#0A0A0A] h-14 text-lg font-semibold rounded-xl"
            >
              <Link to="/auth?view=signup">Start My Free 7-Day Reset →</Link>
            </Button>

            {/* Lower-commitment secondary CTA */}
            <Link
              to="/assessment"
              className="block text-[#F9F6F0]/70 hover:text-[#C9A84C] text-sm transition-colors pt-1"
            >
              Not ready? Take the 3-minute Worth Thermostat →
            </Link>
          </div>

          <p className="text-[#F9F6F0]/30 text-sm mt-6">
            No credit card required. 7 days free.
          </p>
        </section>

        {/* What you get in 7 days */}
        <section className="max-w-xl mx-auto mb-16">
          <h2 className="font-display text-xl md:text-2xl text-center mb-6">
            What happens in your first 7 days
          </h2>
          <ul className="space-y-3">
            {[
              "Day 1 — Worth Thermostat result: see the exact pattern running you",
              "Daily Permission Slip + Reset Anthem to anchor the shift",
              "One Healing Tool a day, paired to your result",
              "Day 7 — decide if you want to keep going. No auto-charge.",
            ].map((line) => (
              <li key={line} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#C9A84C] mt-0.5 shrink-0" />
                <span className="text-[#F9F6F0]/85">{line}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Testimonials — only render when real ones exist */}
        {TESTIMONIALS.length > 0 && (
          <section className="max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-xl md:text-2xl text-center mb-6">
              Early members are saying
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <blockquote
                  key={t.attribution}
                  className="bg-[#06060e] border border-[#C9A84C]/15 rounded-xl p-5 text-sm"
                >
                  <p className="text-[#F9F6F0]/85 mb-3">“{t.quote}”</p>
                  <footer className="text-[#C9A84C]/80 text-xs">— {t.attribution}</footer>
                </blockquote>
              ))}
            </div>
          </section>
        )}

        {/* Pillars strip — honest, no fabricated stats */}
        <section className="max-w-xl mx-auto text-center">
          <p className="text-[#C9A84C] font-display tracking-wide">
            Health · Wealth · Love · Leadership
          </p>
          <p className="text-[#F9F6F0]/50 text-sm mt-2">
            The four areas Reset Your Mind 1111™ recalibrates.
          </p>
        </section>
      </main>
    </div>
  );
}
