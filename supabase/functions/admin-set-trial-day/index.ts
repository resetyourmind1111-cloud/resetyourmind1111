import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Admin-only. Sets a target user's trial_start_date so they appear to be on day N.
// Body: { email: string, day: number (1-8) }
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing auth" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid auth" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);

    // Verify caller is admin
    const { data: callerProfile } = await admin
      .from("profiles").select("is_admin").eq("user_id", userData.user.id).single();
    if (!callerProfile?.is_admin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const day = Number(body.day);
    if (!email || !Number.isFinite(day) || day < 1 || day > 8) {
      return new Response(JSON.stringify({ error: "email and day (1-8) required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find target user by email
    const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const target = list.users.find(u => u.email?.toLowerCase() === email);
    if (!target) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // To put user on "Day N", trial_start_date should be (N-1) full days ago.
    // useTrialStatus uses differenceInDays(now, start), so start = today - (N-1) days.
    const start = new Date();
    start.setUTCDate(start.getUTCDate() - (day - 1));
    start.setUTCHours(0, 5, 0, 0);

    const { error: updErr } = await admin
      .from("profiles")
      .update({ trial_start_date: start.toISOString() })
      .eq("user_id", target.id);
    if (updErr) throw updErr;

    return new Response(JSON.stringify({
      status: "ok",
      email,
      day,
      trial_start_date: start.toISOString(),
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("admin-set-trial-day error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
