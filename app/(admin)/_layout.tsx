import { Tabs } from "expo-router";
import { View } from "react-native";
import { RoleGuard } from "../../components/auth/RoleGuard";
import { WebFrame } from "../../components/layout/WebFrame";
import { AppIcon, type IconName } from "../../components/ui";

const TAB_ICON: Record<string, IconName> = {
  overview: "progress",
  users: "social",
  moderation: "moderation",
};

function TabIcon({ name, focused, color }: { name: string; focused: boolean; color: string }) {
  return (
    <View className="items-center">
      <AppIcon name={TAB_ICON[name] ?? "progress"} size={22} color={color} strokeWidth={focused ? 2.4 : 1.8} />
      {focused ? <View className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-1" /> : null}
    </View>
  );
}

function AdminTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#781BB6",
        tabBarInactiveTintColor: "#6E6382",
        tabBarStyle: {
          backgroundColor: "#14101B",
          borderTopWidth: 1,
          borderTopColor: "#2E2740",
          paddingTop: 8,
          height: 65,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
      }}
    >
      <Tabs.Screen name="overview" options={{ title: "Overview", tabBarIcon: ({ focused, color }) => <TabIcon name="overview" focused={focused} color={color} /> }} />
      <Tabs.Screen name="users" options={{ title: "Usuarios", tabBarIcon: ({ focused, color }) => <TabIcon name="users" focused={focused} color={color} /> }} />
      <Tabs.Screen name="moderation" options={{ title: "Moderacao", tabBarIcon: ({ focused, color }) => <TabIcon name="moderation" focused={focused} color={color} /> }} />
    </Tabs>
  );
}

export default function AdminLayout() {
  return (
    <RoleGuard allow="admin">
      <WebFrame maxWidth={680}>
        <AdminTabs />
      </WebFrame>
    </RoleGuard>
  );
}
