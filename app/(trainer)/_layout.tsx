import { Tabs } from "expo-router";
import { View } from "react-native";
import { useIsDesktop } from "../../lib/layout/useIsDesktop";
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
  const isDesktop = useIsDesktop();

  return (
    <View className="flex-1 flex-row">
      {isDesktop ? <TrainerSidebar /> : null}
      <View className="flex-1">
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#27272A",
            tabBarInactiveTintColor: "#71717A",
            tabBarStyle: isDesktop
              ? { display: "none" as const }
              : {
                  backgroundColor: "#FFFFFF",
                  borderTopWidth: 1,
                  borderTopColor: "#E4E4E7",
                  paddingTop: 8,
                  height: 65,
                },
            tabBarLabelStyle: {
              fontFamily: "Geist_600SemiBold",
              fontSize: 10,
              fontWeight: "700",
              letterSpacing: 0.5,
            },
          }}
        >
          <Tabs.Screen name="dashboard" options={{ title: "Visão geral", tabBarIcon: ({ focused, color }) => <TabIcon name="dashboard" focused={focused} color={color} /> }} />
          <Tabs.Screen name="students" options={{ title: "Alunos", tabBarIcon: ({ focused, color }) => <TabIcon name="students" focused={focused} color={color} /> }} />
          <Tabs.Screen name="exercises" options={{ title: "Exercícios", tabBarIcon: ({ focused, color }) => <TabIcon name="exercises" focused={focused} color={color} /> }} />
          <Tabs.Screen name="financial" options={{ title: "Financeiro", tabBarIcon: ({ focused, color }) => <TabIcon name="financial" focused={focused} color={color} /> }} />
          <Tabs.Screen name="chat" options={{ href: null }} />
          <Tabs.Screen name="checkins" options={{ href: null }} />
          <Tabs.Screen name="workout-builder" options={{ href: null }} />
          <Tabs.Screen name="diet-builder" options={{ href: null }} />
          <Tabs.Screen name="recipes" options={{ href: null }} />
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
