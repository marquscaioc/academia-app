import { Tabs } from "expo-router";
import { Text, View } from "react-native";

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    home: "🏠",
    workouts: "🏋️",
    diet: "🥗",
    progress: "📊",
    social: "👥",
    chat: "💬",
  };
  return (
    <View className="items-center">
      <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.4 }}>
        {icons[name] ?? "●"}
      </Text>
      {focused ? (
        <View className="w-1.5 h-1.5 bg-lime-500 rounded-full mt-1" />
      ) : null}
    </View>
  );
}

export default function StudentLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#BBFF00",
        tabBarInactiveTintColor: "#6B6B73",
        tabBarStyle: {
          backgroundColor: "#111113",
          borderTopWidth: 1,
          borderTopColor: "#2A2A30",
          paddingTop: 8,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          letterSpacing: 0.5,
          textTransform: "uppercase",
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Inicio",
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="(workouts)"
        options={{
          title: "Treinos",
          tabBarIcon: ({ focused }) => <TabIcon name="workouts" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="(diet)"
        options={{
          title: "Dieta",
          tabBarIcon: ({ focused }) => <TabIcon name="diet" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="(progress)"
        options={{
          title: "Progresso",
          tabBarIcon: ({ focused }) => <TabIcon name="progress" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="(social)"
        options={{
          title: "Social",
          tabBarIcon: ({ focused }) => <TabIcon name="social" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="(chat)"
        options={{
          title: "Chat",
          tabBarIcon: ({ focused }) => <TabIcon name="chat" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
