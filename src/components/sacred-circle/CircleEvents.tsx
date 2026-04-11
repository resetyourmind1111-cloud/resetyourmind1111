import { useState, useEffect } from "react";
import { Calendar, Play, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const EVENT_TYPE_LABELS: Record<string, string> = {
  live_session: "Live Session",
  group_meditation: "Group Meditation",
  qa: "Q&A",
  workshop: "Workshop",
  reset_ceremony: "Reset Ceremony",
};

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_type: string;
  event_date: string;
  replay_url: string | null;
  rsvp_count: number;
  user_rsvped: boolean;
}

export function CircleEvents() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    if (!user) return;
    const { data: eventsData } = await supabase.from("circle_events").select("*").order("event_date", { ascending: true });
    if (!eventsData) return;

    const eventIds = eventsData.map((e: any) => e.id);
    const { data: rsvps } = await supabase.from("circle_event_rsvps").select("event_id, user_id").in("event_id", eventIds);

    const rsvpMap: Record<string, { count: number; userRsvped: boolean }> = {};
    (rsvps || []).forEach((r: any) => {
      if (!rsvpMap[r.event_id]) rsvpMap[r.event_id] = { count: 0, userRsvped: false };
      rsvpMap[r.event_id].count++;
      if (r.user_id === user.id) rsvpMap[r.event_id].userRsvped = true;
    });

    setEvents(eventsData.map((e: any) => ({
      ...e,
      rsvp_count: rsvpMap[e.id]?.count || 0,
      user_rsvped: rsvpMap[e.id]?.userRsvped || false,
    })));
  };

  const handleRsvp = async (eventId: string, alreadyRsvped: boolean) => {
    if (!user) return;
    if (alreadyRsvped) {
      await supabase.from("circle_event_rsvps").delete().eq("event_id", eventId).eq("user_id", user.id);
    } else {
      await supabase.from("circle_event_rsvps").insert({ event_id: eventId, user_id: user.id });
      toast({ title: "You're going ✦" });
    }
    fetchEvents();
  };

  const now = new Date();
  const upcoming = events.filter(e => new Date(e.event_date) >= now);
  const past = events.filter(e => new Date(e.event_date) < now);

  return (
    <div className="max-w-2xl mx-auto pb-16">
      <div className="mb-8">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-1">Live Events</h2>
        <p className="text-muted-foreground text-sm">Reset sessions, group meditations, and live Q&As. Join live or watch the replay.</p>
      </div>

      {upcoming.length > 0 ? (
        <div className="space-y-4 mb-8">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Upcoming</h3>
          {upcoming.map(event => (
            <EventCard key={event.id} event={event} onRsvp={handleRsvp} isPast={false} />
          ))}
        </div>
      ) : (
        <Card className="p-6 bg-secondary/10 border-secondary/30 mb-8">
          <p className="text-foreground font-serif text-lg mb-2">No events scheduled right now.</p>
          <p className="text-sm text-muted-foreground">Check back soon — live sessions are added monthly.</p>
          <p className="text-xs text-muted-foreground mt-2">Every month there's a live reset with Lorie. You'll be notified when it's posted.</p>
        </Card>
      )}

      {past.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Past Events / Replays</h3>
          {past.map(event => (
            <EventCard key={event.id} event={event} onRsvp={handleRsvp} isPast={true} />
          ))}
        </div>
      )}
    </div>
  );
}

function EventCard({ event, onRsvp, isPast }: { event: Event; onRsvp: (id: string, rsvped: boolean) => void; isPast: boolean }) {
  return (
    <Card className="p-4 bg-card/80 border-border/50">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-serif text-lg font-semibold text-foreground">{event.title}</h4>
          <p className="text-xs text-muted-foreground">{format(new Date(event.event_date), "EEEE, MMMM d · h:mm a")}</p>
        </div>
        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/10 text-accent font-semibold">
          {EVENT_TYPE_LABELS[event.event_type] || event.event_type}
        </span>
      </div>
      {event.description && <p className="text-sm text-foreground/80 mb-3">{event.description}</p>}
      <p className="text-xs text-muted-foreground mb-3">{event.rsvp_count} people going</p>
      <div className="flex gap-2">
        {isPast ? (
          event.replay_url ? (
            <a href={event.replay_url} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline"><Play className="w-3.5 h-3.5 mr-1.5" />Watch Replay</Button>
            </a>
          ) : (
            <Button size="sm" variant="ghost" disabled>Replay coming soon</Button>
          )
        ) : (
          <Button
            size="sm"
            onClick={() => onRsvp(event.id, event.user_rsvped)}
            className={event.user_rsvped ? "bg-accent/20 text-accent border border-accent/40" : "bg-accent text-accent-foreground hover:bg-accent/90"}
          >
            {event.user_rsvped ? <><Check className="w-3.5 h-3.5 mr-1.5" />Going</> : "RSVP"}
          </Button>
        )}
      </div>
    </Card>
  );
}
