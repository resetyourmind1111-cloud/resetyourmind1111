import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useFoundingMode } from "@/hooks/useFoundingMode";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Check } from "lucide-react";
import logo from "@/assets/logo.png";
import { track } from "@/lib/analytics";

// TODO(lorie): Replace these with real beta-member quotes (first name + initial only is fine).
const TESTIMONIALS: { quote: string; attribution: string }[] = [];

export default function Landing() {
  const { foundingMode, spotsRemaining, loading: foundingLoading } = useFoundingMode();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    track("landing_view");
  }, []);

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
            Why do you keep doing this?
          </h1>

          <p className="text-[#F9F6F0]/70 font-sans text-base md:text-lg mb-8 max-w-md mx-auto">
            Discover the hidden pattern that may be keeping you stuck — and get a personalized starting point to move forward with more clarity, confidence, and self-trust.
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
              onClick={() => track("cta_click_start_reset", { location: "hero" })}
              className="w-full bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#0A0A0A] h-14 text-lg font-semibold rounded-xl"
            >
              <Link to="/whats-my-pattern">Discover My Pattern</Link>
            </Button>

            {/* Lower-commitment secondary CTA */}
            <Link
              to="/assessment"
              onClick={() => track("cta_click_assessment", { location: "hero_secondary" })}
              className="block text-[#F9F6F0]/70 hover:text-[#C9A84C] text-sm transition-colors pt-1"
            >
              Take the 3-Minute Worth Thermostat →
            </Link>
          </div>

          <p className="text-[#F9F6F0]/40 text-sm mt-4 italic">
            You are not broken.<br />You are conditioned.<br />And patterns can change.
          </p>

          <div className="mt-6">
            <p className="text-[#F9F6F0]/30 text-sm">
              No credit card required. Free 7-day trial available after your personalized result.
            </p>
            <p className="text-[#F9F6F0]/40 text-xs mt-3">
              People often discover patterns around: overthinking, self-doubt, procrastination, people-pleasing, perfectionism, visibility, worthiness.
            </p>
          </div>
        </section>

        {/* What happens next */}
        <section className="max-w-xl mx-auto mb-16">
          <h2 className="font-display text-xl md:text-2xl text-center mb-6">
            What happens next
          </h2>
          <ul className="space-y-3">
            {[
              "Discover Your Pattern — Answer 6 quick questions and identify the pattern that may be keeping you stuck.",
              "Get Your Personalized Result — Understand how the pattern may be showing up and what it may be trying to protect you from.",
              "Start Your Reset — Receive a recommended tool and a simple first step designed specifically for your result.",
              "Continue Your 7-Day Reset — Explore guided tools, permission slips, meditations, and daily practices that help reinforce new patterns.",
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
