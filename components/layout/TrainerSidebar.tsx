import { Pressable, Text, View } from "react-native";
import { usePathname, router } from "expo-router";

interface SidebarItem {
  href: string;
  icon: string;
  label: string;
  match: string;
}

const items: SidebarItem[] = [
  { href: "/(trainer)/dashboard", icon: "📊", label: "Dashboard", match: "dashboard" },
  { href: "/(trainer)/students", icon: "👥", label: "Alunos", match: "students" },
  { href: "/(trainer)/exercises", icon: "🏋️", label: "Exercicios", match: "exercises" },
  { href: "/(trainer)/financial", icon: "💰", label: "Financeiro", match: "financial" },
  { href: "/(trainer)/checkins/builder", icon: "📋", label: "Check-ins", match: "checkins" },
  { href: "/(trainer)/checkins/branding", icon: "🎨", label: "Branding", match: "branding" },
];

export function TrainerSidebar() {
  const pathname = usePathname();

  return (
    <View className="w-64 bg-dark-200 border-r border-surface-border pt-8 px-4">
      {/* Brand */}
      <View className="flex-row items-center gap-3 px-3 mb-10">
        <View className="w-10 h-10 bg-lime-500 rounded-xl items-center justify-center rotate-3">
          <Text className="text-dark-400 text-lg font-black -rotate-3">A</Text>
        </View>
        <View>
          <Text className="text-base font-black text-text-primary">ACADEMIA</Text>
          <Text className="text-[9px] text-text-muted tracking-widest uppercase">Painel Pro</Text>
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
                isActive ? "bg-lime-500/10" : "active:bg-surface-hover"
              }`}
            >
              <Text style={{ fontSize: 18, opacity: isActive ? 1 : 0.5 }}>{item.icon}</Text>
              <Text className={`text-sm font-bold ${isActive ? "text-lime-500" : "text-text-muted"}`}>
                {item.label}
              </Text>
              {isActive ? (
                <View className="ml-auto w-1.5 h-1.5 bg-lime-500 rounded-full" />
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
