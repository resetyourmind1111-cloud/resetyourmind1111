import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const manifestoLines = [
  "I am not here to settle.",
  "I am not here to shrink, to apologize, or to make myself smaller so others can feel bigger.",
  "I am here to RESET.",
  "To recalibrate my worth thermostat to the temperature I was always meant to live at.",
  "",
  "I give myself permission to walk away from crumbs.",
  "I give myself permission to demand the feast.",
  "I give myself permission to be celebrated — loudly, boldly, and without apology.",
  "",
  "I am not broken. I am becoming.",
  "I am not behind. I am exactly on time.",
  "I am not too much. I am finally enough.",
  "",
  "Today, I choose myself.",
  "Today, I honor my boundaries.",
  "Today, I release the guilt of wanting more.",
  "Today, I step into the fullest expression of who I am.",
  "",
  "I am the permission I have been waiting for.",
  "I am the celebration I have been searching for.",
  "I am the love letter I have been longing to receive.",
  "",
  "This is my reset.",
  "This is my recalibration.",
  "This is my revolution.",
  "",
  "And it starts right now.",
  "",
  "— Permission Granted.",
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
                  line.startsWith("I am not here") || line.startsWith("This is my") || line === "And it starts right now."
                    ? "text-2xl md:text-3xl font-bold text-foreground"
                    : line.startsWith("I give myself")
                    ? "text-xl md:text-2xl text-accent font-semibold"
                    : line.startsWith("Today,")
                    ? "text-xl md:text-2xl text-foreground font-medium"
                    : line.startsWith("I am the")
                    ? "text-xl md:text-2xl text-accent/80 italic"
                    : line === "— Permission Granted."
                    ? "text-3xl md:text-4xl font-bold text-accent mt-4"
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
