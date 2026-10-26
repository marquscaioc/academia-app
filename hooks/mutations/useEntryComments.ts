import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export interface EntryComment {
  id: string;
  entry_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: { full_name: string; avatar_url: string | null };
}

export function useEntryComments(entryId: string) {
  return useQuery({
    queryKey: ["entry-comments", entryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("challenge_entry_comments")
        .select("*, author:profiles!author_id(full_name, avatar_url)")
        .eq("entry_id", entryId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as EntryComment[];
    },
    enabled: !!entryId,
  });
}

export function useAddEntryComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { entry_id: string; author_id: string; content: string }) => {
      const { data, error } = await supabase.from("challenge_entry_comments").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["entry-comments", vars.entry_id] });
    },
  });
}

export function useDeleteEntryComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; entry_id: string }) => {
      const { error } = await supabase.from("challenge_entry_comments").delete().eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["entry-comments", vars.entry_id] });
    },
  });
}
