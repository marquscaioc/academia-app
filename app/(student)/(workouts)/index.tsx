import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WorkoutsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-black text-text-primary mb-6">
          Meus Treinos
        </Text>
        <View className="flex-1 items-center justify-center">
          <View className="w-20 h-20 bg-surface-card border border-surface-border rounded-3xl items-center justify-center mb-5">
            <Text className="text-3xl">🏋️</Text>
          </View>
          <Text className="text-lg font-bold text-text-primary">
            Nenhum treino ainda
          </Text>
          <Text className="text-sm text-text-muted text-center mt-2 max-w-[280px] leading-5">
            Seus planos de treino aparecerão aqui quando seu personal atribui-los.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
