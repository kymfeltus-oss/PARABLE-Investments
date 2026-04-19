/**
 * LiveKit Web SDK expects a WebSocket URL (`wss://` / `ws://`). Hosting env vars are
 * sometimes pasted as `https://*.livekit.cloud` — normalize so the client can connect.
 */
export function normalizeLiveKitServerUrl(raw: string | undefined): string {
  const u = (raw ?? '').trim();
  if (!u) return '';
  if (u.startsWith('https://')) return `wss://${u.slice('https://'.length)}`;
  if (u.startsWith('http://')) return `ws://${u.slice('http://'.length)}`;
  return u;
}
