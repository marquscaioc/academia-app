import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";
import type { StudentOverview } from "../../lib/trainer/adherence";

/**
 * One RPC for all of the trainer's active students (migration 00037). Replaces the previous
 * N+1 loop (two sequential queries per student). RLS still applies (SECURITY INVOKER).
 */
export function useTrainerOverview(trainerId?: string) {
  return useQuery({
    queryKey: ["trainer", "overview", { trainerId }],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("trainer_student_overview");
      if (error) throw error;
      return (data ?? []) as StudentOverview[];
    },
    enabled: !!trainerId,
    staleTime: 1000 * 60 * 2,
  });
}
