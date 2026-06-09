import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../lib/auth/provider";
import { useCreateTemplate, useAddQuestion } from "../../../hooks/mutations/useCheckinMutations";
import { AppIcon } from "../../../components/ui";
import { DisplayHeading } from "../../../components/ui/DisplayHeading";
import { SectionLabel } from "../../../components/ui/SectionLabel";
import { amethystGlow, font } from "../../../lib/design/tokens";

interface DraftQuestion {
  text: string;
  type: "text" | "number" | "scale" | "choice" | "boolean";
  options: string;
  required: boolean;
  weight: number;
}

const questionTypes = [
  { value: "text", label: "Texto", icon: "notebook" },
  { value: "number", label: "Numero", icon: "gauge" },
  { value: "scale", label: "Escala 1-10", icon: "scale" },
  { value: "choice", label: "Multipla escolha", icon: "list" },
  { value: "boolean", label: "Sim/Nao", icon: "check-circle" },
] as const;

export default function CheckinBuilderScreen() {
  const { user } = useAuth();
  const createTemplate = useCreateTemplate();
  const addQuestion = useAddQuestion();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("weekly");
  const [questions, setQuestions] = useState<DraftQuestion[]>([]);
  const [saving, setSaving] = useState(false);

  const addNewQuestion = () => {
    setQuestions([...questions, { text: "", type: "text", options: "", required: true, weight: 1 }]);
  };

  const updateQuestion = (idx: number, field: keyof DraftQuestion, value: unknown) => {
    const updated = [...questions];
    updated[idx] = { ...updated[idx], [field]: value };
    setQuestions(updated);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!user || !title.trim() || questions.length === 0) return;
    setSaving(true);

    const template = await createTemplate.mutateAsync({
      created_by: user.id,
      title: title.trim(),
      description: description.trim() || undefined,
      frequency,
    });

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      await addQuestion.mutateAsync({
        template_id: template.id,
        question_text: q.text,
        question_type: q.type,
        options: q.type === "choice" && q.options
          ? q.options.split(",").map((o) => o.trim())
          : undefined,
        is_required: q.required,
        sort_order: i,
        weight: q.weight,
      });
    }

    setSaving(false);
    router.back();
  };

  const frequencies = [
    { value: "daily", label: "Diario" },
    { value: "weekly", label: "Semanal" },
    { value: "biweekly", label: "Quinzenal" },
    { value: "monthly", label: "Mensal" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6" keyboardShouldPersistTaps="handled">
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()} className="flex-row items-center gap-1.5">
            <AppIcon name="arrow-left" size={18} color="#6E6382" strokeWidth={2} />
            <Text className="text-text-muted text-sm" style={{ fontFamily: font.medium }}>Cancelar</Text>
          </Pressable>
          <DisplayHeading size="sm">Novo questionário.</DisplayHeading>
          <View className="w-16" />
        </View>

        <View className="gap-5">
          <View>
            <SectionLabel className="mb-2 ml-1">Titulo *</SectionLabel>
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
              placeholder="Ex: Check-in semanal"
              placeholderTextColor="#6E6382"
              value={title}
              onChangeText={setTitle}
              style={{ fontFamily: font.regular }}
            />
          </View>

          <View>
            <SectionLabel className="mb-2 ml-1">Descricao</SectionLabel>
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
              placeholder="Instrucoes para o aluno"
              placeholderTextColor="#6E6382"
              value={description}
              onChangeText={setDescription}
              multiline
              style={{ minHeight: 60, textAlignVertical: "top", fontFamily: font.regular }}
            />
          </View>

          <View>
            <SectionLabel className="mb-2 ml-1">Frequencia</SectionLabel>
            <View className="flex-row gap-2">
              {frequencies.map((f) => (
                <Pressable
                  key={f.value}
                  onPress={() => setFrequency(f.value)}
                  className={`flex-1 py-2.5 rounded-xl border items-center ${
                    frequency === f.value ? "bg-violet-500/10 border-violet-500" : "bg-surface-card border-surface-border"
                  }`}
                >
                  <Text
                    className={`text-xs ${frequency === f.value ? "text-violet-400" : "text-text-muted"}`}
                    style={{ fontFamily: font.semibold }}
                  >
                    {f.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Questions */}
          <View>
            <View className="flex-row items-center justify-between mb-3">
              <SectionLabel>Perguntas ({questions.length})</SectionLabel>
              <Pressable onPress={addNewQuestion} className="flex-row items-center gap-1.5 bg-violet-500/10 px-3 py-1.5 rounded-lg">
                <AppIcon name="plus" size={14} color="#9B40D8" strokeWidth={2} />
                <Text className="text-violet-400 text-xs" style={{ fontFamily: font.semibold }}>Adicionar</Text>
              </Pressable>
            </View>

            <View className="gap-3">
              {questions.map((q, idx) => (
                <View key={idx} className="bg-surface-card border border-surface-border rounded-3xl p-4">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-2">
                      <View className="w-7 h-7 rounded-xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
                        <Text className="text-[11px] text-violet-300" style={{ fontFamily: font.bold }}>{idx + 1}</Text>
                      </View>
                      <Text className="text-xs text-text-muted" style={{ fontFamily: font.semibold }}>Pergunta {idx + 1}</Text>
                    </View>
                    <Pressable onPress={() => removeQuestion(idx)} className="flex-row items-center gap-1">
                      <AppIcon name="trash" size={14} color="#FB7185" strokeWidth={2} />
                      <Text className="text-danger-500 text-xs" style={{ fontFamily: font.semibold }}>Remover</Text>
                    </Pressable>
                  </View>

                  <TextInput
                    className="bg-dark-300 border border-surface-border rounded-2xl px-4 py-3 text-sm text-text-primary mb-3"
                    placeholder="Texto da pergunta"
                    placeholderTextColor="#6E6382"
                    value={q.text}
                    onChangeText={(v) => updateQuestion(idx, "text", v)}
                    style={{ fontFamily: font.regular }}
                  />

                  <View className="flex-row flex-wrap gap-1.5 mb-3">
                    {questionTypes.map((t) => (
                      <Pressable
                        key={t.value}
                        onPress={() => updateQuestion(idx, "type", t.value)}
                        className={`flex-row items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${
                          q.type === t.value ? "bg-violet-500" : "bg-surface-elevated"
                        }`}
                      >
                        <AppIcon
                          name={t.icon}
                          size={14}
                          color={q.type === t.value ? "#FFFFFF" : "#A99FBA"}
                          strokeWidth={2}
                        />
                        <Text
                          className={`text-[10px] ${q.type === t.value ? "text-white" : "text-text-muted"}`}
                          style={{ fontFamily: font.semibold }}
                        >
                          {t.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  {/* Weight selector */}
                  <View className="flex-row items-center gap-2 mb-3">
                    <Text className="text-[10px] text-text-muted" style={{ fontFamily: font.semibold }}>Peso:</Text>
                    {[1, 2, 3, 4, 5].map((w) => (
                      <Pressable
                        key={w}
                        onPress={() => updateQuestion(idx, "weight", w)}
                        className={`w-8 h-8 rounded-lg items-center justify-center ${
                          q.weight === w ? "bg-violet-500" : "bg-surface-elevated"
                        }`}
                      >
                        <Text className={`text-xs ${q.weight === w ? "text-white" : "text-text-muted"}`} style={{ fontFamily: font.bold }}>{w}</Text>
                      </Pressable>
                    ))}
                  </View>

                  {q.type === "choice" ? (
                    <TextInput
                      className="bg-dark-300 border border-surface-border rounded-2xl px-4 py-2.5 text-xs text-text-primary"
                      placeholder="Opcoes separadas por virgula: Otimo, Bom, Regular, Ruim"
                      placeholderTextColor="#6E6382"
                      value={q.options}
                      onChangeText={(v) => updateQuestion(idx, "options", v)}
                      style={{ fontFamily: font.regular }}
                    />
                  ) : null}
                </View>
              ))}

              {questions.length === 0 ? (
                <Pressable
                  onPress={addNewQuestion}
                  className="border border-dashed border-surface-border rounded-3xl py-10 items-center"
                >
                  <View className="w-16 h-16 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center mb-3">
                    <AppIcon name="clipboard" size={28} color="#9B40D8" strokeWidth={2} />
                  </View>
                  <Text className="text-text-muted text-sm" style={{ fontFamily: font.regular }}>Adicione a primeira pergunta</Text>
                </Pressable>
              ) : null}
            </View>
          </View>

          <Pressable
            onPress={handleSave}
            disabled={saving || !title.trim() || questions.length === 0}
            className="rounded-2xl overflow-hidden mt-4 mb-10"
            style={title.trim() && questions.length > 0 ? amethystGlow : undefined}
          >
            <LinearGradient
              colors={
                title.trim() && questions.length > 0
                  ? ["#781BB6", "#C636E0"]
                  : ["#2E2740", "#2E2740"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0.9 }}
              style={{ paddingVertical: 18, alignItems: "center" }}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text
                  className={title.trim() && questions.length > 0 ? "text-white text-base" : "text-text-muted text-base"}
                  style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}
                >
                  Salvar questionário
                </Text>
              )}
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
