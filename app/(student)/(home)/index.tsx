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
import { useAuth } from "../../../lib/auth/provider";
import { useAcceptInvite } from "../../../hooks/mutations/useInviteMutations";

function StatCard({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <View className="flex-1 bg-surface-card border border-surface-border rounded-2xl p-4">
      <Text className={`text-2xl font-black ${color}`}>{value}</Text>
      <Text className="text-[10px] text-text-muted mt-1 uppercase tracking-wider font-bold">{label}</Text>
    </View>
  );
}

function QuickAction({ icon, label, href }: { icon: string; label: string; href: string }) {
  return (
    <Link href={href as never} asChild>
      <Pressable className="flex-1 bg-surface-card border border-surface-border rounded-2xl py-5 items-center active:bg-surface-hover">
        <Text className="text-2xl mb-2">{icon}</Text>
        <Text className="text-xs font-bold text-text-secondary">{label}</Text>
      </Pressable>
    </Link>
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
      <ScrollView className="flex-1 px-6 pt-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text className="text-sm text-text-muted font-medium">{greeting},</Text>
            <Text className="text-3xl font-black text-text-primary tracking-tight">{firstName}</Text>
          </View>
          <Link href="/profile/edit" asChild>
            <Pressable className="w-10 h-10 bg-surface-card border border-surface-border rounded-xl items-center justify-center">
              <Text className="text-sm">⚙️</Text>
            </Pressable>
          </Link>
        </View>

        {/* Invite code section */}
        {!inviteSuccess ? (
          <View className="mb-6">
            {!showInvite ? (
              <Pressable
                onPress={() => setShowInvite(true)}
                className="bg-surface-card border border-dashed border-violet-500/30 rounded-2xl p-4 flex-row items-center gap-3 active:bg-surface-hover"
              >
                <View className="w-10 h-10 bg-violet-500/10 rounded-xl items-center justify-center">
                  <Text className="text-lg">🎟️</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-text-primary">Tem um codigo de convite?</Text>
                  <Text className="text-xs text-text-muted mt-0.5">Conecte-se ao seu personal trainer</Text>
                </View>
                <Text className="text-violet-400 font-bold text-sm">Inserir</Text>
              </Pressable>
            ) : (
              <View className="bg-surface-card border border-violet-500/30 rounded-2xl p-5">
                <Text className="text-xs font-bold text-violet-400 mb-3 tracking-wider uppercase">
                  Codigo de convite
                </Text>
                {inviteError ? (
                  <View className="bg-danger-500/10 rounded-xl p-3 mb-3">
                    <Text className="text-danger-500 text-xs font-medium text-center">{inviteError}</Text>
                  </View>
                ) : null}
                <TextInput
                  className="bg-dark-300 border-2 border-surface-border rounded-xl px-4 py-3 text-center text-2xl font-black text-violet-400 tracking-[6px]"
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
                    <Text className="text-text-muted font-bold text-sm">Cancelar</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleAcceptInvite}
                    disabled={inviteCode.length < 6 || acceptInvite.isPending}
                    className={`flex-1 rounded-xl py-3 items-center ${
                      inviteCode.length >= 6 ? "bg-violet-500" : "bg-surface-border"
                    }`}
                  >
                    {acceptInvite.isPending ? (
                      <ActivityIndicator color="#0A0A0B" size="small" />
                    ) : (
                      <Text className={`font-black text-sm ${inviteCode.length >= 6 ? "text-white" : "text-text-muted"}`}>
                        Conectar
                      </Text>
                    )}
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View className="bg-success-500/10 border border-success-500/20 rounded-2xl p-4 mb-6 flex-row items-center gap-3">
            <Text className="text-lg">✅</Text>
            <Text className="text-sm text-success-500 font-bold flex-1">
              Conectado ao seu personal! Confira o chat.
            </Text>
          </View>
        )}

        {/* Today's workout */}
        <View className="bg-surface-card border border-surface-border rounded-3xl p-6 mb-6">
          <View className="flex-row items-center gap-3 mb-3">
            <View className="w-10 h-10 bg-violet-500/20 rounded-xl items-center justify-center">
              <Text className="text-lg">⚡</Text>
            </View>
            <Text className="text-xs text-violet-400 font-bold uppercase tracking-wider">Treino de hoje</Text>
          </View>
          <Text className="text-lg font-bold text-text-primary mb-1">Nenhum treino atribuido</Text>
          <Text className="text-sm text-text-muted leading-5">
            Peca ao seu personal para criar um plano de treino personalizado.
          </Text>
          <View className="h-1 bg-surface-border rounded-full mt-5">
            <View className="h-full bg-violet-500 rounded-full w-0" />
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row gap-3 mb-6">
          <StatCard value="0" label="Treinos esta semana" color="text-violet-400" />
          <StatCard value="0" label="Dias de streak" color="text-ice-400" />
        </View>

        {/* Quick Actions */}
        <Text className="text-xs font-bold text-text-muted mb-3 tracking-wider uppercase">Acoes rapidas</Text>
        <View className="flex-row gap-3 mb-8">
          <QuickAction icon="📏" label="Medidas" href="/(student)/(progress)/add-measurement" />
          <QuickAction icon="📸" label="Foto" href="/(student)/(progress)/add-photo" />
          <QuickAction icon="🏆" label="Desafios" href="/challenges" />
        </View>

        {/* Sign out */}
        <Pressable
          onPress={signOut}
          className="border border-surface-border rounded-2xl py-3.5 items-center mb-10 active:bg-surface-hover"
        >
          <Text className="text-text-muted font-bold text-sm">Sair da conta</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
