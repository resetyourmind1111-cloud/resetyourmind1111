import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useFoundingMode } from "@/hooks/useFoundingMode";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import logo from "@/assets/logo.png";

export default function Landing() {
  const { foundingMode, spotsRemaining } = useFoundingMode();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/home");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
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
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md text-center"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Reset Your Mind 1111" className="h-20 w-auto" />
        </div>

        {/* Gold bar */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mb-10" />

        {/* Headline */}
        <h1 className="font-display text-3xl md:text-4xl text-[#F9F6F0] leading-tight mb-4">
          Stop repeating patterns<br />that no longer serve you.
        </h1>

        <p className="text-[#F9F6F0]/60 font-sans text-base md:text-lg mb-10 max-w-sm mx-auto">
          The Reset Your Mind 1111™ app works at the nervous system level — where patterns actually live.
        </p>

        {/* Founding member badge */}
        {foundingMode && spotsRemaining > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-[#3D1A6E]/30 border border-[#3D1A6E]/50 rounded-full px-4 py-2">
              <span className="text-sm">⭐</span>
              <span className="text-[#F9F6F0] text-sm font-medium">Founding Member Rate — $44/month locked in</span>
            </div>
            <p className="text-[#F9F6F0]/40 text-xs mt-2">{spotsRemaining} spots remaining</p>
          </motion.div>
        )}

        {/* CTAs */}
        <div className="space-y-3">
          <Button asChild className="w-full bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#0A0A0A] h-14 text-lg font-semibold rounded-xl">
            <Link to="/auth?view=signup">Start My Free 7-Day Reset →</Link>
          </Button>

          <Button asChild variant="outline" className="w-full border-[#C9A84C]/40 text-[#F9F6F0] hover:bg-[#C9A84C]/10 h-14 text-lg font-semibold rounded-xl bg-transparent">
            <Link to="/auth">Sign In →</Link>
          </Button>
        </div>

        <p className="text-[#F9F6F0]/30 text-sm mt-6">
          No credit card required. 7 days free.
        </p>
      </motion.div>
    </div>
  );
}
