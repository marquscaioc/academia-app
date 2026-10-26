import { useState } from "react";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../lib/auth/provider";
import { useUnreadConversationCount } from "../../../hooks/queries/useChat";
import { useUnreadCount } from "../../../hooks/queries/useUnreadNotifications";
import { AppIcon, DisplayHeading, SectionLabel, type IconName } from "../../../components/ui";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { WebContainer } from "../../../components/layout/WebContainer";
import { font, palette } from "../../../lib/design/tokens";

interface HubItem {
  label: string;
  description: string;
  icon: IconName;
  href: string;
  badge?: number;
}

function HubRow({ item }: { item: HubItem }) {
  const badge = item.badge && item.badge > 0 ? (item.badge > 99 ? "99+" : String(item.badge)) : null;
  return (
    <Pressable
      onPress={() => router.push(item.href as never)}
      accessibilityRole="button"
      accessibilityLabel={badge ? `${item.label}, ${badge} não lidas` : item.label}
      className="flex-row items-center gap-4 px-4 py-4 active:bg-surface-hover"
    >
      <View className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
        <AppIcon name={item.icon} size={18} color={palette.violet300} strokeWidth={2} />
      </View>
      <View className="flex-1">
        <Text className="text-sm text-text-primary" style={{ fontFamily: font.semibold }}>{item.label}</Text>
        <Text className="text-xs text-text-muted mt-0.5" style={{ fontFamily: font.regular }}>{item.description}</Text>
      </View>
      {badge ? (
        <View className="min-w-[22px] h-[22px] px-1.5 rounded-full bg-fuchsia-500 items-center justify-center">
          <Text className="text-[11px] text-white" style={{ fontFamily: font.semibold }}>{badge}</Text>
        </View>
      ) : null}
      <AppIcon name="chevron-right" size={16} color={palette.textMuted} strokeWidth={2} />
    </Pressable>
  );
}

function HubSection({ title, items }: { title: string; items: HubItem[] }) {
  return (
    <View className="mb-6">
      <SectionLabel className="mb-2 ml-1">{title}</SectionLabel>
      <View className="bg-surface-card border border-surface-border rounded-3xl overflow-hidden">
        {items.map((item, i) => (
          <View key={item.href} className={i > 0 ? "border-t border-surface-border" : undefined}>
            <HubRow item={item} />
          </View>
        ))}
      </View>
    </View>
  );
}

export default function MoreScreen() {
  const { user, signOut } = useAuth();
  const unreadChats = useUnreadConversationCount(user?.id);
  const { data: unreadNotifications } = useUnreadCount(user?.id);
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  const community: HubItem[] = [
    { label: "Chat", description: "Conversas com seu personal e grupos", icon: "chat", href: "/(student)/(chat)", badge: unreadChats },
    { label: "Social", description: "Feed de treinos e publicações", icon: "social", href: "/(student)/(social)" },
    { label: "Desafios", description: "Participe e acompanhe o ranking", icon: "trophy", href: "/challenges" },
    { label: "Grupos", description: "Comunidades de treino", icon: "user", href: "/groups" },
  ];
  const learning: HubItem[] = [
    { label: "Aulas e e-books", description: "Vídeos e materiais do seu personal", icon: "courses", href: "/(student)/(courses)" },
    { label: "Profissionais parceiros", description: "Contatos indicados pelo seu personal", icon: "user", href: "/partners" },
    { label: "Conquistas", description: "Medalhas desbloqueadas", icon: "medal", href: "/(student)/(progress)/badges" },
  ];
  const account: HubItem[] = [
    { label: "Notificações", description: "Avisos e lembretes", icon: "bell", href: "/notifications", badge: unreadNotifications ?? 0 },
    { label: "Perfil", description: "Dados pessoais e preferências", icon: "settings", href: "/profile/edit" },
    { label: "Seus dados", description: "Fontes de dados e como usamos suas informações", icon: "shield", href: "/sobre-dados" },
    { label: "Privacidade", description: "Política de privacidade", icon: "file", href: "/privacidade" },
    { label: "Termos de uso", description: "Condições do serviço", icon: "book", href: "/termos" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <WebContainer maxWidth={760}>
        <ScrollView contentContainerClassName="px-6 pt-6 pb-10">
          <DisplayHeading className="mb-6">Mais</DisplayHeading>
          <HubSection title="Comunidade" items={community} />
          <HubSection title="Aprender" items={learning} />
          <HubSection title="Conta" items={account} />
          <Pressable
            onPress={() => setConfirmSignOut(true)}
            accessibilityRole="button"
            className="items-center py-4 active:opacity-70"
          >
            <Text className="text-sm" style={{ fontFamily: font.semibold, color: palette.danger }}>Sair da conta</Text>
          </Pressable>
        </ScrollView>
      </WebContainer>
      <ConfirmDialog
        visible={confirmSignOut}
        title="Sair da conta?"
        message="Você precisará entrar novamente para acessar seus treinos."
        confirmLabel="Sair"
        destructive
        onConfirm={() => {
          setConfirmSignOut(false);
          signOut();
        }}
        onCancel={() => setConfirmSignOut(false)}
      />
    </SafeAreaView>
  );
}
