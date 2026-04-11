import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface GuidelinesModalProps {
  onAccept: () => void;
}

export function GuidelinesModal({ onAccept }: GuidelinesModalProps) {
  const { user } = useAuth();
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If content doesn't overflow, enable button immediately
    const el = scrollRef.current;
    if (el && el.scrollHeight <= el.clientHeight + 20) {
      setScrolledToBottom(true);
    }
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 20) setScrolledToBottom(true);
  };

  const handleAccept = async () => {
    if (!user) return;
    await supabase.from("profiles").update({ first_visit_circle: true }).eq("user_id", user.id);
    onAccept();
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col">
        <div className="p-6 pb-0">
          <h2 className="font-serif text-2xl font-bold text-foreground">The Sacred Circle Agreement</h2>
        </div>
        <div ref={scrollRef} onScroll={handleScroll} className="p-6 overflow-y-auto flex-1 space-y-4 text-sm text-foreground/90 leading-relaxed">
          <p>This is a space for real transformation. Not performance. Not perfection. Just people doing the work.</p>
          <p className="font-semibold">To keep this Circle sacred, we ask that you:</p>
          <ul className="space-y-3">
            <li>✦ <strong>Share from your own experience.</strong> Use "I" statements. Speak your truth, not others'.</li>
            <li>✦ <strong>Hold what's shared here with care.</strong> What happens in the Circle stays in the Circle.</li>
            <li>✦ <strong>No unsolicited advice.</strong> Witness first. Ask before advising.</li>
            <li>✦ <strong>No promotion or selling.</strong> This is a healing space, not a marketplace.</li>
            <li>✦ <strong>Celebrate others genuinely.</strong> There is no competition in transformation.</li>
            <li>✦ <strong>Report what doesn't belong here.</strong> Use the report button. We take it seriously.</li>
            <li>✦ <strong>You are welcome here exactly as you are.</strong> All genders. All backgrounds. All stages of the reset.</li>
          </ul>
        </div>
        <div className="p-6 pt-0">
          <Button
            onClick={handleAccept}
            disabled={!scrolledToBottom}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold disabled:opacity-40"
          >
            I agree — take me to the Circle
          </Button>
        </div>
      </div>
    </div>
  );
}
