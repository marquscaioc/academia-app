import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "../components/ui";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Página não encontrada" }} />
      <SafeAreaView className="flex-1 bg-dark-400 items-center justify-center px-8">
        <View className="items-center max-w-[420px] w-full">
          <Logo size="md" />
          <Text className="text-6xl font-black text-text-primary mt-8" style={{ fontFamily: "Nunito_900Black" }}>
            404
          </Text>
          <Text className="text-base text-text-secondary text-center mt-3 mb-8" style={{ fontFamily: "Nunito_400Regular" }}>
            Esta página não existe ou foi movida.
          </Text>
          <Link href="/" className="bg-violet-500 rounded-2xl px-6 py-3">
            <Text className="text-white font-bold text-sm" style={{ fontFamily: "Nunito_700Bold" }}>
              Voltar ao início
            </Text>
          </Link>
        </View>
      </SafeAreaView>
    </>
  );
}
