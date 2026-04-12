import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function OnboardingOverlay() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center p-6"
    >
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
          <span className="text-2xl">✦</span>
        </div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
          Let's set up your reset first.
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          It takes 3 minutes and tells you exactly where to start.
        </p>
        <Button
          onClick={() => navigate("/onboarding")}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base py-6 rounded-xl"
        >
          Set up my reset →
        </Button>
      </div>
    </motion.div>
  );
}
