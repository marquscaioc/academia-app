import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../lib/auth/provider";
import { supabase } from "../../../lib/supabase/client";
import { useConversations, Conversation } from "../../../hooks/queries/useChat";
import { useGetOrCreateDM } from "../../../hooks/mutations/useChatMutations";
import { Avatar } from "../../../components/ui/Avatar";
import { DisplayHeading } from "../../../components/ui/DisplayHeading";
import { AppIcon } from "../../../components/ui";
import { font, amethystGlow } from "../../../lib/design/tokens";

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
            <DisplayHeading size="sm">Nova conversa</DisplayHeading>
            <Pressable onPress={onClose} className="w-9 h-9 rounded-2xl bg-surface-elevated border border-surface-border items-center justify-center active:bg-surface-hover">
              <AppIcon name="close" size={18} color="#A99FBA" strokeWidth={2} />
            </Pressable>
          </View>
          {!connections?.length ? (
            <Text className="text-sm text-text-muted text-center py-6" style={{ fontFamily: font.regular }}>Nenhuma conexão para conversar ainda.</Text>
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
                  <Text className="text-sm text-text-primary flex-1" style={{ fontFamily: font.semibold }}>{c.name}</Text>
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
          <DisplayHeading size="2xl">Mensagens</DisplayHeading>
          <Pressable onPress={() => setShowNew(true)} style={amethystGlow} className="rounded-2xl overflow-hidden">
            <LinearGradient
              colors={["#781BB6", "#C636E0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0.9 }}
              className="px-4 py-2"
            >
              <Text className="text-white text-xs" style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}>+ Nova</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#781BB6" />
          </View>
        ) : !conversations?.length ? (
          <View className="flex-1 items-center justify-center px-8 py-12">
            <View className="w-16 h-16 rounded-3xl bg-violet-500/15 border border-violet-500/25 items-center justify-center mb-6">
              <AppIcon name="chat" size={28} color="#9B40D8" strokeWidth={2} />
            </View>
            <Text className="text-3xl text-text-primary text-center" style={{ fontFamily: font.display, letterSpacing: -0.3 }}>
              Nenhuma conversa
            </Text>
            <Text className="text-sm text-text-secondary text-center mt-2.5 max-w-[300px] leading-5" style={{ fontFamily: font.regular }}>
              Suas conversas com trainers e outros alunos aparecerão aqui.
            </Text>
            <Pressable onPress={() => setShowNew(true)} style={amethystGlow} className="mt-7 rounded-2xl overflow-hidden">
              <LinearGradient
                colors={["#781BB6", "#C636E0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.9 }}
                style={{ paddingVertical: 13, paddingHorizontal: 26 }}
              >
                <Text className="text-white text-sm" style={{ fontFamily: font.semibold, letterSpacing: 0.4 }}>
                  Iniciar conversa
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
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
                    <View className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
                      <AppIcon name="social" size={20} color="#9B40D8" strokeWidth={2} />
                    </View>
                  ) : (
                    <Avatar uri={avatar} name={name} size="lg" />
                  )}

                  <View className="flex-1">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm text-text-primary" style={{ fontFamily: font.semibold }} numberOfLines={1}>
                        {name}
                      </Text>
                      <Text className="text-[10px] text-text-muted" style={{ fontFamily: font.regular }}>
                        {timeAgo(item.last_message_at)}
                      </Text>
                    </View>
                    {item.last_message_preview ? (
                      <Text className="text-xs text-text-muted mt-1" style={{ fontFamily: font.regular }} numberOfLines={1}>
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
