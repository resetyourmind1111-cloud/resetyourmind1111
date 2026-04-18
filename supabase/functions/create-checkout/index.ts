import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@17.5.0?target=denonext";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRICE_TIER_MAP: Record<string, string> = {
  "price_1TNYPhC1ibVojXJK3CB5eX7T": "RESET",
  "price_1TNYQoC1ibVojXJK9f7YhF3n": "RESET",
  "price_1TNYTnC1ibVojXJKpUwoZSLk": "EXPAND",
  "price_1TNYVPC1ibVojXJKlJKQkFZX": "EXPAND",
  "price_1TNYdXC1ibVojXJKPkHDKXgL": "EMBODY",
  "price_1TNYeNC1ibVojXJKlvFsGuhA": "EMBODY",
  "price_1TNYgqC1ibVojXJKdUQ9Wa7W": "FOUNDING",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = user.id;
    const userEmail = user.email;

    const { priceId, tierKey } = await req.json();
    
    if (!priceId || !PRICE_TIER_MAP[priceId]) {
      return new Response(JSON.stringify({ error: "Invalid price" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Founding 111 oversell protection
    if (PRICE_TIER_MAP[priceId] === "FOUNDING") {
      const { data: spots } = await supabaseAdmin
        .from("founding_member_spots")
        .select("spots_remaining")
        .limit(1)
        .single();
      
      if (!spots || spots.spots_remaining <= 0) {
        return new Response(
          JSON.stringify({ error: "Founding 111 spots are sold out" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);

    // Get or create Stripe customer
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id, full_name")
      .eq("user_id", userId)
      .single();

    let stripeCustomerId = profile?.stripe_customer_id;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userEmail as string,
        name: profile?.full_name || undefined,
        metadata: { supabase_user_id: userId as string },
      });
      stripeCustomerId = customer.id;

      await supabaseAdmin
        .from("profiles")
        .update({ stripe_customer_id: customer.id })
        .eq("user_id", userId);
    }

    const origin = req.headers.get("origin") || "https://id-preview--e0c3104e-89de-46cb-978e-ccf1844a67a2.lovable.app";

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/upgrade`,
      metadata: {
        user_id: userId as string,
        tier_requested: tierKey || PRICE_TIER_MAP[priceId],
      },
      subscription_data: {
        metadata: {
          user_id: userId as string,
          tier_requested: tierKey || PRICE_TIER_MAP[priceId],
        },
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
