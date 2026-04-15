import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useAuth } from "../../../lib/auth/provider";
import { useAcceptInvite } from "../../../hooks/mutations/useInviteMutations";
import { useWorkoutPlans } from "../../../hooks/queries/useWorkouts";
import { useUnreadCount } from "../../../hooks/queries/useUnreadNotifications";
import { BigStat, DisplayHeading, GradientCard, Logo, SectionLabel } from "../../../components/ui";

function QuickAction({ icon, label, href, index }: { icon: string; label: string; href: string; index: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(500 + index * 70).springify()} style={{ flex: 1 }}>
      <Link href={href as never} asChild>
        <Pressable className="bg-surface-card border border-surface-border rounded-2xl py-5 items-center active:bg-surface-hover overflow-hidden">
          <LinearGradient
            colors={["rgba(155,64,216,0.08)", "transparent"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            pointerEvents="none"
          />
          <Text className="text-2xl mb-2">{icon}</Text>
          <Text className="text-[11px] text-text-secondary" style={{ fontFamily: "DMSans_600SemiBold", letterSpacing: 0.5 }}>
            {label}
          </Text>
        </Pressable>
      </Link>
    </Animated.View>
  );
}

export default function StudentHomeScreen() {
  const { user, profile, signOut } = useAuth();
  const acceptInvite = useAcceptInvite();
  const [showInvite, setShowInvite] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const firstName = profile?.full_name?.split(" ")[0] ?? "Aluno";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  const edition = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long" }).toUpperCase();

  const { data: workoutPlans } = useWorkoutPlans(user?.id);
  const { data: unreadCount } = useUnreadCount(user?.id);
  const activePlan = workoutPlans?.[0];
  const daysUntilExpiry = activePlan?.ends_at
    ? Math.ceil((new Date(activePlan.ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const handleAcceptInvite = async () => {
    if (!inviteCode.trim() || !user) return;
    setInviteError("");
    const result = await acceptInvite.mutateAsync({
      code: inviteCode.trim(),
      student_id: user.id,
    });
    if (!result.success) {
      setInviteError(result.error ?? "Codigo invalido");
      return;
    }
    setInviteSuccess(true);
    setInviteCode("");
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      {/* Ambient gradient wash — top */}
      <LinearGradient
        colors={["rgba(120,27,182,0.18)", "transparent"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 380 }}
        pointerEvents="none"
      />

      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        {/* Masthead — magazine-style */}
        <Animated.View entering={FadeIn.duration(500)} className="flex-row items-center justify-between mb-8">
          <View className="flex-row items-center gap-3">
            <Logo size="sm" />
            <View>
              <Text
                className="text-[10px] text-fuchsia-400"
                style={{ fontFamily: "DMSans_700Bold", letterSpacing: 3 }}
              >
                ED. {edition}
              </Text>
              <Text
                className="text-[9px] text-text-muted mt-0.5"
                style={{ fontFamily: "DMSans_700Bold", letterSpacing: 2 }}
              >
                ROYAL AMETHYST
              </Text>
            </View>
          </View>
          <View className="flex-row gap-2">
            <Link href="/notifications" asChild>
              <Pressable className="w-10 h-10 bg-surface-card border border-surface-border rounded-xl items-center justify-center">
                <Text className="text-sm">🔔</Text>
                {(unreadCount ?? 0) > 0 ? (
                  <View className="absolute -top-1 -right-1 bg-fuchsia-500 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
                    <Text className="text-white text-[9px]" style={{ fontFamily: "DMSans_700Bold" }}>
                      {unreadCount! > 99 ? "99+" : unreadCount}
                    </Text>
                  </View>
                ) : null}
              </Pressable>
            </Link>
            <Link href="/profile/edit" asChild>
              <Pressable className="w-10 h-10 bg-surface-card border border-surface-border rounded-xl items-center justify-center">
                <Text className="text-sm">⚙️</Text>
              </Pressable>
            </Link>
          </View>
        </Animated.View>

        {/* Editorial greeting — serif italic */}
        <Animated.View entering={FadeInDown.delay(80).springify()} className="mb-2">
          <DisplayHeading size="md" italic tone="muted">
            {greeting},
          </DisplayHeading>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(160).springify()} className="mb-10">
          <Text
            className="text-text-primary"
            style={{
              fontFamily: "ArchivoBlack_400Regular",
              fontSize: 56,
              lineHeight: 56,
              letterSpacing: -2.5,
            }}
          >
            {firstName.toUpperCase()}.
          </Text>
        </Animated.View>

        {/* Invite — brief, compact */}
        {!inviteSuccess ? (
          <Animated.View entering={FadeInDown.delay(220).springify()} className="mb-6">
            {!showInvite ? (
              <Pressable
                onPress={() => setShowInvite(true)}
                className="border border-dashed border-violet-500/40 rounded-2xl p-4 flex-row items-center gap-3 active:bg-surface-hover"
              >
                <View className="w-10 h-10 bg-violet-500/15 rounded-xl items-center justify-center">
                  <Text className="text-lg">🎟️</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-text-primary" style={{ fontFamily: "DMSans_600SemiBold" }}>
                    Tem um código de convite?
                  </Text>
                  <Text className="text-xs text-text-muted mt-0.5" style={{ fontFamily: "DMSans_400Regular" }}>
                    Conecte-se ao seu personal trainer
                  </Text>
                </View>
                <Text className="text-fuchsia-400 text-sm" style={{ fontFamily: "DMSans_700Bold" }}>
                  Inserir →
                </Text>
              </Pressable>
            ) : (
              <View className="bg-surface-card border border-violet-500/30 rounded-2xl p-5">
                <SectionLabel tone="accent" className="mb-3">
                  Código de convite
                </SectionLabel>
                {inviteError ? (
                  <View className="bg-danger-500/10 rounded-xl p-3 mb-3">
                    <Text className="text-danger-500 text-xs text-center" style={{ fontFamily: "DMSans_500Medium" }}>
                      {inviteError}
                    </Text>
                  </View>
                ) : null}
                <TextInput
                  className="bg-dark-300 border-2 border-surface-border rounded-xl px-4 py-3 text-center text-3xl text-violet-300"
                  style={{ fontFamily: "ArchivoBlack_400Regular", letterSpacing: 8 }}
                  placeholder="ABCDEF"
                  placeholderTextColor="#2A2A30"
                  value={inviteCode}
                  onChangeText={(t) => setInviteCode(t.toUpperCase())}
                  maxLength={6}
                  autoCapitalize="characters"
                />
                <View className="flex-row gap-3 mt-4">
                  <Pressable
                    onPress={() => { setShowInvite(false); setInviteCode(""); setInviteError(""); }}
                    className="flex-1 border border-surface-border rounded-xl py-3 items-center"
                  >
                    <Text className="text-text-muted text-sm" style={{ fontFamily: "DMSans_700Bold" }}>
                      Cancelar
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={handleAcceptInvite}
                    disabled={inviteCode.length < 6 || acceptInvite.isPending}
                    className={`flex-1 rounded-xl py-3 items-center ${
                      inviteCode.length >= 6 ? "bg-violet-500" : "bg-surface-border"
                    }`}
                  >
                    {acceptInvite.isPending ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text
                        className={`text-sm ${inviteCode.length >= 6 ? "text-white" : "text-text-muted"}`}
                        style={{ fontFamily: "DMSans_700Bold", letterSpacing: 1 }}
                      >
                        CONECTAR
                      </Text>
                    )}
                  </Pressable>
                </View>
              </View>
            )}
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeInDown.springify()}
            className="bg-success-500/10 border border-success-500/20 rounded-2xl p-4 mb-6 flex-row items-center gap-3"
          >
            <Text className="text-lg">✅</Text>
            <Text className="text-sm text-success-500 flex-1" style={{ fontFamily: "DMSans_600SemiBold" }}>
              Conectado ao seu personal! Confira o chat.
            </Text>
          </Animated.View>
        )}

        {/* Feature block — "Treino de hoje" — gradient border hero */}
        <Animated.View entering={FadeInDown.delay(300).springify()} className="mb-8">
          <GradientCard variant="border" tone="amethyst" rounded="3xl" padding={false}>
            <View className="p-7">
              <View className="flex-row items-center gap-2 mb-4">
                <View className="w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
                <SectionLabel tone="accent">Treino de hoje</SectionLabel>
              </View>
              <DisplayHeading size="md" italic className="mb-2">
                Nenhum treino{"\n"}atribuído ainda.
              </DisplayHeading>
              <Text
                className="text-sm text-text-secondary mt-3 leading-6"
                style={{ fontFamily: "DMSans_400Regular" }}
              >
                Peça ao seu personal para criar um plano de treino personalizado para os seus objetivos.
              </Text>

              {/* Ornamental progress bar */}
              <View className="mt-6 flex-row items-center gap-3">
                <View className="flex-1 h-[3px] bg-surface-border rounded-full overflow-hidden">
                  <View className="h-full w-0 bg-fuchsia-400" />
                </View>
                <Text
                  className="text-text-muted text-[10px]"
                  style={{ fontFamily: "DMSans_700Bold", letterSpacing: 2 }}
                >
                  0 / 0
                </Text>
              </View>
            </View>
          </GradientCard>
        </Animated.View>

        {/* Plan expiring banner */}
        {daysUntilExpiry != null && daysUntilExpiry <= 7 && daysUntilExpiry > 0 ? (
          <Animated.View
            entering={FadeInDown.delay(340).springify()}
            className="bg-warning-500/10 border border-warning-500/30 rounded-2xl p-4 mb-6 flex-row items-center gap-3"
          >
            <Text className="text-2xl">⚠️</Text>
            <View className="flex-1">
              <Text className="text-sm text-warning-500" style={{ fontFamily: "DMSans_700Bold" }}>
                Plano expira em {daysUntilExpiry} dia{daysUntilExpiry !== 1 ? "s" : ""}
              </Text>
              <Text className="text-xs text-text-muted mt-0.5" style={{ fontFamily: "DMSans_400Regular" }}>
                Converse com seu personal para renovar.
              </Text>
            </View>
          </Animated.View>
        ) : null}

        {/* Stats — editorial split */}
        <Animated.View entering={FadeInDown.delay(380).springify()} className="mb-10">
          <SectionLabel withRule className="mb-5">
            Esta semana
          </SectionLabel>
          <View className="flex-row items-end justify-between">
            <BigStat value="0" label="Treinos" tone="accent" size="xl" />
            <View className="w-px h-14 bg-surface-border mx-4" />
            <BigStat
              value={String(profile?.current_streak ?? 0)}
              label="Streak"
              suffix="D"
              tone="ice"
              size="xl"
              align="center"
            />
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <SectionLabel withRule className="mb-4">
          Ações rápidas
        </SectionLabel>
        <View className="flex-row gap-3 mb-10">
          <QuickAction icon="📏" label="Medidas" href="/(student)/(progress)/add-measurement" index={0} />
          <QuickAction icon="📸" label="Foto" href="/(student)/(progress)/add-photo" index={1} />
          <QuickAction icon="🏆" label="Desafios" href="/challenges" index={2} />
        </View>

        {/* Sign out */}
        <Pressable
          onPress={signOut}
          className="border border-surface-border rounded-2xl py-3.5 items-center mb-10 active:bg-surface-hover"
        >
          <Text className="text-text-muted text-sm" style={{ fontFamily: "DMSans_700Bold", letterSpacing: 1 }}>
            SAIR DA CONTA
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
