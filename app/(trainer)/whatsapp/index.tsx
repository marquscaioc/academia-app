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

const EVOLUTION_URL = "http://localhost:8080";
const API_KEY = "teste123";
const INSTANCE = "academia-app";

type ConnectionStatus = "open" | "connecting" | "close" | "unknown";

interface InstanceInfo {
  connectionStatus: ConnectionStatus;
  ownerJid: string | null;
  profileName: string | null;
  profilePicUrl: string | null;
}

export default function WhatsAppScreen() {
  const [status, setStatus] = useState<ConnectionStatus>("unknown");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [instanceInfo, setInstanceInfo] = useState<InstanceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Test message
  const [testNumber, setTestNumber] = useState("");
  const [testMessage, setTestMessage] = useState("Teste do Academia App! 💪");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`${EVOLUTION_URL}/instance/fetchInstances`, {
        headers: { apikey: API_KEY },
      });
      const data = await res.json();
      const instance = Array.isArray(data)
        ? data.find((i: { name: string }) => i.name === INSTANCE)
        : null;

      if (instance) {
        setStatus(instance.connectionStatus ?? "close");
        setInstanceInfo({
          connectionStatus: instance.connectionStatus,
          ownerJid: instance.ownerJid,
          profileName: instance.profileName,
          profilePicUrl: instance.profilePicUrl,
        });
      } else {
        setStatus("close");
      }
    } catch {
      setError("Nao foi possivel conectar a Evolution API. Verifique se o Docker esta rodando.");
      setStatus("unknown");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchQrCode = useCallback(async () => {
    try {
      const res = await fetch(`${EVOLUTION_URL}/instance/connect/${INSTANCE}`, {
        headers: { apikey: API_KEY },
      });
      const data = await res.json();
      if (data.base64) {
        setQrCode(data.base64);
      } else {
        // QR not ready yet, try again
        setQrCode(null);
      }
    } catch {
      setQrCode(null);
    }
  }, []);

  const createInstance = async () => {
    try {
      setLoading(true);
      await fetch(`${EVOLUTION_URL}/instance/create`, {
        method: "POST",
        headers: { apikey: API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({
          instanceName: INSTANCE,
          integration: "WHATSAPP-BAILEYS",
          qrcode: true,
        }),
      });
      await fetchStatus();
    } catch {
      setError("Erro ao criar instancia");
    } finally {
      setLoading(false);
    }
  };

  const disconnectInstance = async () => {
    try {
      await fetch(`${EVOLUTION_URL}/instance/logout/${INSTANCE}`, {
        method: "DELETE",
        headers: { apikey: API_KEY },
      });
      setStatus("close");
      setInstanceInfo(null);
      setQrCode(null);
    } catch {
      // silent
    }
  };

  const sendTestMessage = async () => {
    if (!testNumber.trim()) return;
    setSending(true);
    setSendResult(null);
    try {
      let phone = testNumber.replace(/\D/g, "");
      if (!phone.startsWith("55")) phone = "55" + phone;

      const res = await fetch(`${EVOLUTION_URL}/message/sendText/${INSTANCE}`, {
        method: "POST",
        headers: { apikey: API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ number: phone, text: testMessage }),
      });
      const data = await res.json();
      if (data.key || data.status === "PENDING") {
        setSendResult("success");
      } else {
        setSendResult("error");
      }
    } catch {
      setSendResult("error");
    } finally {
      setSending(false);
    }
  };

  // Poll status
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(() => {
      fetchStatus();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  // Fetch QR when connecting
  useEffect(() => {
    if (status === "close" || status === "connecting") {
      fetchQrCode();
      const interval = setInterval(fetchQrCode, 3000);
      return () => clearInterval(interval);
    } else {
      setQrCode(null);
    }
  }, [status, fetchQrCode]);

  const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
    open: { label: "Conectado", color: "text-success-500", bg: "bg-success-500/10", dot: "bg-success-500" },
    connecting: { label: "Conectando...", color: "text-warning-500", bg: "bg-warning-500/10", dot: "bg-warning-500" },
    close: { label: "Desconectado", color: "text-danger-500", bg: "bg-danger-500/10", dot: "bg-danger-500" },
    unknown: { label: "Verificando...", color: "text-text-muted", bg: "bg-surface-elevated", dot: "bg-text-muted" },
  };

  const st = statusConfig[status] ?? statusConfig.unknown;

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
            <Text className="text-xs text-text-muted">Evolution API — localhost:8080</Text>
          </View>
          <View className={`flex-row items-center gap-2 px-3 py-2 rounded-full ${st.bg}`}>
            <View className={`w-2.5 h-2.5 rounded-full ${st.dot}`} />
            <Text className={`text-xs font-bold ${st.color}`}>{st.label}</Text>
          </View>
        </View>

        {loading ? (
          <View className="items-center py-20">
            <ActivityIndicator size="large" color="#781BB6" />
            <Text className="text-text-muted text-sm mt-4">Verificando conexao...</Text>
          </View>
        ) : error ? (
          /* Error state */
          <View className="bg-danger-500/10 border border-danger-500/20 rounded-3xl p-6 items-center">
            <Text className="text-4xl mb-4">⚠️</Text>
            <Text className="text-base font-bold text-text-primary text-center mb-2">
              Evolution API nao acessivel
            </Text>
            <Text className="text-sm text-text-muted text-center mb-6 leading-5">
              {error}
            </Text>
            <View className="bg-surface-card rounded-2xl p-4 w-full mb-4">
              <Text className="text-xs text-text-muted font-mono leading-5">
                docker compose -f docker-compose.evolution.yml up -d
              </Text>
            </View>
            <Pressable onPress={fetchStatus} className="bg-violet-500 rounded-2xl px-6 py-3 active:bg-violet-600">
              <Text className="text-white font-bold text-sm">Tentar novamente</Text>
            </Pressable>
          </View>
        ) : status === "open" ? (
          /* Connected state */
          <View>
            {/* Connection info */}
            <View className="bg-success-500/5 border border-success-500/20 rounded-3xl p-6 mb-6">
              <View className="flex-row items-center gap-4 mb-4">
                {instanceInfo?.profilePicUrl ? (
                  <Image
                    source={{ uri: instanceInfo.profilePicUrl }}
                    style={{ width: 56, height: 56, borderRadius: 28 }}
                    contentFit="cover"
                  />
                ) : (
                  <View className="w-14 h-14 bg-success-500/20 rounded-full items-center justify-center">
                    <Text className="text-2xl">✅</Text>
                  </View>
                )}
                <View className="flex-1">
                  <Text className="text-lg font-black text-text-primary">
                    {instanceInfo?.profileName ?? "WhatsApp Conectado"}
                  </Text>
                  <Text className="text-xs text-text-muted mt-0.5">
                    {instanceInfo?.ownerJid?.split("@")[0]?.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, "+$1 ($2) $3-$4") ?? "Numero conectado"}
                  </Text>
                </View>
              </View>
              <View className="bg-success-500/10 rounded-xl p-3">
                <Text className="text-xs text-success-500 font-bold text-center">
                  Pronto para enviar mensagens automaticas
                </Text>
              </View>
            </View>

            {/* Test message */}
            <View className="bg-surface-card border border-surface-border rounded-3xl p-6 mb-6">
              <View className="flex-row items-center gap-3 mb-5">
                <View className="w-10 h-10 bg-violet-500/15 rounded-xl items-center justify-center">
                  <Text className="text-lg">🧪</Text>
                </View>
                <Text className="text-base font-black text-text-primary">Testar Envio</Text>
              </View>

              <View className="gap-4">
                <View>
                  <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">
                    Numero (com DDD)
                  </Text>
                  <TextInput
                    className="bg-dark-300 border-2 border-surface-border rounded-2xl px-5 py-4 text-base text-text-primary"
                    placeholder="11 99999-9999"
                    placeholderTextColor="#6E6382"
                    value={testNumber}
                    onChangeText={setTestNumber}
                    keyboardType="phone-pad"
                  />
                </View>

                <View>
                  <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">
                    Mensagem
                  </Text>
                  <TextInput
                    className="bg-dark-300 border-2 border-surface-border rounded-2xl px-5 py-4 text-sm text-text-primary"
                    placeholder="Mensagem de teste..."
                    placeholderTextColor="#6E6382"
                    value={testMessage}
                    onChangeText={setTestMessage}
                    multiline
                    style={{ minHeight: 80, textAlignVertical: "top" }}
                  />
                </View>

                <Pressable
                  onPress={sendTestMessage}
                  disabled={sending || !testNumber.trim()}
                  className={`rounded-2xl py-4 items-center ${
                    testNumber.trim() ? "bg-violet-500 active:bg-violet-600" : "bg-surface-border"
                  }`}
                >
                  {sending ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className={`font-black text-base ${testNumber.trim() ? "text-white" : "text-text-muted"}`}>
                      Enviar Teste
                    </Text>
                  )}
                </Pressable>

                {sendResult === "success" ? (
                  <View className="bg-success-500/10 border border-success-500/20 rounded-xl p-3">
                    <Text className="text-success-500 text-sm font-bold text-center">
                      Mensagem enviada com sucesso!
                    </Text>
                  </View>
                ) : sendResult === "error" ? (
                  <View className="bg-danger-500/10 border border-danger-500/20 rounded-xl p-3">
                    <Text className="text-danger-500 text-sm font-bold text-center">
                      Erro ao enviar. Verifique o numero.
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            {/* Disconnect */}
            <Pressable
              onPress={disconnectInstance}
              className="border border-danger-500/30 rounded-2xl py-3.5 items-center mb-10 active:bg-danger-500/10"
            >
              <Text className="text-danger-500 font-bold text-sm">Desconectar WhatsApp</Text>
            </Pressable>
          </View>
        ) : (
          /* QR Code / Connecting state */
          <View>
            <View className="bg-surface-card border border-surface-border rounded-3xl p-6 items-center mb-6">
              <Text className="text-lg font-black text-text-primary mb-2">Conectar WhatsApp</Text>
              <Text className="text-sm text-text-muted text-center mb-6 leading-5">
                Escaneie o QR Code com seu WhatsApp Business{"\n"}para conectar o envio automatico.
              </Text>

              {qrCode ? (
                <View className="bg-white rounded-2xl p-4 mb-4">
                  <Image
                    source={{ uri: qrCode }}
                    style={{ width: 260, height: 260 }}
                    contentFit="contain"
                  />
                </View>
              ) : (
                <View className="w-[260px] h-[260px] bg-surface-elevated rounded-2xl items-center justify-center mb-4">
                  <ActivityIndicator size="large" color="#781BB6" />
                  <Text className="text-text-muted text-xs mt-3">Gerando QR Code...</Text>
                </View>
              )}

              <View className="bg-violet-500/10 rounded-xl p-4 w-full">
                <Text className="text-xs text-violet-400 font-bold mb-2">Como conectar:</Text>
                <View className="gap-2">
                  <View className="flex-row gap-2">
                    <Text className="text-xs text-text-muted">1.</Text>
                    <Text className="text-xs text-text-secondary">Abra o WhatsApp no celular</Text>
                  </View>
                  <View className="flex-row gap-2">
                    <Text className="text-xs text-text-muted">2.</Text>
                    <Text className="text-xs text-text-secondary">Menu → Aparelhos conectados</Text>
                  </View>
                  <View className="flex-row gap-2">
                    <Text className="text-xs text-text-muted">3.</Text>
                    <Text className="text-xs text-text-secondary">Conectar aparelho → Escaneie o QR</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Create instance if needed */}
            {status === "unknown" ? (
              <Pressable
                onPress={createInstance}
                className="bg-violet-500 rounded-2xl py-4 items-center mb-6 active:bg-violet-600"
              >
                <Text className="text-white font-black text-base">Criar Instancia</Text>
              </Pressable>
            ) : null}

            {/* Auto-refresh notice */}
            <View className="items-center mb-10">
              <View className="flex-row items-center gap-2">
                <ActivityIndicator size="small" color="#6E6382" />
                <Text className="text-text-muted text-xs">Aguardando conexao... atualiza automaticamente</Text>
              </View>
            </View>
          </View>
        )}

        {/* Features info */}
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
                <View className="w-10 h-10 bg-surface-elevated rounded-xl items-center justify-center">
                  <Text className="text-lg">{item.icon}</Text>
                </View>
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
