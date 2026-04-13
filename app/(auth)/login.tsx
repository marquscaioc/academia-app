import { Link, router } from "expo-router";
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
import { useAuth } from "../../lib/auth/provider";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Preencha todos os campos");
      return;
    }
    setError("");
    setLoading(true);
    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError("Email ou senha incorretos");
      setLoading(false);
      return;
    }
    router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-8 max-w-[440px] w-full self-center">
          {/* Brand */}
          <View className="mb-14 items-center">
            <View className="w-16 h-16 bg-violet-400 rounded-2xl items-center justify-center mb-5 rotate-6">
              <Text className="text-dark-400 text-3xl font-black -rotate-6">A</Text>
            </View>
            <Text className="text-4xl font-black text-text-primary tracking-tight">
              ACADEMIA
            </Text>
            <Text className="text-base text-text-muted mt-2 tracking-widest uppercase text-xs">
              Treine. Evolua. Conquiste.
            </Text>
          </View>

          {/* Error */}
          {error ? (
            <View className="bg-danger-500/10 border border-danger-500/20 rounded-2xl p-4 mb-5">
              <Text className="text-danger-500 text-center text-sm font-medium">{error}</Text>
            </View>
          ) : null}

          {/* Form */}
          <View className="gap-4">
            <View>
              <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">
                Email
              </Text>
              <TextInput
                className={`rounded-2xl px-5 py-4 text-base text-text-primary ${
                  focusedField === "email"
                    ? "bg-surface-elevated border-2 border-violet-400/50"
                    : "bg-surface-card border-2 border-surface-border"
                }`}
                placeholder="seu@email.com"
                placeholderTextColor="#6B6B73"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            <View>
              <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">
                Senha
              </Text>
              <TextInput
                className={`rounded-2xl px-5 py-4 text-base text-text-primary ${
                  focusedField === "password"
                    ? "bg-surface-elevated border-2 border-violet-400/50"
                    : "bg-surface-card border-2 border-surface-border"
                }`}
                placeholder="Sua senha"
                placeholderTextColor="#6B6B73"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                secureTextEntry
                autoComplete="password"
              />
            </View>

            <Link href="/(auth)/forgot-password" asChild>
              <Pressable className="self-end py-1">
                <Text className="text-text-muted text-xs font-medium">
                  Esqueceu a senha?
                </Text>
              </Pressable>
            </Link>

            {/* CTA Button */}
            <Pressable
              onPress={handleLogin}
              disabled={loading}
              className={`rounded-2xl py-4.5 items-center mt-2 ${
                loading ? "bg-violet-700" : "bg-violet-400 active:bg-violet-500"
              }`}
              style={{ paddingVertical: 18 }}
            >
              {loading ? (
                <ActivityIndicator color="#0A0A0B" />
              ) : (
                <Text className="text-dark-400 font-black text-base tracking-wide uppercase">
                  Entrar
                </Text>
              )}
            </Pressable>
          </View>

          {/* Divider */}
          <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-surface-border" />
            <Text className="text-text-muted text-xs mx-4">ou</Text>
            <View className="flex-1 h-px bg-surface-border" />
          </View>

          {/* Register link */}
          <View className="flex-row justify-center">
            <Text className="text-text-muted text-sm">Novo por aqui? </Text>
            <Link href="/(auth)/register" asChild>
              <Pressable>
                <Text className="text-violet-400 font-bold text-sm">
                  Criar conta
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
