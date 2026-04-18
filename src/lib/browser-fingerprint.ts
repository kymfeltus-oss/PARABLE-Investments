/**
 * Client-only: stable-ish fingerprint from environment signals (not hardware-unique ID).
 */
export async function computeBrowserFingerprint(): Promise<string> {
  if (typeof window === 'undefined' || !globalThis.crypto?.subtle) {
    return '';
  }
  const nav = navigator;
  const parts = [
    nav.userAgent,
    nav.language,
    `${screen.width}x${screen.height}x${screen.colorDepth}`,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    String(nav.hardwareConcurrency ?? ''),
    String((nav as Navigator & { deviceMemory?: number }).deviceMemory ?? ''),
    nav.platform,
  ];
  const payload = parts.join('|');
  const enc = new TextEncoder().encode(payload);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
