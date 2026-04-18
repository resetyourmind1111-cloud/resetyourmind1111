// One-shot admin utility: re-upload all .mp3 files in the `audio` bucket
// with Content-Type: audio/mpeg so older Android browsers play them reliably.
// Invoke once, then this function can be removed.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: files, error: listErr } = await supabase
      .storage.from("audio").list("", { limit: 1000 });
    if (listErr) throw listErr;

    const results: Array<{ name: string; ok: boolean; error?: string }> = [];

    for (const f of files ?? []) {
      if (!f.name.endsWith(".mp3")) continue;
      try {
        const { data: blob, error: dlErr } = await supabase
          .storage.from("audio").download(f.name);
        if (dlErr || !blob) throw dlErr ?? new Error("download failed");

        const buf = await blob.arrayBuffer();
        const { error: upErr } = await supabase.storage
          .from("audio")
          .upload(f.name, buf, {
            contentType: "audio/mpeg",
            upsert: true,
            cacheControl: "3600",
          });
        if (upErr) throw upErr;

        results.push({ name: f.name, ok: true });
      } catch (e) {
        results.push({ name: f.name, ok: false, error: (e as Error).message });
      }
    }

    return new Response(
      JSON.stringify({ updated: results.filter(r => r.ok).length, total: results.length, results }, null, 2),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
