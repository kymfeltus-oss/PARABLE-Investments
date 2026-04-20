import { NdaGate } from '@/components/investor/NdaGate';
import { normalizeLiveKitServerUrl } from '@/lib/livekit-server-url';
import MeetClient from './MeetClient';

/** Avoid serving a long-cached HTML shell for the meeting flow (`?live=1`, scheduled joins, etc.). */
export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MeetPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  /** `NEXT_PUBLIC_*` or server-only `LIVEKIT_URL` (e.g. Vercel) — URL is passed as a prop, not inlined in client bundles. */
  const serverUrl = normalizeLiveKitServerUrl(
    process.env.NEXT_PUBLIC_LIVEKIT_URL ?? process.env.LIVEKIT_URL,
  );

  const join = typeof sp.join === 'string' ? sp.join : '';
  const roomParam = typeof sp.room === 'string' ? sp.room : '';
  const scheduledSuffix = process.env.NEXT_PUBLIC_SCHEDULED_MEET_ROOM_SUFFIX?.trim() ?? '';

  const isScheduled = join === 'scheduled';

  /** Same suffix as confirmation emails; do not allow a different `room` query to bypass checks. */
  let initialRoomSuffix: string | undefined;
  if (isScheduled) {
    initialRoomSuffix = scheduledSuffix || 'scheduled-call';
  } else if (roomParam) {
    initialRoomSuffix = roomParam;
  }

  return (
    <NdaGate>
      <MeetClient
        serverUrl={serverUrl}
        initialRoomSuffix={initialRoomSuffix}
        scheduledVerification={isScheduled}
      />
    </NdaGate>
  );
}
