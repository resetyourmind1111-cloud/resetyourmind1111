## Goal
Ship the 7 activation fixes safely and modularly. Zero changes to auth, Stripe, subscription, or trial-status logic.

## 1. Lightweight analytics (no external SaaS)

**New table** `analytics_events`:
- `id uuid`, `user_id uuid null`, `session_id text`, `event text`, `props jsonb`, `path text`, `created_at timestamptz default now()`
- RLS: anon + authenticated can INSERT only; SELECT restricted to admins (`is_admin`)
- GRANTs per project standard

**New client utility** `src/lib/analytics.ts`:
- `track(event, props?)` — fire-and-forget insert, anonymous-safe (uses `session_id` from `localStorage`)
- `useTrackPageView(name)` hook

**Events wired** exactly as you listed:
`landing_view`, `cta_click_start_reset`, `cta_click_assessment`, `auth_view`, `signup_success`, `onboarding_complete`, `home_first_action`, `card_pull`, `permission_slip_accepted`, `assessment_started`, `assessment_completed`.

No replacement of existing logic — only additive `track()` calls at known points (Landing CTAs, Auth mount, signup success in AuthContext, end of `PersonalizedOnboarding.handleProcessing`, Home primary CTA, card-pull mutation, permission-slip-accept mutation, Assessment mount + submit).

## 2. Home redesign — one obvious first action

In `src/pages/Home.tsx`:
- Add a single primary hero card **above the fold** for trial/free users who have not yet activated: "Take your 30-second check-in →" linking to the existing daily check-in flow.
- All other dashboard sections (tools grid, oracle, lessons, etc.) stay exactly as-is but render *below* the hero with a subtler visual treatment (smaller heading, no gold gradient).
- Once the user has any activation event, hero collapses to a compact "Today's practice" card and the rest of the dashboard returns to current weight.
- Paid users are unaffected — hero only shows for trial/free.

No removal of existing widgets. No changes to gating logic.

## 3. Activation definition

Single source of truth in `src/lib/activation.ts`:
```ts
isActivated(userId) → boolean
```
Returns true if any row exists in: `daily_shifts`, `lesson_completions`, `card_pulls`, `permission_slips_accepted`, `assessment_results`.

Used by:
- Home hero (collapse condition)
- Day-1 no-activity nudge (skip condition)

## 4. Activation event tracking
Covered by #1 wire-ups (card_pull, permission_slip_accepted, assessment_completed) + a `home_first_action` fired on the check-in CTA click.

## 5. Backfill 21 users missing trial schedules

One-off admin script `scripts/backfill-trial-schedules.ts` (run locally, never auto-executed):
- Lists profiles where `subscription_tier IN (null,'free')` AND user has **zero** rows in `notifications_schedule`
- Calls the same insert logic as `enqueue-trial-emails`, anchored on the user's `auth.users.created_at`
- Skips users whose Day-N would be in the past — only enqueues future days
- Prints a dry-run summary first; requires `--apply` flag to write

Safe: idempotency guaranteed by the existing "any rows = skip" check + script's own pre-filter.

## 6. Day-1 no-activity nudge

New edge function `send-day1-nudge` + hourly cron:
- Finds users whose trial started 22–26h ago, `subscription_tier='free'`, and `isActivated() === false`
- Sends a single "Your reset is one tap away" email (new template entry, `day_number = 11`)
- Idempotent: writes a sent marker row to `notifications_schedule` with `day_number=11` before sending; skips if already exists

## 7. Day-8 follow-up email

Add `day: 8` to `_shared/trial-emails.ts` and one new row to `enqueue-trial-emails` (start + 8 days, 15:00 UTC). Add `8` to the `day_number` filter in `send-trial-emails`. Skip-on-upgrade logic already handles non-converters correctly.

**New signups only** — no backfill of Day-8 for existing trials (consistent with your previous instruction on the Day-2 morning nudge).

## Files touched

**New:**
- `supabase/migrations/<ts>_analytics_events.sql`
- `src/lib/analytics.ts`
- `src/lib/activation.ts`
- `src/components/home/CheckInHeroCard.tsx`
- `scripts/backfill-trial-schedules.ts`
- `supabase/functions/send-day1-nudge/index.ts`

**Edited (additive only):**
- `src/pages/Landing.tsx` (2 track calls)
- `src/pages/Auth.tsx` (1 track call) + `src/contexts/AuthContext.tsx` (1 track call on signup)
- `src/components/onboarding/PersonalizedOnboarding.tsx` (1 track call)
- `src/pages/Home.tsx` (hero insertion)
- `src/pages/Assessment.tsx` (2 track calls)
- Card-pull + permission-slip components (1 track call each)
- `supabase/functions/_shared/trial-emails.ts` (Day 8 + Day 11 templates)
- `supabase/functions/enqueue-trial-emails/index.ts` (Day 8 row)
- `supabase/functions/send-trial-emails/index.ts` (extend day_number filter)

## Impact confirmation
- **Auth:** no changes. AuthContext gains one fire-and-forget `track()` call after successful signup.
- **Checkout / Stripe / subscriptions:** no changes.
- **Trial status / gating:** no changes. Backfill never touches `subscription_tier` or trial dates.
- **Existing users:** unaffected unless they're in the 21-user backfill cohort (and only by receiving the email schedule they should have had).

## Execution order
A. Migration + analytics utility + activation helper (foundation)
B. Wire `track()` calls + Home hero (activation visibility)
C. Day-8 email template + enqueue
D. Backfill script (you run it manually with `--apply` when ready)
E. Day-1 nudge function + cron (last, since it depends on activation tracking)

Each step is independently revertible.
