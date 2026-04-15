import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

/**
 * Per-trainer Evolution API instance name.
 * Returns the persisted name from trainer_profiles.whatsapp_instance_name,
 * OR a deterministic default `treino_<shortId>` for first-time setup.
 */
export function useTrainerWhatsAppInstance(trainerId: string | undefined) {
  return useQuery({
    queryKey: ["whatsapp", "instance-name", trainerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trainer_profiles")
        .select("whatsapp_instance_name")
        .eq("id", trainerId!)
        .maybeSingle();
      if (error) throw error;
      const existing = data?.whatsapp_instance_name;
      if (existing) return { name: existing as string, isConfigured: true };
      // Default deterministic name so instance creation can proceed without extra input
      return { name: defaultInstanceName(trainerId!), isConfigured: false };
    },
    enabled: !!trainerId,
    staleTime: 1000 * 60,
  });
}

export function defaultInstanceName(trainerId: string): string {
  return `treino_${trainerId.replace(/-/g, "").slice(0, 12)}`;
}
