// Evolution API configuration.
//
// WhatsApp/Evolution is DISABLED unless EXPO_PUBLIC_EVOLUTION_URL is set
// (self-hosted or cloud gateway). It is intentionally neutralized for launch.
//
// SECURITY: apiKey is an Evolution *master* key that controls every instance.
// Any EXPO_PUBLIC_* var is inlined into the client JS bundle at build time, so
// the production/web build env MUST leave EXPO_PUBLIC_EVOLUTION_KEY empty until
// the key is rotated and moved behind a server-side proxy (edge function). The
// request layer (client.ts) refuses to call out while WHATSAPP_ENABLED is false,
// so the key is never exercised from an unconfigured build.
//
// The instance name is NOT global — each trainer has their own Evolution
// instance, resolved via useTrainerWhatsAppInstance(trainerId).

const url = process.env.EXPO_PUBLIC_EVOLUTION_URL ?? "";
const apiKey = process.env.EXPO_PUBLIC_EVOLUTION_KEY ?? "";

/** WhatsApp/Evolution is only active when a gateway URL is configured. */
export const WHATSAPP_ENABLED = url.length > 0;

export const EVOLUTION_CONFIG = {
  url,
  apiKey,
  /** @deprecated Use useTrainerWhatsAppInstance(trainerId) in app code. */
  instance: "academia-app",
} as const;
