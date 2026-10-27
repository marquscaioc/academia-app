import { useEffect, useState } from "react";

/** Current epoch ms, re-rendering every `intervalMs` while `active`. */
export function useNow(active: boolean, intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [active, intervalMs]);
  // A timer can restart before its activation effect runs. Read the clock on
  // that first render too, so an old tick cannot inflate the new countdown.
  return active ? Date.now() : now;
}
