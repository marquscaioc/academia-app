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
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useAuth } from "../../lib/auth/provider";
import { DisplayHeading, Logo } from "../../components/ui";
import { amethystGlow, font } from "../../lib/design/tokens";

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
      {/* Ambient gradient */}
      <LinearGradient
        colors={["rgba(120,27,182,0.32)", "rgba(198,54,224,0.08)", "transparent"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 520 }}
        pointerEvents="none"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-8 max-w-[440px] w-full self-center">
          {/* Brand — logo + editorial wordmark */}
          <Animated.View entering={FadeIn.duration(500)} className="mb-12 items-center">
            <Logo size="xl" />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(120).springify()} className="items-center mb-2">
            <DisplayHeading size="md" italic tone="muted">
              Bem-vindo ao
            </DisplayHeading>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(200).springify()} className="items-center mb-12">
            <DisplayHeading size="2xl" tone="primary">
              Projeto Gaab.
            </DisplayHeading>
            <Text
              className="text-fuchsia-400 mt-2"
              style={{ fontFamily: font.semibold, fontSize: 10, letterSpacing: 3 }}
            >
              ROYAL AMETHYST · EST. 2026
            </Text>
          </Animated.View>

          {/* Error */}
          {error ? (
            <Animated.View
              entering={FadeIn.duration(200)}
              className="bg-danger-500/10 border border-danger-500/20 rounded-2xl p-4 mb-5"
            >
              <Text className="text-danger-500 text-center text-sm" style={{ fontFamily: font.medium }}>
                {error}
              </Text>
            </Animated.View>
          ) : null}

          {/* Form */}
          <Animated.View entering={FadeInDown.delay(280).springify()} className="gap-4">
            <View>
              <Text
                className="text-[11px] text-text-muted mb-2 ml-0.5 uppercase"
                style={{ fontFamily: font.semibold, letterSpacing: 1.5 }}
              >
                Email
              </Text>
              <TextInput
                className={`rounded-2xl px-4 py-3.5 text-[15px] text-text-primary ${
                  focusedField === "email"
                    ? "bg-surface-elevated border border-violet-400/80"
                    : "bg-surface-card/80 border border-surface-border"
                }`}
                style={{ fontFamily: font.regular }}
                placeholder="seu@email.com"
                placeholderTextColor="#6E6382"
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
              <Text
                className="text-[11px] text-text-muted mb-2 ml-0.5 uppercase"
                style={{ fontFamily: font.semibold, letterSpacing: 1.5 }}
              >
                Senha
              </Text>
              <TextInput
                className={`rounded-2xl px-4 py-3.5 text-[15px] text-text-primary ${
                  focusedField === "password"
                    ? "bg-surface-elevated border border-violet-400/80"
                    : "bg-surface-card/80 border border-surface-border"
                }`}
                style={{ fontFamily: font.regular }}
                placeholder="Sua senha"
                placeholderTextColor="#6E6382"
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
                <Text className="text-text-muted text-xs" style={{ fontFamily: font.medium }}>
                  Esqueceu a senha?
                </Text>
              </Pressable>
            </Link>

            {/* CTA Button — gradient */}
            <Pressable
              onPress={handleLogin}
              disabled={loading}
              className="rounded-2xl overflow-hidden mt-2"
              style={loading ? undefined : amethystGlow}
            >
              <LinearGradient
                colors={loading ? ["#50107D", "#86169E"] : ["#781BB6", "#C636E0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.9 }}
                style={{ paddingVertical: 17, alignItems: "center" }}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white text-[15px]" style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}>
                    Entrar
                  </Text>
                )}
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Divider + Register link — centered block */}
          <Animated.View entering={FadeIn.delay(360)} className="items-center mt-8">
            <View className="flex-row items-center w-full mb-6">
              <View className="flex-1 h-px bg-surface-border" />
              <Text
                className="text-text-muted text-[10px] mx-4 uppercase"
                style={{ fontFamily: font.semibold, letterSpacing: 2 }}
              >
                ou
              </Text>
              <View className="flex-1 h-px bg-surface-border" />
            </View>
            <Text className="text-text-muted text-sm text-center" style={{ fontFamily: font.regular }}>
              Novo por aqui?
            </Text>
            <Link href="/(auth)/register" asChild>
              <Pressable className="mt-2 py-1">
                <Text className="text-fuchsia-400 text-sm text-center" style={{ fontFamily: font.semibold }}>
                  Criar conta →
                </Text>
              </Pressable>
            </Link>

            <View className="flex-row items-center gap-2 mt-8">
              <Link href="/termos" asChild>
                <Pressable className="py-1">
                  <Text className="text-text-muted text-[11px]">Termos</Text>
                </Pressable>
              </Link>
              <Text className="text-surface-border text-[11px]">·</Text>
              <Link href="/privacidade" asChild>
                <Pressable className="py-1">
                  <Text className="text-text-muted text-[11px]">Privacidade</Text>
                </Pressable>
              </Link>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
