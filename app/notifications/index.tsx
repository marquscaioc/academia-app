import { router } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../lib/auth/provider";
import { supabase } from "../../lib/supabase/client";
import { font } from "../../lib/design/tokens";
import { DisplayHeading } from "../../components/ui/DisplayHeading";
import { AppIcon, type IconName } from "../../components/ui";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  is_read: boolean;
  created_at: string;
  data: Record<string, unknown> | null;
}

const typeIcons: Record<string, IconName> = {
  new_workout: "workout",
  check_in_due: "clipboard-check",
  message: "chat",
  challenge_update: "trophy",
  achievement: "award",
  payment: "money",
  invite_accepted: "social",
  default: "bell",
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
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 rounded-2xl bg-surface-card border border-surface-border items-center justify-center"
            >
              <AppIcon name="arrow-left" size={18} color="#6E6382" strokeWidth={2} />
            </Pressable>
            <DisplayHeading size="sm">Notificações.</DisplayHeading>
            {unreadCount > 0 ? (
              <View className="bg-violet-500 rounded-full px-2 py-0.5">
                <Text className="text-white text-[10px]" style={{ fontFamily: font.bold }}>
                  {unreadCount}
                </Text>
              </View>
            ) : null}
          </View>
          {unreadCount > 0 ? (
            <Pressable
              onPress={() => markAllRead.mutate()}
              className="flex-row items-center gap-1.5"
            >
              <AppIcon name="check-all" size={16} color="#9B40D8" strokeWidth={2} />
              <Text className="text-violet-400 text-xs" style={{ fontFamily: font.semibold }}>
                Marcar todas como lidas
              </Text>
            </Pressable>
          ) : null}
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#781BB6" />
          </View>
        ) : !notifications?.length ? (
          <View className="flex-1 items-center justify-center px-6">
            <View className="w-16 h-16 rounded-3xl bg-violet-500/15 border border-violet-500/25 items-center justify-center mb-5">
              <AppIcon name="bell" size={28} color="#9B40D8" strokeWidth={2} />
            </View>
            <DisplayHeading size="sm">Tudo em dia.</DisplayHeading>
            <Text className="text-text-secondary text-sm text-center mt-2" style={{ fontFamily: font.regular }}>
              Nenhuma notificacao ainda.
            </Text>
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
                <View className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center mt-0.5">
                  <AppIcon
                    name={typeIcons[item.type] ?? typeIcons.default}
                    size={18}
                    color="#9B40D8"
                    strokeWidth={2}
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text
                      className="text-sm text-text-primary flex-1"
                      style={{ fontFamily: item.is_read ? font.medium : font.semibold }}
                    >
                      {item.title}
                    </Text>
                    {!item.is_read ? (
                      <View className="w-2 h-2 bg-violet-500 rounded-full" />
                    ) : null}
                  </View>
                  {item.body ? (
                    <Text className="text-xs text-text-secondary mt-1 leading-4" style={{ fontFamily: font.regular }}>
                      {item.body}
                    </Text>
                  ) : null}
                  <Text className="text-[10px] text-text-muted mt-1.5" style={{ fontFamily: font.regular }}>
                    {timeAgo(item.created_at)}
                  </Text>
                </View>
              </Pressable>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
