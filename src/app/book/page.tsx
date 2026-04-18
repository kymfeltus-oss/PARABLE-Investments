import { NdaGate } from '@/components/investor/NdaGate';
import { BookMeetingWizard } from '@/components/investor/BookMeetingWizard';
import { resolveSchedulingEmbedUrl } from '@/lib/meeting-links';

export default function BookMeetingPage() {
  const embedSrc = resolveSchedulingEmbedUrl();

  return (
    <NdaGate>
      <BookMeetingWizard embedSrc={embedSrc} />
    </NdaGate>
  );
}
