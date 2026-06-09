import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { font, amethystGlow } from "../../../lib/design/tokens";
import { EVOLUTION_CONFIG } from "../../../lib/whatsapp/config";
import * as evo from "../../../lib/whatsapp/client";
import { MESSAGE_TEMPLATES } from "../../../lib/whatsapp/templates";
import { useAuth } from "../../../lib/auth/provider";
import { useTrainerWhatsAppInstance } from "../../../hooks/queries/useTrainerWhatsAppInstance";

export default function WhatsAppSettingsScreen() {
  const { user } = useAuth();
  const { data: inst } = useTrainerWhatsAppInstance(user?.id);
  const INSTANCE = inst?.name ?? "";
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSaved, setWebhookSaved] = useState(false);
  const [webhookError, setWebhookError] = useState<string | null>(null);

  const handleSaveWebhook = async () => {
    if (!INSTANCE || !webhookUrl.trim()) return;
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
            <Text className="text-violet-400" style={{ fontFamily: font.medium }}>← Voltar</Text>
          </Pressable>
          <Text className="text-2xl text-text-primary" style={{ fontFamily: font.display }}>Configurações</Text>
          <View className="w-16" />
        </View>

        {/* Webhook */}
        <View className="bg-surface-card border border-surface-border rounded-3xl p-6 mb-6">
          <View className="flex-row items-center gap-3 mb-4">
            <View className="w-10 h-10 bg-violet-500/15 rounded-xl items-center justify-center">
              <Text className="text-lg">🔗</Text>
            </View>
            <View>
              <Text className="text-sm text-text-primary" style={{ fontFamily: font.bold }}>Webhook</Text>
              <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>Receber respostas dos alunos</Text>
            </View>
          </View>

          <TextInput
            className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary mb-3"
            placeholder="https://sua-url.com/functions/v1/whatsapp-webhook"
            placeholderTextColor="#6E6382"
            style={{ fontFamily: font.regular }}
            value={webhookUrl}
            onChangeText={(v) => { setWebhookUrl(v); setWebhookSaved(false); }}
            autoCapitalize="none"
            keyboardType="url"
          />

          {webhookUrl.trim() ? (
            <Pressable
              onPress={handleSaveWebhook}
              style={amethystGlow}
              className="rounded-2xl overflow-hidden"
            >
              <LinearGradient
                colors={["#781BB6", "#C636E0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.9 }}
                className="py-3 items-center"
              >
                <Text className="text-white" style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}>
                  Salvar webhook
                </Text>
              </LinearGradient>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleSaveWebhook}
              disabled
              className="rounded-2xl py-3 items-center bg-surface-border"
            >
              <Text className="text-text-muted" style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}>
                Salvar webhook
              </Text>
            </Pressable>
          )}

          {webhookSaved ? (
            <View className="bg-success-500/10 rounded-xl p-3 mt-3">
              <Text className="text-success-500 text-xs text-center" style={{ fontFamily: font.semibold }}>Webhook configurado!</Text>
            </View>
          ) : null}
          {webhookError ? (
            <View className="bg-danger-500/10 rounded-xl p-3 mt-3">
              <Text className="text-danger-500 text-xs text-center" style={{ fontFamily: font.semibold }}>{webhookError}</Text>
            </View>
          ) : null}
        </View>

        {/* Connection info */}
        <View className="bg-surface-card border border-surface-border rounded-3xl p-6 mb-6">
          <View className="flex-row items-center gap-3 mb-4">
            <View className="w-10 h-10 bg-violet-500/15 rounded-xl items-center justify-center">
              <Text className="text-lg">⚙️</Text>
            </View>
            <Text className="text-sm text-text-primary" style={{ fontFamily: font.bold }}>API</Text>
          </View>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>URL</Text>
              <Text className="text-xs text-text-secondary" style={{ fontFamily: font.regular }}>{EVOLUTION_CONFIG.url}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>Instância</Text>
              <Text className="text-xs text-text-secondary" style={{ fontFamily: font.regular }}>{INSTANCE || "—"}</Text>
            </View>
            {inst && !inst.isConfigured ? (
              <View className="flex-row justify-between">
                <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>Status</Text>
                <Text className="text-xs text-warning-500" style={{ fontFamily: font.semibold }}>Não provisionada</Text>
              </View>
            ) : null}
            <View className="flex-row justify-between">
              <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>Versão</Text>
              <Text className="text-xs text-text-secondary" style={{ fontFamily: font.regular }}>v1.8.1</Text>
            </View>
          </View>
        </View>

        {/* Templates */}
        <View className="bg-surface-card border border-surface-border rounded-3xl p-6 mb-10">
          <View className="flex-row items-center gap-3 mb-4">
            <View className="w-10 h-10 bg-violet-500/15 rounded-xl items-center justify-center">
              <Text className="text-lg">📝</Text>
            </View>
            <Text className="text-sm text-text-primary" style={{ fontFamily: font.bold }}>Templates de mensagem</Text>
          </View>
          <View className="gap-3">
            {MESSAGE_TEMPLATES.map((t) => (
              <View key={t.id} className="flex-row items-center gap-3 py-2 border-b border-surface-border last:border-0">
                <Text className="text-lg">{t.icon}</Text>
                <View className="flex-1">
                  <Text className="text-sm text-text-primary" style={{ fontFamily: font.semibold }}>{t.name}</Text>
                  <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>{t.description}</Text>
                </View>
                <View className={`px-2 py-0.5 rounded-full ${
                  t.category === "reminder" ? "bg-warning-500/15" : t.category === "engagement" ? "bg-violet-500/15" : "bg-surface-elevated"
                }`}>
                  <Text className={`text-[10px] ${
                    t.category === "reminder" ? "text-warning-500" : t.category === "engagement" ? "text-violet-400" : "text-text-muted"
                  }`} style={{ fontFamily: font.bold }}>
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
