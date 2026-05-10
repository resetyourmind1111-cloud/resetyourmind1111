import { useLocation, useNavigate } from "react-router-dom";
import { useGiftedAccess } from "@/hooks/useGiftedAccess";

const HIDDEN_PATHS = ["/upgrade", "/auth", "/onboarding", "/founding-member-welcome"];

export function GiftedCountdownBanner() {
  const { isGifted, daysRemaining, urgency } = useGiftedAccess();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isGifted) return null;
  if (HIDDEN_PATHS.some((p) => location.pathname.startsWith(p))) return null;

  const goUpgrade = () => navigate("/upgrade");

  if (urgency === "early") {
    return (
      <div style={{ background: "#f8f4ff" }} className="px-4 py-3 border-b border-[#3d2a5c]/10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold" style={{ color: "#3d2a5c" }}>
            💜 You have {daysRemaining} {daysRemaining === 1 ? "day" : "days"} of gifted access remaining.
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#3d2a5c", opacity: 0.8 }}>
            Loving the app? Lock in your Founding Member rate before it expires.{" "}
            <button onClick={goUpgrade} className="underline font-semibold">
              Upgrade for just $11 →
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (urgency === "mid") {
    return (
      <div style={{ background: "#fff8e0" }} className="px-4 py-3 border-b border-[#b8922a]/20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold" style={{ color: "#b8922a" }}>
            ⏳ {daysRemaining} {daysRemaining === 1 ? "day" : "days"} left on your gifted access.
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#8a6d1f" }}>
            Your Founding Member discount expires when your free access does. Don't miss it.{" "}
            <button onClick={goUpgrade} className="underline font-semibold">
              Claim your $11 rate now →
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (urgency === "late") {
    return (
      <div style={{ background: "#3d2a5c" }} className="px-4 py-3">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold text-white">
            🔔 Only {daysRemaining} {daysRemaining === 1 ? "day" : "days"} left — your gifted access expires soon.
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#e8dcff" }}>
            After expiry, full membership is $44/month. Lock in $11 now while you still can.
          </p>
          <button
            onClick={goUpgrade}
            style={{ background: "#C9A84C", color: "#1a0f33" }}
            className="mt-2 px-4 py-1.5 rounded-lg text-xs font-bold hover:opacity-90"
          >
            Upgrade Before It Expires →
          </button>
        </div>
      </div>
    );
  }

  // final
  return (
    <div style={{ background: "#3d2a5c" }} className="px-4 py-4">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-base font-bold text-white">Today is your last day of gifted access.</p>
        <p className="text-xs mt-1" style={{ color: "#e8dcff" }}>
          Upgrade now to keep everything you've built. Founding Member rate: $11 first month.
        </p>
        <button
          onClick={goUpgrade}
          style={{ background: "#C9A84C", color: "#1a0f33" }}
          className="mt-3 px-6 py-2.5 rounded-lg text-sm font-bold hover:opacity-90"
        >
          Keep My Access — $11 →
        </button>
      </div>
    </div>
  );
}
