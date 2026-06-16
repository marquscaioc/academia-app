// scripts/gen-app-icons.mjs
// Gera os assets de ícone a partir de assets/logosemfundo.png (rinoceronte violeta
// em fundo transparente). Resolve o blocker de loja apontado na auditoria:
//   - iOS exige ícone OPACO (sem canal alpha) -> Apple rejeita ícone transparente.
//   - Android adaptive precisa respeitar a SAFE-ZONE (~66%) senão o mark é cortado.
//   - os 4 assets eram cópias byte-a-byte do mesmo PNG transparente.
// Uso: npm run icons   (ou: node scripts/gen-app-icons.mjs)
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const asset = (f) => path.join(dir, "..", "assets", f);
const SRC = asset("logosemfundo.png");
const BG = "#0B0811"; // brand dark (igual ao splash/adaptive backgroundColor do app.json)
const SIZE = 1024;
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

// Mark (rinoceronte) recortado do padding transparente, para controlar a escala.
const trimmed = () => sharp(SRC).trim().png().toBuffer();

async function markAt(fraction, canvas = SIZE) {
  const s = Math.round(canvas * fraction);
  return sharp(await trimmed())
    .resize(s, s, { fit: "contain", background: TRANSPARENT })
    .toBuffer();
}

async function onCanvas(markBuf, { canvas = SIZE, opaque = false } = {}) {
  let img = sharp({
    create: {
      width: canvas,
      height: canvas,
      channels: 4,
      background: opaque ? BG : TRANSPARENT,
    },
  }).composite([{ input: markBuf, gravity: "center" }]);
  if (opaque) img = img.flatten({ background: BG }).removeAlpha(); // sem canal alpha => Apple OK
  return img.png();
}

// 1) icon.png — ícone iOS/loja OPACO: rinoceronte centrado em fundo escuro.
await (await onCanvas(await markAt(0.62), { opaque: true })).toFile(asset("icon.png"));
// 2) adaptive-icon.png — foreground Android dentro da safe-zone (~60%), fundo transparente.
await (await onCanvas(await markAt(0.6), { opaque: false })).toFile(asset("adaptive-icon.png"));
// 3) splash-icon.png — mark menor (~42%) transparente (splash usa contain + bg escuro).
await (await onCanvas(await markAt(0.42), { opaque: false })).toFile(asset("splash-icon.png"));
// 4) favicon.png — pequeno (196) e opaco.
await (await onCanvas(await markAt(0.7, 196), { canvas: 196, opaque: true })).toFile(asset("favicon.png"));

console.log("OK: icon.png (opaco), adaptive-icon.png (safe-zone), splash-icon.png, favicon.png (196).");
