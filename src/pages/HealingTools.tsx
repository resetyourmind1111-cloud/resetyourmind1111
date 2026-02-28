import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { LockedContent } from "@/components/LockedContent";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const healingTools = [
  { name: "Emotional Release Technique", icon: "💧", description: "Let go of trapped emotions through guided release exercises." },
  { name: "Inner Child Healing", icon: "🧸", description: "Reconnect with and heal your inner child wounds." },
  { name: "Mirror Work", icon: "🪞", description: "Transform self-image through mirror affirmation practice." },
  { name: "Shadow Work Journal", icon: "🌑", description: "Explore and integrate your shadow self with guided prompts." },
  { name: "Cord Cutting Ceremony", icon: "✂️", description: "Release energetic attachments to people and situations." },
  { name: "Forgiveness Protocol", icon: "🕊️", description: "A structured approach to deep forgiveness work." },
  { name: "Grief Processing", icon: "🖤", description: "Honor and process grief in a safe, guided container." },
  { name: "Boundary Builder", icon: "🛡️", description: "Strengthen your boundaries with practical exercises." },
  { name: "Nervous System Reset", icon: "🧠", description: "Regulate your nervous system with somatic techniques." },
  { name: "Trauma Timeline", icon: "📅", description: "Map and process your healing timeline." },
  { name: "Body Scan Practice", icon: "🧘", description: "Release stored tension through guided body scanning." },
  { name: "EFT Tapping Guide", icon: "👆", description: "Emotional freedom technique for anxiety and stress." },
  { name: "Breathwork Sessions", icon: "🌬️", description: "Transformative breathing techniques for emotional release." },
  { name: "Gratitude Alchemy", icon: "✨", description: "Transform pain into gratitude through structured practice." },
  { name: "Self-Compassion Letters", icon: "💌", description: "Write healing letters to yourself through different life stages." },
  { name: "Rage Release Ritual", icon: "🔥", description: "Safely express and channel anger for healing." },
  { name: "Dream Analysis", icon: "🌙", description: "Decode your subconscious messages through dream journaling." },
  { name: "Energy Clearing", icon: "🌊", description: "Cleanse your energetic field and restore balance." },
];

export default function HealingTools() {
  const { user } = useAuth();
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("user_id", user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const tier = profile?.subscription_tier || "free";

  return (
    <AuthenticatedLayout title="Healing Tools" subtitle="18 powerful tools for deep emotional healing and transformation">
      <LockedContent requiredTier="tier2" currentTier={tier}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {healingTools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="glass-card-hover cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{tool.icon}</div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </LockedContent>
    </AuthenticatedLayout>
  );
}
