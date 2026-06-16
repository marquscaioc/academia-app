import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
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

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

// ─── Internal: single nav item ────────────────────────────────────────────────

function NavItem({ item, isActive }: { item: SidebarItem; isActive: boolean }) {
  return (
    <Pressable
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
}

// ─── Internal: collapsible section ───────────────────────────────────────────

function SectionBlock({
  section,
  segments,
}: {
  section: SidebarSection;
  segments: string[];
}) {
  const [collapsed, setCollapsed] = useState(section.defaultCollapsed ?? false);

  return (
    <View className="mb-1">
      {section.title != null && (
        <Pressable
          onPress={section.collapsible ? () => setCollapsed((c) => !c) : undefined}
          className="flex-row items-center justify-between px-4 pt-4 pb-1"
        >
          <Text
            className="text-text-muted uppercase"
            style={{ fontFamily: font.semibold, fontSize: 10, letterSpacing: 1.5 }}
          >
            {section.title}
          </Text>
          {section.collapsible && (
            <AppIcon
              name="chevron-down"
              size={13}
              color="#6E6382"
              strokeWidth={2.5}
            />
          )}
        </Pressable>
      )}
      {!collapsed && (
        <View className="gap-0.5">
          {section.items.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={segments.includes(item.match)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface AppSidebarProps {
  subtitle: string;
  /** Legacy flat list — preserved for backward compat */
  items?: SidebarItem[];
  /** New section-based nav */
  sections?: SidebarSection[];
}

/**
 * Web-only navigation rail for full-screen desktop layouts. Active state uses
 * route segments (works with expo-router group routes like the student tabs).
 * Supports flat `items` (backward compat) or sectioned `sections` prop.
 */
export function AppSidebar({ items, sections, subtitle }: AppSidebarProps) {
  const segments = useSegments() as string[];
  const { profile, signOut } = useAuth();

  const resolvedSections: SidebarSection[] =
    sections ?? (items ? [{ items }] : []);

  return (
    <View className="w-60 bg-dark-200 border-r border-surface-border pt-8 justify-between" style={{ flex: 0 }}>
      {/* Brand */}
      <View className="flex-row items-center gap-3 px-4 mb-6">
        <View className="w-10 h-10 bg-violet-500 rounded-2xl items-center justify-center">
          <Text className="text-white text-lg" style={{ fontFamily: font.display }}>G</Text>
        </View>
        <View>
          <Text className="text-xl text-text-primary" style={{ fontFamily: font.display, letterSpacing: -0.3 }}>
            Projeto Gaab
          </Text>
          <Text
            className="text-text-muted uppercase"
            style={{ fontFamily: font.semibold, fontSize: 9, letterSpacing: 2 }}
          >
            {subtitle}
          </Text>
        </View>
      </View>

      {/* Scrollable nav sections */}
      <ScrollView
        className="flex-1 px-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        {resolvedSections.map((section, i) => (
          <SectionBlock key={i} section={section} segments={segments} />
        ))}
      </ScrollView>

      {/* Footer: profile + logout */}
      <View className="pb-6 pt-4 border-t border-surface-border gap-1 px-2">
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

// ─── Nav constants ────────────────────────────────────────────────────────────

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

export const ADMIN_CADASTRO_SECTIONS: SidebarSection[] = [
  {
    title: undefined,
    items: ADMIN_NAV,
  },
  {
    title: "Cadastro Secundário",
    collapsible: true,
    defaultCollapsed: false,
    items: [
      { href: "/(admin)/cadastro/exercicios",           icon: "workout",   label: "Exercícios",             match: "exercicios" },
      { href: "/(admin)/cadastro/alimentos",             icon: "food",      label: "Alimentos",              match: "alimentos" },
      { href: "/(admin)/cadastro/grupos-musculares",     icon: "target",    label: "Grupos Musculares",      match: "grupos-musculares" },
      { href: "/(admin)/cadastro/tecnicas",              icon: "energy",    label: "Técnicas",               match: "tecnicas" },
      { href: "/(admin)/cadastro/treinos-predefinidos",  icon: "clipboard", label: "Treinos Pré-definidos",  match: "treinos-predefinidos" },
      { href: "/(admin)/cadastro/refeicoes",             icon: "diet",      label: "Refeições",              match: "refeicoes" },
      { href: "/(admin)/cadastro/dietas-predefinidas",   icon: "diet",      label: "Dietas Pré-definidas",   match: "dietas-predefinidas" },
      { href: "/(admin)/cadastro/questionarios",         icon: "clipboard", label: "Questionários",          match: "questionarios" },
      { href: "/(admin)/cadastro/substituicoes",         icon: "repeat",    label: "Substituições",          match: "substituicoes" },
      { href: "/(admin)/cadastro/materiais",             icon: "book",      label: "Materiais",              match: "materiais" },
      { href: "/(admin)/cadastro/planos-contratuais",    icon: "financial", label: "Planos Contratuais",     match: "planos-contratuais" },
      { href: "/(admin)/cadastro/planos-profissionais",  icon: "star",      label: "Planos Profissionais",   match: "planos-profissionais" },
      { href: "/(admin)/cadastro/cupons",                icon: "award",     label: "Cupons",                 match: "cupons" },
      { href: "/(admin)/cadastro/grupos-usuario",        icon: "social",    label: "Grupos de Usuário",      match: "grupos-usuario" },
      { href: "/(admin)/cadastro/modulos",               icon: "courses",   label: "Módulos de Aulas",       match: "modulos" },
      { href: "/(admin)/cadastro/funcionarios",          icon: "user",      label: "Funcionários",           match: "funcionarios" },
      { href: "/(admin)/cadastro/permissoes",            icon: "shield",    label: "Permissões",             match: "permissoes" },
      { href: "/(admin)/cadastro/audit-logs",            icon: "book",      label: "Logs de Auditoria",      match: "audit-logs" },
      { href: "/(admin)/cadastro/activity-logs",         icon: "activity",  label: "Logs de Atividade",      match: "activity-logs" },
      { href: "/(admin)/cadastro/error-logs",            icon: "alert",     label: "Logs de Erro",           match: "error-logs" },
    ],
  },
];
