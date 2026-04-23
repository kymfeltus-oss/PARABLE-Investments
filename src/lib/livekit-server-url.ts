/**
 * LiveKit Web SDK calls `new URL(serverUrl)` — values must be absolute (e.g. `wss://…`).
 * Hosting envs are often pasted as `https://…` (we fix) or as a **host only** (e.g. `…livekit.cloud`
 * with no `wss://`), which **throws** `Failed to construct 'URL': Invalid URL` in the browser.
 */
export function normalizeLiveKitServerUrl(raw: string | undefined): string {
  let u = (raw ?? '').trim();
  if (!u) return '';
  if (
    (u.startsWith('"') && u.endsWith('"') && u.length > 1) ||
    (u.startsWith("'") && u.endsWith("'") && u.length > 1)
  ) {
    u = u.slice(1, -1).trim();
  }
  if (!u) return '';

  let out: string;
  if (u.startsWith('https://')) {
    out = `wss://${u.slice('https://'.length)}`;
  } else if (u.startsWith('http://')) {
    out = `ws://${u.slice('http://'.length)}`;
  } else if (u.startsWith('wss://') || u.startsWith('ws://')) {
    out = u;
  } else if (!u.includes('://')) {
    if (u.startsWith('localhost') || u.startsWith('127.0.0.1')) {
      out = `ws://${u}`;
    } else {
      out = `wss://${u}`;
    }
  } else {
    out = u;
  }

  if (!out) return '';
  try {
    const p = new URL(out);
    if (p.protocol !== 'wss:' && p.protocol !== 'ws:') {
      return '';
    }
  } catch {
    return '';
  }
  return out;
}

/**
 * True when `raw` can be normalized to a non-empty `wss`/`ws` URL (safe for `LiveKitRoom`).
 */
export function isValidLiveKitServerUrl(s: string): boolean {
  return normalizeLiveKitServerUrl(s) !== '';
}
