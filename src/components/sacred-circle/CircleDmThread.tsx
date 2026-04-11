import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface CircleDmThreadProps {
  recipientId: string;
  recipientName: string;
  onBack: () => void;
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export function CircleDmThread({ recipientId, recipientName, onBack }: CircleDmThreadProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("circle_dms")
      .select("*")
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${user.id})`)
      .order("created_at", { ascending: true });
    if (data) setMessages(data as Message[]);

    // Mark received messages as read
    await supabase.from("circle_dms").update({ read: true })
      .eq("sender_id", recipientId).eq("recipient_id", user.id).eq("read", false);
  };

  useEffect(() => {
    fetchMessages();
    const channel = supabase
      .channel(`dm-${recipientId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "circle_dms" }, () => fetchMessages())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, recipientId]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!user || !newMessage.trim()) return;
    setSending(true);
    await supabase.from("circle_dms").insert({
      sender_id: user.id, recipient_id: recipientId, content: newMessage.trim(),
    });
    setNewMessage("");
    setSending(false);
  };

  return (
    <div className="max-w-2xl mx-auto pb-16 flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></button>
        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-sm font-bold text-accent">
          {recipientName[0]?.toUpperCase()}
        </div>
        <span className="font-semibold text-foreground">{recipientName}</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map(m => {
          const isMine = m.sender_id === user?.id;
          return (
            <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${isMine ? "bg-accent text-accent-foreground" : "bg-card border border-border"}`}>
                <p className="text-sm">{m.content}</p>
                <p className={`text-[10px] mt-1 ${isMine ? "text-accent-foreground/60" : "text-muted-foreground"}`}>
                  {formatDistanceToNow(new Date(m.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">Start a conversation with {recipientName}.</p>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Type a message..."
          className="flex-1 rounded-xl border border-border bg-muted/30 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <Button onClick={handleSend} disabled={sending || !newMessage.trim()} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
