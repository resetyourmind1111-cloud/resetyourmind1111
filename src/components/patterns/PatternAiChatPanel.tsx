import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_REPLIES = [
  "Give me a reset",
  "Help me understand this",
  "Give me one action",
  "Help me journal this",
  "Remind me who I'm becoming",
];

const TRAP_OPENERS: Record<string, string> = {
  "The Overthinker Trap": "It sounds like an overthinking pattern may be active. What would the smallest next step look like right now?",
  "The People Pleaser Trap": "It sounds like a people-pleasing pattern may be active. Where did you leave yourself behind today?",
  "The Scarcity Loop": "It sounds like a scarcity pattern may be active. What would an expansive choice look like right now?",
  "The Start-Stop Cycle": "It sounds like a start-stop pattern may be active. What's one small thing you can complete today?",
  'The "I Know But…" Trap': "It sounds like the knowing-without-doing pattern may be active. What's one truth you already know that you can live today?",
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pattern-ai-chat`;

interface PatternAiChatPanelProps {
  trapName: string;
  show: boolean;
  onClose: () => void;
}

export function PatternAiChatPanel({ trapName, show, onClose }: PatternAiChatPanelProps) {
  const { hasAccess } = useSubscription();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with opener when panel opens
  useEffect(() => {
    if (show && messages.length === 0) {
      const opener = TRAP_OPENERS[trapName] || "What's coming up for you right now?";
      setMessages([{ role: "assistant", content: opener }]);
    }
  }, [show, trapName]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (show) setTimeout(() => inputRef.current?.focus(), 300);
  }, [show]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          trapContext: trapName,
        }),
      });

      if (resp.status === 429) {
        toast({ title: "Rate limit reached", description: "Please try again in a moment.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      if (resp.status === 402) {
        toast({ title: "AI credits exhausted", description: "Add funds in Settings > Workspace > Usage.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      if (!resp.ok || !resp.body) throw new Error("Failed to connect to AI");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      const upsertAssistant = (chunk: string) => {
        assistantSoFar += chunk;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && prev.length > updatedMessages.length) {
            return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      };

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error("AI chat error:", e);
      toast({ title: "AI unavailable", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasAccess("expand")) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-x-0 bottom-0 z-50 bg-background border-t border-primary/20 rounded-t-2xl shadow-[0_-10px_40px_rgba(201,168,76,0.15)] flex flex-col"
          style={{ maxHeight: "80vh" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/20">
            <div>
              <h3 className="font-serif text-base font-semibold text-foreground">AI Support</h3>
              <p className="text-xs text-muted-foreground">You don't have to untangle this alone.</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-muted/20 transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-card border border-border/30 text-foreground rounded-bl-md"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="bg-card border border-border/30 rounded-2xl rounded-bl-md px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>

          {/* Quick replies */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {QUICK_REPLIES.map(qr => (
                <button
                  key={qr}
                  onClick={() => sendMessage(qr)}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-full border border-primary/30 text-xs text-primary font-medium hover:bg-primary/10 transition-colors disabled:opacity-50"
                >
                  {qr}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border/20">
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
              className="flex gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message…"
                disabled={isLoading}
                className="flex-1 bg-card border border-border/30 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 disabled:opacity-50"
              />
              <Button
                type="submit"
                size="icon"
                variant="gold"
                className="rounded-xl h-[46px] w-[46px]"
                disabled={!input.trim() || isLoading}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Locked button shown to non-Expand users */
export function PatternAiLockedButton() {
  return (
    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/50">
      <Lock className="w-3 h-3" />
      <span>AI Support — Available on Expand plan</span>
    </div>
  );
}

/** Button that opens chat for Expand users, shows lock for others */
export function PatternAiTriggerButton({
  label = "Ask AI For Help →",
  onClick,
}: {
  label?: string;
  onClick: () => void;
}) {
  const { hasAccess } = useSubscription();

  if (!hasAccess("expand")) return <PatternAiLockedButton />;

  return (
    <button
      onClick={onClick}
      className="w-full text-sm text-muted-foreground hover:text-foreground text-center transition-colors"
    >
      {label}
    </button>
  );
}
