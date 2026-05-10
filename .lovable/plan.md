# Gifted Access 30-Day Experience

Adds a tailored journey for users whose `user_source = 'gifted'`, ending when their `access_expires_at` passes. The $11 Founding Member rate is offered only while gifted access is active.

## 1. Database changes (single migration)

Add to `public.profiles`:
- `access_expires_at` — timestamp with time zone, nullable
- `day15_modal_shown` — boolean, default false
- `day21_modal_shown` — boolean, default false
- `day15_remind_later_at` — timestamp, nullable (so "remind me later" shifts the modal to Day 21)
- `tools_opened_count` — integer, default 0
- `resets_completed_count` — integer, default 0

Update `prevent_profile_privilege_escalation` trigger so regular users can update these new self-owned fields (they are not billing/admin fields, so the existing trigger already allows them — no change needed beyond confirming).

No new RLS policies required — existing self-owned profile policies cover reads/writes.

## 2. New hook: `useGiftedAccess`

`src/hooks/useGiftedAccess.ts` — single source of truth.

Returns:
```
{
  isGifted: boolean,                       // user_source === 'gifted' AND access_expires_at in future
  isExpired: boolean,                      // gifted but access_expires_at in past
  daysRemaining: number,                   // 1-30 (Math.ceil of ms until expiry)
  daysElapsed: number,                     // 30 - daysRemaining (clamped 0..30)
  urgencyTier: 'early' | 'mid' | 'late' | 'final',
  expiresAt: Date | null,
  toolsOpened: number,
  resetsCompleted: number,
  day15ModalShown: boolean,
  day21ModalShown: boolean,
  markModalShown: (key: 'day15' | 'day21', remindLater?: boolean) => Promise<void>,
}
```

Tier mapping (per spec):
- `early`: daysRemaining ≥ 17 (days 1–14 elapsed)
- `mid`: 10 ≤ daysRemaining ≤ 16 (days 15–21)
- `late`: 2 ≤ daysRemaining ≤ 9 (days 22–29)
- `final`: daysRemaining ≤ 1

Subscribes to profile updates via the existing AuthContext profile listener (or a Supabase subscription on the profile row) so the banner updates live.

## 3. New component: `GiftedCountdownBanner`

`src/components/gifted/GiftedCountdownBanner.tsx` — a sticky banner mounted once inside `AuthenticatedLayout`, above the main content.

Behaviour:
- Hidden if `!isGifted` or paid (`subscription_tier !== 'free'`).
- Hidden on `/upgrade`, `/auth`, `/onboarding` to avoid duplicate CTAs.
- Renders the four design variants from the spec (lavender / soft gold / deep purple / deep purple bold) with the matching copy and CTA target `/upgrade`.
- Uses inline tokens for the brand-specific hex codes provided in the spec, since they are one-off marketing colors that don't belong in the global token set.

## 4. New components: gifted modals

- `src/components/gifted/GiftedDay15Modal.tsx` — full-screen modal with gold-on-deep-purple, headline "You're halfway through.", primary "Upgrade for $11 →" → `/upgrade`, secondary "Remind me later" sets `day15_remind_later_at = now()` and `day15_modal_shown = true`.
- `src/components/gifted/GiftedDay21Modal.tsx` — white background, four gold-bordered stat cards driven by `tools_opened_count`, `resets_completed_count`, `daysElapsed`, and existing `current_streak` from profiles. Primary "Continue My Journey — $11 →" → `/upgrade`. Secondary "I'll decide later".

Both modals dismiss to a no-op (state stays "shown" so they never reappear once flagged).

## 5. New controller: `GiftedExperienceGate`

`src/components/gifted/GiftedExperienceGate.tsx` — mounted once in `AuthenticatedLayout`. Decides which (if any) modal to render:
- Day 15 modal: `daysElapsed >= 15 && !day15_modal_shown`.
- Day 21 modal: `daysElapsed >= 21 && !day21_modal_shown` (also triggers if user clicked "Remind me later" on Day 15 and we're now ≥ 21).

Skips both if subscription is paid or if `!isGifted`.

## 6. Counter increments

Two tiny helpers (added inline in the relevant pages, no new files):
- `tools_opened_count`: increment when a user opens a healing tool — bump on mount of `src/pages/HealingToolPage.tsx` (and any tool page guarded behind auth) for gifted users.
- `resets_completed_count`: increment in `src/pages/MonthlyReset.tsx` on completion handler, and on the 30-day reset completion in `src/components/thirty-day/Day30CompletionExperience.tsx`.

Use a single helper `incrementGiftedCounter(field)` colocated in `useGiftedAccess.ts` that no-ops for non-gifted users.

## 7. Upgrade page — gifted variant

In `src/pages/Upgrade.tsx`, extend the existing founding-only branch. Hierarchy of variants:
1. `isGifted` → gifted copy (highest priority).
2. `isLiveReset` → existing $11 live-reset copy.
3. Default → organic $44 copy.

Gifted copy:
- Eyebrow: "FOUNDING MEMBER · GIFTED ACCESS RATE"
- Headline: "You were given access. Now make it yours."
- Subhead: spec body text.
- CTA label: "Claim My $11 Rate →"
- Reuses the same `LIVE_RESET_FIRST_MONTH_COUPON` (`jFPZRQQb`, $33 off once) so first month is $11.

Server-side guard in `supabase/functions/create-checkout/index.ts` is widened: the coupon is honored when `user_source` is `'live-reset'` OR `'gifted'`. Gifted users with an expired `access_expires_at` are rejected (coupon dropped, falls back to $44).

## 8. Files touched

```
supabase/migrations/<new>.sql                  (new — profile fields)
supabase/functions/create-checkout/index.ts    (widen coupon guard)
src/hooks/useGiftedAccess.ts                   (new)
src/components/gifted/GiftedCountdownBanner.tsx (new)
src/components/gifted/GiftedDay15Modal.tsx     (new)
src/components/gifted/GiftedDay21Modal.tsx     (new)
src/components/gifted/GiftedExperienceGate.tsx (new)
src/components/AuthenticatedLayout.tsx         (mount banner + gate)
src/pages/Upgrade.tsx                          (gifted variant branch)
src/pages/HealingToolPage.tsx                  (increment tools_opened_count)
src/pages/MonthlyReset.tsx                     (increment resets_completed_count)
src/components/thirty-day/Day30CompletionExperience.tsx (increment resets_completed_count)
```

## 9. Out of scope / assumptions

- Granting gifted access (setting `user_source = 'gifted'` and `access_expires_at`) is assumed to happen through an existing admin flow or manual DB update — not built here.
- $11 Stripe payment-link path (`buy.stripe.com/...`) already routes via the existing `stripe-webhook` to flip `subscription_tier = 'founding'`; no webhook changes needed.
- Banner colors use literal hex per the spec rather than design tokens, since they are marketing-specific and don't map to the existing dark luxury palette.

Approve and I'll ship it.
