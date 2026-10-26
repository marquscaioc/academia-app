import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebContainer } from "../../components/layout/WebContainer";
import { AppIcon, SectionLabel } from "../../components/ui";
import { font } from "../../lib/design/tokens";

export default function ModerationScreen() {
  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <WebContainer maxWidth={1180} className="flex-1">
      <View className="flex-1 px-6 pt-6">
        <SectionLabel className="mb-2">Comunidade</SectionLabel>
        <Text
          className="text-3xl text-text-primary mb-6"
          style={{ fontFamily: font.display }}
        >
          Moderacao
        </Text>
        <View className="flex-1 items-center justify-center px-8 py-12">
          <View className="w-16 h-16 bg-violet-500/15 border border-violet-500/25 rounded-3xl items-center justify-center mb-6">
            <AppIcon name="moderation" size={28} color="#9B40D8" strokeWidth={2} />
          </View>
          <Text
            className="text-3xl text-text-primary text-center"
            style={{ fontFamily: font.display, letterSpacing: -0.3 }}
          >
            Nenhum conteudo reportado
          </Text>
          <Text
            className="text-sm text-text-secondary text-center mt-2.5 max-w-[300px] leading-5"
            style={{ fontFamily: font.regular }}
          >
            Posts e comentarios reportados pelos usuarios aparecerão aqui para revisao.
          </Text>
        </View>
      </View>
      </WebContainer>
    </SafeAreaView>
  );
}
