import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

interface DailyPose {
  id: string;
  pose_emoji: string;
  pose_description: string;
  active_date: string;
}

export function useDailyPose() {
  return useQuery({
    queryKey: ["challenges", "dailyPose"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("daily_poses")
        .select("*")
        .eq("active_date", today)
        .single();
      if (error) return null;
      return data as DailyPose;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
