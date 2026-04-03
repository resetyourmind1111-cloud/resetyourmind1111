import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft } from "lucide-react";

const states = [
  { emoji: "🧊", label: "I feel stuck", subtext: "overwhelmed, frozen", path: "stuck" },
  { emoji: "🌀", label: "I'm avoiding something", subtext: "procrastinating, resisting", path: "avoiding" },
  { emoji: "🌪", label: "I'm overthinking", subtext: "can't quiet my mind", path: "overthinking" },
  { emoji: "⚡", label: "I feel triggered", subtext: "emotional reaction, stress", path: "triggered" },
  { emoji: "💰", label: "I want to grow my income", subtext: "money, abundance", path: "abundance" },
  { emoji: "🌿", label: "I want to feel aligned", subtext: "grounded, spiritual", path: "aligned" },
];

export default function SupportFlow() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20 md:pt-24 pb-24 md:pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <button onClick={() => navigate("/home")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              What do you need right now?
            </h1>
            <p className="text-muted-foreground text-base">We'll guide you to the right tool.</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {states.map((state, i) => (
              <motion.button
                key={state.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/support-flow/${state.path}`)}
                className="relative flex flex-col items-start gap-2 p-5 rounded-2xl text-left transition-all duration-200 min-h-[80px] border-l-4 border-l-[#C9A84C] bg-gradient-to-br from-[#3D1A6E]/30 to-[#3D1A6E]/10 border border-[#3D1A6E]/30 hover:border-[#C9A84C]/50 hover:shadow-[0_0_20px_rgba(201,168,76,0.1)]"
              >
                <span className="text-2xl">{state.emoji}</span>
                <span className="font-bold text-[#F9F6F0] text-lg leading-tight">{state.label}</span>
                <span className="text-[#C9A84C]/70 text-[13px] italic">{state.subtext}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
