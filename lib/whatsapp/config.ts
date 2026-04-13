// Evolution API configuration
// In dev: localhost Docker container
// In prod: set EXPO_PUBLIC_EVOLUTION_URL env var

export const EVOLUTION_CONFIG = {
  url: process.env.EXPO_PUBLIC_EVOLUTION_URL ?? "http://localhost:8080",
  apiKey: process.env.EXPO_PUBLIC_EVOLUTION_KEY ?? "teste123",
  instance: "academia-app",
} as const;
