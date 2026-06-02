export const US_STATE_OPTIONS = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
  "District of Columbia",
] as const;

export type UsState = (typeof US_STATE_OPTIONS)[number];

export {
  PITCH_ACCESS_AGREEMENT_VERSION as STANDARD_NDA_TEMPLATE_VERSION,
  CONSENT_CHECKBOX_TEXT,
  NDA_COUNSEL_NOTE,
  buildAgreementDocumentSnapshot as buildStandardNdaText,
} from "@/lib/pitch-access-agreement";

export type StandardNdaInput = {
  companyName: string;
  productName: string;
  presenterName?: string;
  presenterEmail?: string;
  governingState: string;
  agreementVersion?: string;
};

export function createNdaVersionLabel(companyName?: string): string {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 6);
  const base = companyName?.trim().replace(/\s+/g, "-").toLowerCase().slice(0, 24);
  return base ? `${base}-${stamp}-${suffix}` : `nda-${stamp}-${suffix}`;
}

export type NdaTemplateInput = {
  companyName?: string;
  productName?: string;
  presenterName?: string;
  presenterEmail?: string;
  governingState?: string;
  agreementVersion?: string;
};

export function normalizeNdaTemplateInput(input: NdaTemplateInput) {
  const companyName = (input.companyName ?? "Your Company").trim().slice(0, 200);
  const productName = (input.productName ?? "Pitch Lock").trim().slice(0, 200);
  const presenterName = (input.presenterName ?? "").trim().slice(0, 200);
  const presenterEmail = input.presenterEmail?.trim().toLowerCase().slice(0, 320) || null;
  const governingState = US_STATE_OPTIONS.includes(input.governingState as UsState)
    ? (input.governingState as UsState)
    : "Texas";
  const agreementVersion = (input.agreementVersion ?? createNdaVersionLabel(companyName)).trim().slice(0, 120);

  return {
    companyName,
    productName,
    presenterName: presenterName || null,
    presenterEmail,
    governingState,
    agreementVersion,
  };
}

export function getEmailStatusMessage(emailStatus: string | undefined | null): string {
  switch (emailStatus) {
    case "sent":
      return "Agreement saved and confirmation emails sent.";
    case "failed":
      return "Agreement saved. Email delivery failed. Check Resend settings.";
    case "unconfigured":
    default:
      return "Agreement saved. Email delivery is not configured yet.";
  }
}
