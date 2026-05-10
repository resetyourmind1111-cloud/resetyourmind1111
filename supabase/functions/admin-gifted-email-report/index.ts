import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Admin-only. Returns gifted users + day15/day21 email send timestamps + email addresses.
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

    const { data: callerProfile } = await admin
      .from("profiles").select("is_admin").eq("user_id", userData.user.id).single();
    if (!callerProfile?.is_admin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: profiles, error } = await admin
      .from("profiles")
      .select("user_id, full_name, user_source, subscription_tier, access_expires_at, day15_email_sent_at, day21_email_sent_at, created_at")
      .eq("user_source", "gifted")
      .order("access_expires_at", { ascending: false, nullsFirst: false })
      .limit(500);
    if (error) throw error;

    // Build email map from auth.users
    const userIds = new Set((profiles || []).map(p => p.user_id));
    const emailMap = new Map<string, string>();
    const perPage = 1000;
    for (let page = 1; page <= 20; page++) {
      const { data: list, error: listErr } = await admin.auth.admin.listUsers({ page, perPage });
      if (listErr) break;
      for (const u of list.users) {
        if (userIds.has(u.id) && u.email) emailMap.set(u.id, u.email);
      }
      if (!list.users.length || list.users.length < perPage) break;
    }

    const now = Date.now();
    const dayMs = 1000 * 60 * 60 * 24;
    const rows = (profiles || []).map((p: any) => {
      const expires = p.access_expires_at ? new Date(p.access_expires_at).getTime() : null;
      const daysRemaining = expires ? Math.max(0, Math.ceil((expires - now) / dayMs)) : null;
      const daysElapsed = daysRemaining !== null ? 30 - daysRemaining : null;
      return {
        user_id: p.user_id,
        email: emailMap.get(p.user_id) || null,
        full_name: p.full_name,
        subscription_tier: p.subscription_tier,
        access_expires_at: p.access_expires_at,
        days_elapsed: daysElapsed,
        days_remaining: daysRemaining,
        day15_email_sent_at: p.day15_email_sent_at,
        day21_email_sent_at: p.day21_email_sent_at,
      };
    });

    const summary = {
      total_gifted: rows.length,
      day15_sent: rows.filter(r => r.day15_email_sent_at).length,
      day21_sent: rows.filter(r => r.day21_email_sent_at).length,
      day15_pending: rows.filter(r => !r.day15_email_sent_at && (r.days_elapsed ?? 0) >= 15).length,
      day21_pending: rows.filter(r => !r.day21_email_sent_at && (r.days_elapsed ?? 0) >= 21).length,
    };

    return new Response(JSON.stringify({ rows, summary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("admin-gifted-email-report error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
