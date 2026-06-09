import { useLocalSearchParams, router } from "expo-router";
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
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../../lib/auth/provider";
import { supabase } from "../../../../lib/supabase/client";
import { useSubmitCheckIn } from "../../../../hooks/mutations/useCheckinMutations";
import { LoadingScreen } from "../../../../components/ui/LoadingScreen";
import { AppIcon } from "../../../../components/ui";
import { font, amethystGlow } from "../../../../lib/design/tokens";
import { LinearGradient } from "expo-linear-gradient";

export default function CheckInResponseScreen() {
  const { checkInId } = useLocalSearchParams<{ checkInId: string }>();
  const { user } = useAuth();
  const submitCheckIn = useSubmitCheckIn();
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [justifications, setJustifications] = useState<Record<string, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);

  const { data: checkIn } = useQuery({
    queryKey: ["checkin-detail", checkInId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("check_ins")
        .select("*, template:questionnaire_templates(*, questions:questionnaire_questions(*))")
        .eq("id", checkInId!)
        .single();
      if (error) throw error;
      if (data.template?.questions) {
        data.template.questions.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order);
      }
      return data;
    },
    enabled: !!checkInId,
  });

  const questions = checkIn?.template?.questions ?? [];
  const currentQ = questions[currentIdx];
  const totalQ = questions.length;
  const isLast = currentIdx >= totalQ - 1;

  const handleNext = () => {
    if (isLast) {
      handleSubmit();
    } else {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleSubmit = async () => {
    if (!checkInId) return;
    const formattedAnswers = Object.entries(answers).map(([qId, val]) => ({
      question_id: qId,
      answer_text: typeof val === "string" ? val : undefined,
      answer_number: typeof val === "number" ? val : undefined,
      justification: justifications[qId] || undefined,
    }));
    await submitCheckIn.mutateAsync({ check_in_id: checkInId, answers: formattedAnswers });
    router.back();
  };

  if (!checkIn || !currentQ) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1 px-6 pt-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-2">
          <Pressable onPress={() => router.back()} className="flex-row items-center gap-1.5">
            <AppIcon name="arrow-left" size={16} color="#6E6382" strokeWidth={2} />
            <Text className="text-text-muted text-sm" style={{ fontFamily: font.medium }}>Sair</Text>
          </Pressable>
          <Text className="text-xs text-text-muted" style={{ fontFamily: font.bold }}>
            {currentIdx + 1} / {totalQ}
          </Text>
        </View>

        {/* Progress bar */}
        <View className="h-1.5 bg-surface-border rounded-full mb-8">
          <View
            className="h-full bg-violet-500 rounded-full"
            style={{ width: `${((currentIdx + 1) / totalQ) * 100}%` }}
          />
        </View>

        <View className="flex-row items-center gap-1.5 mb-3">
          <AppIcon name="clipboard-check" size={14} color="#9B40D8" strokeWidth={2} />
          <Text className="text-violet-400 uppercase" style={{ fontFamily: font.semibold, fontSize: 10, letterSpacing: 2 }}>
            {checkIn.template?.title}
          </Text>
        </View>

        {/* Question */}
        <Text className="text-3xl text-text-primary mb-8 leading-9" style={{ fontFamily: font.display }}>
          {currentQ.question_text}
        </Text>

        {/* Answer input based on type */}
        <View className="flex-1">
          {currentQ.question_type === "text" ? (
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
              placeholder="Sua resposta..."
              placeholderTextColor="#6E6382"
              value={String(answers[currentQ.id] ?? "")}
              onChangeText={(v) => setAnswers({ ...answers, [currentQ.id]: v })}
              multiline
              style={{ minHeight: 120, textAlignVertical: "top", fontFamily: font.regular }}
            />
          ) : currentQ.question_type === "number" ? (
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-5 py-4 text-3xl text-violet-400 text-center"
              placeholder="0"
              placeholderTextColor="#6E6382"
              value={String(answers[currentQ.id] ?? "")}
              onChangeText={(v) => setAnswers({ ...answers, [currentQ.id]: parseFloat(v) || 0 })}
              keyboardType="decimal-pad"
              style={{ fontFamily: font.bold }}
            />
          ) : currentQ.question_type === "scale" ? (
            <View className="flex-row flex-wrap gap-2 justify-center">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <Pressable
                  key={n}
                  onPress={() => setAnswers({ ...answers, [currentQ.id]: n })}
                  className={`w-14 h-14 rounded-xl items-center justify-center ${
                    answers[currentQ.id] === n ? "bg-violet-500" : "bg-surface-card border border-surface-border"
                  }`}
                >
                  <Text className={`text-lg ${
                    answers[currentQ.id] === n ? "text-white" : "text-text-primary"
                  }`} style={{ fontFamily: font.bold }}>
                    {n}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : currentQ.question_type === "boolean" ? (
            <View className="flex-row gap-4">
              {["Sim", "Nao"].map((opt) => (
                <Pressable
                  key={opt}
                  onPress={() => setAnswers({ ...answers, [currentQ.id]: opt })}
                  className={`flex-1 py-6 rounded-2xl items-center ${
                    answers[currentQ.id] === opt ? "bg-violet-500" : "bg-surface-card border border-surface-border"
                  }`}
                >
                  <Text className={`text-lg ${
                    answers[currentQ.id] === opt ? "text-white" : "text-text-primary"
                  }`} style={{ fontFamily: font.bold }}>
                    {opt}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : currentQ.question_type === "choice" && currentQ.options ? (
            <View className="gap-2">
              {(currentQ.options as string[]).map((opt: string) => (
                <Pressable
                  key={opt}
                  onPress={() => setAnswers({ ...answers, [currentQ.id]: opt })}
                  className={`py-4 px-5 rounded-2xl ${
                    answers[currentQ.id] === opt ? "bg-violet-500" : "bg-surface-card border border-surface-border"
                  }`}
                >
                  <Text className={`text-sm ${
                    answers[currentQ.id] === opt ? "text-white" : "text-text-primary"
                  }`} style={{ fontFamily: font.semibold }}>
                    {opt}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          {/* Justification for negative answers */}
          {(() => {
            const ans = answers[currentQ.id];
            const needsJustification =
              (currentQ.question_type === "scale" && typeof ans === "number" && ans <= 2) ||
              (currentQ.question_type === "boolean" && ans === "Nao") ||
              (currentQ.question_type === "number" && typeof ans === "number" && ans <= 2);
            if (!needsJustification) return null;
            return (
              <View className="mt-4">
                <View className="flex-row items-center gap-1.5 mb-2">
                  <AppIcon name="warning" size={14} color="#FBBF24" strokeWidth={2} />
                  <Text className="text-xs text-warning-500" style={{ fontFamily: font.semibold }}>Justifique sua resposta *</Text>
                </View>
                <TextInput
                  className="bg-surface-card/80 border border-warning-500/30 rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
                  placeholder="Explique o motivo..."
                  placeholderTextColor="#6E6382"
                  value={justifications[currentQ.id] ?? ""}
                  onChangeText={(v) => setJustifications({ ...justifications, [currentQ.id]: v })}
                  multiline
                  style={{ minHeight: 80, textAlignVertical: "top", fontFamily: font.regular }}
                />
              </View>
            );
          })()}
        </View>

        {/* Navigation */}
        <View className="flex-row gap-3 py-6">
          {currentIdx > 0 ? (
            <Pressable
              onPress={() => setCurrentIdx(currentIdx - 1)}
              className="flex-1 flex-row items-center justify-center gap-1.5 border border-surface-border rounded-2xl py-4"
            >
              <AppIcon name="chevron-left" size={18} color="#A99FBA" strokeWidth={2} />
              <Text className="text-text-secondary text-sm" style={{ fontFamily: font.semibold }}>Anterior</Text>
            </Pressable>
          ) : null}
          <Pressable
            onPress={handleNext}
            disabled={submitCheckIn.isPending}
            className="flex-1"
            style={amethystGlow}
          >
            <LinearGradient
              colors={submitCheckIn.isPending ? ["#50107D", "#86169E"] : ["#781BB6", "#C636E0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0.9 }}
              className="rounded-2xl py-4 items-center"
            >
              {submitCheckIn.isPending ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <View className="flex-row items-center gap-2">
                  <Text className="text-white text-sm" style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}>
                    {isLast ? "Enviar" : "Proximo"}
                  </Text>
                  <AppIcon name={isLast ? "send" : "chevron-right"} size={18} color="#FFFFFF" strokeWidth={2} />
                </View>
              )}
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
