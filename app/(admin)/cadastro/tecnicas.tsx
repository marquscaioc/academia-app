import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AdminTable } from "../../../components/admin/AdminTable";
import { WebContainer } from "../../../components/layout/WebContainer";
import { AppIcon, Badge } from "../../../components/ui";
import { font } from "../../../lib/design/tokens";
import { useAdminTecnicas, type AdminTecnica } from "../../../hooks/queries/useAdminCadastro";

export default function TecnicasScreen() {
  const { data = [], isLoading } = useAdminTecnicas();

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
                Técnicas
              </Text>
              <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>
                {data.length} cadastradas
              </Text>
            </View>
          </View>

          <AdminTable<AdminTecnica>
            data={data}
            loading={isLoading}
            keyExtractor={(item) => item.id}
            searchPlaceholder="Buscar por nome..."
            searchFilter={(item, q) => item.name.toLowerCase().includes(q)}
            onCreate={() => Alert.alert("Em breve", "Criação em desenvolvimento.")}
            createLabel="Técnica"
            onEdit={() => Alert.alert("Em breve", "Edição em desenvolvimento.")}
            onDelete={() => Alert.alert("Em breve", "Exclusão em desenvolvimento.")}
            emptyMessage="Nenhuma técnica cadastrada."
            columns={[
              {
                key: "name",
                label: "Nome",
                flex: 3,
                sortable: true,
                render: (row) => (
                  <View className="flex-row items-center gap-2">
                    {row.color && (
                      <View
                        style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: row.color }}
                      />
                    )}
                    <Text
                      className="text-sm text-text-primary"
                      style={{ fontFamily: font.medium }}
                      numberOfLines={1}
                    >
                      {row.name}
                    </Text>
                  </View>
                ),
              },
              {
                key: "description",
                label: "Descrição",
                flex: 4,
                render: (row) => (
                  <Text
                    className="text-sm text-text-secondary"
                    style={{ fontFamily: font.regular }}
                    numberOfLines={1}
                  >
                    {row.description ?? "—"}
                  </Text>
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
