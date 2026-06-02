import { SignedAgreementDetail, SignedAgreementNotFound } from "@/components/presenter/SignedAgreementDetail";
import { fetchPitchAccessAgreementById } from "@/lib/pitch-access-agreement-record";

type Props = { params: Promise<{ agreementId: string }> };

export default async function SignedNdaRecordPage({ params }: Props) {
  const { agreementId } = await params;
  const agreement = await fetchPitchAccessAgreementById(agreementId);

  if (!agreement) {
    return <SignedAgreementNotFound />;
  }

  return <SignedAgreementDetail agreement={agreement} />;
}
