import { AuthShell } from "../../components/layout/AuthShell";
import { Button } from "../../components/ui/Button";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import Animated, { FadeInDown } from "react-native-reanimated";
import { supabase } from "../../lib/supabase/client";
import { useAuth } from "../../lib/auth/provider";
import { DisplayHeading, SectionLabel, AppIcon, type IconName } from "../../components/ui";
import { font, surfaceShadow } from "../../lib/design/tokens";

type Role = "student" | "trainer";

const roles: { value: Role; icon: IconName; label: string; description: string; features: string[] }[] = [
  {
    value: "student",
    icon: "workout",
    label: "Aluno",
    description: "Acompanhe treinos, dieta e evolução",
    features: ["Treinos prescritos", "Dieta personalizada", "Acompanhamento de progresso", "Desafios e comunidade"],
  },
  {
    value: "trainer",
    icon: "clipboard",
    label: "Personal Trainer",
    description: "Gerencie alunos, prescreva treinos e dietas",
    features: ["Gestão de alunos", "Planejamento de treinos", "Acompanhamento de progresso", "Gestão financeira"],
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
    <AuthShell>



        <Animated.View entering={FadeInDown.delay(80).springify()} className="mb-10">
          <SectionLabel tone="accent" className="mb-3">
            PERSONALIZE SUA EXPERIÊNCIA
          </SectionLabel>
          <DisplayHeading size="md">Como você vai usar a plataforma?</DisplayHeading>
          <Text className="text-sm text-text-muted mt-4 leading-6" style={{ fontFamily: font.regular }}>
            Selecione o perfil que combina com sua rotina para começar.
          </Text>
        </Animated.View>

        {error ? (
          <View className="bg-danger-500/10 border border-danger-500/20 rounded-2xl p-4 mb-4">
            <Text className="text-danger-500 text-center text-sm font-medium">{error}</Text>
          </View>
        ) : null}

        <View>
          {roles.map((role, idx) => {
            const isSelected = selectedRole === role.value;
            const otherSelected = selectedRole !== null && !isSelected;
            return (
              <View key={role.value}>
                <Pressable
                  onPress={() => setSelectedRole(role.value)}
                  style={isSelected ? surfaceShadow : undefined}
                  className={`rounded-3xl p-6 border ${
                    isSelected
                      ? "bg-surface-elevated border-violet-400/80"
                      : otherSelected
                        ? "bg-surface-card border-surface-border opacity-40"
                        : "bg-surface-card border-surface-border active:border-surface-hover"
                  }`}
                >
                  <View className="flex-row items-center gap-4 mb-4">
                    <View className={`w-14 h-14 rounded-2xl items-center justify-center border ${
                      isSelected ? "bg-violet-500/20 border-violet-500/30" : "bg-surface-elevated border-surface-border"
                    }`}>
                      <AppIcon name={role.icon} size={24} color={isSelected ? "#3F3F46" : "#52525B"} strokeWidth={2} />
                    </View>
                    <View className="flex-1">
                      <Text
                        className={isSelected ? "text-violet-300" : "text-text-primary"}
                        style={{ fontFamily: font.bold, fontSize: 20, letterSpacing: -0.3 }}
                      >
                        {role.label}
                      </Text>
                      <Text
                        className="text-xs text-text-muted mt-1"
                        style={{ fontFamily: font.regular }}
                      >
                        {role.description}
                      </Text>
                    </View>
                    <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                      isSelected ? "border-violet-500 bg-violet-500" : "border-surface-border"
                    }`}>
                      {isSelected ? (
                        <AppIcon name="check" size={14} color="#FFFFFF" strokeWidth={3} />
                      ) : null}
                    </View>
                  </View>

                  <View className="flex-row flex-wrap gap-2">
                    {role.features.map((f) => (
                      <View key={f} className={`px-3 py-1.5 rounded-full ${
                        isSelected ? "bg-violet-500/10" : "bg-dark-300"
                      }`}>
                        <Text
                          className={isSelected ? "text-violet-300" : "text-text-muted"}
                          style={{ fontFamily: font.medium, fontSize: 11 }}
                        >
                          {f}
                        </Text>
                      </View>
                    ))}
                  </View>
                </Pressable>

                {idx === 0 ? (
                  <View className="flex-row items-center my-4">
                    <View className="flex-1 h-px bg-surface-border" />
                    <View className="mx-4 w-10 h-10 rounded-full bg-dark-300 border border-surface-border items-center justify-center">
                      <Text
                        className="text-text-muted"
                        style={{ fontFamily: font.bold, fontSize: 12, letterSpacing: 1 }}
                      >
                        OU
                      </Text>
                    </View>
                    <View className="flex-1 h-px bg-surface-border" />
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>

        <View className="mt-6"><Button title="Continuar" onPress={handleContinue} loading={loading} disabled={!selectedRole} size="lg" /></View>

    </AuthShell>
  );
}
