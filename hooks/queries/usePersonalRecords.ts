import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

interface PersonalRecord {
  exercise_id: string;
  exercise_name: string;
  max_weight: number;
  max_reps: number;
  achieved_at: string;
}

export function usePersonalRecords(userId?: string) {
  return useQuery({
    queryKey: ["workouts", "prs", { userId }],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_user_prs", {
        p_user_id: userId!,
      });
      if (error) throw error;
      return (data ?? []) as PersonalRecord[];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}
