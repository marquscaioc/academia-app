import { supabase } from "../../lib/supabase/client";

interface AchievementDef {
  id: string;
  criteria_type: string;
  criteria_threshold: number;
}

export async function checkAndAwardAchievements(userId: string) {
  try {
    // Get all achievement definitions
    const { data: definitions } = await supabase
      .from("achievement_definitions")
      .select("id, criteria_type, criteria_threshold");

    if (!definitions?.length) return;

    // Get already earned
    const { data: earned } = await supabase
      .from("user_achievements")
      .select("achievement_id")
      .eq("user_id", userId);

    const earnedIds = new Set(earned?.map((e) => e.achievement_id) ?? []);

    // Get user stats
    const { count: workoutCount } = await supabase
      .from("workout_sessions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .not("finished_at", "is", null);

    const { data: profile } = await supabase
      .from("profiles")
      .select("current_streak")
      .eq("id", userId)
      .single();

    const { count: postCount } = await supabase
      .from("feed_posts")
      .select("*", { count: "exact", head: true })
      .eq("author_id", userId);

    // Mapa de stats por criteria_type valido (CHECK em achievement_definitions:
    // workout_count, streak_days, challenge_won, weight_pr, social_posts, check_in_streak).
    // challenge_won e check_in_streak exigem um sinal proprio (rank do desafio /
    // streak de check-ins) que ainda nao calculamos; ficam de fora ate la.
    const statsMap: Record<string, number> = {
      workout_count: workoutCount ?? 0,
      streak_days: profile?.current_streak ?? 0,
      social_posts: postCount ?? 0,
    };

    // Check and award
    for (const def of definitions as AchievementDef[]) {
      if (earnedIds.has(def.id)) continue;
      const current = statsMap[def.criteria_type];
      if (current === undefined) continue;
      if (current >= def.criteria_threshold) {
        await supabase.from("user_achievements").insert({
          user_id: userId,
          achievement_id: def.id,
        });

        // Send push notification
        supabase.functions.invoke("push-notification", {
          body: {
            user_id: userId,
            title: "Nova conquista desbloqueada! 🏆",
            body: `Voce desbloqueou uma nova conquista!`,
            data: { type: "achievement", screen: "progress" },
          },
        }).catch(() => {});
      }
    }
  } catch {
    // Silent fail
  }
}
