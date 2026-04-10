import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Lock, History, Plus, Trash2, ChevronLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { useAiChatSessions, ChatMessage } from "@/hooks/useAiChatSessions";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";

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
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    sessions,
    activeSessionId,
    setActiveSessionId,
    createSession,
    updateSession,
    deleteSession,
    loadSessions,
  } = useAiChatSessions(trapName);

  // Track the current session id locally so we can persist after streaming
  const sessionIdRef = useRef<string | null>(null);
  sessionIdRef.current = activeSessionId;

  // Initialize with opener when panel opens (new conversation)
  useEffect(() => {
    if (show && messages.length === 0 && !activeSessionId) {
      const opener = TRAP_OPENERS[trapName] || "What's coming up for you right now?";
      setMessages([{ role: "assistant", content: opener }]);
    }
  }, [show, trapName]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (show && !showHistory) setTimeout(() => inputRef.current?.focus(), 300);
  }, [show, showHistory]);

  // Save messages after each completed exchange
  const persistMessages = useCallback(
    async (msgs: ChatMessage[]) => {
      if (!user || msgs.length < 2) return;
      if (sessionIdRef.current) {
        await updateSession(sessionIdRef.current, msgs);
      } else {
        const newId = await createSession(msgs);
        if (newId) sessionIdRef.current = newId;
      }
    },
    [user, updateSession, createSession]
  );

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: text.trim() };
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
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
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
      let finalMessages = updatedMessages;

      const upsertAssistant = (chunk: string) => {
        assistantSoFar += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          let next: ChatMessage[];
          if (last?.role === "assistant" && prev.length > updatedMessages.length) {
            next = prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
          } else {
            next = [...prev, { role: "assistant", content: assistantSoFar }];
          }
          finalMessages = next;
          return next;
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
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

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

      // Persist after stream completes
      await persistMessages(finalMessages);
    } catch (e) {
      console.error("AI chat error:", e);
      toast({ title: "AI unavailable", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setActiveSessionId(null);
    sessionIdRef.current = null;
    const opener = TRAP_OPENERS[trapName] || "What's coming up for you right now?";
    setMessages([{ role: "assistant", content: opener }]);
    setShowHistory(false);
  };

  const loadSession = (session: { id: string; messages: ChatMessage[] }) => {
    setActiveSessionId(session.id);
    sessionIdRef.current = session.id;
    setMessages(session.messages);
    setShowHistory(false);
  };

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    await deleteSession(sessionId);
    if (sessionIdRef.current === sessionId) {
      startNewChat();
    }
  };

  const openHistory = () => {
    loadSessions();
    setShowHistory(true);
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
            <div className="flex items-center gap-2">
              {showHistory && (
                <button onClick={() => setShowHistory(false)} className="p-1.5 rounded-full hover:bg-muted/20 transition-colors">
                  <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
              <div>
                <h3 className="font-serif text-base font-semibold text-foreground">
                  {showHistory ? "Past Sessions" : "AI Support"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {showHistory ? "Tap a session to continue" : "You don't have to untangle this alone."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {!showHistory && (
                <>
                  <button onClick={openHistory} className="p-2 rounded-full hover:bg-muted/20 transition-colors" title="Past sessions">
                    <History className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button onClick={startNewChat} className="p-2 rounded-full hover:bg-muted/20 transition-colors" title="New chat">
                    <Plus className="w-4 h-4 text-muted-foreground" />
                  </button>
                </>
              )}
              <button onClick={onClose} className="p-2 rounded-full hover:bg-muted/20 transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {showHistory ? (
            /* Session History List */
            <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-[200px]">
              {sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No saved sessions yet.</p>
              ) : (
                sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => loadSession(session)}
                    className="w-full text-left rounded-xl border border-border/30 bg-card/60 p-3 hover:border-primary/30 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {session.title || "Untitled session"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {session.messages.length} messages · {formatDistanceToNow(new Date(session.updated_at), { addSuffix: true })}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteSession(e, session.id)}
                        className="p-1.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive/20 transition-all"
                        title="Delete session"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : (
            <>
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
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm prose-invert max-w-none [&>p]:m-0 [&>ul]:my-1 [&>ol]:my-1 [&>h1]:text-sm [&>h2]:text-sm [&>h3]:text-sm [&>h1]:font-semibold [&>h2]:font-semibold [&>h3]:font-semibold [&>h1]:mb-1 [&>h2]:mb-1 [&>h3]:mb-1">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        msg.content
                      )}
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
              {messages.length <= 2 && !activeSessionId && (
                <div className="px-4 pb-2 flex flex-wrap gap-2">
                  {QUICK_REPLIES.map((qr) => (
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
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage(input);
                  }}
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
            </>
          )}
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
