import { supabase } from "../../lib/supabase/client";

interface AchievementDef {
  id: string;
  criteria_type: string;
  threshold: number;
}

export async function checkAndAwardAchievements(userId: string) {
  try {
    // Get all achievement definitions
    const { data: definitions } = await supabase
      .from("achievement_definitions")
      .select("id, criteria_type, threshold");

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

    const { count: photoCount } = await supabase
      .from("progress_photos")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    const statsMap: Record<string, number> = {
      first_workout: workoutCount ?? 0,
      workouts_10: workoutCount ?? 0,
      workouts_50: workoutCount ?? 0,
      workouts_100: workoutCount ?? 0,
      streak_7: profile?.current_streak ?? 0,
      streak_30: profile?.current_streak ?? 0,
      posts_10: postCount ?? 0,
      photos_10: photoCount ?? 0,
    };

    // Check and award
    for (const def of definitions as AchievementDef[]) {
      if (earnedIds.has(def.id)) continue;
      const current = statsMap[def.criteria_type];
      if (current === undefined) continue;
      if (current >= def.threshold) {
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
