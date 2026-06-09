import { Tabs } from "expo-router";
import { Platform, View } from "react-native";
import { RoleGuard } from "../../components/auth/RoleGuard";
import { AppSidebar, ADMIN_NAV } from "../../components/layout/AppSidebar";
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
  const isWeb = Platform.OS === "web";
  return (
    <View className="flex-1 flex-row">
      {isWeb ? <AppSidebar items={ADMIN_NAV} subtitle="Admin" /> : null}
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
            tabBarLabelStyle: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
          }}
        >
          <Tabs.Screen name="overview" options={{ title: "Overview", tabBarIcon: ({ focused, color }) => <TabIcon name="overview" focused={focused} color={color} /> }} />
          <Tabs.Screen name="users" options={{ title: "Usuarios", tabBarIcon: ({ focused, color }) => <TabIcon name="users" focused={focused} color={color} /> }} />
          <Tabs.Screen name="moderation" options={{ title: "Moderacao", tabBarIcon: ({ focused, color }) => <TabIcon name="moderation" focused={focused} color={color} /> }} />
        </Tabs>
      </View>
    </View>
  );
}

export default function AdminLayout() {
  return (
    <RoleGuard allow="admin">
      <AdminTabs />
    </RoleGuard>
  );
}
