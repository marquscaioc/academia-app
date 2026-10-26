import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      conversation_id: string;
      sender_id: string;
      content: string;
      message_type?: string;
      media_url?: string;
    }) => {
      const { data, error } = await supabase
        .from("messages")
        .insert({ message_type: "text", ...input })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["chat", "messages", vars.conversation_id] });
      queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
    },
  });
}

export function useGetOrCreateDM() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { user_a: string; user_b: string }) => {
      const { data, error } = await supabase.rpc("get_or_create_dm", {
        user_a: input.user_a,
        user_b: input.user_b,
      });
      if (error) throw error;
      return data as string;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
    },
  });
}

export function useMarkConversationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { conversation_id: string; user_id: string }) => {
      const { error } = await supabase
        .from("conversation_members")
        .update({ last_read_at: new Date().toISOString() })
        .eq("conversation_id", input.conversation_id)
        .eq("user_id", input.user_id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
    },
  });
}

export function useCreateGroupChat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      name: string;
      created_by: string;
      member_ids: string[];
    }) => {
      const { data: conv, error: cErr } = await supabase
        .from("conversations")
        .insert({ conversation_type: "group", name: input.name, created_by: input.created_by })
        .select()
        .single();
      if (cErr) throw cErr;

      const members = [input.created_by, ...input.member_ids].map((uid) => ({
        conversation_id: conv.id,
        user_id: uid,
        role: uid === input.created_by ? "admin" : "member",
      }));

      const { error: mErr } = await supabase.from("conversation_members").insert(members);
      if (mErr) throw mErr;

      return conv;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
    },
  });
}
