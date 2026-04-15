import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as evo from "../../../lib/whatsapp/client";
import type { ConnectionState } from "../../../lib/whatsapp/types";
import { useAuth } from "../../../lib/auth/provider";
import { useTrainerWhatsAppInstance } from "../../../hooks/queries/useTrainerWhatsAppInstance";
import { useSetWhatsAppInstance } from "../../../hooks/mutations/useSetWhatsAppInstance";

export default function WhatsAppScreen() {
  const { user } = useAuth();
  const { data: inst } = useTrainerWhatsAppInstance(user?.id);
  const INSTANCE = inst?.name ?? "";
  const setInstance = useSetWhatsAppInstance();
  const [state, setState] = useState<ConnectionState | "unknown" | "no_instance">("unknown");
  const [qrBase64, setQrBase64] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [ownerPhone, setOwnerPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [testNumber, setTestNumber] = useState("");
  const [testMessage, setTestMessage] = useState("Teste do Academia App! 💪");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<"success" | "error" | null>(null);

  const fetchState = useCallback(async () => {
    if (!INSTANCE) return;
    try {
      setError(null);
      const instance = await evo.getInstance(INSTANCE);
      if (!instance) { setState("no_instance"); return; }
      setState(instance.connectionStatus ?? "close");
      setProfileName(instance.profileName ?? null);
      setProfilePic(instance.profilePicUrl ?? null);
      setOwnerPhone(instance.ownerJid?.split("@")[0] ?? instance.number ?? null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro desconhecido";
      setError(`Evolution API nao acessivel: ${msg}`);
      setState("unknown");
    } finally {
      setLoading(false);
    }
  }, [INSTANCE]);

  const fetchQr = useCallback(async () => {
    if (!INSTANCE) return;
    const qr = await evo.getQrCode(INSTANCE);
    if (qr?.base64) setQrBase64(qr.base64);
  }, [INSTANCE]);

  const handleCreate = async () => {
    if (!INSTANCE || !user) return;
    setLoading(true);
    try {
      const res = await evo.createInstance(INSTANCE);
      if (res.qrcode?.base64) setQrBase64(res.qrcode.base64);
      setState("close");
      // Persist instance name on first-time provision
      if (inst && !inst.isConfigured) {
        await setInstance.mutateAsync({ trainerId: user.id, instanceName: INSTANCE });
      }
    } catch { setError("Erro ao criar instancia."); }
    finally { setLoading(false); }
  };

  const handleLogout = async () => {
    if (!INSTANCE) return;
    try { await evo.logoutInstance(INSTANCE); } catch { /* */ }
    setState("close"); setProfileName(null); setProfilePic(null); setOwnerPhone(null); setQrBase64(null);
  };

  const handleReconnect = async () => {
    if (!INSTANCE) return;
    try { await evo.restartInstance(INSTANCE); setState("connecting"); } catch { /* */ }
  };

  const handleSendTest = async () => {
    if (!INSTANCE || !testNumber.trim()) return;
    setSending(true); setSendResult(null);
    try { await evo.sendText(INSTANCE, testNumber, testMessage); setSendResult("success"); }
    catch { setSendResult("error"); }
    finally { setSending(false); }
  };

  useEffect(() => {
    if (!INSTANCE) return;
    fetchState();
    const i = setInterval(fetchState, 5000);
    return () => clearInterval(i);
  }, [fetchState, INSTANCE]);

  useEffect(() => {
    if (state === "close" || state === "connecting") {
      fetchQr();
      const i = setInterval(fetchQr, 3000);
      return () => clearInterval(i);
    } else { setQrBase64(null); }
  }, [state, fetchQr]);

  const badges: Record<string, { label: string; color: string; bg: string; dot: string }> = {
    open: { label: "Conectado", color: "text-success-500", bg: "bg-success-500/10", dot: "bg-success-500" },
    connecting: { label: "Conectando...", color: "text-warning-500", bg: "bg-warning-500/10", dot: "bg-warning-500" },
    close: { label: "Desconectado", color: "text-danger-500", bg: "bg-danger-500/10", dot: "bg-danger-500" },
    no_instance: { label: "Nao configurado", color: "text-text-muted", bg: "bg-surface-elevated", dot: "bg-text-muted" },
    unknown: { label: "Verificando...", color: "text-text-muted", bg: "bg-surface-elevated", dot: "bg-text-muted" },
  };
  const b = badges[state] ?? badges.unknown;

  const fmtPhone = (p: string | null) => p ? p.replace(/(\d{2})(\d{2})(\d{4,5})(\d{4})/, "+$1 ($2) $3-$4") : "Numero conectado";

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6">
        {/* Header */}
        <View className="flex-row items-center gap-4 mb-8">
          <View className="w-14 h-14 bg-success-500/15 rounded-2xl items-center justify-center">
            <Text className="text-3xl">💬</Text>
          </View>
          <View className="flex-1">
            <Text className="text-2xl font-black text-text-primary">WhatsApp</Text>
            <Text className="text-xs text-text-muted">Evolution API v1.8</Text>
          </View>
          <View className={`flex-row items-center gap-2 px-3 py-2 rounded-full ${b.bg}`}>
            <View className={`w-2.5 h-2.5 rounded-full ${b.dot}`} />
            <Text className={`text-xs font-bold ${b.color}`}>{b.label}</Text>
          </View>
        </View>

        {loading ? (
          <View className="items-center py-20">
            <ActivityIndicator size="large" color="#781BB6" />
            <Text className="text-text-muted text-sm mt-4">Verificando conexao...</Text>
          </View>
        ) : error ? (
          <View className="bg-danger-500/10 border border-danger-500/20 rounded-3xl p-6 items-center">
            <Text className="text-4xl mb-4">⚠️</Text>
            <Text className="text-base font-bold text-text-primary text-center mb-2">Evolution API nao acessivel</Text>
            <Text className="text-sm text-text-muted text-center mb-6 leading-5">{error}</Text>
            <View className="bg-surface-card rounded-2xl p-4 w-full mb-4">
              <Text className="text-xs text-text-muted font-mono leading-5">docker compose -f docker-compose.evolution.yml up -d</Text>
            </View>
            <Pressable onPress={fetchState} className="bg-violet-500 rounded-2xl px-6 py-3 active:bg-violet-600">
              <Text className="text-white font-bold text-sm">Tentar novamente</Text>
            </Pressable>
          </View>
        ) : state === "no_instance" ? (
          <View className="bg-surface-card border border-surface-border rounded-3xl p-6 items-center">
            <Text className="text-4xl mb-4">📱</Text>
            <Text className="text-lg font-black text-text-primary mb-2">Configurar WhatsApp</Text>
            <Text className="text-sm text-text-muted text-center mb-6 leading-5">
              Conecte um numero de WhatsApp para enviar{"\n"}lembretes automaticos aos seus alunos.
            </Text>
            <Pressable onPress={handleCreate} className="bg-violet-500 rounded-2xl px-8 py-4 active:bg-violet-600">
              <Text className="text-white font-black text-base">Conectar WhatsApp</Text>
            </Pressable>
          </View>
        ) : state === "open" ? (
          <View>
            <View className="bg-success-500/5 border border-success-500/20 rounded-3xl p-6 mb-6">
              <View className="flex-row items-center gap-4 mb-4">
                {profilePic ? (
                  <Image source={{ uri: profilePic }} style={{ width: 56, height: 56, borderRadius: 28 }} contentFit="cover" />
                ) : (
                  <View className="w-14 h-14 bg-success-500/20 rounded-full items-center justify-center">
                    <Text className="text-2xl">✅</Text>
                  </View>
                )}
                <View className="flex-1">
                  <Text className="text-lg font-black text-text-primary">{profileName ?? "WhatsApp Conectado"}</Text>
                  <Text className="text-xs text-text-muted mt-0.5">{fmtPhone(ownerPhone)}</Text>
                </View>
              </View>
              <View className="bg-success-500/10 rounded-xl p-3">
                <Text className="text-xs text-success-500 font-bold text-center">Pronto para enviar mensagens automaticas</Text>
              </View>
            </View>

            <View className="bg-surface-card border border-surface-border rounded-3xl p-6 mb-6">
              <View className="flex-row items-center gap-3 mb-5">
                <View className="w-10 h-10 bg-violet-500/15 rounded-xl items-center justify-center"><Text className="text-lg">🧪</Text></View>
                <Text className="text-base font-black text-text-primary">Testar Envio</Text>
              </View>
              <View className="gap-4">
                <View>
                  <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Numero (com DDD)</Text>
                  <TextInput className="bg-dark-300 border-2 border-surface-border rounded-2xl px-5 py-4 text-base text-text-primary" placeholder="11 99999-9999" placeholderTextColor="#6E6580" value={testNumber} onChangeText={(v) => { setTestNumber(v); setSendResult(null); }} keyboardType="phone-pad" />
                </View>
                <View>
                  <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Mensagem</Text>
                  <TextInput className="bg-dark-300 border-2 border-surface-border rounded-2xl px-5 py-4 text-sm text-text-primary" placeholder="Mensagem de teste..." placeholderTextColor="#6E6580" value={testMessage} onChangeText={setTestMessage} multiline style={{ minHeight: 80, textAlignVertical: "top" }} />
                </View>
                <Pressable onPress={handleSendTest} disabled={sending || !testNumber.trim()} className={`rounded-2xl py-4 items-center ${testNumber.trim() ? "bg-violet-500 active:bg-violet-600" : "bg-surface-border"}`}>
                  {sending ? <ActivityIndicator color="#fff" /> : <Text className={`font-black text-base ${testNumber.trim() ? "text-white" : "text-text-muted"}`}>Enviar Teste</Text>}
                </Pressable>
                {sendResult === "success" ? (
                  <View className="bg-success-500/10 border border-success-500/20 rounded-xl p-3"><Text className="text-success-500 text-sm font-bold text-center">Mensagem enviada!</Text></View>
                ) : sendResult === "error" ? (
                  <View className="bg-danger-500/10 border border-danger-500/20 rounded-xl p-3"><Text className="text-danger-500 text-sm font-bold text-center">Erro ao enviar. Verifique o numero.</Text></View>
                ) : null}
              </View>
            </View>

            <View className="flex-row gap-3 mb-6">
              <Pressable onPress={handleReconnect} className="flex-1 border border-surface-border rounded-2xl py-3.5 items-center active:bg-surface-hover">
                <Text className="text-text-secondary font-bold text-sm">Reconectar</Text>
              </Pressable>
              <Pressable onPress={handleLogout} className="flex-1 border border-danger-500/30 rounded-2xl py-3.5 items-center active:bg-danger-500/10">
                <Text className="text-danger-500 font-bold text-sm">Desconectar</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View>
            <View className="bg-surface-card border border-surface-border rounded-3xl p-6 items-center mb-6">
              <Text className="text-lg font-black text-text-primary mb-2">Conectar WhatsApp</Text>
              <Text className="text-sm text-text-muted text-center mb-6 leading-5">
                Escaneie o QR Code com seu WhatsApp Business{"\n"}para conectar o envio automatico.
              </Text>
              {qrBase64 ? (
                <View className="bg-white rounded-2xl p-4 mb-4">
                  <Image source={{ uri: qrBase64 }} style={{ width: 260, height: 260 }} contentFit="contain" />
                </View>
              ) : (
                <View className="w-[260px] h-[260px] bg-surface-elevated rounded-2xl items-center justify-center mb-4">
                  <ActivityIndicator size="large" color="#781BB6" />
                  <Text className="text-text-muted text-xs mt-3">Gerando QR Code...</Text>
                </View>
              )}
              <View className="bg-violet-500/10 rounded-xl p-4 w-full">
                <Text className="text-xs text-violet-400 font-bold mb-2">Como conectar:</Text>
                {["Abra o WhatsApp no celular", "Menu → Aparelhos conectados", "Conectar aparelho → Escaneie o QR"].map((step, i) => (
                  <View key={i} className="flex-row gap-2 mt-1">
                    <Text className="text-xs text-text-muted">{i + 1}.</Text>
                    <Text className="text-xs text-text-secondary">{step}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View className="items-center mb-6">
              <View className="flex-row items-center gap-2">
                <ActivityIndicator size="small" color="#6E6382" />
                <Text className="text-text-muted text-xs">Aguardando conexao...</Text>
              </View>
            </View>
          </View>
        )}

        {/* Quick nav */}
        <View className="flex-row gap-3 mb-6">
          <Pressable
            onPress={() => router.push("/(trainer)/whatsapp/messages" as never)}
            className="flex-1 bg-surface-card border border-surface-border rounded-2xl py-4 items-center active:bg-surface-hover"
          >
            <Text className="text-xl mb-1">📨</Text>
            <Text className="text-xs font-bold text-text-secondary">Mensagens</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/(trainer)/whatsapp/settings" as never)}
            className="flex-1 bg-surface-card border border-surface-border rounded-2xl py-4 items-center active:bg-surface-hover"
          >
            <Text className="text-xl mb-1">⚙️</Text>
            <Text className="text-xs font-bold text-text-secondary">Configuracoes</Text>
          </Pressable>
        </View>

        <View className="bg-surface-card border border-surface-border rounded-3xl p-6 mb-10">
          <Text className="text-sm font-black text-text-primary mb-4">Mensagens Automaticas</Text>
          <View className="gap-3">
            {[
              { icon: "📋", title: "Lembrete de Check-in", desc: "Quando check-in esta pendente" },
              { icon: "🏋️", title: "Treino do Dia", desc: "Lembrete matinal de treino programado" },
              { icon: "⚠️", title: "Plano Expirando", desc: "Aviso 7 e 1 dia antes do vencimento" },
              { icon: "🔥", title: "Nudge de Volta", desc: "Quando aluno nao treina ha 3+ dias" },
            ].map((item) => (
              <View key={item.title} className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-surface-elevated rounded-xl items-center justify-center"><Text className="text-lg">{item.icon}</Text></View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-text-primary">{item.title}</Text>
                  <Text className="text-xs text-text-muted">{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
