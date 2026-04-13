import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
    await createPlan.mutateAsync({
      trainer_id: user.id,
      name: name.trim(),
      description: description.trim() || undefined,
      price_cents: priceCents,
      billing_interval: interval,
    });
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6" keyboardShouldPersistTaps="handled">
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()}>
            <Text className="text-text-muted font-medium text-sm">← Cancelar</Text>
          </Pressable>
          <Text className="text-lg font-black text-text-primary">Novo Plano</Text>
          <View className="w-16" />
        </View>

        {error ? (
          <View className="bg-danger-500/10 border border-danger-500/20 rounded-2xl p-4 mb-5">
            <Text className="text-danger-500 text-center text-sm font-medium">{error}</Text>
          </View>
        ) : null}

        <View className="gap-5">
          <View>
            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Nome do plano *</Text>
            <TextInput
              className="bg-surface-card border-2 border-surface-border rounded-2xl px-5 py-4 text-base text-text-primary"
              placeholder="Ex: Treino + Dieta Mensal"
              placeholderTextColor="#6B6B73"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View>
            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Descricao</Text>
            <TextInput
              className="bg-surface-card border-2 border-surface-border rounded-2xl px-5 py-4 text-base text-text-primary"
              placeholder="O que esta incluso no plano"
              placeholderTextColor="#6B6B73"
              value={description}
              onChangeText={setDescription}
              multiline
              style={{ minHeight: 80, textAlignVertical: "top" }}
            />
          </View>

          <View>
            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Valor (R$) *</Text>
            <TextInput
              className="bg-surface-card border-2 border-surface-border rounded-2xl px-5 py-4 text-base text-text-primary"
              placeholder="199,90"
              placeholderTextColor="#6B6B73"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />
          </View>

          <View>
            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Periodo de cobranca</Text>
            <View className="flex-row gap-2">
              {intervals.map((i) => (
                <Pressable
                  key={i.value}
                  onPress={() => setInterval(i.value)}
                  className={`flex-1 py-3 rounded-xl border-2 items-center ${
                    interval === i.value
                      ? "bg-violet-500/10 border-violet-500"
                      : "bg-surface-card border-surface-border"
                  }`}
                >
                  <Text className={`text-sm font-bold ${
                    interval === i.value ? "text-violet-400" : "text-text-muted"
                  }`}>
                    {i.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable
            onPress={handleCreate}
            disabled={createPlan.isPending}
            className={`rounded-2xl items-center mt-4 mb-10 ${
              createPlan.isPending ? "bg-violet-700" : "bg-violet-500 active:bg-violet-600"
            }`}
            style={{ paddingVertical: 18 }}
          >
            {createPlan.isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white font-black text-base tracking-wide uppercase">
                Criar Plano
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
