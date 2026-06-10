import { router } from "expo-router";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppIcon } from "../components/ui";
import { WebContainer } from "../components/layout/WebContainer";
import { font } from "../lib/design/tokens";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-2 border-b border-surface-border">
      <Text className="text-sm text-text-muted" style={{ fontFamily: font.regular }}>{label}</Text>
      <Text className="text-sm text-text-secondary" style={{ fontFamily: font.medium }}>{value}</Text>
    </View>
  );
}

export default function SobreDadosScreen() {
  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6">
        <WebContainer maxWidth={720}>

          {/* Back */}
          <Pressable onPress={() => router.back()} className="flex-row items-center gap-1.5 mb-6">
            <AppIcon name="arrow-left" size={16} color="#6E6382" strokeWidth={2} />
            <Text className="text-text-muted text-sm" style={{ fontFamily: font.medium }}>Voltar</Text>
          </Pressable>

          <Text className="text-3xl text-text-primary mb-1" style={{ fontFamily: font.display, letterSpacing: -0.3 }}>
            Fontes de dados
          </Text>
          <Text className="text-sm text-text-muted mb-8" style={{ fontFamily: font.regular }}>
            Dados nutricionais utilizados no Projeto Gaab e suas respectivas licenças.
          </Text>

          {/* TACO */}
          <View className="bg-surface-card border border-surface-border rounded-3xl p-5 mb-4">
            <View className="flex-row items-center gap-2 mb-3">
              <View className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
                <AppIcon name="food" size={16} color="#9B40D8" strokeWidth={2} />
              </View>
              <Text className="text-base text-text-primary" style={{ fontFamily: font.semibold }}>TACO</Text>
            </View>
            <Row label="Nome completo" value="Tabela Brasileira de Composição de Alimentos" />
            <Row label="Organização" value="NEPA / UNICAMP" />
            <Row label="Uso" value="Alimentos básicos in natura e minimamente processados" />
            <View className="flex-row justify-between py-2">
              <Text className="text-sm text-text-muted" style={{ fontFamily: font.regular }}>Mais informações</Text>
              <Pressable onPress={() => Linking.openURL("https://www.unicamp.br/nepa/taco/")}>
                <Text className="text-sm text-violet-400 underline" style={{ fontFamily: font.medium }}>unicamp.br/nepa/taco</Text>
              </Pressable>
            </View>
          </View>

          {/* Open Food Facts */}
          <View className="bg-surface-card border border-surface-border rounded-3xl p-5 mb-4">
            <View className="flex-row items-center gap-2 mb-3">
              <View className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/25 items-center justify-center">
                <AppIcon name="search" size={16} color="#67E8F9" strokeWidth={2} />
              </View>
              <Text className="text-base text-text-primary" style={{ fontFamily: font.semibold }}>Open Food Facts</Text>
            </View>
            <Row label="Licença dos dados" value="Open Database License (ODbL)" />
            <Row label="Uso" value="Produtos embalados e industrializados" />
            <View className="flex-row justify-between py-2 border-b border-surface-border">
              <Text className="text-sm text-text-muted" style={{ fontFamily: font.regular }}>Acesso aos dados</Text>
              <Pressable onPress={() => Linking.openURL("https://world.openfoodfacts.org/data")}>
                <Text className="text-sm text-violet-400 underline" style={{ fontFamily: font.medium }}>openfoodfacts.org/data</Text>
              </Pressable>
            </View>
            <View className="flex-row justify-between py-2">
              <Text className="text-sm text-text-muted" style={{ fontFamily: font.regular }}>Licença completa</Text>
              <Pressable onPress={() => Linking.openURL("https://opendatacommons.org/licenses/odbl/")}>
                <Text className="text-sm text-violet-400 underline" style={{ fontFamily: font.medium }}>ODbL</Text>
              </Pressable>
            </View>
          </View>

          {/* ODbL notice */}
          <View className="bg-surface-elevated border border-surface-border rounded-2xl p-4 mb-10">
            <Text className="text-xs text-text-muted leading-5" style={{ fontFamily: font.regular }}>
              Os dados provenientes do Open Food Facts são disponibilizados sob a{" "}
              <Text style={{ fontFamily: font.semibold }}>Open Database License (ODbL)</Text>, que permite uso,
              compartilhamento e modificação desde que o banco de dados resultante seja distribuído sob a mesma licença
              e a fonte seja creditada.
            </Text>
          </View>

        </WebContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
