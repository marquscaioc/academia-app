import type { Food, FoodMacros } from "./foodTypes";

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Macros de `quantity` (na `unit`) de um alimento com valores por 100g.
 *  MVP: g e ml (densidade ~1) calculam direto; outras unidades usam default_portion_g
 *  se houver, senão retornam 0 (a UI deve pedir g/ml). */
export function macrosForQuantity(
  food: Pick<Food, "kcal_100g" | "protein_g_100g" | "carbs_g_100g" | "fat_g_100g" | "default_portion_g">,
  quantity: number,
  unit: string,
): FoodMacros {
  const u = (unit || "").trim().toLowerCase();
  let grams = 0;
  if (u === "g" || u === "ml") grams = quantity;
  else if (food.default_portion_g) grams = quantity * food.default_portion_g;
  const f = grams / 100;
  return {
    calories: round2((food.kcal_100g ?? 0) * f),
    protein_g: round2((food.protein_g_100g ?? 0) * f),
    carbs_g: round2((food.carbs_g_100g ?? 0) * f),
    fat_g: round2((food.fat_g_100g ?? 0) * f),
  };
}
