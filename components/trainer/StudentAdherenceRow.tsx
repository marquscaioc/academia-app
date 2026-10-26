import { Pressable, Text, View } from "react-native";
import { Avatar } from "../ui/Avatar";
import { font } from "../../lib/design/tokens";
import { activityStatus, daysSince, workoutAdherence, type ActivityStatus, type StudentOverview } from "../../lib/trainer/adherence";
import { pluralize } from "../../lib/utils/plural";

const STATUS: Record<ActivityStatus, { label: string; box: string; dot: string }> = {
  active: { label: "Em dia", box: "bg-success-500/5 border-success-500/20", dot: "bg-success-500" },
  slipping: { label: "Atenção", box: "bg-warning-500/5 border-warning-500/20", dot: "bg-warning-500" },
  inactive: { label: "Inativo", box: "bg-danger-500/5 border-danger-500/20", dot: "bg-danger-500" },
  never: { label: "Ainda não treinou", box: "bg-surface-card border-surface-border", dot: "bg-text-muted" },
};

interface StudentAdherenceRowProps {
  student: StudentOverview;
  onPress?: () => void;
}

export function StudentAdherenceRow({ student, onPress }: StudentAdherenceRowProps) {
  const status = activityStatus(student.last_session_at);
  const s = STATUS[status];
  const name = student.full_name ?? "Aluno";
  const since = daysSince(student.last_session_at);
  const adherence = workoutAdherence(student.sessions_30d, student.planned_days_per_week);
  const lastTrained =
    since === null ? "Nenhum treino registrado" : since === 0 ? "Treinou hoje" : `Último treino há ${pluralize(since, "dia", "dias")}`;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={`${name}: ${s.label}. ${lastTrained}.`}
      className={`border rounded-2xl p-4 flex-row items-center gap-3 active:bg-surface-hover ${s.box}`}
    >
      <Avatar uri={student.avatar_url} name={name} size="md" />
      <View className="flex-1">
        <Text className="text-sm text-text-primary" style={{ fontFamily: font.semibold }} numberOfLines={1}>{name}</Text>
        <View className="flex-row items-center gap-1.5 mt-0.5">
          <View className={`w-2 h-2 rounded-full ${s.dot}`} />
          <Text className="text-[11px] text-text-muted" style={{ fontFamily: font.regular }} numberOfLines={1}>
            {s.label} · {lastTrained}
          </Text>
        </View>
      </View>
      <View className="items-end gap-0.5">
        <Text className="text-xs text-text-secondary" style={{ fontFamily: font.semibold }}>
          {pluralize(student.sessions_7d, "treino", "treinos")} / 7d
        </Text>
        {adherence !== null ? (
          <Text className="text-[10px] text-text-muted" style={{ fontFamily: font.regular }}>{adherence}% do plano (30d)</Text>
        ) : null}
        {student.pending_checkins > 0 ? (
          <Text className="text-[10px] text-fuchsia-400" style={{ fontFamily: font.semibold }}>
            {pluralize(student.pending_checkins, "check-in pendente", "check-ins pendentes")}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
