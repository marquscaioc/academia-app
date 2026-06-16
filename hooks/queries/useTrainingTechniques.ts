import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";
import { useAuth } from "../../lib/auth/provider";

export interface TrainingTechnique {
  id: string;
  name: string;
  description: string | null;
  color: string;
  created_by: string | null;
  is_active: boolean;
}

export function useTrainingTechniques() {
  const { user } = useAuth();
  return useQuery<TrainingTechnique[]>({
    queryKey: ["training-techniques", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_techniques")
        .select("id, name, description, color, created_by, is_active")
        .eq("is_active", true)
        .order("created_by", { ascending: true, nullsFirst: true })
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateTechnique() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: { name: string; color: string; description?: string }) => {
      const { data, error } = await supabase
        .from("training_techniques")
        .insert({ ...input, created_by: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data as TrainingTechnique;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["training-techniques"] });
    },
  });
}
