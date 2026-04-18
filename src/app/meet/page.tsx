import MeetClient from './MeetClient';

export default function MeetPage() {
  const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL ?? '';

  return <MeetClient serverUrl={serverUrl} />;
}
