import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DisplayHeading } from "../../../components/ui/DisplayHeading";
import { SectionLabel } from "../../../components/ui/SectionLabel";
import { amethystGlow, font } from "../../../lib/design/tokens";
import { useAuth } from "../../../lib/auth/provider";
import { useCreateSubscriptionPlan } from "../../../hooks/mutations/useFinancialMutations";

const intervals = [
  { value: "monthly", label: "Mensal" },
  { value: "quarterly", label: "Trimestral" },
  { value: "yearly", label: "Anual" },
];

export default function CreatePlanScreen() {
  const { user } = useAuth();
  const createPlan = useCreateSubscriptionPlan();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [interval, setInterval] = useState("monthly");
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) { setError("Informe o nome do plano"); return; }
    if (!price.trim()) { setError("Informe o valor"); return; }
    if (!user) return;

    const priceCents = Math.round(parseFloat(price.replace(",", ".")) * 100);
    if (isNaN(priceCents) || priceCents <= 0) { setError("Valor invalido"); return; }

    setError("");
    try {
      await createPlan.mutateAsync({
        trainer_id: user.id,
        name: name.trim(),
        description: description.trim() || undefined,
        price_cents: priceCents,
        billing_interval: interval,
      });
      router.back();
    } catch (e) {
      setError("Nao foi possivel criar o plano. Tente novamente.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6" keyboardShouldPersistTaps="handled">
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()}>
            <Text className="text-text-muted text-sm" style={{ fontFamily: font.medium }}>← Cancelar</Text>
          </Pressable>
          <DisplayHeading size="sm">Novo plano.</DisplayHeading>
          <View className="w-16" />
        </View>

        {error ? (
          <View className="bg-danger-500/10 border border-danger-500/20 rounded-2xl p-4 mb-5">
            <Text className="text-danger-500 text-center text-sm" style={{ fontFamily: font.medium }}>{error}</Text>
          </View>
        ) : null}

        <View className="gap-5">
          <View>
            <SectionLabel className="mb-2 ml-1">Nome do plano *</SectionLabel>
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
              placeholder="Ex: Treino + Dieta Mensal"
              placeholderTextColor="#6E6382"
              value={name}
              onChangeText={setName}
              style={{ fontFamily: font.regular }}
            />
          </View>

          <View>
            <SectionLabel className="mb-2 ml-1">Descricao</SectionLabel>
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
              placeholder="O que esta incluso no plano"
              placeholderTextColor="#6E6382"
              value={description}
              onChangeText={setDescription}
              multiline
              style={{ minHeight: 80, textAlignVertical: "top", fontFamily: font.regular }}
            />
          </View>

          <View>
            <SectionLabel className="mb-2 ml-1">Valor (R$) *</SectionLabel>
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
              placeholder="199,90"
              placeholderTextColor="#6E6382"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
              style={{ fontFamily: font.regular }}
            />
          </View>

          <View>
            <SectionLabel className="mb-2 ml-1">Periodo de cobranca</SectionLabel>
            <View className="flex-row gap-2">
              {intervals.map((i) => (
                <Pressable
                  key={i.value}
                  onPress={() => setInterval(i.value)}
                  className={`flex-1 py-3 rounded-2xl border items-center ${
                    interval === i.value
                      ? "bg-violet-500/10 border-violet-400/80"
                      : "bg-surface-card/80 border-surface-border"
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      interval === i.value ? "text-violet-400" : "text-text-muted"
                    }`}
                    style={{ fontFamily: font.semibold }}
                  >
                    {i.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable
            onPress={handleCreate}
            disabled={createPlan.isPending}
            className="mt-4 mb-10 rounded-2xl overflow-hidden"
            style={amethystGlow}
          >
            <LinearGradient
              colors={createPlan.isPending ? ["#50107D", "#86169E"] : ["#781BB6", "#C636E0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0.9 }}
              style={{ paddingVertical: 18, alignItems: "center" }}
            >
              {createPlan.isPending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white text-base" style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}>
                  Criar plano
                </Text>
              )}
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
