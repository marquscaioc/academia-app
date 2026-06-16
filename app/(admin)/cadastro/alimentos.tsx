import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AdminTable } from "../../../components/admin/AdminTable";
import { WebContainer } from "../../../components/layout/WebContainer";
import { AppIcon, Badge } from "../../../components/ui";
import { font } from "../../../lib/design/tokens";
import { useAdminAlimentos, type AdminAlimento } from "../../../hooks/queries/useAdminCadastro";

export default function AlimentosScreen() {
  const { data = [], isLoading } = useAdminAlimentos();

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
                Alimentos
              </Text>
              <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>
                {data.length} cadastrados
              </Text>
            </View>
          </View>

          <AdminTable<AdminAlimento>
            data={data}
            loading={isLoading}
            keyExtractor={(item) => item.id}
            searchPlaceholder="Buscar por nome ou categoria..."
            searchFilter={(item, q) =>
              item.name.toLowerCase().includes(q) ||
              (item.category ?? "").toLowerCase().includes(q)
            }
            onCreate={() => Alert.alert("Em breve", "Criação de alimentos em desenvolvimento.")}
            createLabel="Alimento"
            onEdit={() => Alert.alert("Em breve", "Edição em desenvolvimento.")}
            onDelete={() => Alert.alert("Em breve", "Exclusão em desenvolvimento.")}
            emptyMessage="Nenhum alimento cadastrado."
            columns={[
              { key: "name", label: "Nome", flex: 3, sortable: true },
              { key: "category", label: "Categoria", flex: 2, sortable: true },
              { key: "source", label: "Fonte", flex: 1 },
              {
                key: "has_macros",
                label: "Macros",
                flex: 1,
                render: (row) => (
                  <Badge
                    label={row.has_macros ? "Com macros" : "Sem macros"}
                    variant={row.has_macros ? "success" : "default"}
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
