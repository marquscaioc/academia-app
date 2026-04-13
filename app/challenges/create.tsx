import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../lib/auth/provider";
import { useCreateChallenge } from "../../hooks/mutations/useChallengeMutations";

const scoringModes = [
  { value: "days_active", label: "Dias ativos", desc: "1 ponto por dia que treinar" },
  { value: "check_in_count", label: "Check-ins", desc: "1 ponto por check-in" },
  { value: "total_volume", label: "Volume total", desc: "Pontos pelo volume de treino (kg)" },
  { value: "workouts_completed", label: "Treinos completos", desc: "1 ponto por treino finalizado" },
  { value: "active_minutes", label: "Minutos ativos", desc: "Pontos por minuto de atividade" },
  { value: "custom_points", label: "Hustle Points", desc: "Tabela de pontos customizada" },
] as const;

export default function CreateChallengeScreen() {
  const { user } = useAuth();
  const createChallenge = useCreateChallenge();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scoringMode, setScoringMode] = useState<string>("days_active");
  const [durationDays, setDurationDays] = useState("30");
  const [requirePhoto, setRequirePhoto] = useState(true);
  const [teamMode, setTeamMode] = useState(false);
  const [poseVerification, setPoseVerification] = useState(false);
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
      scoring_mode: scoringMode as any,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      require_photo_proof: requirePhoto,
      team_mode: teamMode,
      pose_verification: poseVerification,
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
          <Text className="text-lg font-black text-text-primary">Novo Desafio</Text>
          <View className="w-16" />
        </View>

        {error ? (
          <View className="bg-danger-500/10 border border-danger-500/20 rounded-2xl p-4 mb-4">
            <Text className="text-danger-500 text-center text-sm font-medium">{error}</Text>
          </View>
        ) : null}

        <View className="gap-5">
          <View>
            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Titulo *</Text>
            <TextInput
              className="bg-surface-card border-2 border-surface-border rounded-2xl px-5 py-4 text-base text-text-primary"
              placeholder="Ex: Desafio 30 dias"
              placeholderTextColor="#6E6382"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View>
            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Descricao</Text>
            <TextInput
              className="bg-surface-card border-2 border-surface-border rounded-2xl px-5 py-4 text-base text-text-primary"
              placeholder="Regras e detalhes do desafio"
              placeholderTextColor="#6E6382"
              value={description}
              onChangeText={setDescription}
              multiline
              style={{ minHeight: 80, textAlignVertical: "top" }}
            />
          </View>

          <View>
            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Duracao (dias)</Text>
            <TextInput
              className="bg-surface-card border-2 border-surface-border rounded-2xl px-5 py-4 text-base text-text-primary"
              placeholder="30"
              placeholderTextColor="#6E6382"
              value={durationDays}
              onChangeText={setDurationDays}
              keyboardType="number-pad"
            />
          </View>

          <View>
            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Modo de pontuacao</Text>
            <View className="gap-2">
              {scoringModes.map((m) => (
                <Pressable
                  key={m.value}
                  onPress={() => setScoringMode(m.value)}
                  className={`border-2 rounded-2xl p-4 ${
                    scoringMode === m.value ? "border-violet-500 bg-violet-500/10" : "border-surface-border bg-surface-card"
                  }`}
                >
                  <Text className={`text-sm font-bold ${scoringMode === m.value ? "text-violet-400" : "text-text-primary"}`}>
                    {m.label}
                  </Text>
                  <Text className="text-xs text-text-muted mt-0.5">{m.desc}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Toggles */}
          {[
            { label: "Foto obrigatoria", desc: "Participantes devem enviar foto no check-in", value: requirePhoto, onToggle: () => setRequirePhoto(!requirePhoto) },
            { label: "Modo equipe", desc: "Participantes formam times", value: teamMode, onToggle: () => setTeamMode(!teamMode) },
            { label: "Anti-trapaca (pose)", desc: "Pose do dia obrigatoria na foto", value: poseVerification, onToggle: () => setPoseVerification(!poseVerification) },
          ].map((toggle) => (
            <Pressable
              key={toggle.label}
              onPress={toggle.onToggle}
              className="flex-row items-center justify-between py-3"
            >
              <View className="flex-1 mr-4">
                <Text className="text-sm font-bold text-text-primary">{toggle.label}</Text>
                <Text className="text-xs text-text-muted mt-0.5">{toggle.desc}</Text>
              </View>
              <View className={`w-12 h-7 rounded-full p-0.5 ${toggle.value ? "bg-violet-500" : "bg-surface-border"}`}>
                <View className={`w-6 h-6 bg-white rounded-full ${toggle.value ? "ml-auto" : ""}`} />
              </View>
            </Pressable>
          ))}

          <Pressable
            onPress={handleCreate}
            disabled={createChallenge.isPending}
            className={`rounded-2xl items-center mt-4 mb-10 ${
              createChallenge.isPending ? "bg-violet-700" : "bg-violet-500 active:bg-violet-600"
            }`}
            style={{ paddingVertical: 18 }}
          >
            {createChallenge.isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white font-black text-base tracking-wide uppercase">Criar Desafio</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
