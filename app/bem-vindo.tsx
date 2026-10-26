import { Link, Redirect, router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { AppIcon, Button, DisplayHeading, Logo, type IconName } from "../components/ui";
import { font } from "../lib/design/tokens";
import { useAuth } from "../lib/auth/provider";

// Presentation ("capa") shown to visitors without a session. Every item below describes a feature that
// exists in the app today; keep it that way (no results promises, no features that are not shipped).
const FEATURES: { icon: IconName; title: string; text: string }[] = [
  { icon: "workout", title: "Treino na palma da mão", text: "Seu plano A, B, C com séries, cargas e descanso, direto no celular." },
  { icon: "calendar-check", title: "Programação feita pelo seu professor", text: "O personal monta, ajusta e acompanha o seu treino de onde estiver." },
  { icon: "trend", title: "Seu desempenho, treino a treino", text: "Histórico de sessões, evolução de carga por exercício e frequência." },
  { icon: "trophy", title: "Desafios em grupo", text: "Desafios de 30 dias com ranking por treinos concluídos." },
  { icon: "courses", title: "E-books e videoaulas", text: "Conteúdos curtos em vídeo e PDF liberados pelo seu professor." },
  { icon: "heart-pulse", title: "Parceiros de saúde", text: "Nutricionistas e médicos do esporte indicados pelo seu professor." },
  { icon: "chat", title: "Fale com seu professor", text: "Chat no app e atalho para o WhatsApp do seu personal." },
];

export default function WelcomeScreen() {
  const { session } = useAuth();
  // Signed-in users go to their own home (app/index.tsx routes by role).
  if (session) return <Redirect href="/" />;

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <LinearGradient
        colors={["rgba(120,27,182,0.32)", "rgba(198,54,224,0.08)", "transparent"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 560 }}
        pointerEvents="none"
      />
      <ScrollView contentContainerClassName="px-6 pt-10 pb-12" showsVerticalScrollIndicator={false}>
        <View className="w-full max-w-[560px] self-center">
          <Animated.View entering={FadeIn.duration(500)}>
            <View className="items-center mb-10">
              <Logo size="xl" />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(120).springify()}>
            <Text
              className="text-violet-400 text-center uppercase mb-3"
              style={{ fontFamily: font.semibold, fontSize: 11, letterSpacing: 2.5 }}
            >
              Treino online com acompanhamento
            </Text>
            <DisplayHeading size="2xl" tone="primary" className="text-center">
              Seu treino na palma da mão.
            </DisplayHeading>
            <Text className="text-text-secondary text-center text-[15px] mt-4 leading-6" style={{ fontFamily: font.regular }}>
              Treine com o plano do seu professor, registre cada série e veja sua evolução, tudo pelo celular.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(220).springify()}>
            <View className="gap-3 mt-8">
              <Button title="Começar agora" size="lg" onPress={() => router.push("/(auth)/register")} />
              <Button title="Já tenho conta" variant="outline" size="lg" onPress={() => router.push("/(auth)/login")} />
            </View>
          </Animated.View>

          <View className="gap-3 mt-12">
            {FEATURES.map((f, i) => (
              <Animated.View key={f.title} entering={FadeInDown.delay(300 + i * 60).springify()}>
                <View className="flex-row items-start gap-4 rounded-3xl border border-surface-border bg-surface-card/80 p-5">
                  <View className="w-11 h-11 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
                    <AppIcon name={f.icon} size={20} color="#9B40D8" strokeWidth={2} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-text-primary text-[15px]" style={{ fontFamily: font.semibold }}>{f.title}</Text>
                    <Text className="text-text-muted text-sm mt-1 leading-5" style={{ fontFamily: font.regular }}>{f.text}</Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>

          <View className="rounded-3xl border border-violet-500/30 bg-violet-500/10 p-6 mt-8">
            <Text className="text-text-primary text-lg" style={{ fontFamily: font.display }}>É personal trainer?</Text>
            <Text className="text-text-secondary text-sm mt-2 leading-5" style={{ fontFamily: font.regular }}>
              Atenda seus alunos online: monte planos de treino e alimentares, acompanhe o desempenho de cada aluno, publique aulas e organize seu financeiro.
            </Text>
            <View className="mt-5">
              <Button title="Criar conta de profissional" variant="secondary" onPress={() => router.push("/(auth)/register")} />
            </View>
          </View>

          <View className="flex-row justify-center items-center gap-2 mt-10">
            <Link href="/termos" asChild>
              <Pressable accessibilityRole="link">
                <Text className="text-text-muted text-xs" style={{ fontFamily: font.medium }}>Termos</Text>
              </Pressable>
            </Link>
            <Text className="text-text-muted text-xs">·</Text>
            <Link href="/privacidade" asChild>
              <Pressable accessibilityRole="link">
                <Text className="text-text-muted text-xs" style={{ fontFamily: font.medium }}>Privacidade</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
