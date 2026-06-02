/** LiveKit stub — wired in a later step. */

export function isLiveKitConfigured(): boolean {
  return Boolean(
    process.env.LIVEKIT_API_KEY?.trim() &&
      process.env.LIVEKIT_API_SECRET?.trim() &&
      process.env.NEXT_PUBLIC_LIVEKIT_URL?.trim()
  );
}

export function getLiveKitUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_LIVEKIT_URL?.trim();
  return url || null;
}
