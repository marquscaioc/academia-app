import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../lib/auth/provider";
import { supabase } from "../../../lib/supabase/client";
import { useConversations, Conversation } from "../../../hooks/queries/useChat";
import { useGetOrCreateDM } from "../../../hooks/mutations/useChatMutations";
import { Avatar } from "../../../components/ui/Avatar";
import { EmptyState } from "../../../components/ui/EmptyState";

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `${min}min`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

function getConversationName(conv: Conversation, currentUserId: string): string {
  if (conv.name) return conv.name;
  const other = conv.members?.find((m) => m.user_id !== currentUserId);
  return other?.profile?.full_name ?? "Conversa";
}

function getConversationAvatar(conv: Conversation, currentUserId: string): string | null {
  if (conv.image_url) return conv.image_url;
  const other = conv.members?.find((m) => m.user_id !== currentUserId);
  return other?.profile?.avatar_url ?? null;
}

function NewConversationModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const getOrCreateDM = useGetOrCreateDM();
  const { data: connections } = useQuery({
    queryKey: ["chat", "connections", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trainer_students")
        .select("trainer_id, student_id, trainer:profiles!trainer_id(full_name, avatar_url), student:profiles!student_id(full_name, avatar_url)")
        .or(`trainer_id.eq.${userId},student_id.eq.${userId}`)
        .eq("status", "active");
      if (error) throw error;
      type Row = {
        trainer_id: string;
        student_id: string;
        trainer: { full_name: string; avatar_url: string | null } | null;
        student: { full_name: string; avatar_url: string | null } | null;
      };
      return ((data ?? []) as unknown as Row[]).map((r) => {
        const meTrainer = r.trainer_id === userId;
        return {
          id: meTrainer ? r.student_id : r.trainer_id,
          name: (meTrainer ? r.student?.full_name : r.trainer?.full_name) ?? "Usuario",
          avatar: (meTrainer ? r.student?.avatar_url : r.trainer?.avatar_url) ?? null,
        };
      });
    },
  });

  const open = async (otherId: string) => {
    const convId = await getOrCreateDM.mutateAsync({ user_a: userId, user_b: otherId });
    onClose();
    router.push(`/(student)/(chat)/${convId}` as never);
  };

  return (
    <Modal visible animationType="slide" transparent>
      <View className="flex-1 justify-end">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="bg-dark-200 border-t border-surface-border rounded-t-3xl px-6 pt-6 pb-10 max-h-[70%]">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-black text-text-primary">Nova conversa</Text>
            <Pressable onPress={onClose}>
              <Text className="text-text-muted text-lg">✕</Text>
            </Pressable>
          </View>
          {!connections?.length ? (
            <Text className="text-sm text-text-muted text-center py-6">Nenhuma conexão para conversar ainda.</Text>
          ) : (
            <ScrollView>
              {connections.map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => open(c.id)}
                  disabled={getOrCreateDM.isPending}
                  className="flex-row items-center gap-3 p-3 mb-1 rounded-2xl active:bg-surface-hover"
                >
                  <Avatar uri={c.avatar} name={c.name} size="md" />
                  <Text className="text-sm font-bold text-text-primary flex-1">{c.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

export default function ChatListScreen() {
  const { user } = useAuth();
  const { data: conversations, isLoading } = useConversations(user?.id);
  const [showNew, setShowNew] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1">
        <View className="px-6 pt-6 pb-4 flex-row items-center justify-between">
          <Text className="text-2xl font-black text-text-primary">Mensagens</Text>
          <Pressable onPress={() => setShowNew(true)} className="bg-violet-500 px-3 py-1.5 rounded-xl active:bg-violet-600">
            <Text className="text-white font-black text-xs">+ Nova</Text>
          </Pressable>
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#781BB6" />
          </View>
        ) : !conversations?.length ? (
          <EmptyState
            icon="💬"
            title="Nenhuma conversa"
            description="Suas conversas com trainers e outros alunos aparecerão aqui."
          />
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const name = getConversationName(item, user?.id ?? "");
              const avatar = getConversationAvatar(item, user?.id ?? "");
              const isGroup = item.conversation_type === "group";

              return (
                <Pressable
                  onPress={() => router.push(`/(student)/(chat)/${item.id}`)}
                  className="flex-row items-center gap-4 px-6 py-4 active:bg-surface-hover border-b border-surface-border"
                >
                  {isGroup ? (
                    <View className="w-12 h-12 bg-surface-elevated rounded-xl items-center justify-center">
                      <Text className="text-lg">👥</Text>
                    </View>
                  ) : (
                    <Avatar uri={avatar} name={name} size="lg" />
                  )}

                  <View className="flex-1">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm font-bold text-text-primary" numberOfLines={1}>
                        {name}
                      </Text>
                      <Text className="text-[10px] text-text-muted">
                        {timeAgo(item.last_message_at)}
                      </Text>
                    </View>
                    {item.last_message_preview ? (
                      <Text className="text-xs text-text-muted mt-1" numberOfLines={1}>
                        {item.last_message_preview}
                      </Text>
                    ) : null}
                  </View>
                </Pressable>
              );
            }}
          />
        )}
      </View>

      {showNew && user ? (
        <NewConversationModal userId={user.id} onClose={() => setShowNew(false)} />
      ) : null}
    </SafeAreaView>
  );
}
