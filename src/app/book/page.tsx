import { NdaGate } from '@/components/investor/NdaGate';
import { BookMeetingWizard } from '@/components/investor/BookMeetingWizard';
import {
  getDefaultScheduledRoomSuffix,
  getScheduledMeetUrl,
  resolveSchedulingEmbedUrl,
} from '@/lib/meeting-links';

export default function BookMeetingPage() {
  const meetUrl = getScheduledMeetUrl();
  const rawSuffix = getDefaultScheduledRoomSuffix().replace(/^investor-/i, '');
  const roomLabel = `investor-${rawSuffix}`;
  const embedSrc = resolveSchedulingEmbedUrl();

  return (
    <NdaGate>
      <BookMeetingWizard meetUrl={meetUrl} roomLabel={roomLabel} embedSrc={embedSrc} />
    </NdaGate>
  );
}
