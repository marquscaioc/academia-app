import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../lib/auth/provider";
import { useCreateInvite } from "../../../hooks/mutations/useInviteMutations";
import { DisplayHeading } from "../../../components/ui/DisplayHeading";
import { AppIcon } from "../../../components/ui";
import { amethystGlow, font } from "../../../lib/design/tokens";

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
          <Pressable
            onPress={() => router.back()}
            className="flex-row items-center gap-1.5 active:opacity-70"
          >
            <AppIcon name="arrow-left" size={18} color="#6E6382" strokeWidth={2} />
            <Text className="text-text-muted text-sm" style={{ fontFamily: font.medium }}>
              Voltar
            </Text>
          </Pressable>
          <DisplayHeading size="sm" className="text-text-primary">
            Convidar aluno
          </DisplayHeading>
          <View className="w-16" />
        </View>

        <View className="flex-1 items-center justify-center">
          {inviteCode ? (
            <View className="items-center">
              <View className="w-20 h-20 bg-violet-500/15 border border-violet-500/25 rounded-3xl items-center justify-center mb-6">
                <AppIcon name="qr" size={30} color="#9B40D8" strokeWidth={2} />
              </View>
              <Text
                className="text-sm text-text-secondary mb-4"
                style={{ fontFamily: font.regular }}
              >
                Compartilhe este codigo com seu aluno:
              </Text>
              <View className="bg-surface-card border border-violet-400/80 rounded-3xl px-10 py-8 mb-6 items-center">
                <Text
                  className="text-text-muted text-[11px] mb-3"
                  style={{ fontFamily: font.semibold, letterSpacing: 2 }}
                >
                  CODIGO DE CONVITE
                </Text>
                <Text
                  className="text-6xl text-fuchsia-300 tracking-[8px] text-center"
                  style={{ fontFamily: font.display }}
                >
                  {inviteCode}
                </Text>
              </View>
              <Text
                className="text-xs text-text-muted text-center max-w-[280px] leading-5"
                style={{ fontFamily: font.regular }}
              >
                O aluno deve inserir este codigo na tela inicial do app.{"\n"}
                Valido por 7 dias.
              </Text>

              <Pressable
                onPress={handleGenerate}
                className="flex-row items-center gap-2 border border-surface-border rounded-2xl px-6 py-3 mt-8 active:bg-surface-hover"
              >
                <AppIcon name="refresh" size={18} color="#A99FBA" strokeWidth={2} />
                <Text
                  className="text-text-secondary text-sm"
                  style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}
                >
                  Gerar novo codigo
                </Text>
              </Pressable>
            </View>
          ) : (
            <View className="items-center">
              <View className="w-20 h-20 bg-violet-500/15 border border-violet-500/25 rounded-3xl items-center justify-center mb-6">
                <AppIcon name="user-add" size={30} color="#9B40D8" strokeWidth={2} />
              </View>
              <DisplayHeading size="md" className="text-text-primary text-center mb-2">
                Adicionar aluno
              </DisplayHeading>
              <Text
                className="text-sm text-text-secondary text-center max-w-[300px] leading-5 mb-8"
                style={{ fontFamily: font.regular }}
              >
                Gere um codigo de convite para seu aluno se conectar a voce. Ao aceitar, ele tera acesso aos treinos e uma conversa sera criada automaticamente.
              </Text>

              <Pressable
                onPress={handleGenerate}
                disabled={createInvite.isPending}
                className="rounded-2xl overflow-hidden"
                style={amethystGlow}
              >
                <LinearGradient
                  colors={createInvite.isPending ? ["#50107D", "#86169E"] : ["#781BB6", "#C636E0"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0.9 }}
                  className="px-8 items-center justify-center"
                  style={{ paddingVertical: 18 }}
                >
                  {createInvite.isPending ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <View className="flex-row items-center gap-2">
                      <AppIcon name="qr" size={18} color="#FFFFFF" strokeWidth={2} />
                      <Text
                        className="text-white text-base"
                        style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}
                      >
                        Gerar codigo
                      </Text>
                    </View>
                  )}
                </LinearGradient>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
