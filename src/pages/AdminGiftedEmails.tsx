import { useEffect, useState } from "react";
import { Mail, RefreshCw, Send, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";

interface Row {
  user_id: string;
  email: string | null;
  full_name: string | null;
  subscription_tier: string | null;
  access_expires_at: string | null;
  days_elapsed: number | null;
  days_remaining: number | null;
  day15_email_sent_at: string | null;
  day21_email_sent_at: string | null;
}

interface Summary {
  total_gifted: number;
  day15_sent: number;
  day21_sent: number;
  day15_pending: number;
  day21_pending: number;
}

export default function AdminGiftedEmails() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [filter, setFilter] = useState<"all" | "day15_sent" | "day21_sent" | "pending">("all");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-gifted-email-report");
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setRows((data as any).rows || []);
      setSummary((data as any).summary || null);
    } catch (e: any) {
      toast.error(e.message || "Failed to load");
      if (String(e.message || "").includes("Forbidden")) navigate("/home");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  const triggerSend = async () => {
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-gifted-milestone-emails");
      if (error) throw error;
      const sent = (data as any)?.sent ?? 0;
      toast.success(`Email job ran. Sent: ${sent}`);
      await load();
    } catch (e: any) {
      toast.error(e.message || "Failed to run job");
    } finally {
      setSending(false);
    }
  };

  const filtered = rows.filter(r => {
    if (filter === "all") return true;
    if (filter === "day15_sent") return !!r.day15_email_sent_at;
    if (filter === "day21_sent") return !!r.day21_email_sent_at;
    if (filter === "pending")
      return (!r.day15_email_sent_at && (r.days_elapsed ?? 0) >= 15) ||
             (!r.day21_email_sent_at && (r.days_elapsed ?? 0) >= 21);
    return true;
  });

  const fmt = (iso: string | null) =>
    iso ? format(new Date(iso), "MMM d, yyyy h:mm a") : "—";

  return (
    <AuthenticatedLayout title="Gifted Emails">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-serif text-foreground flex items-center gap-2">
              <Mail className="w-7 h-7 text-[#C9A84C]" />
              Gifted Milestone Emails
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Day 15 and Day 21 email send history for gifted access users.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={load} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={triggerSend} disabled={sending} className="bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90">
              <Send className={`w-4 h-4 mr-2 ${sending ? "animate-pulse" : ""}`} />
              Run send job now
            </Button>
          </div>
        </div>

        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <StatCard label="Total gifted" value={summary.total_gifted} />
            <StatCard label="Day 15 sent" value={summary.day15_sent} />
            <StatCard label="Day 21 sent" value={summary.day21_sent} />
            <StatCard label="Day 15 pending" value={summary.day15_pending} accent={summary.day15_pending > 0} />
            <StatCard label="Day 21 pending" value={summary.day21_pending} accent={summary.day21_pending > 0} />
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          {(["all", "day15_sent", "day21_sent", "pending"] as const).map(f => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className={filter === f ? "bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90" : ""}
            >
              {f === "all" ? "All" : f === "day15_sent" ? "Day 15 Sent" : f === "day21_sent" ? "Day 21 Sent" : "Pending"}
            </Button>
          ))}
        </div>

        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <th className="px-4 py-3">Recipient</th>
                  <th className="px-4 py-3">Tier</th>
                  <th className="px-4 py-3">Day</th>
                  <th className="px-4 py-3">Access expires</th>
                  <th className="px-4 py-3">Day 15 sent</th>
                  <th className="px-4 py-3">Day 21 sent</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Loading…</td></tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No matching users.</td></tr>
                )}
                {filtered.map(r => (
                  <tr key={r.user_id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{r.email || "(no email)"}</div>
                      {r.full_name && <div className="text-xs text-muted-foreground">{r.full_name}</div>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{r.subscription_tier || "—"}</td>
                    <td className="px-4 py-3">
                      {r.days_elapsed !== null ? (
                        <span className="text-foreground">Day {r.days_elapsed}/30</span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{fmt(r.access_expires_at)}</td>
                    <td className="px-4 py-3">
                      {r.day15_email_sent_at ? (
                        <span className="text-emerald-600 dark:text-emerald-400">{fmt(r.day15_email_sent_at)}</span>
                      ) : (r.days_elapsed ?? 0) >= 15 ? (
                        <span className="text-amber-600 dark:text-amber-400">Pending</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {r.day21_email_sent_at ? (
                        <span className="text-emerald-600 dark:text-emerald-400">{fmt(r.day21_email_sent_at)}</span>
                      ) : (r.days_elapsed ?? 0) >= 21 ? (
                        <span className="text-amber-600 dark:text-amber-400">Pending</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className={`text-2xl font-serif mt-1 ${accent ? "text-amber-600 dark:text-amber-400" : "text-[#C9A84C]"}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
