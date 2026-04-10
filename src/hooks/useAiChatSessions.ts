import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatSession {
  id: string;
  trap_name: string;
  title: string | null;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export function useAiChatSessions(trapName: string) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load past sessions for this trap
  const loadSessions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("ai_chat_sessions")
      .select("*")
      .eq("user_id", user.id)
      .eq("trap_name", trapName)
      .order("updated_at", { ascending: false })
      .limit(20);

    if (data) {
      setSessions(
        data.map((d: any) => ({
          ...d,
          messages: (d.messages as any[]) || [],
        }))
      );
    }
    setLoading(false);
  }, [user, trapName]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Create a new session
  const createSession = useCallback(
    async (initialMessages: ChatMessage[]): Promise<string | null> => {
      if (!user) return null;
      const title = generateTitle(initialMessages);
      const { data, error } = await supabase
        .from("ai_chat_sessions")
        .insert({
          user_id: user.id,
          trap_name: trapName,
          title,
          messages: initialMessages as any,
        })
        .select("id")
        .single();

      if (error || !data) return null;
      setActiveSessionId(data.id);
      loadSessions();
      return data.id;
    },
    [user, trapName, loadSessions]
  );

  // Update messages for an existing session
  const updateSession = useCallback(
    async (sessionId: string, messages: ChatMessage[]) => {
      if (!user) return;
      const title = generateTitle(messages);
      await supabase
        .from("ai_chat_sessions")
        .update({ messages: messages as any, title })
        .eq("id", sessionId)
        .eq("user_id", user.id);
    },
    [user]
  );

  // Delete a session
  const deleteSession = useCallback(
    async (sessionId: string) => {
      if (!user) return;
      await supabase
        .from("ai_chat_sessions")
        .delete()
        .eq("id", sessionId)
        .eq("user_id", user.id);

      if (activeSessionId === sessionId) setActiveSessionId(null);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    },
    [user, activeSessionId]
  );

  return {
    sessions,
    activeSessionId,
    setActiveSessionId,
    loading,
    createSession,
    updateSession,
    deleteSession,
    loadSessions,
  };
}

function generateTitle(messages: ChatMessage[]): string {
  const firstUser = messages.find((m) => m.role === "user");
  if (firstUser) {
    return firstUser.content.length > 60
      ? firstUser.content.slice(0, 57) + "…"
      : firstUser.content;
  }
  return "New conversation";
}
