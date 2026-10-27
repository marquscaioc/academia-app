// Expo push sender shared by every function that notifies devices.
// Chunks at Expo's 100-message limit, reads the per-message tickets and clears push tokens Expo reports as
// DeviceNotRegistered (app uninstalled / token rotated), so later runs stop sending to dead devices.
// `admin` must be the service-role client.

const EXPO_PUSH_URL = Deno.env.get("EXPO_PUSH_URL") ?? "https://exp.host/--/api/v2/push/send";
const CHUNK = 100;

export interface ExpoMessage {
  to: string;
  title: string;
  body?: string | null;
  data?: Record<string, unknown>;
  sound?: "default" | null;
  priority?: "default" | "normal" | "high";
}

interface Ticket {
  status: "ok" | "error";
  id?: string;
  message?: string;
  details?: { error?: string };
}

// deno-lint-ignore no-explicit-any
type AdminClient = { from: (table: string) => any };

export interface PushResult {
  /** Messages Expo accepted (ticket status "ok"). Delivery to the device is not confirmed by this. */
  accepted: number;
  failed: number;
  /** Tokens removed from profiles because Expo reported them as no longer registered. */
  removedTokens: number;
}

export async function sendExpoPush(admin: AdminClient, messages: ExpoMessage[]): Promise<PushResult> {
  const result: PushResult = { accepted: 0, failed: 0, removedTokens: 0 };
  const dead = new Set<string>();

  for (let i = 0; i < messages.length; i += CHUNK) {
    const chunk = messages.slice(i, i + CHUNK);
    let tickets: Ticket[] = [];
    try {
      const res = await fetch(EXPO_PUSH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(chunk),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok || !Array.isArray(payload?.data)) {
        console.error(`expo push request failed: HTTP ${res.status} ${JSON.stringify(payload?.errors ?? null).slice(0, 300)}`);
        result.failed += chunk.length;
        continue;
      }
      tickets = payload.data;
    } catch (e) {
      console.error(`expo push request failed: ${String(e)}`);
      result.failed += chunk.length;
      continue;
    }

    // Tickets come back in the same order as the messages.
    chunk.forEach((msg, idx) => {
      const ticket = tickets[idx];
      if (ticket?.status === "ok") {
        result.accepted++;
        return;
      }
      result.failed++;
      if (ticket?.details?.error === "DeviceNotRegistered") dead.add(msg.to);
      else console.error(`expo push ticket error: ${ticket?.details?.error ?? ticket?.message ?? "missing ticket"}`);
    });
  }

  for (const token of dead) {
    // Matching on the token itself avoids wiping a newer token saved by the app in the meantime.
    const { error, count } = await admin.from("profiles").update({ push_token: null }, { count: "exact" }).eq("push_token", token);
    if (error) console.error(`could not clear dead push token: ${error.message}`);
    else result.removedTokens += count ?? 0;
  }

  return result;
}
