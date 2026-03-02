import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useHealingToolEntries(toolId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["healing-tool-entries", toolId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("healing_tool_entries")
        .select("*")
        .eq("tool_id", toolId)
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const saveEntry = useMutation({
    mutationFn: async (entryData: Record<string, any>) => {
      const { error } = await supabase.from("healing_tool_entries").insert({
        user_id: user!.id,
        tool_id: toolId,
        entry_data: entryData,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["healing-tool-entries", toolId] });
      toast.success("Entry saved");
    },
    onError: () => toast.error("Failed to save entry"),
  });

  const updateEntry = useMutation({
    mutationFn: async ({ id, entryData }: { id: string; entryData: Record<string, any> }) => {
      const { error } = await supabase
        .from("healing_tool_entries")
        .update({ entry_data: entryData, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["healing-tool-entries", toolId] });
      toast.success("Entry updated");
    },
    onError: () => toast.error("Failed to update"),
  });

  const deleteEntry = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("healing_tool_entries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["healing-tool-entries", toolId] });
      toast.success("Entry deleted");
    },
    onError: () => toast.error("Failed to delete"),
  });

  return { entries, isLoading, saveEntry, updateEntry, deleteEntry };
}
