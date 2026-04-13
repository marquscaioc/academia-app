import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../lib/auth/provider";
import { useCreateChallenge } from "../../hooks/mutations/useChallengeMutations";

const scoringModes = [
  { value: "days_active", label: "Dias ativos", desc: "1 ponto por dia que treinar" },
  { value: "check_in_count", label: "Check-ins", desc: "1 ponto por check-in" },
  { value: "total_volume", label: "Volume total", desc: "Pontos pelo volume de treino" },
  { value: "custom_points", label: "Pontos livres", desc: "Pontuacao manual" },
] as const;

export default function CreateChallengeScreen() {
  const { user } = useAuth();
  const createChallenge = useCreateChallenge();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scoringMode, setScoringMode] = useState<string>("days_active");
  const [durationDays, setDurationDays] = useState("30");
  const [requirePhoto, setRequirePhoto] = useState(true);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!title.trim()) {
      setError("Informe o titulo do desafio");
      return;
    }
    if (!user) return;

    setError("");
    const days = parseInt(durationDays) || 30;
    const startsAt = new Date();
    const endsAt = new Date(startsAt.getTime() + days * 24 * 60 * 60 * 1000);

    await createChallenge.mutateAsync({
      created_by: user.id,
      title: title.trim(),
      description: description.trim() || undefined,
      scoring_mode: scoringMode as "days_active" | "check_in_count" | "total_volume" | "custom_points",
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      require_photo_proof: requirePhoto,
    });

    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-6" keyboardShouldPersistTaps="handled">
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()}>
            <Text className="text-primary-600 font-medium">Cancelar</Text>
          </Pressable>
          <Text className="text-lg font-bold text-gray-900">Novo Desafio</Text>
          <View className="w-16" />
        </View>

        {error ? (
          <View className="bg-danger-500/10 rounded-xl p-4 mb-4">
            <Text className="text-danger-600 text-center">{error}</Text>
          </View>
        ) : null}

        <View className="gap-5">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">Titulo *</Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900 bg-gray-50"
              placeholder="Ex: Desafio 30 dias"
              placeholderTextColor="#9ca3af"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">Descricao</Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900 bg-gray-50"
              placeholder="Regras e detalhes do desafio"
              placeholderTextColor="#9ca3af"
              value={description}
              onChangeText={setDescription}
              multiline
              style={{ minHeight: 80, textAlignVertical: "top" }}
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">Duracao (dias)</Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900 bg-gray-50"
              placeholder="30"
              placeholderTextColor="#9ca3af"
              value={durationDays}
              onChangeText={setDurationDays}
              keyboardType="number-pad"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2 ml-1">Modo de pontuacao</Text>
            <View className="gap-2">
              {scoringModes.map((m) => (
                <Pressable
                  key={m.value}
                  onPress={() => setScoringMode(m.value)}
                  className={`border rounded-xl p-4 ${
                    scoringMode === m.value ? "border-primary-600 bg-primary-50" : "border-gray-200"
                  }`}
                >
                  <Text className={`text-sm font-semibold ${scoringMode === m.value ? "text-primary-700" : "text-gray-900"}`}>
                    {m.label}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-0.5">{m.desc}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable
            onPress={() => setRequirePhoto(!requirePhoto)}
            className="flex-row items-center justify-between py-3"
          >
            <View>
              <Text className="text-sm font-medium text-gray-700">Foto obrigatoria</Text>
              <Text className="text-xs text-gray-400">Participantes devem enviar foto no check-in</Text>
            </View>
            <View className={`w-12 h-7 rounded-full p-0.5 ${requirePhoto ? "bg-primary-600" : "bg-gray-300"}`}>
              <View className={`w-6 h-6 bg-white rounded-full shadow-sm ${requirePhoto ? "ml-auto" : ""}`} />
            </View>
          </Pressable>

          <Pressable
            onPress={handleCreate}
            disabled={createChallenge.isPending}
            className="bg-primary-600 rounded-xl py-4 items-center mt-2 mb-10 active:bg-primary-700"
          >
            {createChallenge.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-base">Criar Desafio</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
