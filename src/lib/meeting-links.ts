/** Public site origin for links in emails (no trailing slash). */
export function getPublicSiteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, '')}`;
  return 'http://localhost:3003';
}

/** Room suffix for scheduled investor calls (no `investor-` prefix). */
export function getDefaultScheduledRoomSuffix(): string {
  return process.env.NEXT_PUBLIC_SCHEDULED_MEET_ROOM_SUFFIX?.trim() || 'scheduled-call';
}

export function getScheduledMeetPath(roomSuffix?: string): string {
  const suffix = (roomSuffix ?? getDefaultScheduledRoomSuffix()).trim() || 'scheduled-call';
  return `/meet?join=scheduled&room=${encodeURIComponent(suffix)}`;
}

export function getScheduledMeetUrl(roomSuffix?: string): string {
  return `${getPublicSiteOrigin()}${getScheduledMeetPath(roomSuffix)}`;
}

/**
 * iframe `src` for embedded scheduling. Prefer explicit embed URL; for Cal.com links, append `embed=true`.
 */
export function resolveSchedulingEmbedUrl(): string | null {
  const explicit = process.env.NEXT_PUBLIC_SCHEDULING_EMBED_URL?.trim();
  if (explicit) return explicit;
  const link = process.env.NEXT_PUBLIC_SCHEDULING_URL?.trim();
  if (!link) return null;
  try {
    const u = new URL(link);
    if (u.hostname.includes('cal.com')) {
      u.searchParams.set('embed', 'true');
      return u.toString();
    }
  } catch {
    return null;
  }
  return null;
}
