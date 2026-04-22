import { NdaGate } from '@/components/investor/NdaGate';
import { normalizeLiveKitServerUrl } from '@/lib/livekit-server-url';
import { redirect } from 'next/navigation';
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
  const scheduledSuffix = process.env.NEXT_PUBLIC_SCHEDULED_MEET_ROOM_SUFFIX?.trim() ?? '';

  /** Open “enter any room suffix” lobby removed — only scheduled investor joins are supported here. */
  if (join !== 'scheduled') {
    redirect('/start');
  }

  /** Same suffix as confirmation emails; `room` query is not used to pick a different room. */
  const initialRoomSuffix = scheduledSuffix || 'scheduled-call';

  return (
    <NdaGate>
      <MeetClient
        serverUrl={serverUrl}
        initialRoomSuffix={initialRoomSuffix}
        scheduledVerification
      />
    </NdaGate>
  );
}
