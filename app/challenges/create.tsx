import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../lib/auth/provider";
import { useCreateChallenge } from "../../hooks/mutations/useChallengeMutations";
import { AppIcon } from "../../components/ui";
import { WebContainer } from "../../components/layout/WebContainer";
import { font, surfaceShadow } from "../../lib/design/tokens";
import { normalizeInstagramLink } from "../../lib/utils/instagram";

const scoringModes = [
  { value: "days_active", label: "Dias ativos", desc: "1 ponto por dia que treinar" },
  { value: "check_in_count", label: "Check-ins", desc: "1 ponto por check-in" },
  { value: "total_volume", label: "Volume total", desc: "Pontos pelo volume de treino (kg)" },
  { value: "workouts_completed", label: "Treinos completos", desc: "1 ponto por treino finalizado" },
  { value: "active_minutes", label: "Minutos ativos", desc: "Pontos por minuto de atividade" },
  { value: "custom_points", label: "Hustle Points", desc: "Tabela de pontos customizada" },
] as const;

// Ready-made 30-day challenge. Scores habits the app can verify (finished workouts), never body results.
const PRESET_30_DAYS = {
  title: "Desafio 30 dias",
  description: "30 dias de treino e hábitos. Cada treino finalizado no app vale 1 ponto. Acompanhe o ranking e as novidades no nosso Instagram.",
  scoringMode: "workouts_completed",
  durationDays: "30",
};

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
  const [instagram, setInstagram] = useState("");
  const [error, setError] = useState("");

  const applyPreset = () => {
    setTitle(PRESET_30_DAYS.title);
    setDescription(PRESET_30_DAYS.description);
    setScoringMode(PRESET_30_DAYS.scoringMode);
    setDurationDays(PRESET_30_DAYS.durationDays);
    setError("");
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      setError("Informe o título do desafio");
      return;
    }
    if (!user) return;
    const link = normalizeInstagramLink(instagram);
    if ("error" in link) {
      setError(link.error);
      return;
    }

    setError("");
    const days = parseInt(durationDays) || 30;
    const startsAt = new Date();
    const endsAt = new Date(startsAt.getTime() + days * 24 * 60 * 60 * 1000);

    let createdId: string;
    try {
      const created = await createChallenge.mutateAsync({
        created_by: user.id,
      title: title.trim(),
      description: description.trim() || undefined,
      scoring_mode: scoringMode as any,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      require_photo_proof: requirePhoto,
      team_mode: teamMode,
        pose_verification: poseVerification,
        instagram_url: link.url,
      });
      createdId = created.id;
    } catch {
      setError("Não foi possível criar o desafio. Verifique os dados e tente novamente.");
      return;
    }

    // Open the new challenge (works also when this screen was opened directly by URL, with no history).
    router.replace(`/challenges/${createdId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6" keyboardShouldPersistTaps="handled">
        <WebContainer maxWidth={640}>
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()} className="flex-row items-center gap-1.5">
            <AppIcon name="arrow-left" size={16} color="#71717A" strokeWidth={2} />
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
          <Pressable
            onPress={applyPreset}
            accessibilityRole="button"
            className="flex-row items-center border border-violet-500/40 bg-violet-500/10 rounded-2xl p-4"
          >
            <AppIcon name="calendar-check" size={20} color="#3F3F46" strokeWidth={2} />
            <View className="flex-1 ml-3">
              <Text className="text-sm text-violet-400" style={{ fontFamily: font.semibold }}>Usar modelo “Desafio 30 dias”</Text>
              <Text className="text-xs text-text-muted mt-0.5" style={{ fontFamily: font.regular }}>Preenche título, regras, 30 dias e 1 ponto por treino finalizado</Text>
            </View>
          </Pressable>

          <View>
            <Text className="text-text-muted mb-2 ml-1 uppercase" style={{ fontFamily: font.semibold, fontSize: 11, letterSpacing: 2 }}>Título *</Text>
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
              placeholder="Ex: Desafio 30 dias"
              placeholderTextColor="#71717A"
              value={title}
              onChangeText={setTitle}
              style={{ fontFamily: font.regular }}
            />
          </View>

          <View>
            <Text className="text-text-muted mb-2 ml-1 uppercase" style={{ fontFamily: font.semibold, fontSize: 11, letterSpacing: 2 }}>Descrição</Text>
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
              placeholder="Regras e detalhes do desafio"
              placeholderTextColor="#71717A"
              value={description}
              onChangeText={setDescription}
              multiline
              style={{ minHeight: 80, textAlignVertical: "top", fontFamily: font.regular }}
            />
          </View>

          <View>
            <Text className="text-text-muted mb-2 ml-1 uppercase" style={{ fontFamily: font.semibold, fontSize: 11, letterSpacing: 2 }}>Instagram do desafio</Text>
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
              placeholder="@seuperfil ou link do post"
              placeholderTextColor="#71717A"
              value={instagram}
              onChangeText={setInstagram}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              accessibilityLabel="Instagram do desafio"
              style={{ fontFamily: font.regular }}
            />
            <Text className="text-xs text-text-muted mt-1.5 ml-1" style={{ fontFamily: font.regular }}>Opcional. Aparece como botão “Ver no Instagram” para os participantes.</Text>
          </View>

          <View>
            <Text className="text-text-muted mb-2 ml-1 uppercase" style={{ fontFamily: font.semibold, fontSize: 11, letterSpacing: 2 }}>Duração (dias)</Text>
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
              placeholder="30"
              placeholderTextColor="#71717A"
              value={durationDays}
              onChangeText={setDurationDays}
              keyboardType="number-pad"
              style={{ fontFamily: font.regular }}
            />
          </View>

          <View>
            <Text className="text-text-muted mb-2 ml-1 uppercase" style={{ fontFamily: font.semibold, fontSize: 11, letterSpacing: 2 }}>Modo de pontuação</Text>
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
                    <AppIcon name="check-circle" size={20} color="#3F3F46" strokeWidth={2} />
                  ) : (
                    <View className="w-5 h-5 rounded-full border border-surface-border" />
                  )}
                </Pressable>
              ))}
            </View>
          </View>

          {/* Toggles */}
          {[
            { label: "Foto obrigatória", desc: "Participantes devem enviar foto no check-in", value: requirePhoto, onToggle: () => setRequirePhoto(!requirePhoto) },
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
            style={surfaceShadow}
          >
            <LinearGradient
              colors={createChallenge.isPending ? ["#18181B", "#3F3F46"] : ["#27272A", "#27272A"]}
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
        </WebContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
