import * as Crypto from "expo-crypto";

/** RFC 4122 v4 UUID from a cryptographically secure source (native + web). */
export function uuid(): string {
  return Crypto.randomUUID();
}
