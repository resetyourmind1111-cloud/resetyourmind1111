import { useCallback, useEffect, useRef } from "react";

/**
 * Tiny haptic feedback hook gated by browser support.
 * Only fires on devices that expose navigator.vibrate (mobile PWAs).
 * Used for: streak milestone achievements + completion celebrations.
 */
type HapticPattern = "tap" | "success" | "milestone";

const PATTERNS: Record<HapticPattern, number | number[]> = {
  // Single short pulse — completion confirm
  tap: 12,
  // Two-pulse success — celebration overlay
  success: [18, 60, 28],
  // Triple-pulse — streak / day milestones
  milestone: [22, 70, 22, 70, 40],
};

const isSupported = (): boolean =>
  typeof navigator !== "undefined" && typeof navigator.vibrate === "function";

export function useHaptic() {
  const supportedRef = useRef(false);

  useEffect(() => {
    supportedRef.current = isSupported();
  }, []);

  const vibrate = useCallback((pattern: HapticPattern = "tap") => {
    if (!supportedRef.current) return;
    try {
      navigator.vibrate(PATTERNS[pattern]);
    } catch {
      // no-op: some browsers throw on user-gesture requirements
    }
  }, []);

  return { vibrate, isSupported: supportedRef.current };
}
