import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, type ErrorBoundaryProps } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Geist_400Regular } from "@expo-google-fonts/geist/400Regular";
import { Geist_500Medium } from "@expo-google-fonts/geist/500Medium";
import { Geist_600SemiBold } from "@expo-google-fonts/geist/600SemiBold";
import { Geist_700Bold } from "@expo-google-fonts/geist/700Bold";
import { Geist_900Black } from "@expo-google-fonts/geist/900Black";
import { AuthProvider, useAuth } from "../lib/auth/provider";
import { useRestNotifications } from "../lib/notifications/useRestNotifications";
import { ToastHost } from "../components/ui/ToastHost";
import { LoadingScreen } from "../components/ui/LoadingScreen";
import { useNotificationObserver } from "../lib/notifications/useNotificationObserver";
import { font } from "../lib/design/tokens";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

function WorkoutRestNotifications() {
  const { user, identityReady } = useAuth();
  useRestNotifications(user?.id ?? null, identityReady);
  return null;
}

/**
 * App-wide error boundary. expo-router renders this when a route subtree throws,
 * instead of a white screen (critical on web/PC where there is no native crash UI).
 */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-dark-400 items-center justify-center px-8">
        <View className="items-center max-w-[420px] w-full">
          <Text className="text-text-primary text-center" style={{ fontFamily: font.display, fontSize: 34, letterSpacing: -0.4 }}>
            Algo deu errado
          </Text>
          <Text className="text-sm text-text-secondary text-center mt-3 mb-6" style={{ fontFamily: font.regular }}>
            Tivemos um problema ao carregar esta tela. Tente novamente.
          </Text>
          {__DEV__ ? (
            <Text className="text-xs text-danger-500 text-center mb-6 font-sans">{error.message}</Text>
          ) : null}
          <Pressable onPress={retry} className="bg-violet-500 rounded-2xl px-6 py-3">
            <Text className="text-white text-sm" style={{ fontFamily: font.semibold }}>
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
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
    Geist_900Black,
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
          <WorkoutRestNotifications />
          <StatusBar style="dark" />
          <Slot />
          <ToastHost />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
