import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Sparkles, CheckCircle2, ArrowRight, Lock } from "lucide-react";
import logo from "@/assets/logo.png";
import { track } from "@/lib/analytics";

type Status = "idle" | "redeeming" | "success" | "error";

export default function Workshop() {
  const [searchParams] = useSearchParams();
  const codeFromUrl = (searchParams.get("code") || "RECHARGE").toUpperCase();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [label, setLabel] = useState<string>("Restore & Recharge™ Workshop");

  useEffect(() => {
    track("workshop_landing_view", { code: codeFromUrl });
  }, [codeFromUrl]);

  useEffect(() => {
    // Auto-redeem once signed in
    if (!isLoading && user && status === "idle") {
      void redeem();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, user]);

  async function redeem() {
    setStatus("redeeming");
    setError(null);
    try {
      const { data, error: fnError } = await supabase.rpc("redeem_code", {
        _code: codeFromUrl,
        _source: "workshop_page",
      });
      if (fnError) throw fnError;
      const result = data as { success: boolean; error?: string; expires_at?: string; label?: string };
      if (!result.success) {
        setStatus("error");
        setError(result.error || "We couldn't redeem that code.");
        track("workshop_redeem_failed", { code: codeFromUrl, reason: result.error });
        return;
      }
      setExpiresAt(result.expires_at || null);
      if (result.label) setLabel(result.label);
      setStatus("success");
      track("workshop_redeem_success", { code: codeFromUrl });
    } catch (e: any) {
      setStatus("error");
      setError(e?.message || "Something went wrong.");
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F9F6F0] flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg text-center"
      >
        <img src={logo} alt="Reset Your Mind 1111" className="h-14 w-auto mx-auto mb-4" />
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mb-8" />

        {!user && !isLoading && (
          <>
            <Sparkles className="w-10 h-10 text-[#C9A84C] mx-auto mb-4" />
            <h1 className="font-display text-3xl md:text-4xl mb-3">Welcome, workshop friend.</h1>
            <p className="text-[#F9F6F0]/70 mb-8">
              Create your free account to unlock <span className="text-[#C9A84C]">30 days of full app access</span> —
              a gift from the Restore & Recharge™ Workshop.
            </p>
            <div className="flex flex-col gap-3">
              <Link to={`/auth?view=signup&redirect=/workshop%3Fcode%3D${codeFromUrl}`}>
                <Button className="w-full bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#0A0A0A] h-14 text-lg font-semibold rounded-xl">
                  Create My Free Account <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to={`/auth?redirect=/workshop%3Fcode%3D${codeFromUrl}`} className="text-[#C9A84C] hover:underline text-sm">
                Already have an account? Sign in →
              </Link>
            </div>
            <p className="text-xs text-[#F9F6F0]/40 mt-6">Code <span className="text-[#C9A84C]">{codeFromUrl}</span> will be applied automatically.</p>
          </>
        )}

        {user && status === "redeeming" && (
          <>
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-[#C9A84C] font-display text-4xl font-bold tracking-widest">
              1111
            </motion.div>
            <p className="text-[#F9F6F0]/60 mt-6">Unlocking your access…</p>
          </>
        )}

        {user && status === "success" && (
          <>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
              <CheckCircle2 className="w-16 h-16 text-[#C9A84C] mx-auto mb-4" />
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl mb-3">You're in.</h1>
            <p className="text-[#F9F6F0]/80 text-lg mb-2">{label}</p>
            <p className="text-[#F9F6F0]/60 mb-2">
              You now have full app access for the next 30 days.
            </p>
            {expiresAt && (
              <p className="text-[#F9F6F0]/40 text-sm mb-8">
                Access until {new Date(expiresAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
              </p>
            )}
            <Button onClick={() => navigate("/home")} className="w-full bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#0A0A0A] h-14 text-lg font-semibold rounded-xl">
              Enter Your Reset <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </>
        )}

        {user && status === "error" && (
          <>
            <Lock className="w-10 h-10 text-[#F9F6F0]/60 mx-auto mb-4" />
            <h1 className="font-display text-3xl mb-3">We couldn't apply that code.</h1>
            <p className="text-[#F9F6F0]/60 mb-6">{error}</p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => { setStatus("idle"); void redeem(); }} variant="outline" className="w-full h-12">
                Try again
              </Button>
              <Button onClick={() => navigate("/home")} className="w-full bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#0A0A0A] h-12 font-semibold">
                Continue to app
              </Button>
              {error && /already redeemed/i.test(error) && (
                <p className="text-sm text-[#F9F6F0]/40">You've already used a code on this account — your access is active.</p>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
