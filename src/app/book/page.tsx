import { Suspense } from 'react';
import { NdaGate } from '@/components/investor/NdaGate';
import { BookMeetingFinishClient } from '@/components/investor/BookMeetingFinishClient';
import { resolveSchedulingEmbedUrl } from '@/lib/meeting-links';

/** Calendar + confirmation email first; first-time users use `/book/register` from empty state. */
export default function BookMeetingPage() {
  const embedSrc = resolveSchedulingEmbedUrl();

  return (
    <NdaGate>
      <Suspense fallback={null}>
        <BookMeetingFinishClient embedSrc={embedSrc} />
      </Suspense>
    </NdaGate>
  );
}
