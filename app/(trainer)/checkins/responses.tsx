import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../lib/auth/provider";
import { supabase } from "../../../lib/supabase/client";
import { useReviewCheckIn } from "../../../hooks/mutations/useCheckinMutations";
import { Avatar } from "../../../components/ui/Avatar";
import { font } from "../../../lib/design/tokens";

interface CheckInWithDetails {
  id: string;
  user_id: string;
  status: string;
  weighted_score: number | null;
  submitted_at: string | null;
  created_at: string;
  trainer_notes: string | null;
  template: { title: string } | null;
  student: { full_name: string; avatar_url: string | null } | null;
  answers: { id: string; answer_text: string | null; answer_number: number | null; justification: string | null; question: { question_text: string; question_type: string } | null }[];
}

export default function CheckInResponsesScreen() {
  const { user } = useAuth();
  const reviewCheckIn = useReviewCheckIn();
  const [notes, setNotes] = useState<Record<string, string>>({});

  const { data: checkIns, isLoading } = useQuery({
    queryKey: ["trainer", "checkin-responses", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("check_ins")
        .select("*, weighted_score, template:questionnaire_templates(title), student:profiles!user_id(full_name, avatar_url), answers:check_in_answers(*, justification, question:questionnaire_questions(question_text, question_type))")
        .eq("trainer_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as CheckInWithDetails[];
    },
    enabled: !!user,
  });

  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: "bg-warning-500/10", text: "text-warning-500", label: "Pendente" },
    submitted: { bg: "bg-violet-500/10", text: "text-violet-400", label: "Respondido" },
    reviewed: { bg: "bg-success-500/10", text: "text-success-500", label: "Revisado" },
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-6 pt-6 pb-4">
          <Pressable onPress={() => router.back()}>
            <Text className="text-text-muted text-sm" style={{ fontFamily: font.medium }}>← Voltar</Text>
          </Pressable>
          <Text className="text-2xl text-text-primary" style={{ fontFamily: font.display }}>Respostas.</Text>
          <View className="w-16" />
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#781BB6" />
          </View>
        ) : !checkIns?.length ? (
          <View className="flex-1 items-center justify-center px-8">
            <Text className="text-3xl mb-3">📋</Text>
            <Text className="text-xl text-text-primary" style={{ fontFamily: font.display }}>Nenhuma resposta</Text>
            <Text className="text-sm text-text-muted text-center mt-2" style={{ fontFamily: font.regular }}>
              As respostas dos check-ins dos seus alunos aparecerão aqui.
            </Text>
          </View>
        ) : (
          <FlatList
            data={checkIns}
            keyExtractor={(item) => item.id}
            contentContainerClassName="px-6 gap-3 pb-4"
            renderItem={({ item }) => {
              const st = statusColors[item.status] ?? statusColors.pending;
              return (
                <View className="bg-surface-card border border-surface-border rounded-3xl p-5">
                  {/* Header */}
                  <View className="flex-row items-center gap-3 mb-3">
                    <Avatar uri={item.student?.avatar_url} name={item.student?.full_name} size="md" />
                    <View className="flex-1">
                      <Text className="text-sm text-text-primary" style={{ fontFamily: font.semibold }}>{item.student?.full_name}</Text>
                      <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>{item.template?.title}</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      {item.weighted_score != null ? (
                        <View className={`px-2 py-1 rounded-full ${
                          item.weighted_score >= 80 ? "bg-success-500/15" :
                          item.weighted_score >= 50 ? "bg-warning-500/15" :
                          "bg-danger-500/15"
                        }`}>
                          <Text className={`text-[10px] ${
                            item.weighted_score >= 80 ? "text-success-500" :
                            item.weighted_score >= 50 ? "text-warning-500" :
                            "text-danger-500"
                          }`} style={{ fontFamily: font.bold }}>{Math.round(item.weighted_score)}%</Text>
                        </View>
                      ) : null}
                      <View className={`px-2 py-1 rounded-full ${st.bg}`}>
                        <Text className={`text-[10px] ${st.text}`} style={{ fontFamily: font.semibold }}>{st.label}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Answers */}
                  {item.status !== "pending" && item.answers?.length ? (
                    <View className="bg-dark-300 rounded-2xl p-3 gap-2">
                      {item.answers.map((a) => (
                        <View key={a.id}>
                          <Text className="text-[10px] text-text-muted uppercase" style={{ fontFamily: font.semibold, letterSpacing: 1.5 }}>{a.question?.question_text}</Text>
                          <Text className="text-sm text-text-primary mt-0.5" style={{ fontFamily: font.regular }}>
                            {a.answer_text ?? (a.answer_number != null ? String(a.answer_number) : "-")}
                          </Text>
                          {a.justification ? (
                            <Text className="text-xs text-text-muted mt-1" style={{ fontFamily: font.regular }}>
                              Justificativa: {a.justification}
                            </Text>
                          ) : null}
                        </View>
                      ))}
                    </View>
                  ) : null}

                  {/* Revisão do coach */}
                  {item.status === "submitted" ? (
                    <View className="mt-3">
                      <TextInput
                        className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
                        placeholder="Feedback para o aluno (opcional)"
                        placeholderTextColor="#6E6382"
                        value={notes[item.id] ?? ""}
                        onChangeText={(t) => setNotes((n) => ({ ...n, [item.id]: t }))}
                        multiline
                        style={{ fontFamily: font.regular }}
                      />
                      <Pressable
                        onPress={() => reviewCheckIn.mutate({ check_in_id: item.id, trainer_notes: notes[item.id]?.trim() || undefined })}
                        disabled={reviewCheckIn.isPending}
                        className="bg-success-500 rounded-2xl py-3 items-center mt-2 active:bg-success-600"
                      >
                        <Text className="text-white text-xs" style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}>Marcar como revisado</Text>
                      </Pressable>
                    </View>
                  ) : item.status === "reviewed" && item.trainer_notes ? (
                    <View className="mt-3 bg-success-500/5 border border-success-500/20 rounded-2xl p-3">
                      <Text className="text-[10px] text-success-500 uppercase mb-1" style={{ fontFamily: font.semibold, letterSpacing: 1.5 }}>Feedback do coach</Text>
                      <Text className="text-sm text-text-secondary" style={{ fontFamily: font.regular }}>{item.trainer_notes}</Text>
                    </View>
                  ) : null}

                  {/* Date */}
                  <Text className="text-[10px] text-text-muted mt-3" style={{ fontFamily: font.regular }}>
                    {item.submitted_at
                      ? `Respondido em ${new Date(item.submitted_at).toLocaleDateString("pt-BR")}`
                      : `Enviado em ${new Date(item.created_at).toLocaleDateString("pt-BR")}`}
                  </Text>
                </View>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
