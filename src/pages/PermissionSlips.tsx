import { useState, useMemo } from "react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Check, Sparkles, Plus, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  allPermissionSlips,
  permissionSlipCategories,
  getDailySlip,
  PermissionSlip,
} from "@/data/permissionSlipsData";

interface AcceptedSlip {
  id: string;
  slip_text: string;
  category: string;
  is_custom: boolean;
  created_at: string;
}

export default function PermissionSlips() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("daily");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [customText, setCustomText] = useState("");

  const dailySlip = useMemo(() => getDailySlip(), []);

  const { data: acceptedSlips = [] } = useQuery({
    queryKey: ["accepted-slips", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("permission_slips_accepted")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as AcceptedSlip[];
    },
    enabled: !!user,
  });

  const acceptedTexts = useMemo(
    () => new Set(acceptedSlips.map((s) => s.slip_text)),
    [acceptedSlips]
  );

  const acceptSlip = useMutation({
    mutationFn: async ({
      text,
      category,
      isCustom = false,
    }: {
      text: string;
      category: string;
      isCustom?: boolean;
    }) => {
      const { error } = await supabase.from("permission_slips_accepted").insert({
        user_id: user!.id,
        slip_text: text,
        category,
        is_custom: isCustom,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accepted-slips"] });
      toast.success("Permission slip accepted ✨");
    },
    onError: () => toast.error("Failed to accept slip"),
  });

  const removeSlip = useMutation({
    mutationFn: async (slipText: string) => {
      const { error } = await supabase
        .from("permission_slips_accepted")
        .delete()
        .eq("user_id", user!.id)
        .eq("slip_text", slipText);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accepted-slips"] });
      toast.success("Slip removed from collection");
    },
  });

  const handleAccept = (slip: PermissionSlip) => {
    if (acceptedTexts.has(slip.text)) return;
    acceptSlip.mutate({ text: slip.text, category: slip.category });
  };

  const handleCustomSubmit = () => {
    if (!customText.trim()) return;
    acceptSlip.mutate({
      text: customText.trim(),
      category: "Custom",
      isCustom: true,
    });
    setCustomText("");
  };

  const filteredSlips =
    activeCategory === "all"
      ? allPermissionSlips
      : allPermissionSlips.filter((s) => s.category === activeCategory);

  return (
    <AuthenticatedLayout
      title="Permission Slips"
      subtitle="125 permission slips across 25 categories — accept the ones you need today"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/50 h-auto gap-1 p-1">
          <TabsTrigger value="daily">✨ Daily Slip</TabsTrigger>
          <TabsTrigger value="browse">Browse All</TabsTrigger>
          <TabsTrigger value="collection">
            My Collection ({acceptedSlips.length})
          </TabsTrigger>
        </TabsList>

        {/* ===== DAILY SLIP ===== */}
        <TabsContent value="daily">
          <div className="max-w-xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-8"
            >
              <Sparkles className="w-10 h-10 text-accent mx-auto mb-4" />
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                Today's Permission Slip
              </h2>
              <p className="text-muted-foreground text-sm">
                Your daily message of empowerment
              </p>
            </motion.div>
            <FeaturedSlipCard
              slip={dailySlip}
              isAccepted={acceptedTexts.has(dailySlip.text)}
              onAccept={() => handleAccept(dailySlip)}
            />
          </div>
        </TabsContent>

        {/* ===== BROWSE ALL ===== */}
        <TabsContent value="browse">
          {/* Category filter */}
          <ScrollArea className="w-full mb-6">
            <div className="flex gap-2 pb-3">
              <Button
                variant={activeCategory === "all" ? "default" : "outline"}
                size="sm"
                className={
                  activeCategory === "all"
                    ? "bg-accent text-accent-foreground"
                    : "border-accent/30 text-accent hover:bg-accent/10"
                }
                onClick={() => setActiveCategory("all")}
              >
                All ({allPermissionSlips.length})
              </Button>
              {permissionSlipCategories.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  size="sm"
                  className={`whitespace-nowrap ${
                    activeCategory === cat
                      ? "bg-accent text-accent-foreground"
                      : "border-accent/30 text-accent hover:bg-accent/10"
                  }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSlips.map((slip, i) => (
              <SlipCard
                key={slip.id}
                slip={slip}
                isAccepted={acceptedTexts.has(slip.text)}
                onAccept={() => handleAccept(slip)}
                index={i}
              />
            ))}
          </div>

          {/* Create Your Own */}
          <div className="mt-12 max-w-xl mx-auto">
            <Card className="border-accent/20 bg-card/60 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Plus className="w-5 h-5 text-accent" />
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    Create Your Own Permission Slip
                  </h3>
                </div>
                <Textarea
                  placeholder="Permission to..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="mb-3 bg-muted/50 border-accent/20 focus:border-accent resize-none"
                  rows={3}
                />
                <Button
                  onClick={handleCustomSubmit}
                  disabled={!customText.trim() || acceptSlip.isPending}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Accept & Save
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ===== MY COLLECTION ===== */}
        <TabsContent value="collection">
          {acceptedSlips.length === 0 ? (
            <div className="text-center py-16">
              <Sparkles className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">
                You haven't accepted any permission slips yet.
              </p>
              <Button
                variant="outline"
                className="border-accent/30 text-accent"
                onClick={() => setActiveTab("daily")}
              >
                Start with Today's Slip
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {acceptedSlips.map((slip, i) => (
                <motion.div
                  key={slip.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card
                    className="relative overflow-hidden border-accent/20 transition-all duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(43 52% 54% / 0.08) 0%, hsl(43 52% 54% / 0.03) 100%)",
                      boxShadow: "0 4px 20px -4px hsl(43 52% 54% / 0.12)",
                    }}
                  >
                    <CardContent className="p-5">
                      <div className="absolute top-3 right-3">
                        <Check className="w-4 h-4 text-accent" />
                      </div>
                      <p className="text-xs uppercase tracking-widest text-accent/70 mb-3">
                        {slip.category}
                      </p>
                      <p className="font-serif italic text-foreground text-base leading-relaxed">
                        "{slip.slip_text}"
                      </p>
                      {slip.is_custom && (
                        <span className="inline-block mt-2 text-xs text-accent/50 uppercase tracking-wider">
                          Custom
                        </span>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </AuthenticatedLayout>
  );
}

/* ===== Featured Slip (Daily) ===== */
function FeaturedSlipCard({
  slip,
  isAccepted,
  onAccept,
}: {
  slip: PermissionSlip;
  isAccepted: boolean;
  onAccept: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card
        className="relative overflow-hidden border-accent/30"
        style={{
          background:
            "linear-gradient(135deg, hsl(43 52% 54% / 0.12) 0%, hsl(43 52% 54% / 0.04) 100%)",
          boxShadow: "0 8px 40px -8px hsl(43 52% 54% / 0.2)",
        }}
      >
        {isAccepted && (
          <div className="absolute top-4 right-4">
            <Check className="w-5 h-5 text-accent" />
          </div>
        )}
        <CardContent className="p-8 text-center">
          <p className="text-xs uppercase tracking-widest text-accent/70 mb-4">
            {slip.category}
          </p>
          <p className="font-serif italic text-foreground text-2xl leading-relaxed mb-6">
            "{slip.text}"
          </p>
          <Button
            onClick={onAccept}
            disabled={isAccepted}
            className={
              isAccepted
                ? "bg-accent/20 text-accent border border-accent/30"
                : "bg-accent text-accent-foreground hover:bg-accent/90"
            }
          >
            {isAccepted ? (
              <>
                <Check className="w-4 h-4 mr-2" /> Accepted
              </>
            ) : (
              "Accept This Slip"
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ===== Standard Slip Card ===== */
function SlipCard({
  slip,
  isAccepted,
  onAccept,
  index,
}: {
  slip: PermissionSlip;
  isAccepted: boolean;
  onAccept: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
    >
      <Card
        className={`relative h-full transition-all duration-300 hover:-translate-y-0.5 ${
          isAccepted ? "border-accent/30" : "border-border/50"
        }`}
        style={{
          background: isAccepted
            ? "linear-gradient(135deg, hsl(43 52% 54% / 0.08) 0%, hsl(43 52% 54% / 0.03) 100%)"
            : undefined,
          boxShadow: "0 4px 20px -4px hsl(43 52% 54% / 0.06)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 8px 30px -4px hsl(43 52% 54% / 0.15)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 4px 20px -4px hsl(43 52% 54% / 0.06)";
        }}
      >
        {isAccepted && (
          <div className="absolute top-3 right-3">
            <Check className="w-4 h-4 text-accent" />
          </div>
        )}
        <CardContent className="p-5 flex flex-col h-full">
          <p className="text-xs uppercase tracking-widest text-accent/70 mb-3">
            {slip.category}
          </p>
          <p className="font-serif italic text-foreground text-base leading-relaxed mb-4 flex-1">
            "{slip.text}"
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onAccept}
            disabled={isAccepted}
            className={
              isAccepted
                ? "border-accent/30 text-accent bg-accent/10"
                : "border-accent/30 text-accent hover:bg-accent/10"
            }
          >
            {isAccepted ? (
              <>
                <Check className="w-4 h-4 mr-1" /> Accepted
              </>
            ) : (
              "Accept This Slip"
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
