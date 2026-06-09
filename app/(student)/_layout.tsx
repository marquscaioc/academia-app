import { Tabs } from "expo-router";
import { Platform, View } from "react-native";
import { BrandingProvider, useBranding } from "../../lib/branding/BrandingProvider";
import { RoleGuard } from "../../components/auth/RoleGuard";
import { AppSidebar, STUDENT_NAV } from "../../components/layout/AppSidebar";
import { AppIcon, type IconName } from "../../components/ui";

const TAB_ICON: Record<string, IconName> = {
  home: "home",
  workouts: "workout",
  diet: "diet",
  progress: "progress",
  social: "social",
  chat: "chat",
  courses: "courses",
};

function TabIcon({ name, focused, color }: { name: string; focused: boolean; color: string }) {
  return (
    <View className="items-center">
      <AppIcon name={TAB_ICON[name] ?? "home"} size={22} color={color} strokeWidth={focused ? 2.4 : 1.8} />
      {focused ? <View className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-1" /> : null}
    </View>
  );
}

function StudentTabs() {
  const { primaryColor } = useBranding();
  const isWeb = Platform.OS === "web";

  return (
    <View className="flex-1 flex-row">
      {isWeb ? <AppSidebar items={STUDENT_NAV} subtitle="Aluno" /> : null}
      <View className="flex-1">
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: primaryColor,
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
              textTransform: "uppercase",
            },
          }}
        >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Inicio",
          tabBarIcon: ({ focused, color }) => <TabIcon name="home" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(workouts)"
        options={{
          title: "Treinos",
          tabBarIcon: ({ focused, color }) => <TabIcon name="workouts" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(diet)"
        options={{
          title: "Dieta",
          tabBarIcon: ({ focused, color }) => <TabIcon name="diet" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(progress)"
        options={{
          title: "Progresso",
          tabBarIcon: ({ focused, color }) => <TabIcon name="progress" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(social)"
        options={{
          title: "Social",
          tabBarIcon: ({ focused, color }) => <TabIcon name="social" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(chat)"
        options={{
          title: "Chat",
          tabBarIcon: ({ focused, color }) => <TabIcon name="chat" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(courses)"
        options={{
          title: "Aulas",
          tabBarIcon: ({ focused, color }) => <TabIcon name="courses" focused={focused} color={color} />,
        }}
      />
        </Tabs>
      </View>
    </View>
  );
}

export default function StudentLayout() {
  return (
    <RoleGuard allow="student">
      <BrandingProvider>
        <StudentTabs />
      </BrandingProvider>
    </RoleGuard>
  );
}
