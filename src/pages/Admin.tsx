import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, ToggleLeft, ToggleRight, Users, CreditCard, Sparkles, FastForward, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [foundingMode, setFoundingMode] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingValue, setPendingValue] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0, trial: 0, founding: 0, spotsTaken: 0 });
  const [loading, setLoading] = useState(true);
  const [jumpEmail, setJumpEmail] = useState("");
  const [jumpDay, setJumpDay] = useState(1);
  const [jumping, setJumping] = useState(false);

  const handleTrialJump = async () => {
    if (!jumpEmail.trim()) {
      toast.error("Enter a user email");
      return;
    }
    setJumping(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-set-trial-day", {
        body: { email: jumpEmail.trim().toLowerCase(), day: jumpDay },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast.success(`${jumpEmail} is now on Day ${jumpDay}. Refresh their session.`);
    } catch (e: any) {
      toast.error(e.message || "Failed to set trial day");
    } finally {
      setJumping(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    const init = async () => {
      const { data: profile } = await supabase.from("profiles").select("is_admin").eq("user_id", user.id).single();
      if (!(profile as any)?.is_admin) {
        navigate("/home");
        return;
      }
      setIsAdmin(true);

      // Fetch founding mode
      const { data: setting } = await supabase.from("app_settings").select("setting_value").eq("setting_key", "founding_mode").single();
      setFoundingMode(setting?.setting_value === "true");

      // Fetch stats
      const [totalRes, activeRes, foundingRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("founding_member", true),
      ]);

      // Count trial users (profiles with trial_start_date and no active sub)
      const { count: trialCount } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .not("trial_start_date", "is", null)
        .eq("subscription_tier", "free");

      setStats({
        total: totalRes.count ?? 0,
        active: activeRes.count ?? 0,
        trial: trialCount ?? 0,
        founding: foundingRes.count ?? 0,
        spotsTaken: foundingRes.count ?? 0,
      });

      setLoading(false);
    };
    init();
  }, [user, navigate]);

  const handleToggle = () => {
    setPendingValue(!foundingMode);
    setShowConfirm(true);
  };

  const confirmToggle = async () => {
    const newVal = pendingValue;
    await supabase.from("app_settings").update({
      setting_value: newVal ? "true" : "false",
      updated_at: new Date().toISOString(),
      updated_by: user?.id,
    }).eq("setting_key", "founding_mode");

    setFoundingMode(newVal);
    setShowConfirm(false);
    toast.success(`Founding mode ${newVal ? "enabled" : "disabled"}`);
  };

  if (!isAdmin || loading) {
    return (
      <AuthenticatedLayout title="Admin" subtitle="App Settings">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout title="App Settings" subtitle="Admin controls">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Founding Mode */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-accent" />
                <h2 className="font-serif text-xl font-bold text-foreground">Founding Mode</h2>
              </div>

              <div className="flex items-center gap-3 mb-4">
                {foundingMode ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 uppercase">Founding Mode — ON</span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground uppercase">Founding Mode — OFF</span>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {foundingMode
                  ? "Users see only Founding Member pricing. Regular tiers are hidden."
                  : "Users see Reset / Expand / Embody tiers. Founding offer is hidden."}
              </p>

              <Button
                variant="outline"
                onClick={handleToggle}
                className={foundingMode ? "border-destructive text-destructive" : "border-accent text-accent"}
              >
                {foundingMode ? (
                  <><ToggleLeft className="w-4 h-4 mr-2" />Turn Off Founding Mode</>
                ) : (
                  <><ToggleRight className="w-4 h-4 mr-2" />Turn On Founding Mode</>
                )}
              </Button>

              <div className="mt-4 p-3 rounded-lg bg-accent/5 border border-accent/20">
                <p className="text-sm text-foreground font-semibold">Founding spots taken: {stats.spotsTaken} of 111</p>
              </div>

              <div className="mt-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                <p className="text-xs text-destructive/80">
                  Founding Members who cancel lose their $44 rate permanently. A cancel warning modal is shown to them before any cancellation is confirmed.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trial Day Jumper (QA) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <FastForward className="w-5 h-5 text-accent" />
                <h2 className="font-serif text-xl font-bold text-foreground">Trial Day Jumper (QA)</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Backdate any user's trial_start_date so they appear on the chosen day. Day 8 = expired.
              </p>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">User email</Label>
                  <Input
                    type="email"
                    placeholder="user@example.com"
                    value={jumpEmail}
                    onChange={(e) => setJumpEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Trial day</Label>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((d) => (
                      <Button
                        key={d}
                        type="button"
                        size="sm"
                        variant={jumpDay === d ? "default" : "outline"}
                        onClick={() => setJumpDay(d)}
                        className="w-12"
                      >
                        {d}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button onClick={handleTrialJump} disabled={jumping} className="w-full mt-2">
                  {jumping ? "Setting..." : `Set to Day ${jumpDay}`}
                </Button>
                <p className="text-xs text-muted-foreground">
                  After jumping, the target user must refresh or sign out/in to see the new state.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Gifted Email Report link */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}>
          <Card className="glass-card cursor-pointer hover:border-accent transition-colors" onClick={() => navigate("/admin/gifted-emails")}>
            <CardContent className="p-6 flex items-center gap-4">
              <Mail className="w-5 h-5 text-accent" />
              <div className="flex-1">
                <h2 className="font-serif text-xl font-bold text-foreground">Gifted Milestone Emails</h2>
                <p className="text-sm text-muted-foreground">View Day 15 / Day 21 send history and trigger the job manually.</p>
              </div>
              <Button variant="outline" size="sm">Open →</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* App Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5 text-accent" />
                <h2 className="font-serif text-xl font-bold text-foreground">App Stats</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Total members", value: stats.total },
                  { label: "Active subscriptions", value: stats.active },
                  { label: "Free trial users", value: stats.trial },
                  { label: "Founding members", value: stats.founding },
                ].map(s => (
                  <div key={s.label} className="p-3 rounded-lg bg-muted/30">
                    <p className="text-2xl font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Confirm Dialog */}
        <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground">
                {pendingValue ? "Turn on founding mode?" : "Turn off founding mode?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {pendingValue
                  ? "This will show only Founding Member pricing to all users. Regular tiers will be hidden."
                  : "This will hide the Founding Member offer and show regular tier pricing to all new visitors. Existing founders keep their rate."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{pendingValue ? "Cancel" : "Keep founding mode on"}</AlertDialogCancel>
              <AlertDialogAction onClick={confirmToggle}>
                {pendingValue ? "Yes — turn on founding mode" : "Yes — close founding access"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AuthenticatedLayout>
  );
}
