import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { AdminTable } from "../../../components/admin/AdminTable";
import { WebContainer } from "../../../components/layout/WebContainer";
import { AppIcon, Badge } from "../../../components/ui";
import { font } from "../../../lib/design/tokens";
import { supabase } from "../../../lib/supabase/client";
import {
  useAdminExercicios,
  type AdminExercicio,
} from "../../../hooks/queries/useAdminCadastro";

function typeLabel(type: string | null): string {
  if (!type) return "—";
  const map: Record<string, string> = {
    strength: "Força",
    cardio: "Cardio",
    flexibility: "Flexibilidade",
    balance: "Equilíbrio",
    plyometric: "Pliométrico",
    bodyweight: "Peso Corporal",
  };
  return map[type] ?? type;
}

export default function ExerciciosScreen() {
  const { data = [], isLoading } = useAdminExercicios();
  const queryClient = useQueryClient();

  async function handleDelete(item: AdminExercicio) {
    Alert.alert(
      "Excluir exercício",
      `Deseja excluir "${item.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("exercises")
              .delete()
              .eq("id", item.id);
            if (error) {
              Alert.alert("Erro", error.message);
            } else {
              queryClient.invalidateQueries({ queryKey: ["admin", "exercicios"] });
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <WebContainer>
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
          {/* Header */}
          <View className="flex-row items-center gap-3 mb-6">
            <Pressable
              onPress={() => router.back()}
              className="w-9 h-9 rounded-xl bg-surface-card border border-surface-border items-center justify-center"
            >
              <AppIcon name="arrow-left" size={16} color="#A99FBA" strokeWidth={2} />
            </Pressable>
            <View>
              <Text className="text-xl text-text-primary" style={{ fontFamily: font.display }}>
                Exercícios
              </Text>
              <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>
                {data.length} cadastrados
              </Text>
            </View>
          </View>

          <AdminTable<AdminExercicio>
            data={data}
            loading={isLoading}
            keyExtractor={(item) => item.id}
            searchPlaceholder="Buscar por nome ou grupo..."
            searchFilter={(item, q) =>
              item.name.toLowerCase().includes(q) ||
              (item.grupo ?? "").toLowerCase().includes(q)
            }
            onCreate={() => Alert.alert("Em breve", "Criação de exercícios em desenvolvimento.")}
            createLabel="Exercício"
            onEdit={() => Alert.alert("Em breve", "Edição em desenvolvimento.")}
            onDelete={handleDelete}
            emptyMessage="Nenhum exercício cadastrado."
            columns={[
              { key: "name", label: "Nome", flex: 3, sortable: true },
              { key: "grupo", label: "Grupo Muscular", flex: 2, sortable: true },
              {
                key: "exercise_type",
                label: "Tipo",
                flex: 1,
                render: (row) => (
                  <Badge label={typeLabel(row.exercise_type)} variant="primary" />
                ),
              },
              {
                key: "is_active",
                label: "Status",
                flex: 1,
                render: (row) => (
                  <Badge
                    label={row.is_active ? "Ativo" : "Inativo"}
                    variant={row.is_active ? "success" : "default"}
                  />
                ),
              },
            ]}
          />
        </ScrollView>
      </WebContainer>
    </SafeAreaView>
  );
}
