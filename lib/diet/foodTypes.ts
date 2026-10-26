export interface Food {
  id: string; name: string; brand: string | null; category: string | null;
  source: "taco" | "off"; image_url: string | null;
  kcal_100g: number; protein_g_100g: number; carbs_g_100g: number; fat_g_100g: number;
  fiber_g_100g: number | null; sodium_mg_100g: number | null; default_portion_g: number | null;
}
export interface FoodMacros { calories: number; protein_g: number; carbs_g: number; fat_g: number; }
