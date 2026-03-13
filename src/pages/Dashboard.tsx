import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { PastDueBanner } from "@/components/PastDueBanner";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Calendar, Target, ArrowRight, Settings, Sparkles, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { thermostatTypes, ThermostatType } from "@/data/thermostatTypes";
import { getDailySlip } from "@/data/permissionSlipsData";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DailySlipModal } from "@/components/DailySlipModal";

interface AssessmentResult {
  id: string;
  completed_at: string;
  thermostat_type: string;
  total_score: number;
  percentage_score: number;
  category_scores: Record<string, number>;
}

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  const dailySlip = useMemo(() => getDailySlip(), []);

  // Show welcome message after successful checkout
  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      setShowWelcome(true);
      // Clean URL
      searchParams.delete("checkout");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    async function fetchResults() {
      if (!user) return;

      const { data, error } = await supabase
        .from("assessment_results")
        .select("id, completed_at, thermostat_type, total_score, percentage_score, category_scores")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });

      if (!error && data) {
        setResults(data as AssessmentResult[]);
      }
      setIsLoading(false);
    }

    if (user) {
      fetchResults();
    }
  }, [user]);

  // Check if daily slip is already accepted
  const { data: acceptedSlips = [] } = useQuery({
    queryKey: ["accepted-slips", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("permission_slips_accepted")
        .select("slip_text")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data as { slip_text: string }[];
    },
    enabled: !!user,
  });

  const isDailyAccepted = useMemo(
    () => acceptedSlips.some((s) => s.slip_text === dailySlip.text),
    [acceptedSlips, dailySlip]
  );

  const acceptSlip = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("permission_slips_accepted").insert({
        user_id: user!.id,
        slip_text: dailySlip.text,
        category: dailySlip.category,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accepted-slips"] });
      toast.success("Permission slip accepted ✨");
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getTypeInfo = (typeKey: string): ThermostatType | undefined => {
    return thermostatTypes.find(t => t.name === typeKey);
  };

  return (
    <div className="min-h-screen bg-background">
      <DailySlipModal />
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome banner after successful checkout */}
          {showWelcome && (
            <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 border border-primary/30 relative">
              <button
                onClick={() => setShowWelcome(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors text-lg"
                aria-label="Dismiss"
              >
                ✕
              </button>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <h2 className="font-serif text-xl font-bold text-foreground">Welcome to your transformation! 🎉</h2>
              </div>
              <p className="text-muted-foreground">
                Your subscription is being activated. It may take a moment to unlock all your features. 
                Explore your dashboard while we set everything up — permission granted to begin.
              </p>
            </div>
          )}

          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Your Dashboard</h1>
              <p className="text-muted-foreground">Track your growth and view past assessment results</p>
            </div>
            <Link to="/settings">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>

          {/* Daily Permission Slip */}
          <Card
            className="mb-8 relative overflow-hidden border-accent/30"
            style={{
              background:
                "linear-gradient(135deg, hsl(43 52% 54% / 0.1) 0%, hsl(43 52% 54% / 0.03) 100%)",
              boxShadow: "0 8px 32px -8px hsl(43 52% 54% / 0.15)",
            }}
          >
            {isDailyAccepted && (
              <div className="absolute top-4 right-4">
                <Check className="w-5 h-5 text-accent" />
              </div>
            )}
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-accent" />
                <span className="text-xs uppercase tracking-widest text-accent/70">
                  Today's Permission Slip
                </span>
              </div>
              <p className="font-serif italic text-foreground text-xl leading-relaxed mb-4">
                "{dailySlip.text}"
              </p>
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  onClick={() => acceptSlip.mutate()}
                  disabled={isDailyAccepted || acceptSlip.isPending}
                  className={
                    isDailyAccepted
                      ? "bg-accent/20 text-accent border border-accent/30"
                      : "bg-accent text-accent-foreground hover:bg-accent/90"
                  }
                >
                  {isDailyAccepted ? (
                    <>
                      <Check className="w-4 h-4 mr-1" /> Accepted
                    </>
                  ) : (
                    "Accept This Slip"
                  )}
                </Button>
                <Link to="/permission-slips">
                  <Button variant="ghost" size="sm" className="text-accent/70 hover:text-accent">
                    View All Slips <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : results.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No assessments yet</h3>
                <p className="text-muted-foreground mb-6">
                  Take your first assessment to discover your thermostat type
                </p>
                <Button onClick={() => navigate("/assessment")}>
                  Start Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {results.map((result) => {
                const typeInfo = getTypeInfo(result.thermostat_type);
                return (
                  <Card key={result.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge variant="secondary" className="mb-2">
                            {typeInfo?.name || result.thermostat_type}
                          </Badge>
                          <CardTitle className="text-lg">
                            {typeInfo?.tagline || "Assessment Result"}
                          </CardTitle>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {result.percentage_score}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {result.total_score} points
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(result.completed_at), "MMM d, yyyy")}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          {Object.keys(result.category_scores).length} categories analyzed
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              <div className="pt-4 text-center">
                <Button variant="outline" onClick={() => navigate("/assessment")}>
                  Take New Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
