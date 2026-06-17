export interface Food {
  id: string; name: string; brand: string | null; category: string | null;
  source: string; image_url: string | null;
  has_macros: boolean;
  kcal_100g: number | null; protein_g_100g: number | null; carbs_g_100g: number | null; fat_g_100g: number | null;
  fiber_g_100g: number | null; sodium_mg_100g: number | null; default_portion_g: number | null;
}
export interface FoodMacros { calories: number; protein_g: number; carbs_g: number; fat_g: number; }
