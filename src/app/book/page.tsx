import { NdaGate } from '@/components/investor/NdaGate';
import { BookMeetingWizard } from '@/components/investor/BookMeetingWizard';

export default function BookMeetingPage() {
  return (
    <NdaGate>
      <BookMeetingWizard />
    </NdaGate>
  );
}
