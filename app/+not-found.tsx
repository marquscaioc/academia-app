import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "../components/ui";
import { font } from "../lib/design/tokens";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Página não encontrada" }} />
      <SafeAreaView className="flex-1 bg-dark-400 items-center justify-center px-8">
        <View className="items-center max-w-[420px] w-full">
          <Logo size="md" />
          <Text className="text-text-primary mt-8" style={{ fontFamily: font.display, fontSize: 88, lineHeight: 92, letterSpacing: -1 }}>
            404
          </Text>
          <Text className="text-base text-text-secondary text-center mt-2 mb-8" style={{ fontFamily: font.regular }}>
            Esta página não existe ou foi movida.
          </Text>
          <Link href="/" className="bg-violet-500 rounded-2xl px-6 py-3">
            <Text className="text-white text-sm" style={{ fontFamily: font.semibold }}>
              Voltar ao início
            </Text>
          </Link>
        </View>
      </SafeAreaView>
    </>
  );
}
