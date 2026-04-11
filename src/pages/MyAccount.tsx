import { useState } from "react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { User, CreditCard, Shield, Upload, AlertTriangle } from "lucide-react";
import { NotificationSettings } from "@/components/account/NotificationSettings";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
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

const tierNames: Record<string, string> = {
  free: "Free",
  reset: "Reset",
  expand: "Expand",
  embody: "Embody",
  founding_full_access: "Founding 111",
};

export default function MyAccount() {
  const { user, signOut, updatePassword } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { data: profile, refetch } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (data) {
        setFullName(data.full_name || "");
        setPhone(data.phone || "");
      }
      return data;
    },
    enabled: !!user,
  });

  const tier = profile?.subscription_tier || "free";

  const handleSaveProfile = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone })
      .eq("user_id", user!.id);
    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated!");
      refetch();
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    const { error } = await updatePassword(newPassword);
    if (error) {
      toast.error("Failed to update password");
    } else {
      toast.success("Password updated!");
      setNewPassword("");
    }
  };

  const { subscription, effectiveTier } = useSubscription();
  const [showFoundingWarning, setShowFoundingWarning] = useState(false);

  const handleManageSubscription = async () => {
    if (subscription?.founding_member) {
      setShowFoundingWarning(true);
      return;
    }
    openPortal();
  };

  const openPortal = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("create-portal-session");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch {
      toast.error("Failed to open subscription management.");
    }
  };

  const displayTier = effectiveTier || tier;

  return (
    <AuthenticatedLayout title="My Account" subtitle="Manage your profile, plan, and preferences">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Payment Failed Banner */}
        {subscription?.status === "past_due" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-lg bg-primary/10 border border-primary/30 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-sm text-foreground">Your payment needs attention — update your card to keep your access.</p>
            <Button variant="gold" size="sm" onClick={openPortal} className="ml-auto flex-shrink-0">Update Card</Button>
          </motion.div>
        )}

        {/* Plan Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-accent via-accent/70 to-secondary" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-accent" />
                  <h2 className="font-serif text-xl font-bold text-foreground">Current Plan</h2>
                </div>
                <Badge variant="outline" className="border-accent text-accent text-sm px-3">
                  {tierNames[displayTier] || displayTier}
                </Badge>
              </div>
              {subscription && subscription.status !== "canceled" ? (
                <div className="space-y-3">
                  {subscription.cancel_at_period_end && (
                    <p className="text-sm text-muted-foreground">
                      Access until {new Date(subscription.current_period_end!).toLocaleDateString()}
                    </p>
                  )}
                  <Button variant="outline" className="w-full" onClick={handleManageSubscription}>
                    Manage Subscription
                  </Button>
                </div>
              ) : (
                <Link to="/#pricing">
                  <Button variant="gold" className="w-full">
                    {subscription?.status === "canceled" ? "Resubscribe" : "Choose a Plan"}
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Founding Cancel Warning — Non-dismissible */}
        <AlertDialog open={showFoundingWarning}>
          <AlertDialogContent className="[&>button]:hidden">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-serif text-xl text-foreground">Before you cancel.</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>You are a Founding Member of Reset Your Mind 1111™.</p>
                  <p>Your rate of $44/month for full access is locked in for life — but only while you stay active.</p>
                  <p className="font-semibold text-foreground">If you cancel:</p>
                  <ul className="space-y-1">
                    <li>✦ Your founding rate is permanently forfeited</li>
                    <li>✦ This rate cannot be reinstated under any circumstances</li>
                    <li>✦ If you rejoin, you will pay the current regular rate</li>
                  </ul>
                  <p>Are you sure you want to cancel?</p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowFoundingWarning(false)} className="bg-accent text-accent-foreground hover:bg-accent/90">
                Keep my founding rate — stay active
              </AlertDialogAction>
              <AlertDialogCancel onClick={openPortal} className="border-muted-foreground/30 text-muted-foreground">
                I understand — cancel my membership
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-accent" />
                <h2 className="font-serif text-xl font-bold text-foreground">Profile</h2>
              </div>
              <div>
                <Label>Email</Label>
                <Input value={user?.email || ""} disabled className="mt-1 opacity-60" />
              </div>
              <div>
                <Label>Full Name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="mt-1" />
              </div>
              <Button variant="gold" onClick={handleSaveProfile}>Save Changes</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-accent" />
                <h2 className="font-serif text-xl font-bold text-foreground">Security</h2>
              </div>
              <div>
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1"
                />
              </div>
              <Button variant="outline" onClick={handlePasswordChange}>Update Password</Button>
            </CardContent>
          </Card>
        </motion.div>

        <NotificationSettings />

        {/* Redo Reset Plan */}
        <Link to="/onboarding">
          <Button
            variant="outline"
            className="w-full mb-2"
            onClick={async () => {
              if (user) {
                await supabase
                  .from("profiles")
                  .update({ onboarding_complete: false, reset_plan_generated: false } as any)
                  .eq("user_id", user.id);
              }
            }}
          >
            Redo my reset plan
          </Button>
        </Link>

        {/* Sign Out */}
        <Button variant="outline" className="w-full" onClick={signOut}>
          Sign Out
        </Button>
      </div>
    </AuthenticatedLayout>
  );
}
