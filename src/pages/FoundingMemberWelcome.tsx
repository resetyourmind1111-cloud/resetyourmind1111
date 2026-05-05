import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crown, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function FoundingMemberWelcome() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"signup" | "welcome">("signup");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || password.length < 8) {
      setError("Please enter your email and a password of at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "founding-member-signup",
        { body: { email: email.trim().toLowerCase(), password, firstName: firstName.trim() || null } }
      );

      if (fnError || (data && (data as any).error)) {
        const msg = (data as any)?.error || fnError?.message || "Something went wrong.";
        setError(msg);
        setLoading(false);
        return;
      }

      // Sign them in immediately
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) {
        setError("Account created — please sign in.");
        setLoading(false);
        navigate("/auth");
        return;
      }

      setStep("welcome");
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
      setLoading(false);
    }
  };

  if (step === "welcome") {
    return (
      <div className="min-h-screen bg-[#06060e] text-[#F9F6F0] flex items-center justify-center px-6 py-12">
        <div className="max-w-xl w-full text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/40 mb-2">
            <Crown className="w-10 h-10 text-[#C9A84C]" />
          </div>
          <div className="space-y-3">
            <p className="uppercase tracking-[0.3em] text-xs text-[#C9A84C]">Founding Member</p>
            <h1 className="font-serif text-4xl md:text-5xl">Welcome home.</h1>
            <p className="text-[#F9F6F0]/70 text-lg leading-relaxed">
              You're in. Full access. No trial. Your Founding Member seat is locked
              for as long as you stay.
            </p>
          </div>
          <div className="space-y-3 text-left bg-[#F9F6F0]/[0.03] border border-[#C9A84C]/20 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#C9A84C] mt-0.5 shrink-0" />
              <p className="text-sm text-[#F9F6F0]/80">
                All Oracle decks, every Permission Slip™, the full Emotional Surgery™ library, and the Sacred Circle.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#C9A84C] mt-0.5 shrink-0" />
              <p className="text-sm text-[#F9F6F0]/80">
                Lifetime locked pricing — your rate never changes.
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/home")}
            className="w-full h-14 bg-gradient-to-r from-[#C9A84C] to-[#a8893c] text-[#06060e] font-semibold rounded-xl text-base hover:opacity-95"
          >
            Enter the app
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06060e] text-[#F9F6F0] flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/40 mx-auto">
            <Crown className="w-8 h-8 text-[#C9A84C]" />
          </div>
          <p className="uppercase tracking-[0.3em] text-xs text-[#C9A84C]">Founding Member</p>
          <h1 className="font-serif text-3xl md:text-4xl">Claim your seat.</h1>
          <p className="text-[#F9F6F0]/60 text-sm">
            Your payment is in. Create your login to unlock full access.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="firstName" className="text-[#F9F6F0]/70 text-sm">First name (optional)</Label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-[#F9F6F0]/5 border-[#C9A84C]/20 text-[#F9F6F0] h-12 rounded-xl focus:border-[#C9A84C]/60"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[#F9F6F0]/70 text-sm">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="the email you used at checkout"
              className="bg-[#F9F6F0]/5 border-[#C9A84C]/20 text-[#F9F6F0] h-12 rounded-xl focus:border-[#C9A84C]/60"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-[#F9F6F0]/70 text-sm">Create password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="at least 8 characters"
              className="bg-[#F9F6F0]/5 border-[#C9A84C]/20 text-[#F9F6F0] h-12 rounded-xl focus:border-[#C9A84C]/60"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-400/30 rounded-lg px-3 py-2">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-gradient-to-r from-[#C9A84C] to-[#a8893c] text-[#06060e] font-semibold rounded-xl text-base hover:opacity-95"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Activate my Founding Member access"}
          </Button>

          <p className="text-xs text-[#F9F6F0]/40 text-center">
            Already have an account?{" "}
            <button type="button" onClick={() => navigate("/auth")} className="text-[#C9A84C] underline">
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
