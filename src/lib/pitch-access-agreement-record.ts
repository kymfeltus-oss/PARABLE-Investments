import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type PitchAccessAgreementRecord = {
  id: string;
  investorName: string;
  investorEmail: string;
  signature: string;
  version: string;
  signedAt: string;
  clientIp: string | null;
  userAgent: string | null;
  deviceFingerprint: string | null;
  documentSnapshot: string;
  documentHash: string | null;
  recordHash: string | null;
  emailStatus: string;
  ndaTemplateId: string | null;
  presenterName: string | null;
  presenterEmail: string | null;
  companyName: string | null;
  productName: string | null;
  governingState: string | null;
  consentCheckboxText: string | null;
  signingUrl: string | null;
  signedRecordUrl: string | null;
  signedPdfUrl: string | null;
};

/**
 * Loads immutable signed agreement from pitch_access_agreements.
 * document_snapshot is never modified — display and PDFs must use this field only.
 */
export async function fetchPitchAccessAgreementById(
  agreementId: string
): Promise<PitchAccessAgreementRecord | null> {
  const admin = getSupabaseAdmin();
  if (!admin) return null;

  const { data, error } = await admin
    .from("pitch_access_agreements")
    .select("*")
    .eq("id", agreementId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    investorName: data.investor_name,
    investorEmail: data.investor_email,
    signature: data.signature,
    version: data.agreement_version,
    signedAt: data.signed_at_utc ?? data.created_at,
    clientIp: data.client_ip,
    userAgent: data.user_agent,
    deviceFingerprint: data.device_fingerprint,
    documentSnapshot: data.document_snapshot,
    documentHash: data.document_hash,
    recordHash: data.record_hash,
    emailStatus: data.email_status,
    ndaTemplateId: data.nda_template_id,
    presenterName: data.presenter_name,
    presenterEmail: data.presenter_email,
    companyName: data.company_name,
    productName: data.product_name,
    governingState: data.governing_state,
    consentCheckboxText: data.consent_checkbox_text,
    signingUrl: data.signing_url,
    signedRecordUrl: data.signed_record_url,
    signedPdfUrl: data.signed_pdf_url,
  };
}
