import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.png";
import { AuthFormField } from "@/components/auth/AuthFormField";
import { AuthError } from "@/components/auth/AuthError";
import { PostSignupTransition } from "@/components/auth/PostSignupTransition";

const signUpSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  email: z.string().trim().email("Please enter a valid email address.").max(100),
  password: z.string().min(8, "Password must be at least 8 characters.").max(100),
});

const signInSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address.").max(100),
  password: z.string().min(1, "Password is required").max(100),
});

const resetSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address.").max(100),
});

const newPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters.").max(100),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters.").max(100),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AuthView = "signIn" | "signUp" | "forgotPassword" | "updatePassword" | "resetSent";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const initialView = searchParams.get("view") === "signup" ? "signUp" : "signIn";
  const [view, setView] = useState<AuthView>(initialView);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<{ message: string; linkText?: string; linkTo?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const { signUp, signIn, user, isLoading, updatePassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "recovery") setView("updatePassword");

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setView("updatePassword");
    });
    return () => subscription.unsubscribe();
  }, [searchParams]);

  useEffect(() => {
    if (!isLoading && user && view !== "updatePassword" && !showTransition) {
      const redirect = searchParams.get("redirect");
      if (redirect === "checkout") {
        const priceId = searchParams.get("priceId");
        const tier = searchParams.get("tier");
        if (priceId) {
          supabase.functions.invoke("create-checkout", {
            body: { priceId, tierKey: tier },
          }).then(({ data, error }) => {
            if (error) {
              toast.error(error.message || "Failed to start checkout.");
              navigate("/dashboard");
              return;
            }
            if (data?.url) { window.location.assign(data.url); return; }
            navigate("/dashboard");
          });
          return;
        }
      }
      navigate("/home");
    }
  }, [user, isLoading, navigate, view, searchParams, showTransition]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setFormError(null);

    const result = resetSchema.safeParse({ email });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await supabase.functions.invoke("send-password-reset", {
        body: {
          email: result.data.email.toLowerCase(),
          redirectUrl: `${window.location.origin}/auth?type=recovery`,
        },
      });
      if (response.error) {
        setFormError({ message: "Something went wrong. Check your connection and try again." });
      } else {
        setResetEmail(result.data.email.toLowerCase());
        setView("resetSent");
        setEmail("");
      }
    } catch {
      setFormError({ message: "Something went wrong. Check your connection and try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setFormError(null);

    const result = newPasswordSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setFormError({ message: "Your reset link has expired. Please request a new one.", linkText: "Request new link →", linkTo: "/auth" });
        setView("forgotPassword");
        return;
      }
      const { error } = await updatePassword(password);
      if (error) {
        setFormError({ message: error.message });
      } else {
        toast.success("Password updated successfully!");
        navigate("/");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setFormError(null);

    if (view === "signUp") {
      const result = signUpSchema.safeParse({ firstName, email, password });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }

      setIsSubmitting(true);
      try {
        const { error } = await signUp(result.data.email.toLowerCase(), result.data.password, result.data.firstName);
        if (error) {
          if (error.message.includes("already registered")) {
            setFormError({ message: "An account with this email already exists.", linkText: "Sign in instead →", linkTo: "/auth" });
          } else {
            setFormError({ message: error.message });
          }
        } else {
          // Capture ?source=live-reset → persist on profile so we can offer
          // the Founding $11 first-month rate on Day 7.
          const sourceParam = searchParams.get("source");
          const userSource = sourceParam === "live-reset" ? "live-reset" : "organic";
          setTimeout(async () => {
            try {
              const { data: { user: newUser } } = await supabase.auth.getUser();
              if (newUser) {
                await supabase
                  .from("profiles")
                  .update({ user_source: userSource } as any)
                  .eq("user_id", newUser.id);
              }
            } catch (err) {
              console.warn("user_source update failed (non-blocking):", err);
            }
            // Enqueue the 7-day trial email sequence
            supabase.functions.invoke("enqueue-trial-emails").catch((err) => {
              console.warn("enqueue-trial-emails failed (non-blocking):", err);
            });
          }, 1500);
          setShowTransition(true);
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      const result = signInSchema.safeParse({ email, password });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }

      setIsSubmitting(true);
      try {
        const { error } = await signIn(result.data.email.toLowerCase(), result.data.password);
        if (error) {
          const msg = error.message.toLowerCase();
          if (msg.includes("invalid login") || msg.includes("invalid credentials")) {
            setFormError({ message: "That password doesn't match our records. Try again or reset your password.", linkText: "Reset password →", linkTo: "/auth?forgotPassword" });
          } else if (msg.includes("email not confirmed")) {
            setFormError({ message: "Please confirm your email address, then try again." });
          } else {
            setFormError({ message: error.message });
          }
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Check for forgotPassword param
  useEffect(() => {
    if (searchParams.has("forgotPassword")) setView("forgotPassword");
  }, [searchParams]);

  if (showTransition) {
    return <PostSignupTransition firstName={firstName || "friend"} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A]">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-[#C9A84C] font-display text-4xl font-bold tracking-widest"
        >
          1111
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-start px-4 py-8 md:py-16 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[400px]"
      >
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Reset Your Mind 1111" className="h-14 w-auto" />
        </div>

        {/* Gold bar */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mb-8" />

        {/* Content by view */}
        {view === "resetSent" ? (
          <div className="text-center space-y-4">
            <h1 className="font-display text-3xl text-[#F9F6F0]">Check your inbox.</h1>
            <p className="text-[#F9F6F0]/60 font-sans">
              We sent a password reset link to <span className="text-[#F9F6F0]">{resetEmail}</span>.
              It expires in 24 hours.
            </p>
            <button
              onClick={() => { setView("signIn"); setFormError(null); }}
              className="text-[#C9A84C] font-medium hover:underline flex items-center gap-2 mx-auto mt-6"
            >
              <ArrowLeft className="w-4 h-4" /> Back to sign in
            </button>
          </div>
        ) : view === "updatePassword" ? (
          <>
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl text-[#F9F6F0] mb-2">Set new password.</h1>
              <p className="text-[#F9F6F0]/60 font-sans">Enter your new password below.</p>
            </div>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <AuthFormField id="password" type="password" placeholder="New password" value={password} onChange={setPassword} error={errors.password} icon={<Lock className="w-5 h-5" />} />
              <AuthFormField id="confirmPassword" type="password" placeholder="Confirm password" value={confirmPassword} onChange={setConfirmPassword} error={errors.confirmPassword} icon={<Lock className="w-5 h-5" />} />
              {formError && <AuthError message={formError.message} linkText={formError.linkText} linkTo={formError.linkTo} />}
              <Button type="submit" disabled={isSubmitting} className="w-full bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#0A0A0A] h-14 text-lg font-semibold rounded-xl">
                {isSubmitting ? "Updating..." : "Update Password →"}
              </Button>
            </form>
          </>
        ) : view === "forgotPassword" ? (
          <>
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl text-[#F9F6F0] mb-2">Reset your password.</h1>
              <p className="text-[#F9F6F0]/60 font-sans">Enter your email and we'll send you a link.</p>
            </div>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <AuthFormField id="email" type="email" placeholder="Your email address" value={email} onChange={setEmail} error={errors.email} icon={<Mail className="w-5 h-5" />} />
              {formError && <AuthError message={formError.message} />}
              <Button type="submit" disabled={isSubmitting} className="w-full bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#0A0A0A] h-14 text-lg font-semibold rounded-xl">
                {isSubmitting ? "Sending..." : "Send Reset Link →"}
              </Button>
            </form>
            <button
              onClick={() => { setView("signIn"); setErrors({}); setFormError(null); }}
              className="flex items-center gap-2 text-[#C9A84C] font-medium hover:underline mx-auto mt-6"
            >
              <ArrowLeft className="w-4 h-4" /> Back to sign in
            </button>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl text-[#F9F6F0] mb-2">
                {view === "signUp" ? "Your reset starts here." : "Welcome back."}
              </h1>
              <p className="text-[#F9F6F0]/60 font-sans">
                {view === "signUp" ? (
                  <>Create your free account.<br />No credit card required.</>
                ) : (
                  "Your reset continues here."
                )}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {view === "signUp" && (
                <AuthFormField id="firstName" type="text" placeholder="Your first name" value={firstName} onChange={setFirstName} error={errors.firstName} icon={<User className="w-5 h-5" />} />
              )}
              <AuthFormField id="email" type="email" placeholder="Your email address" value={email} onChange={setEmail} error={errors.email} icon={<Mail className="w-5 h-5" />} />
              <AuthFormField id="password" type="password" placeholder={view === "signUp" ? "Create a password" : "Your password"} value={password} onChange={setPassword} error={errors.password} icon={<Lock className="w-5 h-5" />} />

              {view === "signIn" && (
                <div className="flex justify-end">
                  <button type="button" onClick={() => { setView("forgotPassword"); setErrors({}); setFormError(null); }} className="text-sm text-[#C9A84C] hover:underline">
                    Forgot password?
                  </button>
                </div>
              )}

              {formError && <AuthError message={formError.message} linkText={formError.linkText} linkTo={formError.linkTo} />}

              <Button type="submit" disabled={isSubmitting} className="w-full bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#0A0A0A] h-14 text-lg font-semibold rounded-xl">
                {isSubmitting ? "Loading..." : view === "signUp" ? "Start My Free Reset →" : "Sign In →"}
              </Button>
            </form>

            {view === "signUp" && (
              <p className="text-center text-[#F9F6F0]/30 text-sm mt-4">
                7 days free. No credit card needed.<br />Cancel anytime.
              </p>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-[1px] bg-[#C9A84C]/20" />
              <span className="text-[#F9F6F0]/30 text-sm">or</span>
              <div className="flex-1 h-[1px] bg-[#C9A84C]/20" />
            </div>

            <div className="text-center">
              <p className="text-[#F9F6F0]/60">
                {view === "signUp" ? "Already have an account?" : "Don't have an account?"}
              </p>
              <button
                type="button"
                onClick={() => { setView(view === "signUp" ? "signIn" : "signUp"); setErrors({}); setFormError(null); }}
                className="text-[#C9A84C] font-semibold hover:underline mt-1"
              >
                {view === "signUp" ? "Sign in →" : "Start your free reset →"}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
