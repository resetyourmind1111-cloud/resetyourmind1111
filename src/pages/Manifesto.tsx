import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const manifestoLines = [
  "PERMISSION GRANTED",
  "",
  "I acknowledge that I carry an internal worth thermostat — and for far too long, mine has been set too low.",
  "",
  "Today, I choose recalibration.",
  "I choose radical self-permission.",
  "I choose to stop earning love I already deserve.",
  "",
  "I release the habit of waiting for external validation and return to trusting my inherent worth.",
  "",
  "I choose celebration over \"good enough.\"",
  "I choose self-respect over self-sacrifice.",
  "I choose to let self-love be essential — not selfish.",
  "",
  "I commit to asking myself, in every moment:",
  "How would someone who feels deeply loved respond?",
  "And I allow that answer to guide my choices.",
  "",
  "I give myself permission to stop settling, to stop people-pleasing, and to stop shrinking.",
  "",
  "I honor that rest does not need to be earned and love does not require perfection.",
  "",
  "I release my belief that I am \"too much\" or somehow not enough.",
  "",
  "I reclaim my ability to recognize my own worth before I give it away.",
  "",
  "Today marks a turning point.",
  "My worth thermostat is rising — and I trust myself to live from safety, truth, and self-trust.",
  "",
  "I no longer wait.",
  "",
  "— Permission Granted.",
  "© Reset Your Mind 1111 | Lorie Wu",
];

export default function Manifesto() {
  const [isReading, setIsReading] = useState(false);

  const handleReadAloud = () => {
    if (isReading) {
      speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    const text = manifestoLines.filter(Boolean).join(". ");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.onend = () => setIsReading(false);
    setIsReading(true);
    speechSynthesis.speak(utterance);
  };

  return (
    <AuthenticatedLayout title="Manifesto" subtitle="Your declaration of worthiness">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center mb-10">
          <Button
            variant={isReading ? "gold" : "outline"}
            size="lg"
            onClick={handleReadAloud}
            className="gap-2"
          >
            <Volume2 className="w-5 h-5" />
            {isReading ? "Stop Reading" : "Read Aloud"}
          </Button>
        </div>

        <div className="space-y-1">
          {manifestoLines.map((line, index) =>
            line === "" ? (
              <div key={index} className="h-8" />
            ) : (
              <motion.p
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.06, duration: 0.5 }}
                className={`font-serif leading-relaxed ${
                  line === "PERMISSION GRANTED"
                    ? "text-3xl md:text-4xl font-bold text-accent tracking-widest uppercase text-center mb-4"
                    : line.startsWith("Today, I choose") || line.startsWith("Today marks")
                    ? "text-xl md:text-2xl font-bold text-foreground"
                    : line.startsWith("I choose")
                    ? "text-xl md:text-2xl text-accent font-semibold"
                    : line.startsWith("I give myself") || line.startsWith("I honor") || line.startsWith("I release") || line.startsWith("I reclaim")
                    ? "text-xl md:text-2xl text-foreground font-medium"
                    : line === "How would someone who feels deeply loved respond?"
                    ? "text-xl md:text-2xl text-accent/80 italic text-center"
                    : line === "I no longer wait."
                    ? "text-2xl md:text-3xl font-bold text-accent mt-2"
                    : line === "— Permission Granted."
                    ? "text-3xl md:text-4xl font-bold text-accent mt-4"
                    : line.startsWith("©")
                    ? "text-sm text-muted-foreground text-center mt-8"
                    : "text-xl md:text-2xl text-foreground/80"
                }`}
              >
                {line}
              </motion.p>
            )
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
