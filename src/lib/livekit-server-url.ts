/**
 * LiveKit Web SDK calls `new URL(serverUrl)` — values must be absolute (e.g. `wss://…`).
 * Hosting envs are often pasted as `https://…` (we fix) or as a **host only** (e.g. `…livekit.cloud`
 * with no `wss://`), which **throws** `Failed to construct 'URL': Invalid URL` in the browser.
 *
 * Vercel / copy-paste sometimes adds a **BOM** or zero-width characters so the string no longer
 * starts with `wss://` — that used to break our branch logic and, with strict validation, could
 * incorrectly return `''` and show "Video service not configured" even when the var is set.
 */
export function normalizeLiveKitServerUrl(raw: string | undefined): string {
  let u = (raw ?? '')
    .trim()
    .replace(/^\uFEFF/, '')
    .replace(/\uFEFF/g, '')
    .replace(/[\u200B-\u200D\u2060]/g, '')
    .trim();
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
    if (p.protocol === 'wss:' || p.protocol === 'ws:') {
      return out;
    }
    return '';
  } catch {
    // Do not return empty: many deploys use edge-case URLs that still work in the browser.
    // Passing `out` preserves prior behavior; LiveKit will surface a clearer connect error.
    if (out.startsWith('wss://') || out.startsWith('ws://')) {
      return out;
    }
    return '';
  }
}

/**
 * True when `raw` can be normalized to a non-empty `wss`/`ws` URL (safe for `LiveKitRoom`).
 */
export function isValidLiveKitServerUrl(s: string): boolean {
  return normalizeLiveKitServerUrl(s) !== '';
}
