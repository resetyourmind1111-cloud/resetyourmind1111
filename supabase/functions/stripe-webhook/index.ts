import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@17.5.0?target=denonext";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const PRICE_TIER_MAP: Record<string, { tier: string; plan: string }> = {
  "price_1TAUgeC1ibVojXJKMY9OXfeh": { tier: "RESET", plan: "RESET" },
  "price_1TAUl6C1ibVojXJKGipOvp36": { tier: "RESET", plan: "RESET" },
  "price_1TAUqnC1ibVojXJKtXzr7iOc": { tier: "EXPAND", plan: "EXPAND" },
  "price_1TAUs8C1ibVojXJKk9KaIU2z": { tier: "EXPAND", plan: "EXPAND" },
  "price_1TAUuwC1ibVojXJKW8fcj8Hc": { tier: "EMBODY", plan: "EMBODY" },
  "price_1TAUwUC1ibVojXJKqMHhdeJE": { tier: "EMBODY", plan: "EMBODY" },
  "price_1TAUzKC1ibVojXJKoehSnlnq": { tier: "FOUNDING_FULL_ACCESS", plan: "FOUNDING_111" },
};

const ANNUAL_PRICES = new Set([
  "price_1TAUl6C1ibVojXJKGipOvp36",
  "price_1TAUs8C1ibVojXJKk9KaIU2z",
  "price_1TAUwUC1ibVojXJKqMHhdeJE",
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

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        if (!userId || !session.subscription) break;

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
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
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

        const userId = subscription.metadata?.user_id;
        if (!userId) break;

        const updateData: Record<string, any> = {
          status: subscription.status === "active" ? "active" : subscription.status === "past_due" ? "past_due" : subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
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
        const userId = subscription.metadata?.user_id;
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
        const userId = subscription.metadata?.user_id;
        if (!userId) break;

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "active",
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
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
        const userId = subscription.metadata?.user_id;
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
