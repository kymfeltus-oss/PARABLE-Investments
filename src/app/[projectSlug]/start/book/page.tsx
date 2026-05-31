import { Suspense } from 'react';
import { NdaGate } from '@/components/investor/NdaGate';
import { BookMeetingFinishClient } from '@/components/investor/BookMeetingFinishClient';
import { resolveSchedulingEmbedUrl } from '@/lib/meeting-links';

/** Calendar first; inline name/email + NDA acknowledgment when no `sessionStorage` booking session yet. */
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
