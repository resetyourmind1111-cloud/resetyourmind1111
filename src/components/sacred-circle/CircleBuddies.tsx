import { useState, useEffect } from "react";
import { Send, UserPlus, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Buddy {
  id: string;
  user_id: string;
  display_name: string;
  thermostat_type: string | null;
  paired_at: string;
}

export function CircleBuddies({ onOpenDm }: { onOpenDm: (userId: string, name: string) => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [buddy, setBuddy] = useState<Buddy | null>(null);
  const [requested, setRequested] = useState(false);
  const [checkedInToday, setCheckedInToday] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchBuddy();
  }, [user]);

  const fetchBuddy = async () => {
    if (!user) return;
    // Check buddy_requested
    const { data: profile } = await supabase.from("profiles").select("buddy_requested").eq("user_id", user.id).single();
    setRequested((profile as any)?.buddy_requested || false);

    // Check for active buddy
    const { data: pairings } = await supabase
      .from("accountability_buddies")
      .select("*")
      .eq("active", true)
      .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`)
      .limit(1);

    if (pairings && pairings.length > 0) {
      const pairing = pairings[0] as any;
      const buddyUserId = pairing.user_id_1 === user.id ? pairing.user_id_2 : pairing.user_id_1;
      const { data: memberData } = await supabase.from("circle_members").select("*").eq("user_id", buddyUserId).maybeSingle();
      if (memberData) {
        setBuddy({
          id: pairing.id,
          user_id: buddyUserId,
          display_name: (memberData as any).display_name,
          thermostat_type: (memberData as any).thermostat_type,
          paired_at: pairing.paired_at,
        });
      }
    }
  };

  const requestBuddy = async () => {
    if (!user) return;
    await supabase.from("profiles").update({ buddy_requested: true }).eq("user_id", user.id);
    setRequested(true);
    toast({ title: "You're in the queue ✦", description: "We'll notify you when you're paired." });
  };

  const sendCheckin = async () => {
    if (!user || !buddy) return;
    await supabase.from("circle_dms").insert({
      sender_id: user.id,
      recipient_id: buddy.user_id,
      content: "Hey — just checking in. How's your reset going today? ✦",
    });
    setCheckedInToday(true);
    toast({ title: "Check-in sent ✦" });
  };

  return (
    <div className="max-w-2xl mx-auto pb-16">
      <div className="mb-8">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-1">Your Accountability Buddy</h2>
        <p className="text-muted-foreground text-sm">One person. Paired with you for the 30-Day Experience. Check in. Cheer each other on. Do it together.</p>
      </div>

      {!buddy ? (
        <Card className="p-6 bg-secondary/10 border-secondary/30">
          {requested ? (
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-accent mx-auto mb-3" />
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">You're in the queue</h3>
              <p className="text-sm text-muted-foreground">We'll notify you when you're paired — usually within 24 hours.</p>
            </div>
          ) : (
            <>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">Find your accountability buddy.</h3>
              <p className="text-sm text-muted-foreground mb-4">Being paired with one person changes everything. Knowing someone is watching your journey makes you 3x more likely to complete it.</p>
              <Button onClick={requestBuddy} className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                <UserPlus className="w-4 h-4 mr-2" />
                Pair me with a buddy
              </Button>
            </>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Daily check-in prompt */}
          {!checkedInToday && (
            <Card className="p-4 border-accent/40 bg-accent/5">
              <p className="text-sm text-foreground mb-2">Have you checked in with <span className="font-semibold">{buddy.display_name}</span> today?</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={sendCheckin} className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs font-semibold">Send check-in</Button>
                <Button size="sm" variant="ghost" onClick={() => setCheckedInToday(true)} className="text-xs text-muted-foreground">I already did</Button>
              </div>
            </Card>
          )}

          {/* Buddy card */}
          <Card className="p-5 bg-card/80 border-border/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-lg font-bold text-accent">
                {buddy.display_name[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-foreground">{buddy.display_name}</p>
                <p className="text-xs text-muted-foreground">Buddy since {formatDistanceToNow(new Date(buddy.paired_at), { addSuffix: true })}</p>
                {buddy.thermostat_type && <span className="text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded-full">{buddy.thermostat_type}</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onOpenDm(buddy.user_id, buddy.display_name)}>
                <Send className="w-3.5 h-3.5 mr-1.5" />Send a message
              </Button>
              <Button size="sm" variant="outline" onClick={sendCheckin}>
                Check in
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
