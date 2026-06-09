import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState } from "../../components/ui/EmptyState";
import { font } from "../../lib/design/tokens";

export default function ModerationScreen() {
  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1 px-6 pt-6">
        <Text
          className="text-3xl text-text-primary mb-6"
          style={{ fontFamily: font.display }}
        >
          Moderacao
        </Text>
        <EmptyState
          icon="🛡️"
          title="Nenhum conteudo reportado"
          description="Posts e comentarios reportados pelos usuarios aparecerão aqui para revisao."
        />
      </View>
    </SafeAreaView>
  );
}
