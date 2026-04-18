import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Schedules 7 emails into notifications_schedule, one per day starting from now.
// Idempotent: skips if a schedule already exists for the user.
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

    // Verify the caller
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid auth" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    const admin = createClient(supabaseUrl, serviceKey);

    // Skip if already enqueued
    const { count } = await admin
      .from("notifications_schedule")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);
    if ((count ?? 0) > 0) {
      return new Response(JSON.stringify({ status: "already_enqueued", count }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const start = new Date();
    const rows = Array.from({ length: 7 }, (_, i) => {
      const day = i + 1;
      const sendAt = new Date(start);
      sendAt.setDate(sendAt.getDate() + i);
      // Send at 9:00 AM local-ish (UTC for simplicity). Cron runs hourly, so within ~1h.
      sendAt.setUTCHours(15, 0, 0, 0);
      return {
        user_id: userId,
        day_number: day,
        scheduled_time: sendAt.toISOString(),
        message_title: `Day ${day}`,
        message_body: `trial_email_day_${day}`, // marker; real copy lives in send-trial-emails
        sent: false,
      };
    });

    const { error: insErr } = await admin.from("notifications_schedule").insert(rows);
    if (insErr) throw insErr;

    return new Response(JSON.stringify({ status: "enqueued", count: rows.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("enqueue-trial-emails error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
