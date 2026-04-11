import { useState, useEffect } from "react";
import { Sparkles, Send, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Member {
  id: string;
  user_id: string;
  display_name: string;
  bio: string | null;
  thermostat_type: string | null;
  primary_trap: string | null;
  human_design_type: string | null;
  days_in_circle: number;
  show_in_directory: boolean;
  show_thermostat: boolean;
  show_primary_trap: boolean;
  show_human_design: boolean;
}

export function CircleMembers({ onOpenDm }: { onOpenDm: (userId: string, name: string) => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [healingAlong, setHealingAlong] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    fetchMembers();
  }, [user]);

  const fetchMembers = async () => {
    if (!user) return;
    const { data } = await supabase.from("circle_members").select("*").eq("show_in_directory", true);
    if (!data) return;
    setMembers(data as Member[]);

    // Healing alongside — same primary_trap
    const { data: myProfile } = await supabase.from("identity_trap_results").select("primary_trap").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
    const myTrap = (myProfile as any)?.primary_trap;
    if (myTrap) {
      const matching = (data as Member[]).filter(m => m.primary_trap === myTrap && m.user_id !== user.id).slice(0, 5);
      setHealingAlong(matching.length >= 3 ? matching : (data as Member[]).filter(m => m.user_id !== user.id).slice(0, 5));
    } else {
      setHealingAlong((data as Member[]).filter(m => m.user_id !== user.id).slice(0, 5));
    }
  };

  const handleBuddyRequest = async (targetUserId: string) => {
    if (!user) return;
    toast({ title: "Buddy request sent ✦" });
  };

  return (
    <div className="max-w-2xl mx-auto pb-16">
      <div className="mb-8">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-1">The Circle</h2>
        <p className="text-muted-foreground text-sm">People doing the same work as you. You are not alone in this.</p>
      </div>

      {/* Member grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
        {members.map(m => (
          <Card
            key={m.id}
            className="p-4 bg-card/80 border-border/50 cursor-pointer hover:border-accent/40 transition-colors"
            onClick={() => setSelectedMember(m)}
          >
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-sm font-bold text-accent mb-2">
              {m.display_name[0]?.toUpperCase()}
            </div>
            <p className="text-sm font-semibold text-foreground truncate">{m.display_name}</p>
            <p className="text-[10px] text-muted-foreground">Day {m.days_in_circle}</p>
            {m.show_thermostat && m.thermostat_type && (
              <span className="text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded-full mt-1 inline-block">{m.thermostat_type}</span>
            )}
            {m.show_primary_trap && m.primary_trap && (
              <span className="text-[10px] text-secondary-foreground bg-secondary/20 px-1.5 py-0.5 rounded-full mt-1 inline-block ml-1">{m.primary_trap}</span>
            )}
          </Card>
        ))}
      </div>

      {/* Healing Alongside */}
      {healingAlong.length > 0 && (
        <div>
          <h3 className="font-serif text-xl font-bold text-foreground mb-1">Healing alongside you.</h3>
          <p className="text-muted-foreground text-sm mb-4">Members working through the same pattern.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {healingAlong.map(m => (
              <Card
                key={m.id}
                className="p-4 bg-card/80 border-border/50 cursor-pointer hover:border-accent/40 transition-colors"
                onClick={() => setSelectedMember(m)}
              >
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-sm font-bold text-secondary-foreground mb-2">
                  {m.display_name[0]?.toUpperCase()}
                </div>
                <p className="text-sm font-semibold text-foreground truncate">{m.display_name}</p>
                {m.show_primary_trap && m.primary_trap && (
                  <span className="text-[10px] text-secondary-foreground bg-secondary/20 px-1.5 py-0.5 rounded-full mt-1 inline-block">{m.primary_trap}</span>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Member profile modal */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="bg-card border-border">
          {selectedMember && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif">{selectedMember.display_name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                {selectedMember.bio && <p className="text-sm text-muted-foreground">{selectedMember.bio}</p>}
                <p className="text-xs text-muted-foreground">Day {selectedMember.days_in_circle} in the Circle</p>
                {selectedMember.show_thermostat && selectedMember.thermostat_type && (
                  <p className="text-xs"><span className="text-muted-foreground">Thermostat Type:</span> <span className="text-foreground">{selectedMember.thermostat_type}</span></p>
                )}
                {selectedMember.show_primary_trap && selectedMember.primary_trap && (
                  <p className="text-xs"><span className="text-muted-foreground">Primary Pattern:</span> <span className="text-foreground">{selectedMember.primary_trap}</span></p>
                )}
                {selectedMember.show_human_design && selectedMember.human_design_type && (
                  <p className="text-xs"><span className="text-muted-foreground">Human Design:</span> <span className="text-foreground">{selectedMember.human_design_type}</span></p>
                )}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => { onOpenDm(selectedMember.user_id, selectedMember.display_name); setSelectedMember(null); }}>
                    <Send className="w-3.5 h-3.5 mr-1.5" />Send a message
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBuddyRequest(selectedMember.user_id)}>
                    <UserPlus className="w-3.5 h-3.5 mr-1.5" />Request as buddy
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
