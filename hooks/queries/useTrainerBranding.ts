import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export interface TrainerBrand {
  brandName: string | null;
  brandLogoUrl: string | null;
  brandPrimaryColor: string | null;
  brandSecondaryColor: string | null;
  brandTagline: string | null;
}

export function useTrainerBranding(studentId?: string) {
  return useQuery({
    queryKey: ["branding", { studentId }],
    queryFn: async () => {
      // First, get the student's trainer
      const { data: relation } = await supabase
        .from("trainer_students")
        .select("trainer_id")
        .eq("student_id", studentId!)
        .eq("status", "active")
        .limit(1)
        .single();

      if (!relation) return null;

      // Then get the trainer's branding
      const { data: profile } = await supabase
        .from("trainer_profiles")
        .select("brand_name, brand_logo_url, brand_primary_color, brand_secondary_color, brand_tagline")
        .eq("id", relation.trainer_id)
        .single();

      if (!profile) return null;

      return {
        brandName: profile.brand_name,
        brandLogoUrl: profile.brand_logo_url,
        brandPrimaryColor: profile.brand_primary_color,
        brandSecondaryColor: profile.brand_secondary_color,
        brandTagline: profile.brand_tagline,
      } as TrainerBrand;
    },
    enabled: !!studentId,
    staleTime: 1000 * 60 * 30, // 30min
  });
}
