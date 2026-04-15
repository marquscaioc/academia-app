import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase/client";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);

  const handleReset = async () => {
    if (!email) { setError("Informe seu email"); return; }
    setError(""); setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (resetError) { setError("Erro ao enviar email. Tente novamente."); return; }
    setSent(true);
  };

  if (sent) {
    return (
      <SafeAreaView className="flex-1 bg-dark-400">
        <View className="flex-1 justify-center px-8 max-w-[440px] w-full self-center">
          <View className="items-center">
            <View className="w-20 h-20 bg-violet-500/20 rounded-3xl items-center justify-center mb-6">
              <Text className="text-4xl">📧</Text>
            </View>
            <Text className="text-2xl font-black text-text-primary text-center">
              Email enviado!
            </Text>
            <Text className="text-sm text-text-muted text-center mt-3 leading-5">
              Verifique sua caixa de entrada e siga as instrucoes para redefinir sua senha.
            </Text>
          </View>
          <Link href="/(auth)/login" asChild>
            <Pressable className="bg-violet-500 rounded-2xl items-center mt-8 active:bg-violet-600" style={{ paddingVertical: 18 }}>
              <Text className="text-white font-black text-base tracking-wide uppercase">Voltar para login</Text>
            </Pressable>
          </Link>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <View className="flex-1 justify-center px-8 max-w-[440px] w-full self-center">
          <Link href="/(auth)/login" asChild>
            <Pressable className="mb-8">
              <Text className="text-text-muted text-sm font-medium">← Voltar</Text>
            </Pressable>
          </Link>
          <View className="mb-10">
            <Text className="text-3xl font-black text-text-primary tracking-tight">Recuperar senha</Text>
            <Text className="text-sm text-text-muted mt-2">Informe seu email para receber o link de recuperacao</Text>
          </View>
          {error ? (
            <View className="bg-danger-500/10 border border-danger-500/20 rounded-2xl p-4 mb-5">
              <Text className="text-danger-500 text-center text-sm font-medium">{error}</Text>
            </View>
          ) : null}
          <View className="gap-4">
            <View>
              <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Email</Text>
              <TextInput
                className={`rounded-2xl px-5 py-4 text-base text-text-primary ${
                  focused ? "bg-surface-elevated border-2 border-violet-500/50" : "bg-surface-card border-2 border-surface-border"
                }`}
                placeholder="seu@email.com"
                placeholderTextColor="#6E6580"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            <Pressable
              onPress={handleReset}
              disabled={loading}
              className={`rounded-2xl items-center mt-2 ${loading ? "bg-violet-700" : "bg-violet-500 active:bg-violet-600"}`}
              style={{ paddingVertical: 18 }}
            >
              {loading ? <ActivityIndicator color="#FFFFFF" /> : (
                <Text className="text-white font-black text-base tracking-wide uppercase">Enviar link</Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
