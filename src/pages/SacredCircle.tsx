import { useState, useEffect } from "react";
import { Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useSubscription } from "@/hooks/useSubscription";
import { Link } from "react-router-dom";
import { CircleFeed } from "@/components/sacred-circle/CircleFeed";
import { CircleMembers } from "@/components/sacred-circle/CircleMembers";
import { CircleBuddies } from "@/components/sacred-circle/CircleBuddies";
import { CircleEvents } from "@/components/sacred-circle/CircleEvents";
import { CircleDmThread } from "@/components/sacred-circle/CircleDmThread";
import { GuidelinesModal } from "@/components/sacred-circle/GuidelinesModal";

export default function SacredCircle() {
  const { user } = useAuth();
  const { hasAccess } = useSubscription();
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [guidelinesChecked, setGuidelinesChecked] = useState(false);
  const [dmTarget, setDmTarget] = useState<{ userId: string; name: string } | null>(null);

  const isLocked = !hasAccess("embody");

  useEffect(() => {
    if (!user || isLocked) return;
    const checkFirstVisit = async () => {
      const { data } = await supabase.from("profiles").select("first_visit_circle").eq("user_id", user.id).single();
      if (data && !(data as any).first_visit_circle) {
        setShowGuidelines(true);
      }
      setGuidelinesChecked(true);
    };
    checkFirstVisit();
  }, [user, isLocked]);

  if (isLocked) {
    return (
      <AuthenticatedLayout title="The Sacred Circle" subtitle="A private community for real transformation.">
        <div className="max-w-lg mx-auto text-center py-12">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-accent" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground mb-3">The Sacred Circle</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
            A private community for people doing the real work. No algorithm. No ads. No performance. Just transformation — witnessed and celebrated.
          </p>
          <div className="text-left max-w-xs mx-auto space-y-2 mb-8">
            {[
              "A chronological feed — no algorithm",
              "Win, Intention, Breakthrough and Question posts",
              "Love, Witnessed and You Got This reactions",
              "An accountability buddy for your 30-Day Experience",
              "Monthly live sessions with Lorie",
              "Direct messages with your buddy and members",
            ].map((item, i) => (
              <p key={i} className="text-xs text-foreground/80">✦ {item}</p>
            ))}
          </div>
          <Link to="/upgrade">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">Unlock Sacred Circle</Button>
          </Link>
          <p className="text-[10px] text-muted-foreground mt-3">Available on Embody plan — $111/month<br />Or: Founding Member — $44/month locked in for life</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!guidelinesChecked) {
    return (
      <AuthenticatedLayout title="Sacred Circle" subtitle="A private space for real transformation.">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </AuthenticatedLayout>
    );
  }

  if (dmTarget) {
    return (
      <AuthenticatedLayout title="Sacred Circle" subtitle="Direct Message">
        <CircleDmThread
          recipientId={dmTarget.userId}
          recipientName={dmTarget.name}
          onBack={() => setDmTarget(null)}
        />
      </AuthenticatedLayout>
    );
  }

  const openDm = (userId: string, name: string) => setDmTarget({ userId, name });

  return (
    <AuthenticatedLayout title="Sacred Circle" subtitle="A private space for real transformation. No algorithm. No ads. Just people doing the work.">
      {showGuidelines && <GuidelinesModal onAccept={() => setShowGuidelines(false)} />}
      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="w-full max-w-md mx-auto mb-6 bg-muted/50">
          <TabsTrigger value="feed" className="flex-1 text-xs">Feed</TabsTrigger>
          <TabsTrigger value="members" className="flex-1 text-xs">Members</TabsTrigger>
          <TabsTrigger value="buddies" className="flex-1 text-xs">Buddies</TabsTrigger>
          <TabsTrigger value="events" className="flex-1 text-xs">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="feed"><CircleFeed /></TabsContent>
        <TabsContent value="members"><CircleMembers onOpenDm={openDm} /></TabsContent>
        <TabsContent value="buddies"><CircleBuddies onOpenDm={openDm} /></TabsContent>
        <TabsContent value="events"><CircleEvents /></TabsContent>
      </Tabs>
    </AuthenticatedLayout>
  );
}
