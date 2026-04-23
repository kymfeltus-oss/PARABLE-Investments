import { NdaGate } from '@/components/investor/NdaGate';
import { getLiveKitUrlFromEnv } from '@/lib/livekit-server-url';
import { redirect } from 'next/navigation';
import MeetClient from './MeetClient';

/** Avoid serving a long-cached HTML shell for the meeting flow (`?live=1`, scheduled joins, etc.). */
export const dynamic = 'force-dynamic';

type PageProps = {
  /** Next may pass a Promise (App Router) or a plain object depending on version. */
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
};

export default async function MeetPage({ searchParams: searchParamsProp }: PageProps) {
  const sp: Record<string, string | string[] | undefined> =
    searchParamsProp == null
      ? {}
      : typeof (searchParamsProp as Promise<unknown>)?.then === 'function'
        ? await (searchParamsProp as Promise<Record<string, string | string[] | undefined>>)
        : (searchParamsProp as Record<string, string | string[] | undefined>);
  const serverUrl = getLiveKitUrlFromEnv();

  const joinRaw = sp.join;
  const join =
    typeof joinRaw === 'string'
      ? joinRaw.trim().toLowerCase()
      : Array.isArray(joinRaw)
        ? (joinRaw[0] ?? '').trim().toLowerCase()
        : '';
  const roomRaw = sp.room;
  const roomParam =
    typeof roomRaw === 'string'
      ? roomRaw.trim()
      : Array.isArray(roomRaw)
        ? (roomRaw[0] ?? '').trim()
        : '';
  const envDefault = process.env.NEXT_PUBLIC_SCHEDULED_MEET_ROOM_SUFFIX?.trim() ?? '';

  /** Open “enter any room suffix” lobby removed — only scheduled investor joins are supported here. */
  if (join !== 'scheduled') {
    redirect('/start');
  }

  /** `room` in the query is the part after `investor-` (per confirmation email / Book a meeting). */
  const initialRoomSuffix = (roomParam || envDefault || 'scheduled-call').replace(/^investor-/i, '');

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
