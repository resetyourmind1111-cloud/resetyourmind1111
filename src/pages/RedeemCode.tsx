import { useState } from "react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Ticket, CheckCircle2 } from "lucide-react";
import { track } from "@/lib/analytics";

export default function RedeemCode() {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState<{ label: string; expires_at: string } | null>(null);

  const handleRedeem = async () => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      toast.error("Enter a code to redeem.");
      return;
    }
    setBusy(true);
    try {
      const { data, error } = await supabase.rpc("redeem_code", { _code: normalized, _source: "manual" });
      if (error) throw error;
      const result = data as { success: boolean; error?: string; expires_at?: string; label?: string };
      if (!result.success) {
        toast.error(result.error || "That code couldn't be redeemed.");
        track("code_redeem_failed", { code: normalized, reason: result.error });
        return;
      }
      setSuccess({ label: result.label || "Access granted", expires_at: result.expires_at || "" });
      track("code_redeem_success", { code: normalized });
    } catch (e: any) {
      toast.error(e?.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthenticatedLayout title="Redeem a Code" subtitle="Unlock access with a workshop or gift code">
      <div className="max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card">
            <CardContent className="p-6 space-y-4">
              {success ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-14 h-14 text-accent mx-auto mb-4" />
                  <h2 className="font-serif text-2xl text-foreground mb-2">You're in.</h2>
                  <p className="text-muted-foreground mb-1">{success.label}</p>
                  {success.expires_at && (
                    <p className="text-sm text-muted-foreground/60">
                      Access until {new Date(success.expires_at).toLocaleDateString()}
                    </p>
                  )}
                  <Button variant="gold" className="mt-6" onClick={() => (window.location.href = "/home")}>
                    Enter your reset
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <Ticket className="w-5 h-5 text-accent" />
                    <h2 className="font-serif text-xl font-bold text-foreground">Enter your code</h2>
                  </div>
                  <div>
                    <Label>Code</Label>
                    <Input
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="RECHARGE"
                      className="mt-1 uppercase tracking-widest text-center text-lg"
                      autoFocus
                    />
                  </div>
                  <Button variant="gold" className="w-full" onClick={handleRedeem} disabled={busy}>
                    {busy ? "Redeeming…" : "Redeem"}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    Codes grant access outside of a subscription. One code per account.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AuthenticatedLayout>
  );
}
