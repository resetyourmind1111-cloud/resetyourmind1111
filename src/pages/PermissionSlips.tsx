import { useState, useMemo } from "react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const categories = [
  "Self-Worth",
  "Boundaries",
  "Abundance",
  "Love",
  "Healing",
  "Empowerment",
] as const;

const allSlips = categories.flatMap((cat, catIndex) =>
  Array.from({ length: Math.ceil(125 / 6) }, (_, i) => ({
    id: `${cat}-${i + 1}`,
    text: getSlipText(cat, i),
    category: cat,
  }))
).slice(0, 125);

function getSlipText(category: string, index: number): string {
  const slips: Record<string, string[]> = {
    "Self-Worth": [
      "I am worthy of everything I desire.",
      "My value is not determined by others' opinions.",
      "I deserve to take up space in this world.",
      "I am enough, exactly as I am right now.",
      "My worth is inherent — it cannot be earned or lost.",
      "I give myself permission to shine without apology.",
      "I am deserving of love, respect, and abundance.",
      "My presence matters and my voice deserves to be heard.",
      "I release the need to prove my worth to anyone.",
      "I am the prize, and I know it.",
      "My self-worth is not up for negotiation.",
      "I choose to see myself through the eyes of love.",
      "I am worthy of celebrating every version of myself.",
      "I trust that I am exactly where I need to be.",
      "My imperfections make me beautifully human.",
      "I refuse to shrink to make others comfortable.",
      "I deserve joy simply because I exist.",
      "I honor the person I am becoming.",
      "I radiate confidence and self-assurance.",
      "I am a masterpiece in progress.",
      "I choose myself without guilt.",
    ],
    "Boundaries": [
      "I give myself permission to say no without guilt.",
      "My boundaries are an act of self-love.",
      "I protect my peace above all else.",
      "No is a complete sentence.",
      "I release relationships that drain my energy.",
      "I teach people how to treat me through my boundaries.",
      "I am allowed to outgrow people and situations.",
      "I choose quality over quantity in all relationships.",
      "My time and energy are sacred resources.",
      "I stop explaining myself to people who don't want to understand.",
      "I walk away from anything that no longer serves my growth.",
      "I deserve relationships built on mutual respect.",
      "I am allowed to change the rules at any time.",
      "I protect my inner peace fiercely and unapologetically.",
      "Setting boundaries makes me stronger, not selfish.",
      "I release the need to people-please.",
      "I trust myself to know what's best for me.",
      "I am allowed to disappoint others to honor myself.",
      "My comfort zone is not a prison — I expand it on my terms.",
      "I give myself permission to close doors that lead to chaos.",
      "I am the gatekeeper of my own peace.",
    ],
    "Abundance": [
      "I am a magnet for prosperity and abundance.",
      "Money flows to me easily and effortlessly.",
      "I deserve financial freedom and wealth.",
      "I release all scarcity mindset patterns.",
      "I am open to receiving abundance in all forms.",
      "My bank account reflects my self-worth.",
      "I attract opportunities that align with my highest good.",
      "I charge what I'm worth without apology.",
      "Abundance is my birthright.",
      "I release guilt around wealth and success.",
      "I am worthy of living an extraordinary life.",
      "Financial abundance flows to me from expected and unexpected sources.",
      "I give myself permission to want more.",
      "I am grateful for the abundance that surrounds me.",
      "I choose abundance over lack in every thought.",
      "I release the belief that money is hard to come by.",
      "I am worthy of having more than enough.",
      "I magnetize wealth with my energy and intention.",
      "Prosperity is drawn to me naturally.",
      "I am financially empowered and free.",
      "I give generously because I know more is always coming.",
    ],
    "Love": [
      "I deserve a love that doesn't hurt.",
      "I am worthy of deep, passionate connection.",
      "I release the need to settle for less in love.",
      "My heart knows what it deserves.",
      "I attract love that matches my self-worth.",
      "I am allowed to want epic, soul-shaking love.",
      "I release past heartbreak and open to new love.",
      "I choose partners who choose me fully.",
      "I deserve love that feels like home.",
      "I give myself permission to be loved loudly.",
      "I trust that my person is on their way to me.",
      "I refuse to beg for love I freely give.",
      "I am worthy of a love story worth telling.",
      "I release attachment to people who can't love me right.",
      "I give myself the love I've been seeking from others.",
      "I am magnetic to healthy, nurturing love.",
      "I deserve a partner who celebrates me daily.",
      "I choose love that empowers me, not diminishes me.",
      "I am complete on my own and enhanced by love.",
      "I release the fear of being truly seen.",
      "I give myself permission to fall in love again.",
    ],
    "Healing": [
      "I give myself permission to heal at my own pace.",
      "My healing journey is valid and sacred.",
      "I release the pain that no longer serves me.",
      "I am allowed to grieve what I lost.",
      "Healing is not linear, and that's okay.",
      "I forgive myself for what I didn't know then.",
      "I am stronger than what tried to break me.",
      "I release shame and embrace radical self-compassion.",
      "My wounds are transforming into wisdom.",
      "I give myself permission to not be okay right now.",
      "I trust the process of my own healing.",
      "I am allowed to feel everything fully.",
      "I release the need to have it all figured out.",
      "I honor my scars as evidence of my survival.",
      "Healing begins when I stop running from myself.",
      "I am allowed to rest as part of my healing.",
      "I release the trauma responses that kept me safe but small.",
      "I choose to heal the parts of me that are still hurting.",
      "I am worthy of a life that feels peaceful.",
      "I forgive those who hurt me — for my own freedom.",
      "I am becoming the person my younger self needed.",
    ],
    "Empowerment": [
      "I am powerful beyond measure.",
      "I give myself permission to be ambitious.",
      "I lead with confidence and grace.",
      "I am the author of my own story.",
      "I refuse to play small to make others comfortable.",
      "I build my empire on my own terms.",
      "I am unstoppable when I believe in myself.",
      "I give myself permission to take the lead.",
      "I am bold, fierce, and unapologetic.",
      "I trust my own decisions completely.",
      "I am capable of achieving anything I set my mind to.",
      "I give myself permission to be proud of my achievements.",
      "I rise above every challenge placed before me.",
      "I am the most powerful force in my own life.",
      "I choose courage over comfort.",
      "I give myself permission to demand excellence.",
      "I am a force of nature.",
      "My dreams are valid and achievable.",
      "I show up as the most powerful version of myself.",
      "I give myself permission to go first.",
      "I am the permission I've been waiting for.",
    ],
  };
  return slips[category]?.[index] || `Permission granted to embrace your ${category.toLowerCase()} journey.`;
}

function SlipCard({ slip, isAccepted, onAccept, index }: { 
  slip: typeof allSlips[0]; 
  isAccepted: boolean; 
  onAccept: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Card className={`glass-card-hover transition-all ${isAccepted ? "ring-2 ring-accent/50" : ""}`}>
        <CardContent className="p-5">
          <p className="font-serif text-foreground text-lg leading-relaxed mb-4">
            "{slip.text}"
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">{slip.category}</span>
            <Button
              variant={isAccepted ? "gold" : "outline"}
              size="sm"
              onClick={onAccept}
              disabled={isAccepted}
            >
              {isAccepted ? (
                <>
                  <Check className="w-4 h-4 mr-1" /> Accepted
                </>
              ) : (
                "Accept This Slip"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function PermissionSlips() {
  const [acceptedSlips, setAcceptedSlips] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<string>("daily");

  const dailySlip = useMemo(() => {
    const today = new Date();
    const dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % allSlips.length;
    return allSlips[dayIndex];
  }, []);

  const handleAccept = (id: string) => {
    setAcceptedSlips((prev) => new Set(prev).add(id));
  };

  return (
    <AuthenticatedLayout title="Permission Slips" subtitle="125 permission slips across 6 categories — accept the ones you need today">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/50 flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="daily">✨ Daily Slip</TabsTrigger>
          <TabsTrigger value="collection">My Collection ({acceptedSlips.size})</TabsTrigger>
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="daily">
          <div className="max-w-xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-6"
            >
              <Sparkles className="w-10 h-10 text-accent mx-auto mb-4" />
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Today's Permission Slip</h2>
              <p className="text-muted-foreground text-sm">Your daily message of empowerment</p>
            </motion.div>
            <SlipCard
              slip={dailySlip}
              isAccepted={acceptedSlips.has(dailySlip.id)}
              onAccept={() => handleAccept(dailySlip.id)}
              index={0}
            />
          </div>
        </TabsContent>

        <TabsContent value="collection">
          {acceptedSlips.size === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">You haven't accepted any slips yet. Start with today's daily slip!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allSlips
                .filter((s) => acceptedSlips.has(s.id))
                .map((slip, i) => (
                  <SlipCard key={slip.id} slip={slip} isAccepted={true} onAccept={() => {}} index={i} />
                ))}
            </div>
          )}
        </TabsContent>

        {categories.map((cat) => (
          <TabsContent key={cat} value={cat}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allSlips
                .filter((s) => s.category === cat)
                .map((slip, i) => (
                  <SlipCard
                    key={slip.id}
                    slip={slip}
                    isAccepted={acceptedSlips.has(slip.id)}
                    onAccept={() => handleAccept(slip.id)}
                    index={i}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </AuthenticatedLayout>
  );
}
