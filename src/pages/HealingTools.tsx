import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { LockedContent } from "@/components/LockedContent";
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

export default function HealingTools() {
  const { user } = useAuth();
  const navigate = useNavigate();
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
              {healingTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <Card className="glass-card-hover h-full flex flex-col">
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
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </LockedContent>
    </AuthenticatedLayout>
  );
}
