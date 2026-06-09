import { ScrollViewStyleReset } from "expo-router/html";
import { type PropsWithChildren } from "react";

/**
 * Web-only HTML shell. Wraps every page served to a browser (mobile + desktop).
 * Native apps ignore this file entirely.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />

        <title>Projeto Gaab — Treino e dieta com seu personal</title>
        <meta
          name="description"
          content="Plataforma para personal trainers e nutricionistas acompanharem alunos: treinos, dietas, check-ins, desafios e progresso em um só lugar."
        />
        <meta name="theme-color" content="#0B0811" />

        {/* Open Graph / social preview */}
        <meta property="og:title" content="Projeto Gaab — Treino e dieta com seu personal" />
        <meta
          property="og:description"
          content="Treinos, dietas, check-ins e progresso com seu personal trainer."
        />
        <meta property="og:type" content="website" />

        {/* Disable body scrolling on web so ScrollView components work as expected. */}
        <ScrollViewStyleReset />

        {/* Dark background everywhere to avoid a white flash before React mounts. */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
html, body { background-color: #0B0811; }
@media (prefers-color-scheme: light) {
  html, body { background-color: #0B0811; }
}
/* Smooth font rendering on desktop browsers */
* { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
`;
