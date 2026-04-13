import { Tabs } from "expo-router";
import { Platform, Text, View } from "react-native";
import { TrainerSidebar } from "../../components/layout/TrainerSidebar";

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    dashboard: "📊",
    students: "👥",
    exercises: "🏋️",
    financial: "💰",
  };
  return (
    <View className="items-center">
      <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.4 }}>{icons[name] ?? "●"}</Text>
      {focused ? <View className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-1" /> : null}
    </View>
  );
}

export default function TrainerLayout() {
  const isWeb = Platform.OS === "web";

  return (
    <View className="flex-1 flex-row">
      {isWeb ? <TrainerSidebar /> : null}
      <View className="flex-1">
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#781BB6",
            tabBarInactiveTintColor: "#6E6382",
            tabBarStyle: isWeb
              ? { display: "none" as const }
              : {
                  backgroundColor: "#14101B",
                  borderTopWidth: 1,
                  borderTopColor: "#2E2740",
                  paddingTop: 8,
                  height: 65,
                },
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: "700",
              letterSpacing: 0.5,
            },
          }}
        >
          <Tabs.Screen name="dashboard" options={{ title: "Dashboard", tabBarIcon: ({ focused }) => <TabIcon name="dashboard" focused={focused} /> }} />
          <Tabs.Screen name="students" options={{ title: "Alunos", tabBarIcon: ({ focused }) => <TabIcon name="students" focused={focused} /> }} />
          <Tabs.Screen name="exercises" options={{ title: "Exercicios", tabBarIcon: ({ focused }) => <TabIcon name="exercises" focused={focused} /> }} />
          <Tabs.Screen name="financial" options={{ title: "Financeiro", tabBarIcon: ({ focused }) => <TabIcon name="financial" focused={focused} /> }} />
          <Tabs.Screen name="checkins" options={{ href: null }} />
          <Tabs.Screen name="workout-builder" options={{ href: null }} />
          <Tabs.Screen name="diet-builder" options={{ href: null }} />
          <Tabs.Screen name="whatsapp" options={{ href: null }} />
        </Tabs>
      </View>
    </View>
  );
}
