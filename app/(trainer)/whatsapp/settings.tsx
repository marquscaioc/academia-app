import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EVOLUTION_CONFIG } from "../../../lib/whatsapp/config";
import * as evo from "../../../lib/whatsapp/client";
import { MESSAGE_TEMPLATES } from "../../../lib/whatsapp/templates";

const INSTANCE = EVOLUTION_CONFIG.instance;

export default function WhatsAppSettingsScreen() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSaved, setWebhookSaved] = useState(false);
  const [webhookError, setWebhookError] = useState<string | null>(null);

  const handleSaveWebhook = async () => {
    if (!webhookUrl.trim()) return;
    setWebhookError(null);
    try {
      await evo.setWebhook(INSTANCE, webhookUrl.trim(), [
        "MESSAGES_UPSERT",
        "CONNECTION_UPDATE",
        "SEND_MESSAGE",
      ]);
      setWebhookSaved(true);
    } catch {
      setWebhookError("Erro ao configurar webhook");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6">
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()}>
            <Text className="text-violet-400 font-medium">← Voltar</Text>
          </Pressable>
          <Text className="text-lg font-black text-text-primary">Configuracoes</Text>
          <View className="w-16" />
        </View>

        {/* Webhook */}
        <View className="bg-surface-card border border-surface-border rounded-3xl p-6 mb-6">
          <View className="flex-row items-center gap-3 mb-4">
            <View className="w-10 h-10 bg-violet-500/15 rounded-xl items-center justify-center">
              <Text className="text-lg">🔗</Text>
            </View>
            <View>
              <Text className="text-sm font-black text-text-primary">Webhook</Text>
              <Text className="text-xs text-text-muted">Receber respostas dos alunos</Text>
            </View>
          </View>

          <TextInput
            className="bg-dark-300 border-2 border-surface-border rounded-2xl px-5 py-4 text-sm text-text-primary mb-3"
            placeholder="https://sua-url.com/functions/v1/whatsapp-webhook"
            placeholderTextColor="#6E6382"
            value={webhookUrl}
            onChangeText={(v) => { setWebhookUrl(v); setWebhookSaved(false); }}
            autoCapitalize="none"
            keyboardType="url"
          />

          <Pressable
            onPress={handleSaveWebhook}
            disabled={!webhookUrl.trim()}
            className={`rounded-2xl py-3 items-center ${webhookUrl.trim() ? "bg-violet-500 active:bg-violet-600" : "bg-surface-border"}`}
          >
            <Text className={`font-bold text-sm ${webhookUrl.trim() ? "text-white" : "text-text-muted"}`}>
              Salvar Webhook
            </Text>
          </Pressable>

          {webhookSaved ? (
            <View className="bg-success-500/10 rounded-xl p-3 mt-3">
              <Text className="text-success-500 text-xs font-bold text-center">Webhook configurado!</Text>
            </View>
          ) : null}
          {webhookError ? (
            <View className="bg-danger-500/10 rounded-xl p-3 mt-3">
              <Text className="text-danger-500 text-xs font-bold text-center">{webhookError}</Text>
            </View>
          ) : null}
        </View>

        {/* Connection info */}
        <View className="bg-surface-card border border-surface-border rounded-3xl p-6 mb-6">
          <View className="flex-row items-center gap-3 mb-4">
            <View className="w-10 h-10 bg-violet-500/15 rounded-xl items-center justify-center">
              <Text className="text-lg">⚙️</Text>
            </View>
            <Text className="text-sm font-black text-text-primary">API</Text>
          </View>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-xs text-text-muted">URL</Text>
              <Text className="text-xs text-text-secondary">{EVOLUTION_CONFIG.url}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs text-text-muted">Instancia</Text>
              <Text className="text-xs text-text-secondary">{EVOLUTION_CONFIG.instance}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs text-text-muted">Versao</Text>
              <Text className="text-xs text-text-secondary">v1.8.1</Text>
            </View>
          </View>
        </View>

        {/* Templates */}
        <View className="bg-surface-card border border-surface-border rounded-3xl p-6 mb-10">
          <View className="flex-row items-center gap-3 mb-4">
            <View className="w-10 h-10 bg-violet-500/15 rounded-xl items-center justify-center">
              <Text className="text-lg">📝</Text>
            </View>
            <Text className="text-sm font-black text-text-primary">Templates de Mensagem</Text>
          </View>
          <View className="gap-3">
            {MESSAGE_TEMPLATES.map((t) => (
              <View key={t.id} className="flex-row items-center gap-3 py-2 border-b border-surface-border last:border-0">
                <Text className="text-lg">{t.icon}</Text>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-text-primary">{t.name}</Text>
                  <Text className="text-xs text-text-muted">{t.description}</Text>
                </View>
                <View className={`px-2 py-0.5 rounded-full ${
                  t.category === "reminder" ? "bg-warning-500/15" : t.category === "engagement" ? "bg-violet-500/15" : "bg-surface-elevated"
                }`}>
                  <Text className={`text-[10px] font-bold ${
                    t.category === "reminder" ? "text-warning-500" : t.category === "engagement" ? "text-violet-400" : "text-text-muted"
                  }`}>
                    {t.category === "reminder" ? "Lembrete" : t.category === "engagement" ? "Engajamento" : "Admin"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
