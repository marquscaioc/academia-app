import type { IconName } from "../../components/ui";

/**
 * Maps a TACO food category string to a Lucide icon (via AppIcon) and a
 * background color for placeholder display (TACO foods have no photo).
 *
 * Icon names are taken directly from the ICONS map in components/ui/Icon.tsx.
 */
const MAP: Record<string, { icon: IconName; color: string }> = {
  cereais: { icon: "diet", color: "#C9A227" },
  graos: { icon: "diet", color: "#C9A227" },
  carnes: { icon: "food", color: "#B0413E" },
  aves: { icon: "food", color: "#C0604B" },
  peixes: { icon: "food", color: "#4A7CA8" },
  frutos: { icon: "food", color: "#4A7CA8" },
  laticinios: { icon: "scale", color: "#5B8FB0" },
  ovos: { icon: "scale", color: "#D4A843" },
  frutas: { icon: "apple", color: "#C0504D" },
  legumes: { icon: "apple", color: "#C05030" },
  vegetais: { icon: "diet", color: "#4E8C57" },
  verduras: { icon: "diet", color: "#3E7A47" },
  leguminosas: { icon: "diet", color: "#7A9E4E" },
  oleos: { icon: "droplet", color: "#D4A227" },
  gorduras: { icon: "droplet", color: "#C09030" },
  bebidas: { icon: "water", color: "#7A6FB0" },
  acucares: { icon: "energy", color: "#D4607A" },
  doces: { icon: "energy", color: "#D46080" },
  alimentos: { icon: "food", color: "#6E6382" },
  produtos: { icon: "food", color: "#6E6382" },
  sopas: { icon: "food", color: "#9A6040" },
  molhos: { icon: "food", color: "#9A7050" },
  preparacoes: { icon: "food", color: "#6E7382" },
};

/**
 * Returns the icon + color for a given food category string.
 * Falls back to the generic "food" icon when no category key matches.
 */
export function categoryVisual(category: string | null): { icon: IconName; color: string } {
  const key = (category ?? "").toLowerCase();
  const hit = Object.keys(MAP).find((k) => key.includes(k));
  return hit ? MAP[hit] : { icon: "food", color: "#6E6382" };
}
