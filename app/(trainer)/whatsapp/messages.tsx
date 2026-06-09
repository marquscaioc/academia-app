import { router } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../lib/auth/provider";
import { supabase } from "../../../lib/supabase/client";
import { Avatar } from "../../../components/ui/Avatar";
import { AppIcon, EmptyState, SectionLabel, type IconName } from "../../../components/ui";
import { font } from "../../../lib/design/tokens";

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

  const templateIcons: Record<string, IconName> = {
    checkin_reminder: "clipboard",
    daily_workout: "workout",
    plan_expiring: "warning",
    smart_nudge: "streak",
    welcome: "celebrate",
    incoming_unknown: "info",
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1">
        <View className="px-6 pt-6 pb-4 flex-row items-center justify-between">
          <Pressable onPress={() => router.back()} className="flex-row items-center gap-1.5">
            <AppIcon name="arrow-left" size={18} color="#9B40D8" strokeWidth={2} />
            <Text className="text-violet-400" style={{ fontFamily: font.medium }}>Voltar</Text>
          </Pressable>
          <View className="items-center">
            <SectionLabel className="mb-0.5">WhatsApp</SectionLabel>
            <Text className="text-xl text-text-primary" style={{ fontFamily: font.display }}>Mensagens enviadas</Text>
          </View>
          <View className="w-16" />
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#781BB6" />
          </View>
        ) : !messages?.length ? (
          <EmptyState
            iconName="chat"
            title="Nenhuma mensagem"
            description="Mensagens enviadas via WhatsApp aparecerao aqui."
          />
        ) : (
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerClassName="px-6 gap-2 pb-10"
            renderItem={({ item }) => {
              const templateType = item.type.replace("whatsapp_", "");
              const icon: IconName = templateIcons[templateType] ?? "chat";
              const sent = item.data?.sent !== false;
              const studentInfo = item.student as unknown as { full_name: string; avatar_url: string | null } | null;

              return (
                <View className="bg-surface-card border border-surface-border rounded-3xl p-4">
                  <View className="flex-row items-center gap-3 mb-2">
                    {studentInfo ? (
                      <Avatar uri={studentInfo.avatar_url} name={studentInfo.full_name} size="sm" />
                    ) : (
                      <View className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
                        <AppIcon name={icon} size={18} color="#9B40D8" strokeWidth={2} />
                      </View>
                    )}
                    <View className="flex-1">
                      <Text className="text-sm text-text-primary" style={{ fontFamily: font.semibold }}>
                        {studentInfo?.full_name ?? "Aluno"}
                      </Text>
                      <Text className="text-[10px] uppercase text-text-muted" style={{ fontFamily: font.semibold, letterSpacing: 1.5 }}>
                        {templateType.replace(/_/g, " ")}
                      </Text>
                    </View>
                    <View className={`flex-row items-center gap-1 px-2.5 py-1 rounded-full ${sent ? "bg-success-500/15" : "bg-danger-500/15"}`}>
                      <AppIcon
                        name={sent ? "check-circle" : "x-circle"}
                        size={12}
                        color={sent ? "#34D399" : "#FB7185"}
                        strokeWidth={2}
                      />
                      <Text className={`text-[10px] ${sent ? "text-success-500" : "text-danger-500"}`} style={{ fontFamily: font.bold }}>
                        {sent ? "Enviado" : "Falhou"}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-xs text-text-secondary" numberOfLines={2} style={{ fontFamily: font.regular }}>
                    {item.body}
                  </Text>
                  <View className="flex-row items-center gap-1.5 mt-2">
                    <AppIcon name="clock" size={12} color="#6E6382" strokeWidth={2} />
                    <Text className="text-[10px] text-text-muted" style={{ fontFamily: font.regular }}>
                      {new Date(item.created_at).toLocaleString("pt-BR")}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
