import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { LockedContent } from "@/components/LockedContent";
import { TrialLockedContent } from "@/components/TrialLockedContent";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { healingTools } from "@/data/healingToolsData";
import HealingToolsDashboard from "@/components/healing-tools/HealingToolsDashboard";
import { useTrialStatus, getTrialAllowedTools } from "@/hooks/useTrialStatus";
import { TrialBackButton } from "@/components/TrialBackButton";

export default function HealingTools() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isTrialActive, onboardingReason, trialTool1, trialTool2 } = useTrialStatus();
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
  const allowedTools = getTrialAllowedTools(onboardingReason, trialTool1, trialTool2);

  const renderToolCard = (tool: typeof healingTools[0], index: number) => {
    const isTrialTool = allowedTools.includes(tool.id);
    const isLockedDuringTrial = isTrialActive && tier === "free" && !isTrialTool;

    return (
      <motion.div
        key={tool.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04 }}
      >
        <TrialLockedContent isLocked={isLockedDuringTrial}>
          <Card className={`glass-card-hover h-full flex flex-col ${isTrialTool && isTrialActive && tier === "free" ? "border-[#C9A84C]/40" : ""}`}>
            <CardContent className="p-6 flex flex-col flex-1">
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{tool.icon}</span>
                <Badge variant="outline" className="text-xs border-accent/30 text-accent">
                  {tool.category}
                </Badge>
              </div>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">{tool.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{tool.description}</p>
              <Button
                variant="outline"
                className="w-full border-accent/30 text-accent hover:bg-accent/10"
                onClick={() => navigate(`/healing-tools/${tool.id}`)}
              >
                Open Tool
              </Button>
            </CardContent>
          </Card>
        </TrialLockedContent>
      </motion.div>
    );
  };

  // Sort: unlocked tools first during trial
  const sortedTools = isTrialActive && tier === "free"
    ? [...healingTools].sort((a, b) => {
        const aAllowed = allowedTools.includes(a.id) ? 0 : 1;
        const bAllowed = allowedTools.includes(b.id) ? 0 : 1;
        return aAllowed - bAllowed;
      })
    : healingTools;

  const shouldShowContent = isTrialActive && tier === "free";

  return (
    <AuthenticatedLayout title="Healing Tools" subtitle="21 powerful tools for deep emotional healing and transformation">
      <TrialBackButton fallbackPath="/home" label="Back to Home" className="mb-4" />
      {shouldShowContent ? (
        <>
          {/* Trial banner */}
          <div className="mb-6 p-4 rounded-xl bg-[#3D1A6E]/20 border border-[#3D1A6E]/30">
            <p className="text-[#F9F6F0]/80 text-sm italic">
              Your 2 preview tools are selected based on where you are right now.
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              Upgrade to unlock the full toolkit.
            </p>
          </div>
          <Tabs defaultValue="tools" className="w-full">
            <TabsList className="mb-6 bg-muted/50">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="tools">All Tools</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              <HealingToolsDashboard />
            </TabsContent>
            <TabsContent value="tools">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedTools.map((tool, index) => renderToolCard(tool, index))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <LockedContent requiredTier="expand" currentTier={tier}>
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="mb-6 bg-muted/50">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="tools">All Tools</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              <HealingToolsDashboard />
            </TabsContent>
            <TabsContent value="tools">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {healingTools.map((tool, index) => renderToolCard(tool, index))}
              </div>
            </TabsContent>
          </Tabs>
        </LockedContent>
      )}
    </AuthenticatedLayout>
  );
}
