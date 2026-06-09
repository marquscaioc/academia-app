import { Tabs } from "expo-router";
import { Platform, View } from "react-native";
import { TrainerSidebar } from "../../components/layout/TrainerSidebar";
import { RoleGuard } from "../../components/auth/RoleGuard";
import { AppIcon, type IconName } from "../../components/ui";

const TAB_ICON: Record<string, IconName> = {
  dashboard: "dashboard",
  students: "social",
  exercises: "workout",
  financial: "financial",
};

function TabIcon({ name, focused, color }: { name: string; focused: boolean; color: string }) {
  return (
    <View className="items-center">
      <AppIcon name={TAB_ICON[name] ?? "dashboard"} size={22} color={color} strokeWidth={focused ? 2.4 : 1.8} />
      {focused ? <View className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-1" /> : null}
    </View>
  );
}

function TrainerTabs() {
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
          <Tabs.Screen name="dashboard" options={{ title: "Dashboard", tabBarIcon: ({ focused, color }) => <TabIcon name="dashboard" focused={focused} color={color} /> }} />
          <Tabs.Screen name="students" options={{ title: "Alunos", tabBarIcon: ({ focused, color }) => <TabIcon name="students" focused={focused} color={color} /> }} />
          <Tabs.Screen name="exercises" options={{ title: "Exercicios", tabBarIcon: ({ focused, color }) => <TabIcon name="exercises" focused={focused} color={color} /> }} />
          <Tabs.Screen name="financial" options={{ title: "Financeiro", tabBarIcon: ({ focused, color }) => <TabIcon name="financial" focused={focused} color={color} /> }} />
          <Tabs.Screen name="checkins" options={{ href: null }} />
          <Tabs.Screen name="workout-builder" options={{ href: null }} />
          <Tabs.Screen name="diet-builder" options={{ href: null }} />
          <Tabs.Screen name="whatsapp" options={{ href: null }} />
          <Tabs.Screen name="courses" options={{ href: null }} />
        </Tabs>
      </View>
    </View>
  );
}

export default function TrainerLayout() {
  return (
    <RoleGuard allow="trainer">
      <TrainerTabs />
    </RoleGuard>
  );
}
