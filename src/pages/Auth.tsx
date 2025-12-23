import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { Mail, Lock, User, Sparkles, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.png";

const signUpSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  email: z.string().trim().email("Please enter a valid email address").max(100),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
});

const signInSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").max(100),
  password: z.string().min(1, "Password is required").max(100),
});

const resetSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").max(100),
});

const newPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters").max(100),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AuthView = "signIn" | "signUp" | "forgotPassword" | "updatePassword";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<AuthView>("signIn");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signUp, signIn, user, isLoading, updatePassword } = useAuth();
  const navigate = useNavigate();

  // Check for password recovery token in URL
  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "recovery") {
      setView("updatePassword");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isLoading && user && view !== "updatePassword") {
      navigate("/");
    }
  }, [user, isLoading, navigate, view]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

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
          email,
          redirectUrl: `${window.location.origin}/auth?type=recovery`,
        },
      });

      if (response.error) {
        toast.error("Failed to send reset email. Please try again.");
      } else {
        toast.success("If an account exists with this email, you'll receive a reset link.");
        setView("signIn");
        setEmail("");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

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
      const { error } = await updatePassword(password);
      if (error) {
        toast.error(error.message);
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
    
    const schema = view === "signUp" ? signUpSchema : signInSchema;
    const data = view === "signUp" ? { firstName, email, password } : { email, password };
    
    const result = schema.safeParse(data);
    
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
      if (view === "signUp") {
        const { error } = await signUp(email, password, firstName);
        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("This email is already registered. Please sign in instead.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Account created successfully! You can now sign in.");
          setView("signIn");
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login")) {
            toast.error("Invalid email or password. Please try again.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Welcome back!");
          navigate("/");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
        <Sparkles className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const renderForgotPassword = () => (
    <form onSubmit={handleForgotPassword} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground py-6 text-lg font-semibold rounded-xl"
      >
        {isSubmitting ? "Sending..." : "Send Reset Link"}
      </Button>

      <button
        type="button"
        onClick={() => setView("signIn")}
        className="flex items-center gap-2 text-primary font-semibold hover:underline mx-auto"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Sign In
      </button>
    </form>
  );

  const renderUpdatePassword = () => (
    <form onSubmit={handleUpdatePassword} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground">New Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`pl-10 ${errors.password ? "border-destructive" : ""}`}
          />
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`pl-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground py-6 text-lg font-semibold rounded-xl"
      >
        {isSubmitting ? "Updating..." : "Update Password"}
      </Button>
    </form>
  );

  const renderAuthForm = () => (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        {view === "signUp" && (
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-foreground">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="firstName"
                type="text"
                placeholder="Your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`pl-10 ${errors.firstName ? "border-destructive" : ""}`}
              />
            </div>
            {errors.firstName && (
              <p className="text-sm text-destructive">{errors.firstName}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`pl-10 ${errors.password ? "border-destructive" : ""}`}
            />
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>

        {view === "signIn" && (
          <button
            type="button"
            onClick={() => setView("forgotPassword")}
            className="text-sm text-primary hover:underline"
          >
            Forgot your password?
          </button>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground py-6 text-lg font-semibold rounded-xl"
        >
          {isSubmitting 
            ? "Loading..." 
            : view === "signUp" ? "Create Account" : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-muted-foreground">
          {view === "signUp" ? "Already have an account?" : "Don't have an account?"}
          <button
            type="button"
            onClick={() => {
              setView(view === "signUp" ? "signIn" : "signUp");
              setErrors({});
            }}
            className="ml-2 text-primary font-semibold hover:underline"
          >
            {view === "signUp" ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </>
  );

  const getTitle = () => {
    switch (view) {
      case "signUp": return "Create Account";
      case "forgotPassword": return "Reset Password";
      case "updatePassword": return "Set New Password";
      default: return "Welcome Back";
    }
  };

  const getSubtitle = () => {
    switch (view) {
      case "signUp": return "Start your transformation journey today";
      case "forgotPassword": return "Enter your email to receive a reset link";
      case "updatePassword": return "Enter your new password below";
      default: return "Sign in to continue your journey";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-16 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <div className="glass-card p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <img src={logo} alt="Reset Your Mind 1111" className="h-16 w-auto" />
          </motion.div>

          <div className="text-center mb-8">
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              {getTitle()}
            </h2>
            <p className="text-muted-foreground">
              {getSubtitle()}
            </p>
          </div>

          {view === "forgotPassword" && renderForgotPassword()}
          {view === "updatePassword" && renderUpdatePassword()}
          {(view === "signIn" || view === "signUp") && renderAuthForm()}
        </div>
      </motion.div>
    </div>
  );
}
