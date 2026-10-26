import { Pressable, Text, View } from "react-native";
import { router, useSegments } from "expo-router";
import { AppIcon, type IconName } from "../ui";
import { useAuth } from "../../lib/auth/provider";
import { font } from "../../lib/design/tokens";

export interface SidebarItem {
  href: string;
  icon: IconName;
  label: string;
  /** Segment to match in useSegments() for the active state, e.g. "(workouts)" or "overview". */
  match: string;
}

/**
 * Web-only navigation rail for full-screen desktop layouts. Active state uses
 * route segments (works with expo-router group routes like the student tabs).
 */
export function AppSidebar({ items, subtitle }: { items: SidebarItem[]; subtitle: string }) {
  const segments = useSegments() as string[];
  const { profile, signOut } = useAuth();

  return (
    <View className="w-60 bg-dark-200 border-r border-surface-border pt-8 px-4 justify-between">
      <View>
        {/* Brand */}
        <View className="flex-row items-center gap-3 px-3 mb-10">
          <View className="w-10 h-10 bg-violet-500 rounded-2xl items-center justify-center">
            <Text className="text-white text-lg" style={{ fontFamily: font.display }}>G</Text>
          </View>
          <View>
            <Text className="text-xl text-text-primary" style={{ fontFamily: font.display, letterSpacing: -0.3 }}>
              Projeto Gaab
            </Text>
            <Text className="text-[9px] text-text-muted uppercase" style={{ fontFamily: font.semibold, letterSpacing: 2 }}>
              {subtitle}
            </Text>
          </View>
        </View>

        {/* Nav */}
        <View className="gap-1">
          {items.map((item) => {
            const isActive = segments.includes(item.match);
            return (
              <Pressable
                key={item.href}
                onPress={() => router.push(item.href as never)}
                className={`flex-row items-center gap-3 px-4 py-3 rounded-xl ${
                  isActive ? "bg-violet-500/10" : "active:bg-surface-hover"
                }`}
              >
                <AppIcon name={item.icon} size={18} color={isActive ? "#9B40D8" : "#6E6382"} strokeWidth={isActive ? 2.4 : 2} />
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

      {/* Footer: profile + logout */}
      <View className="pb-6 pt-4 border-t border-surface-border gap-1">
        <Pressable
          onPress={() => router.push("/profile/edit" as never)}
          className="flex-row items-center gap-3 px-4 py-3 rounded-xl active:bg-surface-hover"
        >
          <AppIcon name="user" size={18} color="#6E6382" strokeWidth={2} />
          <Text className="text-sm text-text-muted" style={{ fontFamily: font.medium }} numberOfLines={1}>
            {profile?.full_name ?? "Perfil"}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => signOut()}
          className="flex-row items-center gap-3 px-4 py-3 rounded-xl active:bg-surface-hover"
        >
          <AppIcon name="logout" size={18} color="#6E6382" strokeWidth={2} />
          <Text className="text-sm text-text-muted" style={{ fontFamily: font.medium }}>Sair</Text>
        </Pressable>
      </View>
    </View>
  );
}

export const STUDENT_NAV: SidebarItem[] = [
  { href: "/(student)/(home)", icon: "home", label: "Início", match: "(home)" },
  { href: "/(student)/(workouts)", icon: "workout", label: "Treinos", match: "(workouts)" },
  { href: "/(student)/(diet)", icon: "diet", label: "Dieta", match: "(diet)" },
  { href: "/(student)/(progress)", icon: "progress", label: "Progresso", match: "(progress)" },
  { href: "/(student)/(social)", icon: "social", label: "Social", match: "(social)" },
  { href: "/(student)/(chat)", icon: "chat", label: "Chat", match: "(chat)" },
  { href: "/(student)/(courses)", icon: "courses", label: "Aulas", match: "(courses)" },
];

export const ADMIN_NAV: SidebarItem[] = [
  { href: "/(admin)/overview", icon: "progress", label: "Overview", match: "overview" },
  { href: "/(admin)/users", icon: "social", label: "Usuários", match: "users" },
  { href: "/(admin)/moderation", icon: "moderation", label: "Moderação", match: "moderation" },
];
