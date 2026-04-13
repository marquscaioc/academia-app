import { Tabs } from "expo-router";
import { Text, View } from "react-native";

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    overview: "📊",
    users: "👥",
    moderation: "🛡️",
  };
  return (
    <View className="items-center">
      <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.4 }}>{icons[name] ?? "●"}</Text>
      {focused ? <View className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-1" /> : null}
    </View>
  );
}

export default function AdminLayout() {
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
      <Tabs.Screen name="overview" options={{ title: "Overview", tabBarIcon: ({ focused }) => <TabIcon name="overview" focused={focused} /> }} />
      <Tabs.Screen name="users" options={{ title: "Usuarios", tabBarIcon: ({ focused }) => <TabIcon name="users" focused={focused} /> }} />
      <Tabs.Screen name="moderation" options={{ title: "Moderacao", tabBarIcon: ({ focused }) => <TabIcon name="moderation" focused={focused} /> }} />
    </Tabs>
  );
}
