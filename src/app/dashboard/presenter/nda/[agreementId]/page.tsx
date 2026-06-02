import { redirect } from "next/navigation";

type Props = { params: Promise<{ agreementId: string }> };

export default async function LegacyAgreementRedirect({ params }: Props) {
  const { agreementId } = await params;
  redirect(`/dashboard/presenter/nda/signed/${agreementId}`);
}
