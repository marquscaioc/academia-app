import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, type ErrorBoundaryProps } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  useFonts,
  Nunito_400Regular,
  Nunito_400Regular_Italic,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_900Black,
} from "@expo-google-fonts/nunito";
import { AuthProvider } from "../lib/auth/provider";
import { LoadingScreen } from "../components/ui/LoadingScreen";
import { useNotificationObserver } from "../lib/notifications/useNotificationObserver";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

/**
 * App-wide error boundary. expo-router renders this when a route subtree throws,
 * instead of a white screen (critical on web/PC where there is no native crash UI).
 */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-dark-400 items-center justify-center px-8">
        <View className="items-center max-w-[420px] w-full">
          <Text className="text-2xl font-black text-text-primary text-center" style={{ fontFamily: "Nunito_900Black" }}>
            Algo deu errado
          </Text>
          <Text className="text-sm text-text-secondary text-center mt-3 mb-6" style={{ fontFamily: "Nunito_400Regular" }}>
            Tivemos um problema ao carregar esta tela. Tente novamente.
          </Text>
          {__DEV__ ? (
            <Text className="text-xs text-danger-500 text-center mb-6">{error.message}</Text>
          ) : null}
          <Pressable onPress={retry} className="bg-violet-500 rounded-2xl px-6 py-3">
            <Text className="text-white font-bold text-sm" style={{ fontFamily: "Nunito_700Bold" }}>
              Tentar novamente
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_400Regular_Italic,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_900Black,
  });

  useNotificationObserver();

  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <LoadingScreen />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StatusBar style="light" />
          <Slot />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
