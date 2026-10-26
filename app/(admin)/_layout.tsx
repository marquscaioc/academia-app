import { Tabs } from "expo-router";
import { View } from "react-native";
import { useIsDesktop } from "../../lib/layout/useIsDesktop";
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
  const isDesktop = useIsDesktop();
  return (
    <View className="flex-1 flex-row">
      {isDesktop ? <AppSidebar items={ADMIN_NAV} subtitle="Admin" /> : null}
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
              fontFamily: "Geist_600SemiBold", fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
          }}
        >
          <Tabs.Screen name="overview" options={{ title: "Overview", tabBarIcon: ({ focused, color }) => <TabIcon name="overview" focused={focused} color={color} /> }} />
          <Tabs.Screen name="users" options={{ title: "Usuários", tabBarIcon: ({ focused, color }) => <TabIcon name="users" focused={focused} color={color} /> }} />
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
