import { router } from "expo-router";
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

interface DraftQuestion {
  text: string;
  type: "text" | "number" | "scale" | "choice" | "boolean";
  options: string;
  required: boolean;
  weight: number;
}

const questionTypes = [
  { value: "text", label: "Texto", icon: "📝" },
  { value: "number", label: "Numero", icon: "🔢" },
  { value: "scale", label: "Escala 1-10", icon: "📊" },
  { value: "choice", label: "Multipla escolha", icon: "☑️" },
  { value: "boolean", label: "Sim/Nao", icon: "✅" },
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
          <Pressable onPress={() => router.back()}>
            <Text className="text-text-muted font-medium text-sm">← Cancelar</Text>
          </Pressable>
          <Text className="text-lg font-black text-text-primary">Novo Questionario</Text>
          <View className="w-16" />
        </View>

        <View className="gap-5">
          <View>
            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Titulo *</Text>
            <TextInput
              className="bg-surface-card border-2 border-surface-border rounded-2xl px-5 py-4 text-base text-text-primary"
              placeholder="Ex: Check-in semanal"
              placeholderTextColor="#6E6580"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View>
            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Descricao</Text>
            <TextInput
              className="bg-surface-card border-2 border-surface-border rounded-2xl px-5 py-4 text-base text-text-primary"
              placeholder="Instrucoes para o aluno"
              placeholderTextColor="#6E6580"
              value={description}
              onChangeText={setDescription}
              multiline
              style={{ minHeight: 60, textAlignVertical: "top" }}
            />
          </View>

          <View>
            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Frequencia</Text>
            <View className="flex-row gap-2">
              {frequencies.map((f) => (
                <Pressable
                  key={f.value}
                  onPress={() => setFrequency(f.value)}
                  className={`flex-1 py-2.5 rounded-xl border-2 items-center ${
                    frequency === f.value ? "bg-violet-500/10 border-violet-500" : "bg-surface-card border-surface-border"
                  }`}
                >
                  <Text className={`text-xs font-bold ${frequency === f.value ? "text-violet-400" : "text-text-muted"}`}>
                    {f.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Questions */}
          <View>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-xs font-bold text-text-muted tracking-wider uppercase">
                Perguntas ({questions.length})
              </Text>
              <Pressable onPress={addNewQuestion} className="bg-violet-500/10 px-3 py-1.5 rounded-lg">
                <Text className="text-violet-400 font-bold text-xs">+ Adicionar</Text>
              </Pressable>
            </View>

            <View className="gap-3">
              {questions.map((q, idx) => (
                <View key={idx} className="bg-surface-card border border-surface-border rounded-2xl p-4">
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-xs text-text-muted font-bold">Pergunta {idx + 1}</Text>
                    <Pressable onPress={() => removeQuestion(idx)}>
                      <Text className="text-danger-500 text-xs font-bold">Remover</Text>
                    </Pressable>
                  </View>

                  <TextInput
                    className="bg-dark-300 border border-surface-border rounded-xl px-4 py-3 text-sm text-text-primary mb-3"
                    placeholder="Texto da pergunta"
                    placeholderTextColor="#6E6580"
                    value={q.text}
                    onChangeText={(v) => updateQuestion(idx, "text", v)}
                  />

                  <View className="flex-row flex-wrap gap-1.5 mb-3">
                    {questionTypes.map((t) => (
                      <Pressable
                        key={t.value}
                        onPress={() => updateQuestion(idx, "type", t.value)}
                        className={`px-2.5 py-1.5 rounded-lg ${
                          q.type === t.value ? "bg-violet-500" : "bg-surface-elevated"
                        }`}
                      >
                        <Text className={`text-[10px] font-bold ${
                          q.type === t.value ? "text-white" : "text-text-muted"
                        }`}>
                          {t.icon} {t.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  {/* Weight selector */}
                  <View className="flex-row items-center gap-2 mb-3">
                    <Text className="text-[10px] text-text-muted font-bold">Peso:</Text>
                    {[1, 2, 3, 4, 5].map((w) => (
                      <Pressable
                        key={w}
                        onPress={() => updateQuestion(idx, "weight", w)}
                        className={`w-8 h-8 rounded-lg items-center justify-center ${
                          q.weight === w ? "bg-violet-500" : "bg-surface-elevated"
                        }`}
                      >
                        <Text className={`text-xs font-black ${q.weight === w ? "text-white" : "text-text-muted"}`}>{w}</Text>
                      </Pressable>
                    ))}
                  </View>

                  {q.type === "choice" ? (
                    <TextInput
                      className="bg-dark-300 border border-surface-border rounded-xl px-4 py-2.5 text-xs text-text-primary"
                      placeholder="Opcoes separadas por virgula: Otimo, Bom, Regular, Ruim"
                      placeholderTextColor="#6E6580"
                      value={q.options}
                      onChangeText={(v) => updateQuestion(idx, "options", v)}
                    />
                  ) : null}
                </View>
              ))}

              {questions.length === 0 ? (
                <Pressable
                  onPress={addNewQuestion}
                  className="border border-dashed border-surface-border rounded-2xl py-10 items-center"
                >
                  <Text className="text-2xl mb-2">📋</Text>
                  <Text className="text-text-muted text-sm">Adicione a primeira pergunta</Text>
                </Pressable>
              ) : null}
            </View>
          </View>

          <Pressable
            onPress={handleSave}
            disabled={saving || !title.trim() || questions.length === 0}
            className={`rounded-2xl items-center mt-4 mb-10 ${
              title.trim() && questions.length > 0 ? "bg-violet-500 active:bg-violet-600" : "bg-surface-border"
            }`}
            style={{ paddingVertical: 18 }}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className={`font-black text-base tracking-wide uppercase ${
                title.trim() && questions.length > 0 ? "text-white" : "text-text-muted"
              }`}>
                Salvar Questionario
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
