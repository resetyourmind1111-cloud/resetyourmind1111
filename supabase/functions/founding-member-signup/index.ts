import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } }
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password, firstName } = await req.json();

    if (!email || !password || password.length < 8) {
      return new Response(
        JSON.stringify({ error: "Email and password (min 8 chars) are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Verify a pending founding member record exists OR allow override (manual seed)
    const { data: pending } = await supabaseAdmin
      .from("pending_founding_members")
      .select("id, claimed")
      .eq("email", normalizedEmail)
      .maybeSingle();

    // If there's no pending payment record, seed one so the trigger upgrades them.
    // (This covers the customer who already paid before this code shipped.)
    if (!pending) {
      await supabaseAdmin.from("pending_founding_members").insert({
        email: normalizedEmail,
        source: "founding_member_welcome_link",
        paid_at: new Date().toISOString(),
      });
    }

    // Create the user with email auto-confirmed so they go straight in
    const { data: created, error: createErr } =
      await supabaseAdmin.auth.admin.createUser({
        email: normalizedEmail,
        password,
        email_confirm: true,
        user_metadata: { full_name: firstName ?? null },
      });

    if (createErr || !created.user) {
      // If user already exists, return a clear message
      const msg = createErr?.message ?? "Signup failed";
      const status = msg.toLowerCase().includes("already") ? 409 : 400;
      return new Response(JSON.stringify({ error: msg }), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = created.user.id;

    // Ensure profile is upgraded (handle_new_user creates the row; the
    // claim_pending_founding_member BEFORE INSERT trigger sets tier=founding,
    // user_source=live-reset, onboarding_complete=true). Belt-and-suspenders update:
    await supabaseAdmin
      .from("profiles")
      .update({
        subscription_tier: "founding",
        user_source: "live-reset",
        onboarding_complete: true,
        full_name: firstName ?? null,
      })
      .eq("user_id", userId);

    // Mark pending claimed (in case trigger didn't fire because profile pre-existed)
    await supabaseAdmin
      .from("pending_founding_members")
      .update({
        claimed: true,
        claimed_by_user_id: userId,
        claimed_at: new Date().toISOString(),
      })
      .eq("email", normalizedEmail);

    return new Response(JSON.stringify({ ok: true, user_id: userId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("founding-member-signup error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
