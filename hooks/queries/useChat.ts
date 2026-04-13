import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export interface Conversation {
  id: string;
  conversation_type: "direct" | "group" | "challenge";
  name: string | null;
  image_url: string | null;
  last_message_at: string | null;
  last_message_preview: string | null;
  created_at: string;
  members?: ConversationMember[];
}

export interface ConversationMember {
  id: string;
  conversation_id: string;
  user_id: string;
  role: string;
  last_read_at: string;
  is_muted: boolean;
  profile?: { full_name: string; avatar_url: string | null };
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  message_type: string;
  media_url: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  sender?: { full_name: string; avatar_url: string | null };
}

export function useConversations(userId?: string) {
  return useQuery({
    queryKey: ["chat", "conversations", userId],
    queryFn: async () => {
      const { data: memberships, error: mErr } = await supabase
        .from("conversation_members")
        .select("conversation_id")
        .eq("user_id", userId!);
      if (mErr) throw mErr;

      const convIds = memberships?.map((m) => m.conversation_id) ?? [];
      if (!convIds.length) return [];

      const { data, error } = await supabase
        .from("conversations")
        .select("*, members:conversation_members(*, profile:profiles!user_id(full_name, avatar_url))")
        .in("id", convIds)
        .order("last_message_at", { ascending: false, nullsFirst: false });
      if (error) throw error;
      return data as Conversation[];
    },
    enabled: !!userId,
  });
}

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: ["chat", "messages", conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*, sender:profiles!sender_id(full_name, avatar_url)")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })
        .limit(100);
      if (error) throw error;
      return data as Message[];
    },
    enabled: !!conversationId,
  });
}
