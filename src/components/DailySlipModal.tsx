import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, ArrowRight, X } from "lucide-react";
import { getDailySlip } from "@/data/permissionSlipsData";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const STORAGE_KEY = "daily-slip-dismissed";

function getDismissedDate(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function setDismissedToday() {
  try {
    localStorage.setItem(STORAGE_KEY, new Date().toDateString());
  } catch {}
}

export function DailySlipModal() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const dailySlip = useMemo(() => getDailySlip(), []);

  const alreadyDismissedToday = getDismissedDate() === new Date().toDateString();
  const [open, setOpen] = useState(!alreadyDismissedToday);

  const { data: acceptedSlips = [] } = useQuery({
    queryKey: ["accepted-slips", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("permission_slips_accepted")
        .select("slip_text")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data as { slip_text: string }[];
    },
    enabled: !!user,
  });

  const isDailyAccepted = useMemo(
    () => acceptedSlips.some((s) => s.slip_text === dailySlip.text),
    [acceptedSlips, dailySlip]
  );

  const acceptSlip = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("permission_slips_accepted").insert({
        user_id: user!.id,
        slip_text: dailySlip.text,
        category: dailySlip.category,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accepted-slips"] });
      track("permission_slip_accepted", { source: "daily_slip_modal" });
      toast.success("Permission slip accepted ✨");
    },
  });

  const handleDismiss = useCallback(() => {
    setDismissedToday();
    setOpen(false);
  }, []);

  const handleAccept = useCallback(() => {
    if (!isDailyAccepted) {
      acceptSlip.mutate();
    }
    setDismissedToday();
    setTimeout(() => setOpen(false), 1200);
  }, [isDailyAccepted, acceptSlip]);

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleDismiss(); }}>
      <DialogContent
        className="sm:max-w-md border-accent/30 p-0 overflow-hidden bg-transparent shadow-none [&>button]:hidden"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative rounded-2xl overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, hsl(0 0% 8%) 0%, hsl(0 0% 5%) 100%)",
            boxShadow:
              "0 0 80px hsl(43 52% 54% / 0.15), 0 20px 60px -20px hsl(0 0% 0% / 0.5)",
          }}
        >
          {/* Gold accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, hsl(43 52% 54%) 50%, transparent 100%)",
            }}
          />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="px-8 pt-10 pb-8 text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Sparkles className="w-10 h-10 text-accent mx-auto mb-5" />
            </motion.div>

            {/* Label */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs uppercase tracking-[0.25em] text-accent/70 mb-6"
            >
              Today's Permission Slip
            </motion.p>

            {/* Category */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-xs uppercase tracking-widest text-accent/50 mb-3"
            >
              {dailySlip.category}
            </motion.p>

            {/* Slip text */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-serif italic text-foreground text-2xl leading-relaxed mb-8"
            >
              "{dailySlip.text}"
            </motion.p>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex flex-col gap-3"
            >
              <Button
                onClick={handleAccept}
                disabled={isDailyAccepted || acceptSlip.isPending}
                className={
                  isDailyAccepted
                    ? "bg-accent/20 text-accent border border-accent/30 w-full"
                    : "bg-accent text-accent-foreground hover:bg-accent/90 w-full btn-glow"
                }
              >
                {isDailyAccepted ? (
                  <>
                    <Check className="w-4 h-4 mr-2" /> Accepted
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" /> Accept This Slip
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-4">
                <Link to="/permission-slips" onClick={handleDismiss}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-accent/60 hover:text-accent text-xs"
                  >
                    View All 125 Slips <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  Not now
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
