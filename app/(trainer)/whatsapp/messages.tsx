import { router } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../lib/auth/provider";
import { supabase } from "../../../lib/supabase/client";
import { Avatar } from "../../../components/ui/Avatar";

interface WhatsAppNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  data: { channel?: string; template?: string; sent?: boolean } | null;
  created_at: string;
  is_pushed: boolean;
  student?: { full_name: string; avatar_url: string | null } | null;
}

export default function WhatsAppMessagesScreen() {
  const { user } = useAuth();

  const { data: messages, isLoading } = useQuery({
    queryKey: ["whatsapp", "messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*, student:profiles!user_id(full_name, avatar_url)")
        .like("type", "whatsapp_%")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data ?? []) as WhatsAppNotification[];
    },
    enabled: !!user,
  });

  const templateIcons: Record<string, string> = {
    checkin_reminder: "📋",
    daily_workout: "🏋️",
    plan_expiring: "⚠️",
    smart_nudge: "🔥",
    welcome: "👋",
    incoming_unknown: "❓",
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1">
        <View className="px-6 pt-6 pb-4 flex-row items-center justify-between">
          <Pressable onPress={() => router.back()}>
            <Text className="text-violet-400 font-medium">← Voltar</Text>
          </Pressable>
          <Text className="text-lg font-black text-text-primary">Mensagens Enviadas</Text>
          <View className="w-16" />
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#781BB6" />
          </View>
        ) : !messages?.length ? (
          <View className="flex-1 items-center justify-center px-8">
            <Text className="text-3xl mb-3">💬</Text>
            <Text className="text-base font-bold text-text-primary">Nenhuma mensagem</Text>
            <Text className="text-sm text-text-muted text-center mt-2">
              Mensagens enviadas via WhatsApp aparecerao aqui.
            </Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerClassName="px-6 gap-2 pb-10"
            renderItem={({ item }) => {
              const templateType = item.type.replace("whatsapp_", "");
              const icon = templateIcons[templateType] ?? "💬";
              const sent = item.data?.sent !== false;
              const studentInfo = item.student as unknown as { full_name: string; avatar_url: string | null } | null;

              return (
                <View className="bg-surface-card border border-surface-border rounded-2xl p-4">
                  <View className="flex-row items-center gap-3 mb-2">
                    {studentInfo ? (
                      <Avatar uri={studentInfo.avatar_url} name={studentInfo.full_name} size="sm" />
                    ) : (
                      <Text className="text-lg">{icon}</Text>
                    )}
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-text-primary">
                        {studentInfo?.full_name ?? "Aluno"}
                      </Text>
                      <Text className="text-[10px] text-text-muted">
                        {templateType.replace(/_/g, " ")}
                      </Text>
                    </View>
                    <View className={`px-2 py-0.5 rounded-full ${sent ? "bg-success-500/15" : "bg-danger-500/15"}`}>
                      <Text className={`text-[10px] font-bold ${sent ? "text-success-500" : "text-danger-500"}`}>
                        {sent ? "Enviado" : "Falhou"}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-xs text-text-secondary" numberOfLines={2}>
                    {item.body}
                  </Text>
                  <Text className="text-[10px] text-text-muted mt-2">
                    {new Date(item.created_at).toLocaleString("pt-BR")}
                  </Text>
                </View>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
