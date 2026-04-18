import { NdaGate } from '@/components/investor/NdaGate';
import MeetClient from './MeetClient';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MeetPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL ?? '';

  const join = typeof sp.join === 'string' ? sp.join : '';
  const roomParam = typeof sp.room === 'string' ? sp.room : '';
  const scheduledSuffix = process.env.NEXT_PUBLIC_SCHEDULED_MEET_ROOM_SUFFIX?.trim() ?? '';

  let initialRoomSuffix: string | undefined;
  if (join === 'scheduled') {
    initialRoomSuffix = roomParam || scheduledSuffix || 'scheduled-call';
  } else if (roomParam) {
    initialRoomSuffix = roomParam;
  }

  return (
    <NdaGate>
      <MeetClient serverUrl={serverUrl} initialRoomSuffix={initialRoomSuffix} />
    </NdaGate>
  );
}
