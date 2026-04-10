import { useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share2, X, Crown, Flame, Sun, RefreshCw, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";

interface MilestoneCardProps {
  zoneName: string;
  zoneMessage: string;
  thermostatType?: string;
  show: boolean;
  onClose: () => void;
}

const ZONE_ICONS: Record<string, React.ReactNode> = {
  "The Starting Point": <Flame className="w-8 h-8" />,
  "The Awakening": <Sun className="w-8 h-8" />,
  "The Shift": <RefreshCw className="w-8 h-8" />,
  "The Rise": <ArrowUp className="w-8 h-8" />,
  "The Summit": <Crown className="w-8 h-8" />,
};

const ZONE_CELEBRATION: Record<string, string> = {
  "The Starting Point": "I just began my Reset Map journey.\nMy Worth Thermostat is warming up.\nPermission granted. ✦",
  "The Awakening": "I just entered The Awakening on my Reset Map.\nMy Worth Thermostat is rising.\nPermission granted. ✦",
  "The Shift": "I just entered The Shift on my Reset Map.\nSomething is changing inside me.\nPermission granted. ✦",
  "The Rise": "I just entered The Rise on my Reset Map.\nMy Worth Thermostat is rising.\nPermission granted. ✦",
  "The Summit": "I just entered The Summit on my Reset Map.\nMy Worth Thermostat is rising.\nPermission granted. ✦",
};

export function MilestoneShareCard({ zoneName, zoneMessage, thermostatType, show, onClose }: MilestoneCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const captureCard = useCallback(async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0A0A0A",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), "image/png"));
    } catch {
      return null;
    }
  }, []);

  const handleDownload = async () => {
    const blob = await captureCard();
    if (!blob) {
      toast({ title: "Couldn't generate image", variant: "destructive" });
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reset-map-${zoneName.toLowerCase().replace(/\s/g, "-")}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Image saved ✨" });
  };

  const handleShare = async () => {
    const blob = await captureCard();
    if (!blob) {
      toast({ title: "Couldn't generate image", variant: "destructive" });
      return;
    }
    const file = new File([blob], "reset-milestone.png", { type: "image/png" });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: `I entered ${zoneName}!`,
          text: ZONE_CELEBRATION[zoneName] || `I just entered ${zoneName} on my Reset Map.`,
          files: [file],
        });
      } catch (err: any) {
        if (err.name !== "AbortError") {
          toast({ title: "Share cancelled" });
        }
      }
    } else {
      // Fallback: copy text
      const text = `${ZONE_CELEBRATION[zoneName] || `I just entered ${zoneName} on my Reset Map.`}\n\n#ResetYourMind1111 #WorthThermostat`;
      await navigator.clipboard.writeText(text);
      toast({ title: "Milestone text copied to clipboard ✨" });
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-[#06060e]/95 flex items-center justify-center p-6"
        >
          {/* Close */}
          <button onClick={onClose} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground z-10">
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-sm w-full space-y-6">
            {/* The shareable card */}
            <div
              ref={cardRef}
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: "#0A0A0A" }}
            >
              <div className="p-8 space-y-6 text-center">
                {/* Gold glow icon */}
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #C9A84C, #D4B86A)",
                    boxShadow: "0 0 30px rgba(201, 168, 76, 0.4)",
                  }}
                >
                  <span className="text-[#0A0A0A]">{ZONE_ICONS[zoneName] || <Crown className="w-8 h-8" />}</span>
                </div>

                {/* Zone name */}
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: 700, color: "#C9A84C", lineHeight: 1.3 }}>
                  {zoneName}
                </h2>

                {/* Thermostat type */}
                {thermostatType && (
                  <p style={{ fontSize: "12px", color: "rgba(249,246,240,0.5)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                    {thermostatType}
                  </p>
                )}

                {/* Celebration message */}
                <p style={{ fontSize: "14px", color: "#F9F6F0", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                  {ZONE_CELEBRATION[zoneName]}
                </p>

                {/* Branding */}
                <div className="pt-4 border-t" style={{ borderColor: "rgba(201, 168, 76, 0.2)" }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", color: "#C9A84C", fontWeight: 600, letterSpacing: "0.05em" }}>
                    Reset Your Mind 1111™
                  </p>
                  <p style={{ fontSize: "10px", color: "rgba(249,246,240,0.35)", marginTop: "6px" }}>
                    #ResetYourMind1111 #WorthThermostat
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleDownload}
                variant="outline"
                className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-xl py-5"
              >
                <Download className="w-4 h-4 mr-2" /> Save Image
              </Button>
              <Button
                onClick={handleShare}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-5"
              >
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
            </div>

            <button onClick={onClose} className="w-full text-center text-sm text-muted-foreground hover:text-foreground">
              Skip for now
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}