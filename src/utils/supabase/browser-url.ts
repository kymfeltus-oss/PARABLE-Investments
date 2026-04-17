/**
 * Optionally route browser Supabase traffic through Next (`/supabase-proxy` → project URL)
 * when extensions, DNS, or TLS block direct requests to *.supabase.co.
 *
 * Default is **off**: the client calls `NEXT_PUBLIC_SUPABASE_URL` directly. If the relay is on
 * but `next.config` rewrites are missing (wrong/missing env at dev server start), requests hit
 * `/supabase-proxy/...` and Next returns HTML → auth throws "Unexpected token '<' ... not valid JSON".
 *
 * Set `NEXT_PUBLIC_SUPABASE_BROWSER_RELAY=1` only when you need the proxy.
 *
 * Server code should keep using process.env.NEXT_PUBLIC_SUPABASE_URL (no relay).
 */
export function getBrowserSupabaseUrl(): string {
  const direct = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  if (typeof window === "undefined") return direct;
  if (!shouldUseBrowserRelay()) return direct;
  return `${window.location.origin}/supabase-proxy`;
}

export function shouldUseBrowserRelay(): boolean {
  if (process.env.NEXT_PUBLIC_SUPABASE_BROWSER_RELAY === "1") return true;
  if (process.env.NEXT_PUBLIC_SUPABASE_BROWSER_RELAY === "0") return false;
  return false;
}
