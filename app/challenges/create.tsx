import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../lib/auth/provider";
import { useCreateChallenge } from "../../hooks/mutations/useChallengeMutations";
import { AppIcon } from "../../components/ui";
import { font, amethystGlow } from "../../lib/design/tokens";

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
          <Pressable onPress={() => router.back()} className="flex-row items-center gap-1.5">
            <AppIcon name="arrow-left" size={16} color="#6E6382" strokeWidth={2} />
            <Text className="text-text-muted text-sm" style={{ fontFamily: font.medium }}>Cancelar</Text>
          </Pressable>
          <Text className="text-2xl text-text-primary" style={{ fontFamily: font.display }}>Novo desafio.</Text>
          <View className="w-16" />
        </View>

        {error ? (
          <View className="bg-danger-500/10 border border-danger-500/20 rounded-2xl p-4 mb-4">
            <Text className="text-danger-500 text-center text-sm" style={{ fontFamily: font.medium }}>{error}</Text>
          </View>
        ) : null}

        <View className="gap-5">
          <View>
            <Text className="text-text-muted mb-2 ml-1 uppercase" style={{ fontFamily: font.semibold, fontSize: 11, letterSpacing: 2 }}>Titulo *</Text>
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
              placeholder="Ex: Desafio 30 dias"
              placeholderTextColor="#6E6382"
              value={title}
              onChangeText={setTitle}
              style={{ fontFamily: font.regular }}
            />
          </View>

          <View>
            <Text className="text-text-muted mb-2 ml-1 uppercase" style={{ fontFamily: font.semibold, fontSize: 11, letterSpacing: 2 }}>Descricao</Text>
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
              placeholder="Regras e detalhes do desafio"
              placeholderTextColor="#6E6382"
              value={description}
              onChangeText={setDescription}
              multiline
              style={{ minHeight: 80, textAlignVertical: "top", fontFamily: font.regular }}
            />
          </View>

          <View>
            <Text className="text-text-muted mb-2 ml-1 uppercase" style={{ fontFamily: font.semibold, fontSize: 11, letterSpacing: 2 }}>Duracao (dias)</Text>
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
              placeholder="30"
              placeholderTextColor="#6E6382"
              value={durationDays}
              onChangeText={setDurationDays}
              keyboardType="number-pad"
              style={{ fontFamily: font.regular }}
            />
          </View>

          <View>
            <Text className="text-text-muted mb-2 ml-1 uppercase" style={{ fontFamily: font.semibold, fontSize: 11, letterSpacing: 2 }}>Modo de pontuacao</Text>
            <View className="gap-2">
              {scoringModes.map((m) => (
                <Pressable
                  key={m.value}
                  onPress={() => setScoringMode(m.value)}
                  className={`flex-row items-center border rounded-2xl p-4 ${
                    scoringMode === m.value ? "border-violet-500 bg-violet-500/10" : "border-surface-border bg-surface-card"
                  }`}
                >
                  <View className="flex-1 mr-3">
                    <Text className={`text-sm ${scoringMode === m.value ? "text-violet-400" : "text-text-primary"}`} style={{ fontFamily: font.semibold }}>
                      {m.label}
                    </Text>
                    <Text className="text-xs text-text-muted mt-0.5" style={{ fontFamily: font.regular }}>{m.desc}</Text>
                  </View>
                  {scoringMode === m.value ? (
                    <AppIcon name="check-circle" size={20} color="#9B40D8" strokeWidth={2} />
                  ) : (
                    <View className="w-5 h-5 rounded-full border border-surface-border" />
                  )}
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
                <Text className="text-sm text-text-primary" style={{ fontFamily: font.semibold }}>{toggle.label}</Text>
                <Text className="text-xs text-text-muted mt-0.5" style={{ fontFamily: font.regular }}>{toggle.desc}</Text>
              </View>
              <View className={`w-12 h-7 rounded-full p-0.5 ${toggle.value ? "bg-violet-500" : "bg-surface-border"}`}>
                <View className={`w-6 h-6 bg-white rounded-full ${toggle.value ? "ml-auto" : ""}`} />
              </View>
            </Pressable>
          ))}

          <Pressable
            onPress={handleCreate}
            disabled={createChallenge.isPending}
            className="rounded-2xl overflow-hidden mt-4 mb-10"
            style={amethystGlow}
          >
            <LinearGradient
              colors={createChallenge.isPending ? ["#50107D", "#86169E"] : ["#781BB6", "#C636E0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0.9 }}
              style={{ paddingVertical: 18, alignItems: "center" }}
            >
              {createChallenge.isPending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <View className="flex-row items-center gap-2">
                  <AppIcon name="trophy" size={18} color="#FFFFFF" strokeWidth={2} />
                  <Text className="text-white text-base" style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}>Criar desafio</Text>
                </View>
              )}
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
