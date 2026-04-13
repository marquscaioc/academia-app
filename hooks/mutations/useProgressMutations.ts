import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

interface AddMeasurementInput {
  user_id: string;
  measured_at?: string;
  weight_kg?: number;
  body_fat_pct?: number;
  chest_cm?: number;
  waist_cm?: number;
  hips_cm?: number;
  bicep_left_cm?: number;
  bicep_right_cm?: number;
  thigh_left_cm?: number;
  thigh_right_cm?: number;
  calf_left_cm?: number;
  calf_right_cm?: number;
  notes?: string;
}

interface AddProgressPhotoInput {
  user_id: string;
  photo_url: string;
  pose?: "front" | "back" | "side_left" | "side_right" | "custom";
  taken_at?: string;
  notes?: string;
}

export function useAddMeasurement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddMeasurementInput) => {
      const { data, error } = await supabase
        .from("body_measurements")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress", "measurements"] });
    },
  });
}

export function useAddProgressPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddProgressPhotoInput) => {
      const { data, error } = await supabase
        .from("progress_photos")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress", "photos"] });
    },
  });
}

export async function uploadProgressPhoto(
  userId: string,
  uri: string,
): Promise<string> {
  const fileName = `${userId}/${Date.now()}.jpg`;

  const response = await fetch(uri);
  const blob = await response.blob();

  const { error } = await supabase.storage
    .from("progress-photos")
    .upload(fileName, blob, {
      contentType: "image/jpeg",
      upsert: false,
    });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from("progress-photos").getPublicUrl(fileName);

  return publicUrl;
}
