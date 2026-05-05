import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@17.5.0?target=denonext";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const PRICE_TIER_MAP: Record<string, { tier: string; plan: string }> = {
  "price_1TNYPhC1ibVojXJK3CB5eX7T": { tier: "RESET", plan: "RESET" },
  "price_1TNYQoC1ibVojXJK9f7YhF3n": { tier: "RESET", plan: "RESET" },
  "price_1TNYTnC1ibVojXJKpUwoZSLk": { tier: "EXPAND", plan: "EXPAND" },
  "price_1TNYVPC1ibVojXJKlJKQkFZX": { tier: "EXPAND", plan: "EXPAND" },
  "price_1TNYdXC1ibVojXJKPkHDKXgL": { tier: "EMBODY", plan: "EMBODY" },
  "price_1TNYeNC1ibVojXJKlvFsGuhA": { tier: "EMBODY", plan: "EMBODY" },
  "price_1TNYgqC1ibVojXJKdUQ9Wa7W": { tier: "FOUNDING_FULL_ACCESS", plan: "FOUNDING_111" },
};

const ANNUAL_PRICES = new Set([
  "price_1TNYQoC1ibVojXJK9f7YhF3n",
  "price_1TNYVPC1ibVojXJKlJKQkFZX",
  "price_1TNYeNC1ibVojXJKlvFsGuhA",
]);

function getBillingInterval(priceId: string): string {
  return ANNUAL_PRICES.has(priceId) ? "annual" : "monthly";
}

function periodEndIso(sub: any): string | null {
  // Newer Stripe API moved current_period_end to items.data[0]
  const ts = sub?.current_period_end ?? sub?.items?.data?.[0]?.current_period_end;
  if (!ts || typeof ts !== "number") return null;
  const d = new Date(ts * 1000);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200 });
  }

  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!signature || !webhookSecret) {
    return new Response("Missing signature or secret", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Resolve user_id from subscription metadata, or fall back to DB lookup
  // by stripe_subscription_id / stripe_customer_id. Stripe doesn't always
  // carry metadata on renewals or portal-driven updates.
  async function resolveUserId(sub: Stripe.Subscription): Promise<string | null> {
    const metaId = (sub.metadata as any)?.user_id;
    if (metaId) return metaId;

    const { data: bySub } = await supabaseAdmin
      .from("subscriptions")
      .select("user_id")
      .eq("stripe_subscription_id", sub.id)
      .maybeSingle();
    if (bySub?.user_id) return bySub.user_id;

    if (sub.customer) {
      const { data: byCust } = await supabaseAdmin
        .from("subscriptions")
        .select("user_id")
        .eq("stripe_customer_id", sub.customer as string)
        .maybeSingle();
      if (byCust?.user_id) return byCust.user_id;
    }
    return null;
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;

        // Case A: payment-link / no app account yet — capture as pending founding member
        if (!userId) {
          const email =
            session.customer_details?.email ||
            session.customer_email ||
            null;
          if (email) {
            await supabaseAdmin.from("pending_founding_members").upsert(
              {
                email: email.toLowerCase(),
                stripe_customer_id: (session.customer as string) ?? null,
                stripe_session_id: session.id,
                stripe_payment_intent_id: (session.payment_intent as string) ?? null,
                amount_paid: session.amount_total ?? null,
                paid_at: new Date().toISOString(),
                source: "stripe_payment_link",
              },
              { onConflict: "email" }
            );

            // If a profile already exists for this email, upgrade them now
            const { data: existingUser } = await supabaseAdmin.auth.admin
              .listUsers({ page: 1, perPage: 1 });
            // Best-effort lookup by email via profiles join
            const { data: matchingAuth } = await supabaseAdmin
              .rpc("get_user_id_by_email", { p_email: email.toLowerCase() })
              .maybeSingle?.() ?? { data: null };

            // Fallback direct query — find via auth.users requires service role
            const { data: usersByEmail } = await supabaseAdmin
              .from("profiles")
              .select("user_id")
              .limit(1);
            // Note: profiles table has no email column; rely on claim trigger at signup.
          }
          break;
        }

        if (!session.subscription) break;

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const priceId = subscription.items.data[0]?.price?.id;
        const mapping = priceId ? PRICE_TIER_MAP[priceId] : null;
        if (!mapping) break;

        const isFounding = mapping.plan === "FOUNDING_111";

        // Upsert subscription record
        await supabaseAdmin.from("subscriptions").upsert(
          {
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscription.id,
            stripe_price_id: priceId,
            stripe_product_id: subscription.items.data[0]?.price?.product as string,
            tier: mapping.tier,
            status: "active",
            billing_interval: getBillingInterval(priceId!),
            current_period_end: periodEndIso(subscription),
            cancel_at_period_end: subscription.cancel_at_period_end,
            founding_member: isFounding,
            lifetime_locked_price: isFounding,
            plan_name: mapping.plan,
          },
          { onConflict: "user_id" }
        );

        // Update profile subscription tier
        await supabaseAdmin
          .from("profiles")
          .update({ subscription_tier: mapping.tier.toLowerCase() })
          .eq("user_id", userId);

        // Decrement founding spots (idempotent using subscription id)
        if (isFounding) {
          // Check if this subscription already decremented
          const { data: existing } = await supabaseAdmin
            .from("subscriptions")
            .select("id")
            .eq("stripe_subscription_id", subscription.id)
            .eq("founding_member", true);

          // Only decrement if this is a new founding subscription (upsert just created/updated it)
          const { data: spots } = await supabaseAdmin
            .from("founding_member_spots")
            .select("spots_remaining, id")
            .limit(1)
            .single();

          if (spots && spots.spots_remaining > 0) {
            await supabaseAdmin
              .from("founding_member_spots")
              .update({ spots_remaining: spots.spots_remaining - 1, updated_at: new Date().toISOString() })
              .eq("id", spots.id);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0]?.price?.id;
        const mapping = priceId ? PRICE_TIER_MAP[priceId] : null;

        const userId = await resolveUserId(subscription);
        if (!userId) break;

        const updateData: Record<string, any> = {
          status: subscription.status === "active" ? "active" : subscription.status === "past_due" ? "past_due" : subscription.status,
          current_period_end: periodEndIso(subscription),
          cancel_at_period_end: subscription.cancel_at_period_end,
          updated_at: new Date().toISOString(),
        };

        if (mapping && priceId) {
          updateData.tier = mapping.tier;
          updateData.plan_name = mapping.plan;
          updateData.stripe_price_id = priceId;
          updateData.billing_interval = getBillingInterval(priceId);
        }

        await supabaseAdmin
          .from("subscriptions")
          .update(updateData)
          .eq("user_id", userId);

        if (mapping) {
          await supabaseAdmin
            .from("profiles")
            .update({ subscription_tier: mapping.tier.toLowerCase() })
            .eq("user_id", userId);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = await resolveUserId(subscription);
        if (!userId) break;

        await supabaseAdmin
          .from("subscriptions")
          .update({ status: "canceled", updated_at: new Date().toISOString() })
          .eq("user_id", userId);

        await supabaseAdmin
          .from("profiles")
          .update({ subscription_tier: "free" })
          .eq("user_id", userId);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = await resolveUserId(subscription);
        if (!userId) break;

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "active",
            current_period_end: periodEndIso(subscription),
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = await resolveUserId(subscription);
        if (!userId) break;

        await supabaseAdmin
          .from("subscriptions")
          .update({ status: "past_due", updated_at: new Date().toISOString() })
          .eq("user_id", userId);
        break;
      }
    }
  } catch (err: any) {
    console.error("Error processing webhook:", err.message);
    return new Response(`Webhook handler error: ${err.message}`, { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
