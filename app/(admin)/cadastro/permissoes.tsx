import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AdminTable } from "../../../components/admin/AdminTable";
import { WebContainer } from "../../../components/layout/WebContainer";
import { AppIcon } from "../../../components/ui";
import { font } from "../../../lib/design/tokens";

export default function PermissoesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <WebContainer>
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
          <View className="flex-row items-center gap-3 mb-6">
            <Pressable
              onPress={() => router.back()}
              className="w-9 h-9 rounded-xl bg-surface-card border border-surface-border items-center justify-center"
            >
              <AppIcon name="arrow-left" size={16} color="#A99FBA" strokeWidth={2} />
            </Pressable>
            <View>
              <Text className="text-xl text-text-primary" style={{ fontFamily: font.display }}>
                Permissões de Funcionário
              </Text>
              <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>
                Cadastro em construção
              </Text>
            </View>
          </View>
          <AdminTable
            data={[]}
            columns={[{ key: "name", label: "Nome", sortable: true }]}
            keyExtractor={(item: Record<string, string>) => item.id}
            emptyMessage="Nenhuma permissão cadastrada ainda."
            searchPlaceholder="Buscar..."
            onCreate={() => Alert.alert("Em breve", "Em desenvolvimento.")}
            createLabel="Permissão"
          />
        </ScrollView>
      </WebContainer>
    </SafeAreaView>
  );
}
