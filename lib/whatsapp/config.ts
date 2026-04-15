// Evolution API configuration
// In dev: localhost Docker container
// In prod: set EXPO_PUBLIC_EVOLUTION_URL env var
//
// The instance name is NOT global — each trainer has their own Evolution
// instance, resolved via useTrainerWhatsAppInstance(trainerId). The legacy
// `instance` constant below is kept only as a fallback for scripts that
// run outside of a trainer context (e.g., ops utilities).

export const EVOLUTION_CONFIG = {
  url: process.env.EXPO_PUBLIC_EVOLUTION_URL ?? "http://localhost:8080",
  apiKey: process.env.EXPO_PUBLIC_EVOLUTION_KEY ?? "teste123",
  /** @deprecated Use useTrainerWhatsAppInstance(trainerId) in app code. */
  instance: "academia-app",
} as const;
