import { router } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../lib/auth/provider";
import { supabase } from "../../lib/supabase/client";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  is_read: boolean;
  created_at: string;
  data: Record<string, unknown> | null;
}

const typeIcons: Record<string, string> = {
  new_workout: "🏋️",
  check_in_due: "📋",
  message: "💬",
  challenge_update: "🏆",
  achievement: "🎖️",
  payment: "💰",
  invite_accepted: "👥",
  default: "🔔",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `${min}min`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export default function NotificationsScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!user,
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user!.id)
        .eq("is_read", false);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const unreadCount = notifications?.filter((n) => !n.is_read).length ?? 0;

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-6 pt-6 pb-4">
          <View className="flex-row items-center gap-3">
            <Pressable onPress={() => router.back()}>
              <Text className="text-text-muted font-medium text-sm">← Voltar</Text>
            </Pressable>
            <Text className="text-xl font-black text-text-primary">Notificacoes</Text>
            {unreadCount > 0 ? (
              <View className="bg-violet-400 rounded-full px-2 py-0.5">
                <Text className="text-dark-400 text-[10px] font-black">{unreadCount}</Text>
              </View>
            ) : null}
          </View>
          {unreadCount > 0 ? (
            <Pressable onPress={() => markAllRead.mutate()}>
              <Text className="text-violet-400 text-xs font-bold">Marcar todas como lidas</Text>
            </Pressable>
          ) : null}
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#A855F7" />
          </View>
        ) : !notifications?.length ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-4xl mb-3">🔔</Text>
            <Text className="text-text-muted text-sm">Nenhuma notificacao ainda.</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => !item.is_read && markRead.mutate(item.id)}
                className={`flex-row items-start gap-4 px-6 py-4 border-b border-surface-border ${
                  !item.is_read ? "bg-surface-card" : ""
                }`}
              >
                <View className="w-10 h-10 bg-surface-elevated rounded-xl items-center justify-center mt-0.5">
                  <Text className="text-lg">{typeIcons[item.type] ?? typeIcons.default}</Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-sm font-bold text-text-primary flex-1">{item.title}</Text>
                    {!item.is_read ? (
                      <View className="w-2 h-2 bg-violet-400 rounded-full" />
                    ) : null}
                  </View>
                  {item.body ? (
                    <Text className="text-xs text-text-muted mt-1 leading-4">{item.body}</Text>
                  ) : null}
                  <Text className="text-[10px] text-text-muted mt-1.5">{timeAgo(item.created_at)}</Text>
                </View>
              </Pressable>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
