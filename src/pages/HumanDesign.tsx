import { useState } from "react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const humanDesignTypes = [
  {
    type: "Manifestor",
    description: "You are here to initiate and create impact. Your aura is closed and repelling — not to push people away, but to protect your creative force.",
    strategy: "Inform before you act.",
    notSelf: "Anger",
    signature: "Peace",
    color: "accent",
  },
  {
    type: "Generator",
    description: "You are the life force of the planet. Your sacral center lights up with a powerful gut response that guides you toward what's correct for you.",
    strategy: "Wait to respond.",
    notSelf: "Frustration",
    signature: "Satisfaction",
    color: "accent",
  },
  {
    type: "Manifesting Generator",
    description: "You are a multi-passionate powerhouse — a hybrid of the Manifestor and Generator. You move fast and are here to find shortcuts and efficiencies.",
    strategy: "Wait to respond, then inform.",
    notSelf: "Frustration & Anger",
    signature: "Satisfaction & Peace",
    color: "accent",
  },
  {
    type: "Projector",
    description: "You are here to guide and direct others. Your gift is seeing deeply into people and systems. You see things others miss.",
    strategy: "Wait for the invitation.",
    notSelf: "Bitterness",
    signature: "Success",
    color: "accent",
  },
  {
    type: "Reflector",
    description: "You are the rarest type — a mirror of the community. You sample the energies around you and reflect back the health of your environment.",
    strategy: "Wait a full lunar cycle.",
    notSelf: "Disappointment",
    signature: "Surprise",
    color: "accent",
  },
];

export default function HumanDesign() {
  const [result, setResult] = useState<typeof humanDesignTypes[0] | null>(null);
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple deterministic assignment based on birth data for demo
    const hash = (birthDate + birthTime + birthPlace).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    setResult(humanDesignTypes[hash % humanDesignTypes.length]);
  };

  return (
    <AuthenticatedLayout title="Human Design Analysis" subtitle="Discover your energetic blueprint and strategy for living in alignment">
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="glass-card">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <Sparkles className="w-10 h-10 text-accent mx-auto mb-4" />
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Enter Your Birth Data</h2>
                    <p className="text-muted-foreground text-sm">We'll use this to determine your Human Design type</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="birthDate">Birth Date</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="birthTime">Birth Time</Label>
                      <Input
                        id="birthTime"
                        type="time"
                        value={birthTime}
                        onChange={(e) => setBirthTime(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="birthPlace">Birth Place</Label>
                      <Input
                        id="birthPlace"
                        type="text"
                        placeholder="City, Country"
                        value={birthPlace}
                        onChange={(e) => setBirthPlace(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <Button type="submit" variant="gold" size="lg" className="w-full">
                      Reveal My Design
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <Card className="glass-card overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-accent via-accent/70 to-secondary" />
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-10 h-10 text-accent" />
                    </div>
                    <h2 className="font-serif text-3xl font-bold text-foreground mb-1">You are a {result.type}</h2>
                    <p className="text-accent font-medium">~ {((humanDesignTypes.indexOf(result) + 1) / humanDesignTypes.length * 100).toFixed(0)}% of the population ~</p>
                  </div>

                  <p className="text-foreground leading-relaxed mb-8 text-center">{result.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="text-center p-4 rounded-xl bg-muted/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Strategy</p>
                      <p className="font-serif font-semibold text-foreground">{result.strategy}</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-muted/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Signature</p>
                      <p className="font-serif font-semibold text-accent">{result.signature}</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-muted/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Not-Self Theme</p>
                      <p className="font-serif font-semibold text-foreground">{result.notSelf}</p>
                    </div>
                  </div>

                  <Button variant="outline" onClick={() => setResult(null)} className="w-full">
                    Try Different Birth Data
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthenticatedLayout>
  );
}
