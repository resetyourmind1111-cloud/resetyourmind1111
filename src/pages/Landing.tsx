import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useFoundingMode } from "@/hooks/useFoundingMode";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Check } from "lucide-react";
import logo from "@/assets/logo.png";
import lorieFounderAsset from "@/assets/lorie-wu-founder.jpeg.asset.json";
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
        <section className="max-w-6xl mx-auto pt-10 pb-16">
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
            {/* Copy column */}
            <div className="text-center md:text-left max-w-xl mx-auto md:mx-0 order-1">
              <div className="flex md:justify-start justify-center mb-6">
                <img src={logo} alt="" aria-hidden="true" className="h-20 w-auto" />
              </div>

              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mb-10 md:bg-gradient-to-r" />

              <h1 className="font-display text-3xl md:text-5xl text-[#F9F6F0] leading-tight mb-5">
                Why do you keep doing the same thing… even when you know better?
              </h1>

              <p className="text-[#F9F6F0]/70 font-sans text-base md:text-lg mb-8 max-w-md mx-auto md:mx-0">
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
            </div>

            {/* Founder photo column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="order-2 flex flex-col items-center md:items-start"
            >
              <div className="relative w-full max-w-sm mx-auto md:mx-0">
                <div className="absolute -inset-1 bg-gradient-to-br from-[#C9A84C]/40 via-[#3D1A6E]/30 to-transparent rounded-3xl blur-md" aria-hidden="true" />
                <img
                  src={lorieFounderAsset.url}
                  alt="Lorie Wu"
                  loading="eager"
                  className="relative w-full h-auto rounded-3xl border border-[#C9A84C]/20 shadow-2xl object-cover"
                />
              </div>
              <div className="mt-5 text-center md:text-left max-w-sm">
                <p className="font-display text-xl text-[#F9F6F0]">Lorie Wu</p>
                <p className="text-[#C9A84C] text-sm mt-1">
                  Creator of Reset Your Mind 1111™
                </p>
                <p className="text-[#F9F6F0]/60 text-sm mt-3 leading-relaxed">
                  Helping people uncover the hidden patterns behind overthinking, self-doubt, procrastination, overwhelm, and emotional exhaustion.
                </p>
                <p className="text-[#F9F6F0]/60 text-sm mt-2 leading-relaxed">
                  Because when you understand the pattern, you can begin to change it.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Founder Insight */}
        <section className="max-w-2xl mx-auto mb-16">
          <p className="text-[#C9A84C]/80 text-xs uppercase tracking-[0.2em] text-center mb-3">
            A common realization
          </p>
          <h2 className="font-display text-2xl md:text-3xl text-center text-[#F9F6F0] mb-6">
            What Many People Discover
          </h2>
          <div className="text-center space-y-4 text-[#F9F6F0]/85 text-base md:text-lg leading-relaxed">
            <p>Most people don’t need more information.</p>
            <p>They already know what they should do.</p>
            <p>The challenge is understanding why they keep doing something different.</p>
            <p className="mt-4">One of the most common realizations people experience is:</p>
            <p className="italic text-[#F9F6F0]/90">
              “I’m not broken. I’ve been repeating a pattern I couldn’t see.”
            </p>
            <p className="text-[#C9A84C]/90">
              Because awareness is often the first step toward change.
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
            The four areas where most people discover they've been repeating the same patterns for years.
          </p>
        </section>
      </main>
    </div>
  );
}
