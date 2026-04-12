import { useState, useEffect } from "react";
import { X, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Don't show in standalone mode (already installed)
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    // Desktop — hide
    if (window.innerWidth >= 768) return;

    // Check dismiss localStorage
    const dismissed = localStorage.getItem("pwa_install_dismissed");
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedAt < sevenDays) return;
    }

    // Detect iOS
    const ua = navigator.userAgent;
    const iosDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIos(iosDevice);

    if (iosDevice) {
      // iOS doesn't fire beforeinstallprompt — show manual instructions
      setShowBanner(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShowBanner(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa_install_dismissed", Date.now().toString());
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] border-t-2 border-[#C9A84C] px-4 py-3"
      style={{ backgroundColor: "#2A1F3D" }}
    >
      <div className="flex items-center gap-3 max-w-lg mx-auto">
        <img
          src="/icons/icon-192.png"
          alt="RYM1111"
          className="w-10 h-10 rounded-lg flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-[#F5F0E8] text-sm font-medium truncate">Reset Your Mind 1111™</p>
          {isIos ? (
            <p className="text-[#F5F0E8]/60 text-xs flex items-center gap-1">
              Tap <Share className="w-3 h-3 inline" /> then "Add to Home Screen"
            </p>
          ) : (
            <p className="text-[#F5F0E8]/60 text-xs">Add to your home screen</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {!isIos && (
            <button
              onClick={handleInstall}
              className="bg-[#C9A84C] text-black text-[13px] font-bold rounded px-4 py-2"
            >
              Install
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="text-[#F5F0E8]/40 text-[11px] ml-1"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
