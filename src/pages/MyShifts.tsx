import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { BottomNav } from "@/components/BottomNav";
import { format } from "date-fns";

interface ShiftEntry {
  id: string;
  entry_date: string;
  prompt: string;
  response: string;
}

export default function MyShifts() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<ShiftEntry[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
      return;
    }
    if (!user) return;

    (supabase.from("daily_shifts" as any) as any)
      .select("id, entry_date, prompt, response")
      .eq("user_id", user.id)
      .order("entry_date", { ascending: false })
      .then(({ data }: any) => {
        if (data) setEntries(data);
      });
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20 md:pt-24 pb-24 md:pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
            Your Transformation Record
          </h1>
          <p className="text-muted-foreground text-sm text-center mb-8">
            Every shift you've named. In your own words.
          </p>

          {entries.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm mt-12">
              No shifts saved yet. Start by answering today's prompt on the dashboard.
            </p>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-xl border border-border/50 bg-card/80"
                >
                  <p className="text-xs text-muted-foreground mb-1">
                    {format(new Date(entry.entry_date), "MMMM d, yyyy")}
                  </p>
                  <p className="font-serif text-sm italic text-foreground/70 mb-2">
                    "{entry.prompt}"
                  </p>
                  <p className="text-sm text-foreground">{entry.response}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
