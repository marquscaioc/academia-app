// Post-build patch for the single-page web export (dist/index.html).
// Expo's single output ignores app/+html.tsx, so we inject the document
// language, title and social/SEO meta here. Idempotent + safe to re-run.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const file = resolve(process.cwd(), "dist", "index.html");
if (!existsSync(file)) {
  console.warn("[patch-web-html] dist/index.html not found — did the export run?");
  process.exit(0);
}

const TITLE = "Academia — Treino e dieta com seu personal";
const DESCRIPTION =
  "Plataforma para personal trainers e nutricionistas acompanharem alunos: treinos, dietas, check-ins, desafios e progresso em um só lugar.";

const META = `
    <meta name="description" content="${DESCRIPTION}" />
    <meta name="theme-color" content="#0B0811" />
    <meta property="og:title" content="${TITLE}" />
    <meta property="og:description" content="Treinos, dietas, check-ins e progresso com seu personal trainer." />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary" />`;

let html = readFileSync(file, "utf8");

html = html.replace('<html lang="en">', '<html lang="pt-BR">');
html = html.replace(/<title>.*?<\/title>/, `<title>${TITLE}</title>`);

// Inject meta once (guard against double-patching on re-runs).
if (!html.includes('name="description"')) {
  html = html.replace("</head>", `${META}\n  </head>`);
}

writeFileSync(file, html, "utf8");
console.log("[patch-web-html] dist/index.html patched (lang, title, meta).");
