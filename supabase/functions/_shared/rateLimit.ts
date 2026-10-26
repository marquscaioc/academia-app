// Fixed-window rate limit backed by public.consume_rate_limit() (migration 00039).
// `admin` must be the service-role client: the function is not executable by app users.

// deno-lint-ignore no-explicit-any
type AdminClient = { rpc: (fn: string, args: Record<string, unknown>) => PromiseLike<{ data: any; error: { message: string } | null }> };

/**
 * true = allowed. If the limiter itself fails (DB unavailable), the call is allowed and the error logged:
 * an outage of the counter table must not take the feature down with it.
 */
export async function consumeRateLimit(admin: AdminClient, key: string, limit: number, windowSeconds: number): Promise<boolean> {
  const { data, error } = await admin.rpc("consume_rate_limit", {
    p_key: key,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });
  if (error) {
    console.error(`rate limit check failed for ${key.split(":")[0]}: ${error.message}`);
    return true;
  }
  return data === true;
}

export function tooManyRequests(windowSeconds: number, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify({ error: "rate_limited" }), {
    status: 429,
    headers: { ...headers, "Content-Type": "application/json", "Retry-After": String(windowSeconds) },
  });
}
