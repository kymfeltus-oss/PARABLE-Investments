import { Suspense } from 'react';
import { NdaGate } from '@/components/investor/NdaGate';
import { BookMeetingFinishClient } from '@/components/investor/BookMeetingFinishClient';
import { resolveSchedulingEmbedUrl } from '@/lib/meeting-links';

export default function BookFinishPage() {
  const embedSrc = resolveSchedulingEmbedUrl();

  return (
    <NdaGate>
      <Suspense fallback={null}>
        <BookMeetingFinishClient embedSrc={embedSrc} />
      </Suspense>
    </NdaGate>
  );
}
