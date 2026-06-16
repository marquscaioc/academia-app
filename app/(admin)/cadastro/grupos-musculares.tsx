import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AdminTable } from "../../../components/admin/AdminTable";
import { WebContainer } from "../../../components/layout/WebContainer";
import { AppIcon } from "../../../components/ui";
import { font } from "../../../lib/design/tokens";
import {
  useAdminGruposMusculares,
  type AdminGrupoMuscular,
} from "../../../hooks/queries/useAdminCadastro";

export default function GruposMuscularesScreen() {
  const { data = [], isLoading } = useAdminGruposMusculares();

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
                Grupos Musculares
              </Text>
              <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>
                {data.length} cadastrados
              </Text>
            </View>
          </View>

          <AdminTable<AdminGrupoMuscular>
            data={data}
            loading={isLoading}
            keyExtractor={(item) => item.id}
            searchPlaceholder="Buscar por nome..."
            searchFilter={(item, q) => item.name.toLowerCase().includes(q)}
            onCreate={() => Alert.alert("Em breve", "Criação em desenvolvimento.")}
            createLabel="Grupo Muscular"
            onEdit={() => Alert.alert("Em breve", "Edição em desenvolvimento.")}
            onDelete={() => Alert.alert("Em breve", "Exclusão em desenvolvimento.")}
            emptyMessage="Nenhum grupo muscular cadastrado."
            columns={[
              { key: "name", label: "Nome", flex: 4, sortable: true },
              { key: "id", label: "ID", flex: 2 },
            ]}
          />
        </ScrollView>
      </WebContainer>
    </SafeAreaView>
  );
}
