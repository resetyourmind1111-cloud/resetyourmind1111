import { useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share2, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";

interface PatternShareCardProps {
  trapName: string;
}

export function PatternShareCard({ trapName }: PatternShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const captureCard = useCallback(async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#06060e",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
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
    a.download = `my-pattern-${trapName.toLowerCase().replace(/\s+/g, "-")}.png`;
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
    const file = new File([blob], "my-pattern.png", { type: "image/png" });
    const shareText = `My Pattern: ${trapName}\nI'm resetting it. Reset yours at resetyourmind1111.com\n\n#ResetYourMind1111`;

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: `My Pattern: ${trapName}`,
          text: shareText,
          files: [file],
        });
      } catch (err: any) {
        if (err.name !== "AbortError") toast({ title: "Share cancelled" });
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({ title: "Pattern text copied to clipboard ✨" });
    }
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setShowPreview(true)}
        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors min-h-[44px] px-3"
      >
        <Share2 className="w-4 h-4" />
        Share your pattern
      </button>

      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-[#06060e]/95 flex items-center justify-center p-6 overflow-y-auto"
          >
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-6 right-6 text-muted-foreground hover:text-foreground z-10"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-w-sm w-full space-y-6 my-auto">
              {/* Square share card */}
              <div
                ref={cardRef}
                className="aspect-square rounded-2xl overflow-hidden relative"
                style={{
                  backgroundColor: "#06060e",
                  backgroundImage:
                    "radial-gradient(circle at 50% 40%, rgba(61, 26, 110, 0.55) 0%, rgba(6, 6, 14, 0.95) 65%)",
                }}
              >
                {/* Gold frame accent */}
                <div
                  className="absolute inset-3 rounded-xl pointer-events-none"
                  style={{ border: "1px solid rgba(201, 168, 76, 0.35)" }}
                />

                <div className="relative h-full flex flex-col items-center justify-center text-center px-8 py-10">
                  <p
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "#C9A84C",
                      fontWeight: 600,
                      marginBottom: "20px",
                    }}
                  >
                    My Pattern
                  </p>

                  <Sparkles className="w-7 h-7 mb-5" style={{ color: "#C9A84C" }} />

                  <h2
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "32px",
                      fontWeight: 700,
                      color: "#F9F6F0",
                      lineHeight: 1.2,
                      marginBottom: "20px",
                    }}
                  >
                    {trapName}
                  </h2>

                  <p
                    style={{
                      fontSize: "14px",
                      color: "rgba(249, 246, 240, 0.75)",
                      lineHeight: 1.6,
                      maxWidth: "280px",
                    }}
                  >
                    I'm resetting it.
                    <br />
                    Reset yours at resetyourmind1111.com
                  </p>

                  <div
                    className="absolute bottom-6 left-0 right-0"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "12px",
                      color: "#C9A84C",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                    }}
                  >
                    Reset Your Mind 1111™
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-xl py-5"
                >
                  <Download className="w-4 h-4 mr-2" /> Download
                </Button>
                <Button
                  onClick={handleShare}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-5"
                >
                  <Share2 className="w-4 h-4 mr-2" /> Share
                </Button>
              </div>

              <button
                onClick={() => setShowPreview(false)}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
