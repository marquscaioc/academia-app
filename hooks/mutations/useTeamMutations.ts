import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export function useCreateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { challenge_id: string; name: string; user_id: string }) => {
      // Create team
      const { data: team, error } = await supabase
        .from("challenge_teams")
        .insert({ challenge_id: input.challenge_id, name: input.name, member_count: 1 })
        .select()
        .single();
      if (error) throw error;

      // Assign creator to team
      await supabase
        .from("challenge_participants")
        .update({ team_id: team.id })
        .eq("challenge_id", input.challenge_id)
        .eq("user_id", input.user_id);

      return team;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["challenges", "teams", vars.challenge_id] });
    },
  });
}

export function useJoinTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { challenge_id: string; team_id: string; user_id: string }) => {
      const { error } = await supabase
        .from("challenge_participants")
        .update({ team_id: input.team_id })
        .eq("challenge_id", input.challenge_id)
        .eq("user_id", input.user_id);
      if (error) throw error;

      // Increment team member count
      await supabase.rpc("increment_team_member_count", { p_team_id: input.team_id });
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["challenges", "teams", vars.challenge_id] });
    },
  });
}
