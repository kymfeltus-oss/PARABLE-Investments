/**
 * Version bump when legal copy changes materially (also update localStorage key in investor-nda-storage).
 * Snapshot stored server-side with each signature for audit trail.
 */
export const INVESTOR_AGREEMENT_VERSION = '2026-03-nda-nc-v1';

/** Plain-text snapshot for database storage (must match what the user sees on screen). */
export function getInvestorAgreementPlainText(): string {
  return [
    `PARABLE — Mutual Confidentiality, Restricted Use, and Non-Competition (Electronic Acknowledgment)`,
    `Version: ${INVESTOR_AGREEMENT_VERSION}`,
    ``,
    `This acknowledgment is between Parable and its affiliates (“Parable,” “we,” or “Discloser”) and you (“Recipient”). It governs information shared so you can evaluate a potential investment, partnership, or similar relationship.`,
    ``,
    `1. Confidential information`,
    `“Confidential Information” means non-public information Parable discloses or makes available, including product plans, designs, software, algorithms, business models, financial data, projections, metrics, customer or pipeline information, roadmaps, marketing plans, and materials labeled confidential or that reasonably should be understood as confidential.`,
    ``,
    `2. Use and non-disclosure`,
    `Recipient will use Confidential Information solely to evaluate a potential transaction or relationship with Parable, and not for any other purpose. Recipient will not disclose Confidential Information to any third party without Parable’s prior written consent, except to Recipient’s employees, directors, advisors, or professional representatives who need to know and who are bound by confidentiality obligations at least as protective as this acknowledgment. Recipient will protect Confidential Information using reasonable care.`,
    ``,
    `3. Exclusions`,
    `Confidential Information does not include information that Recipient can show: (a) was public without breach; (b) was rightfully known to Recipient before disclosure; (c) was independently developed without use of Confidential Information; or (d) was rightfully received from a third party without restriction.`,
    ``,
    `4. Restricted use and non-competition (limited scope)`,
    `For twelve (12) months after the last disclosure of Confidential Information, Recipient will not, directly or indirectly, use Confidential Information to develop, fund, operate, or assist a business that competes with Parable’s core products or services as described in materials shared with Recipient, except with Parable’s prior written consent. This section does not prohibit general investment activity unrelated to Confidential Information, lawful independent development without use of Confidential Information, or employment that does not rely on or disclose Parable’s Confidential Information. If any restriction is deemed unenforceable, it will be modified to the minimum extent necessary.`,
    ``,
    `5. Return / destruction`,
    `Upon request, Recipient will promptly return or destroy Confidential Information and copies, subject to routine backup and legal retention obligations.`,
    ``,
    `6. No license; no obligation to proceed`,
    `No license or rights are granted under intellectual property except as needed to review Confidential Information. Either party may stop discussions at any time. Parable makes no representation that a transaction will occur.`,
    ``,
    `7. Remedies`,
    `Recipient acknowledges that breach may cause irreparable harm and that equitable relief (including injunction) may be appropriate in addition to other remedies.`,
    ``,
    `8. Electronic signature`,
    `By typing your name and providing your email below, you intend to sign this acknowledgment electronically and agree it has the same effect as a handwritten signature to the extent permitted by law.`,
    ``,
    `9. Governing law`,
    `This acknowledgment is governed by the laws of the State of Delaware, without regard to conflict-of-law rules, except where prohibited. Courts in Delaware have exclusive jurisdiction, subject to mandatory arbitration if the parties later execute a separate agreement requiring it.`,
    ``,
    `Disclaimer: This is a template for discussion. Have independent counsel review before relying on it. Parable may require a separate definitive agreement.`,
  ].join('\n');
}
