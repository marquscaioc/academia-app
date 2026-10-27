import { type ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsDesktop } from "../../lib/layout/useIsDesktop";
import { font, palette } from "../../lib/design/tokens";
import { Logo } from "../ui/Logo";
import { AppIcon } from "../ui/Icon";

export function AuthShell({ children }: { children: ReactNode }) {
  const isDesktop = useIsDesktop();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 flex-row">
        {isDesktop ? (
          <View style={{ width: "44%", maxWidth: 680, backgroundColor: palette.bg, borderRightWidth: 1, borderRightColor: palette.border }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 48 }} showsVerticalScrollIndicator={false}>
              <Logo size="lg" />
              <View style={{ flex: 1, justifyContent: "center", paddingVertical: 64, maxWidth: 430 }}>
                <View className="self-start border border-surface-border rounded-full px-3 py-1.5 mb-7 bg-white">
                  <Text className="text-[11px] text-text-secondary" style={{ fontFamily: font.medium }}>Treino, saúde e constância</Text>
                </View>
                <Text style={{ fontFamily: font.semibold, fontSize: 52, lineHeight: 58, letterSpacing: -2.2, color: palette.textPrimary }}>
                  Seu progresso.{"\n"}Com direção.
                </Text>
                <Text className="text-base text-text-secondary mt-6 leading-7" style={{ fontFamily: font.regular, maxWidth: 350 }}>
                  Um espaço para organizar sua rotina e evoluir com acompanhamento profissional.
                </Text>
                <View className="mt-12 border-t border-surface-border">
                  {[
                    { number: "01", title: "Treinos planejados", description: "Cada sessão com um propósito." },
                    { number: "02", title: "Nutrição e rotina", description: "Seu plano alimentar sempre por perto." },
                    { number: "03", title: "Evolução acompanhada", description: "Clareza sobre cada etapa do caminho." },
                  ].map((item) => (
                    <View key={item.number} className="flex-row gap-5 py-5 border-b border-surface-border">
                      <Text className="text-xs text-text-muted mt-0.5" style={{ fontFamily: font.medium }}>{item.number}</Text>
                      <View>
                        <Text className="text-sm text-text-primary" style={{ fontFamily: font.medium }}>{item.title}</Text>
                        <Text className="text-xs text-text-muted mt-1.5" style={{ fontFamily: font.regular }}>{item.description}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
              <View className="flex-row items-center gap-2">
                <AppIcon name="shield" size={14} color={palette.textMuted} strokeWidth={1.7} />
                <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>Cuidado em cada detalhe.</Text>
              </View>
            </ScrollView>
          </View>
        ) : null}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: isDesktop ? 56 : 24, paddingVertical: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full self-center" style={{ maxWidth: 400 }}>
            {!isDesktop ? <View className="mb-12"><Logo size="lg" /></View> : null}
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
