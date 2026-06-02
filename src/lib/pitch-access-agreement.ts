/**
 * Pitch Access Agreement — versioned template with placeholder variables.
 * document_snapshot is built server-side and must never change after signing.
 */

export const PITCH_ACCESS_AGREEMENT_VERSION = "2026-05-pitchlock-access-standard-v1";

export const CONSENT_CHECKBOX_TEXT =
  'I have read this Pitch Access Agreement, agree to be bound as written, and by clicking "I Agree" intend to electronically sign to the extent permitted by applicable law.';

export const NDA_COUNSEL_NOTE =
  "This template is provided for convenience and should be reviewed by qualified legal counsel before use.";

export type AgreementTemplateVars = {
  discloser_name: string;
  company_name: string;
  product_name: string;
  presenter_name: string;
  presenter_email: string;
  governing_state: string;
  version: string;
};

const PITCH_ACCESS_AGREEMENT_TEMPLATE = `PITCH ACCESS AGREEMENT
Version: {{version}}

This Pitch Access Agreement ("Agreement") is entered into by and between {{discloser_name}} ("Discloser") and the undersigned investor or recipient ("Recipient").

Discloser is presenting confidential materials related to {{product_name}} through the Pitch Lock platform. Recipient seeks access to confidential pitch materials for evaluation purposes only.

1. Confidential Information
"Confidential Information" means non-public information disclosed by Discloser, including pitch decks, financial data, product plans, business models, projections, wireframes, and any materials reasonably understood as confidential.

2. Permitted Use
Recipient will use Confidential Information solely to evaluate a potential investment or business relationship with Discloser and for no other purpose. Recipient shall not use the Confidential Information to compete with Discloser or develop a derivative product.

3. Non-Disclosure
Recipient will not disclose Confidential Information to third parties without Discloser's prior written consent, except to professional advisors bound by confidentiality obligations at least as protective as this Agreement.

4. Exclusions
Confidential Information does not include information that Recipient can demonstrate was publicly available, previously known, independently developed, or rightfully received from a third party without restriction.

5. No License
Nothing in this Agreement grants Recipient any license, patent rights, trademark rights, copyright, or intellectual property ownership rights to the Confidential Information.

6. Term & Destruction
The obligations of confidentiality shall survive for a period of two (2) years from the date of access. Upon written request by Discloser, Recipient will promptly delete or destroy all digital and physical copies of the Confidential Information.

7. Governing Law
This Agreement is governed by the laws of the State of {{governing_state}}, without regard to conflict-of-law principles.

8. Presenter Contact
Authorized presenter: {{presenter_name}} ({{presenter_email}}).

9. Electronic Signature
By typing your name, entering your email, and clicking "I Agree", Recipient intends to electronically sign this Agreement to the extent permitted by applicable law, including the U.S. ESIGN Act and applicable state electronic transaction laws.

Legal notice:
{{legal_notice}}`;

export function fillAgreementTemplate(vars: AgreementTemplateVars): string {
  let text = PITCH_ACCESS_AGREEMENT_TEMPLATE;
  const map: Record<string, string> = {
    ...vars,
    legal_notice: NDA_COUNSEL_NOTE,
  };
  for (const [key, value] of Object.entries(map)) {
    text = text.replaceAll(`{{${key}}}`, value);
  }
  return text;
}

export type BuildAgreementSnapshotInput = {
  companyName?: string;
  productName?: string;
  presenterName?: string;
  presenterEmail?: string;
  governingState?: string;
  agreementVersion?: string;
};

export function buildAgreementDocumentSnapshot(input: BuildAgreementSnapshotInput = {}): string {
  const company = (input.companyName ?? "Pitch Lock Presenter").trim();
  const product = (input.productName ?? "confidential pitch materials").trim();
  const presenter = (input.presenterName ?? "Authorized Presenter").trim();
  const email = (input.presenterEmail ?? "presenter@example.com").trim();
  const state = (input.governingState ?? "Texas").trim();

  return fillAgreementTemplate({
    discloser_name: company,
    company_name: company,
    product_name: product,
    presenter_name: presenter,
    presenter_email: email,
    governing_state: state,
    version: input.agreementVersion?.trim() || PITCH_ACCESS_AGREEMENT_VERSION,
  });
}

export function getPitchAccessAgreementText(): string {
  return buildAgreementDocumentSnapshot();
}

export function getPitchAccessAgreementParagraphs(text?: string): string[] {
  return (text ?? getPitchAccessAgreementText())
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}
