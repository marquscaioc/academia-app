import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export interface BodyMeasurement {
  id: string;
  user_id: string;
  measured_at: string;
  weight_kg: number | null;
  body_fat_pct: number | null;
  chest_cm: number | null;
  waist_cm: number | null;
  hips_cm: number | null;
  bicep_left_cm: number | null;
  bicep_right_cm: number | null;
  thigh_left_cm: number | null;
  thigh_right_cm: number | null;
  calf_left_cm: number | null;
  calf_right_cm: number | null;
  notes: string | null;
}

export interface ProgressPhoto {
  id: string;
  user_id: string;
  photo_url: string;
  thumbnail_url: string | null;
  pose: "front" | "back" | "side_left" | "side_right" | "custom" | null;
  taken_at: string;
  is_private: boolean;
  notes: string | null;
}

export function useBodyMeasurements(userId?: string) {
  return useQuery({
    queryKey: ["progress", "measurements", { userId }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("body_measurements")
        .select("*")
        .eq("user_id", userId!)
        .order("measured_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as BodyMeasurement[];
    },
    enabled: !!userId,
  });
}

export function useProgressPhotos(userId?: string) {
  return useQuery({
    queryKey: ["progress", "photos", { userId }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("progress_photos")
        .select("*")
        .eq("user_id", userId!)
        .order("taken_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as ProgressPhoto[];
    },
    enabled: !!userId,
  });
}
