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
import { User, CreditCard, Bell, Shield, Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const tierNames: Record<string, string> = {
  free: "Free",
  tier1: "Reset",
  tier2: "Expand",
  tier3: "Embody",
};

export default function MyAccount() {
  const { user, signOut, updatePassword } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [notifications, setNotifications] = useState({
    dailySlips: true,
    streakReminder: true,
    newContent: true,
    marketing: false,
  });

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

  return (
    <AuthenticatedLayout title="My Account" subtitle="Manage your profile, plan, and preferences">
      <div className="max-w-2xl mx-auto space-y-8">
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
                  {tierNames[tier]}
                </Badge>
              </div>
              {tier !== "tier3" && (
                <Link to="/#pricing">
                  <Button variant="gold" className="w-full">
                    Upgrade to {tier === "free" || tier === "tier1" ? "Expand" : "Embody"}
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </motion.div>

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

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-card">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Bell className="w-5 h-5 text-accent" />
                <h2 className="font-serif text-xl font-bold text-foreground">Notifications</h2>
              </div>
              {[
                { key: "dailySlips", label: "Daily Permission Slip" },
                { key: "streakReminder", label: "Streak Reminders" },
                { key: "newContent", label: "New Content Alerts" },
                { key: "marketing", label: "Marketing & Offers" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2">
                  <span className="text-foreground text-sm">{item.label}</span>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, [item.key]: checked }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sign Out */}
        <Button variant="outline" className="w-full" onClick={signOut}>
          Sign Out
        </Button>
      </div>
    </AuthenticatedLayout>
  );
}
