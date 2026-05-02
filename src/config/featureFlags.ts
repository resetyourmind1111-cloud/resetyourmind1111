/**
 * Feature flags — flip to staged-launch features.
 *
 * SHOW_ALL_TIERS:
 *   false → only the Founding $44/month tier is shown on /upgrade.
 *           Live-reset attendees additionally see the "$11 first month"
 *           variant of that same Founding plan (via Stripe coupon).
 *   true  → restore the full Reset / Expand / Embody tier lineup.
 */
export const SHOW_ALL_TIERS = false;

/**
 * Stripe coupon ID that drops the Founding $44/month plan to $11 for the
 * first billing cycle. Applied automatically for users whose
 * profiles.user_source === 'live-reset'.
 */
export const LIVE_RESET_FIRST_MONTH_COUPON = "jFPZRQQb";
