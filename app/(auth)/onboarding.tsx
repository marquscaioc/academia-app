import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { supabase } from "../../lib/supabase/client";
import { useAuth } from "../../lib/auth/provider";
import { Logo } from "../../components/ui";

type Role = "student" | "trainer";

const roles: { value: Role; icon: string; label: string; description: string; features: string[] }[] = [
  {
    value: "student",
    icon: "💪",
    label: "Aluno",
    description: "Acompanhe treinos, dieta e evolucao",
    features: ["Treinos prescritos", "Dieta personalizada", "Acompanhamento de progresso", "Desafios e competicoes"],
  },
  {
    value: "trainer",
    icon: "📋",
    label: "Personal Trainer",
    description: "Gerencie alunos, prescreva treinos e dietas",
    features: ["Gestao de alunos", "Builder de treinos", "Acompanhamento de progresso", "Dashboard financeiro"],
  },
];

export default function OnboardingScreen() {
  const { user, refreshProfile } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleContinue = async () => {
    if (!selectedRole || !user) return;
    setError("");
    setLoading(true);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ role: selectedRole, onboarding_completed: true })
      .eq("id", user.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    // Create trainer_profiles record if trainer
    if (selectedRole === "trainer") {
      await supabase.from("trainer_profiles").upsert({ id: user.id });
    }

    await refreshProfile();
    setLoading(false);
    router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <LinearGradient
        colors={["rgba(120,27,182,0.28)", "transparent"]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 420 }}
        pointerEvents="none"
      />
      <View className="flex-1 justify-center px-8 max-w-[500px] w-full self-center">
        <Animated.View entering={FadeIn.duration(400)} className="items-center mb-6">
          <Logo size="lg" />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(80).springify()} className="mb-10">
          <Text
            className="text-fuchsia-400 mb-3"
            style={{ fontFamily: "DMSans_700Bold", fontSize: 10, letterSpacing: 3 }}
          >
            PASSO FINAL · ONBOARDING
          </Text>
          <Text
            className="text-text-muted"
            style={{ fontFamily: "InstrumentSerif_400Regular_Italic", fontSize: 26, letterSpacing: -0.5 }}
          >
            Como você vai
          </Text>
          <Text
            className="text-text-primary mt-1"
            style={{
              fontFamily: "ArchivoBlack_400Regular",
              fontSize: 40,
              lineHeight: 40,
              letterSpacing: -2,
            }}
          >
            USAR O APP?
          </Text>
          <Text className="text-sm text-text-muted mt-4" style={{ fontFamily: "DMSans_400Regular" }}>
            Escolha seu perfil para personalizar a experiência.
          </Text>
        </Animated.View>

        {error ? (
          <View className="bg-danger-500/10 border border-danger-500/20 rounded-2xl p-4 mb-4">
            <Text className="text-danger-500 text-center text-sm font-medium">{error}</Text>
          </View>
        ) : null}

        <View className="gap-4">
          {roles.map((role) => {
            const isSelected = selectedRole === role.value;
            return (
              <Pressable
                key={role.value}
                onPress={() => setSelectedRole(role.value)}
                className={`rounded-3xl p-6 border-2 ${
                  isSelected
                    ? "bg-surface-elevated border-violet-500"
                    : "bg-surface-card border-surface-border active:border-surface-hover"
                }`}
              >
                <View className="flex-row items-center gap-4 mb-4">
                  <View className={`w-14 h-14 rounded-2xl items-center justify-center ${
                    isSelected ? "bg-violet-500/20" : "bg-surface-elevated"
                  }`}>
                    <Text className="text-2xl">{role.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className={`text-xl font-black ${
                      isSelected ? "text-violet-300" : "text-text-primary"
                    }`}>
                      {role.label}
                    </Text>
                    <Text className="text-xs text-text-muted mt-0.5">
                      {role.description}
                    </Text>
                  </View>
                  <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                    isSelected ? "border-violet-500 bg-violet-500" : "border-surface-border"
                  }`}>
                    {isSelected ? (
                      <Text className="text-white text-xs font-black">✓</Text>
                    ) : null}
                  </View>
                </View>

                <View className="flex-row flex-wrap gap-2">
                  {role.features.map((f) => (
                    <View key={f} className={`px-3 py-1.5 rounded-full ${
                      isSelected ? "bg-violet-500/10" : "bg-dark-300"
                    }`}>
                      <Text className={`text-xs font-medium ${
                        isSelected ? "text-violet-300" : "text-text-muted"
                      }`}>
                        {f}
                      </Text>
                    </View>
                  ))}
                </View>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={handleContinue}
          disabled={!selectedRole || loading}
          className="rounded-2xl overflow-hidden mt-8"
        >
          {selectedRole ? (
            <LinearGradient
              colors={loading ? ["#50107D", "#86169E"] : ["#781BB6", "#C636E0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ paddingVertical: 18, alignItems: "center" }}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text
                  className="text-white text-base"
                  style={{ fontFamily: "DMSans_700Bold", letterSpacing: 2 }}
                >
                  CONTINUAR →
                </Text>
              )}
            </LinearGradient>
          ) : (
            <View className="bg-surface-border items-center" style={{ paddingVertical: 18 }}>
              <Text
                className="text-text-muted text-base"
                style={{ fontFamily: "DMSans_700Bold", letterSpacing: 2 }}
              >
                SELECIONE UM PERFIL
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
