import assert from "node:assert";
import { macrosForQuantity } from "../lib/diet/foodCalc.ts";
const frango = { kcal_100g: 165, protein_g_100g: 31, carbs_g_100g: 0, fat_g_100g: 3.6, default_portion_g: null };
let r = macrosForQuantity(frango, 150, "g");
assert.strictEqual(r.calories, 247.5);
assert.strictEqual(r.protein_g, 46.5);
assert.strictEqual(macrosForQuantity(frango, 1, "g").calories, 1.65);
assert.strictEqual(macrosForQuantity(frango, 100, "ml").calories, 165);      // ml ~ g (densidade ~1)
assert.strictEqual(macrosForQuantity(frango, 1, "unidade").calories, 0);      // sem default_portion_g => 0
const ovo = { kcal_100g: 146, protein_g_100g: 13, carbs_g_100g: 0.6, fat_g_100g: 9.5, default_portion_g: 50 };
assert.strictEqual(macrosForQuantity(ovo, 2, "unidade").calories, 146);       // 2 * 50g = 100g
console.log("foodCalc OK");
