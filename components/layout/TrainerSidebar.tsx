import { Pressable, Text, View } from "react-native";
import { usePathname, router } from "expo-router";
import { AppIcon, type IconName } from "../ui";
import { font } from "../../lib/design/tokens";

interface SidebarItem {
  href: string;
  icon: IconName;
  label: string;
  match: string;
}

const items: SidebarItem[] = [
  { href: "/(trainer)/dashboard", icon: "dashboard", label: "Dashboard", match: "dashboard" },
  { href: "/(trainer)/students", icon: "social", label: "Alunos", match: "students" },
  { href: "/(trainer)/exercises", icon: "workout", label: "Exercícios", match: "exercises" },
  { href: "/(trainer)/financial", icon: "financial", label: "Financeiro", match: "financial" },
  { href: "/(trainer)/checkins/builder", icon: "clipboard", label: "Check-ins", match: "checkins" },
  { href: "/(trainer)/checkins/branding", icon: "sparkles", label: "Branding", match: "branding" },
  { href: "/(trainer)/whatsapp", icon: "chat", label: "WhatsApp", match: "whatsapp" },
  { href: "/(trainer)/courses", icon: "courses", label: "Aulas", match: "courses" },
];

export function TrainerSidebar() {
  const pathname = usePathname();

  return (
    <View className="w-64 bg-dark-200 border-r border-surface-border pt-8 px-4">
      {/* Brand */}
      <View className="flex-row items-center gap-3 px-3 mb-10">
        <View className="w-10 h-10 bg-violet-500 rounded-2xl items-center justify-center">
          <Text className="text-white text-lg" style={{ fontFamily: font.display }}>G</Text>
        </View>
        <View>
          <Text className="text-xl text-text-primary" style={{ fontFamily: font.display, letterSpacing: -0.3 }}>
            Projeto Gaab
          </Text>
          <Text
            className="text-[9px] text-text-muted uppercase"
            style={{ fontFamily: font.semibold, letterSpacing: 2 }}
          >
            Painel Pro
          </Text>
        </View>
      </View>

      {/* Nav items */}
      <View className="gap-1">
        {items.map((item) => {
          const isActive = pathname.includes(item.match);
          return (
            <Pressable
              key={item.href}
              onPress={() => router.push(item.href as never)}
              className={`flex-row items-center gap-3 px-4 py-3 rounded-xl ${
                isActive ? "bg-violet-500/10" : "active:bg-surface-hover"
              }`}
            >
              <AppIcon
                name={item.icon}
                size={18}
                color={isActive ? "#9B40D8" : "#6E6382"}
                strokeWidth={isActive ? 2.4 : 2}
              />
              <Text
                className={`text-sm ${isActive ? "text-violet-400" : "text-text-muted"}`}
                style={{ fontFamily: isActive ? font.semibold : font.medium }}
              >
                {item.label}
              </Text>
              {isActive ? <View className="ml-auto w-1.5 h-1.5 bg-violet-500 rounded-full" /> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
