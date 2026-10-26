import { Pressable, Text, View } from "react-native";
import { usePathname, router } from "expo-router";
import { AppIcon, type IconName } from "../ui";
import { Logo } from "../ui/Logo";
import { font } from "../../lib/design/tokens";

interface SidebarItem {
  href: string;
  icon: IconName;
  label: string;
  match: string;
}

const items: SidebarItem[] = [
  { href: "/(trainer)/dashboard", icon: "dashboard", label: "Visão geral", match: "dashboard" },
  { href: "/(trainer)/students", icon: "social", label: "Alunos", match: "students" },
  { href: "/(trainer)/chat", icon: "message", label: "Mensagens", match: "/chat" },
  { href: "/(trainer)/exercises", icon: "workout", label: "Exercícios", match: "exercises" },
  { href: "/(trainer)/financial", icon: "financial", label: "Financeiro", match: "financial" },
  { href: "/(trainer)/checkins/builder", icon: "clipboard", label: "Check-ins", match: "checkins" },
  { href: "/(trainer)/checkins/branding", icon: "sparkles", label: "Perfil profissional", match: "branding" },
  { href: "/(trainer)/courses", icon: "courses", label: "Aulas", match: "courses" },
  { href: "/partners", icon: "user", label: "Parceiros", match: "partners" },
];

export function TrainerSidebar() {
  const pathname = usePathname();

  return (
    <View className="w-64 bg-dark-200 border-r border-surface-border pt-8 px-4">
      {/* Brand */}
      <View className="gap-1.5 px-3 mb-10">
          <Logo size="lg" />
          <Text
            className="text-[10px] text-text-muted uppercase"
            style={{ fontFamily: font.semibold, letterSpacing: 1 }}
          >
            Área profissional
          </Text>
      </View>

      {/* Nav items */}
      <View className="gap-1">
        {items.map((item) => {
          const isActive = item.match === "checkins" ? pathname.includes("checkins") && !pathname.includes("branding") : pathname.includes(item.match);
          return (
            <Pressable
              key={item.href}
              onPress={() => router.push(item.href as never)}
              className={`flex-row items-center gap-3 px-4 py-3 rounded-xl ${
                isActive ? "bg-surface-elevated" : "active:bg-surface-hover"
              }`}
            >
              <AppIcon
                name={item.icon}
                size={18}
                color={isActive ? "#3F3F46" : "#71717A"}
                strokeWidth={isActive ? 2.4 : 2}
              />
              <Text
                className={`text-sm ${isActive ? "text-violet-400" : "text-text-secondary"}`}
                style={{ fontFamily: isActive ? font.semibold : font.medium }}
              >
                {item.label}
              </Text>
              {isActive ? <View className="ml-auto w-1 h-4 bg-primary-500 rounded-full" /> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
