import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../lib/auth/provider";
import { useCreateInvite } from "../../../hooks/mutations/useInviteMutations";

export default function InviteScreen() {
  const { user } = useAuth();
  const createInvite = useCreateInvite();
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!user) return;
    const invite = await createInvite.mutateAsync(user.id);
    setInviteCode(invite.code);
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1 px-6 pt-6">
        <View className="flex-row items-center justify-between mb-8">
          <Pressable onPress={() => router.back()}>
            <Text className="text-text-muted font-medium text-sm">← Voltar</Text>
          </Pressable>
          <Text className="text-lg font-black text-text-primary">Convidar Aluno</Text>
          <View className="w-16" />
        </View>

        <View className="flex-1 items-center justify-center">
          {inviteCode ? (
            <View className="items-center">
              <View className="w-20 h-20 bg-violet-500/20 rounded-3xl items-center justify-center mb-6">
                <Text className="text-4xl">🎟️</Text>
              </View>
              <Text className="text-sm text-text-muted mb-4">
                Compartilhe este codigo com seu aluno:
              </Text>
              <View className="bg-surface-card border-2 border-violet-500 rounded-3xl px-10 py-8 mb-6">
                <Text className="text-5xl font-black text-violet-400 tracking-[8px] text-center">
                  {inviteCode}
                </Text>
              </View>
              <Text className="text-xs text-text-muted text-center max-w-[280px] leading-5">
                O aluno deve inserir este codigo na tela inicial do app.{"\n"}
                Valido por 7 dias.
              </Text>

              <Pressable
                onPress={handleGenerate}
                className="border border-surface-border rounded-2xl px-6 py-3 mt-8 active:bg-surface-hover"
              >
                <Text className="text-text-secondary font-bold text-sm">Gerar novo codigo</Text>
              </Pressable>
            </View>
          ) : (
            <View className="items-center">
              <View className="w-20 h-20 bg-surface-card border border-surface-border rounded-3xl items-center justify-center mb-6">
                <Text className="text-4xl">👥</Text>
              </View>
              <Text className="text-lg font-bold text-text-primary text-center mb-2">
                Adicionar aluno
              </Text>
              <Text className="text-sm text-text-muted text-center max-w-[300px] leading-5 mb-8">
                Gere um codigo de convite para seu aluno se conectar a voce. Ao aceitar, ele tera acesso aos treinos e uma conversa sera criada automaticamente.
              </Text>

              <Pressable
                onPress={handleGenerate}
                disabled={createInvite.isPending}
                className={`rounded-2xl px-8 items-center ${
                  createInvite.isPending ? "bg-violet-700" : "bg-violet-500 active:bg-violet-600"
                }`}
                style={{ paddingVertical: 18 }}
              >
                {createInvite.isPending ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-black text-base tracking-wide uppercase">
                    Gerar codigo
                  </Text>
                )}
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
