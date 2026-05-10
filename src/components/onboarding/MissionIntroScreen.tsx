import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const PERMISSION_LIST = [
  "No pressure to be good at this",
  "No forced positivity",
  "Gentle enough for overwhelmed nervous systems",
  "Beginner safe",
  "You belong here exactly as you are",
];

const PURPLE = "#2d1a4d";
const GOLD = "#c9a84c";
const LAVENDER = "#9b7fc7";
const SERIF = "'Cormorant Garamond', serif";
const SANS = "'Montserrat', sans-serif";

interface Props {
  onContinue: () => void;
}

export function MissionIntroScreen({ onContinue }: Props) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center"
      style={{ backgroundColor: PURPLE, fontFamily: SERIF }}
    >
      <div className="max-w-xl w-full">
        {/* Logo */}
        <p
          className="text-2xl font-bold tracking-wider mb-3"
          style={{ color: "#ffffff" }}
        >
          1111
        </p>
        <div className="flex justify-center mb-10">
          <div className="h-px w-16" style={{ backgroundColor: GOLD }} />
        </div>

        <h1
          className="text-4xl md:text-5xl font-bold mb-8"
          style={{ color: "#ffffff" }}
        >
          Before we begin.
        </h1>

        <div
          className="space-y-5 text-lg md:text-xl leading-relaxed mb-10"
          style={{ color: "#e9def7" }}
        >
          <p>
            A lot of emotionally exhausted people are trying to manifest, heal, feel confident,
            receive love, and rest — while their body is still preparing for danger underneath it
            all.
          </p>
          <p>
            A nervous system conditioned for survival will often resist the very things the mind
            says it wants.
          </p>
          <p>That's not weakness. That's biology.</p>
          <p>
            Reset Your Mind 1111™ is here to gently change that — at your pace, in your body, on
            your terms.
          </p>
        </div>

        <ul className="space-y-3 mb-10 inline-block text-left">
          {PERMISSION_LIST.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-base md:text-lg"
              style={{ color: GOLD }}
            >
              <Sparkles className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: GOLD }} />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <Button
          onClick={onContinue}
          className="w-full py-6 rounded-xl text-base font-semibold border-0 hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: GOLD,
            color: PURPLE,
            fontFamily: SANS,
          }}
        >
          I'm ready. Let's begin. →
        </Button>

        <p
          className="text-xs mt-6 tracking-wider"
          style={{ color: LAVENDER, fontFamily: SANS }}
        >
          PERMISSION GRANTED™
        </p>
      </div>
    </div>
  );
}
