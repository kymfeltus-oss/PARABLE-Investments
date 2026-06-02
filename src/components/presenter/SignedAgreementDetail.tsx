import Link from "next/link";
import { PitchLockLogo } from "@/components/brand/PitchLockLogo";
import { DashboardHeader, DashboardShell } from "@/components/layout/DashboardShell";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import type { PitchAccessAgreementRecord } from "@/lib/pitch-access-agreement-record";

function formatUtc(iso: string): string {
  try {
    return new Date(iso).toISOString().replace("T", " ").slice(0, 19);
  } catch {
    return iso;
  }
}

function DetailField({
  label,
  value,
  mono = false,
  className,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="pl-label">{label}</dt>
      <dd className={mono ? "pl-data pl-mono pl-text-secondary" : "pl-data pl-body text-sm"}>
        {value}
      </dd>
    </div>
  );
}

export function SignedAgreementDetail({ agreement }: { agreement: PitchAccessAgreementRecord }) {
  return (
    <DashboardShell
      sidebar={null}
      bottomNav={null}
      header={<DashboardHeader title="Signed Pitch Access Agreement" />}
    >
      <div className="pl-mobile-logo-bar lg:hidden">
        <PitchLockLogo size="sm" />
      </div>
      <div className="mx-auto max-w-2xl space-y-8 pl-page-container">
        <Link href="/dashboard/presenter/nda#tracker" className="pl-link text-sm">
          ← Back to NDA Tracker
        </Link>

        <GlassCard className="pl-animate-in">
          <p className="pl-label">Document metadata</p>
          <dl className="pl-detail-grid">
            <DetailField label="Agreement ID" value={agreement.id} mono className="sm:col-span-2" />
            <DetailField label="NDA version" value={agreement.version} mono />
            <DetailField label="Signed (UTC)" value={formatUtc(agreement.signedAt)} />
            <DetailField label="Email status" value={agreement.emailStatus} />
            {agreement.signedRecordUrl ? (
              <DetailField
                label="Signed record URL"
                value={agreement.signedRecordUrl}
                mono
                className="sm:col-span-2"
              />
            ) : null}
          </dl>
        </GlassCard>

        <GlassCard>
          <p className="pl-label">Presenter</p>
          <dl className="pl-detail-grid">
            <DetailField label="Name" value={agreement.presenterName ?? "—"} />
            <DetailField label="Email" value={agreement.presenterEmail ?? "—"} />
            <DetailField label="Company" value={agreement.companyName ?? "—"} />
            <DetailField label="Product" value={agreement.productName ?? "—"} />
            <DetailField label="Governing state" value={agreement.governingState ?? "—"} />
          </dl>
        </GlassCard>

        <GlassCard>
          <p className="pl-label">Recipient</p>
          <dl className="pl-detail-grid">
            <DetailField label="Investor name" value={agreement.investorName} />
            <DetailField label="Investor email" value={agreement.investorEmail} />
            <DetailField label="Typed signature" value={agreement.signature} className="sm:col-span-2" />
          </dl>
        </GlassCard>

        <GlassCard>
          <p className="pl-label">Audit trail</p>
          <dl className="pl-detail-grid">
            <DetailField label="Document hash" value={agreement.documentHash ?? "—"} mono className="sm:col-span-2" />
            <DetailField label="Record hash" value={agreement.recordHash ?? "—"} mono className="sm:col-span-2" />
            <DetailField label="IP address" value={agreement.clientIp ?? "—"} />
            <DetailField label="Device fingerprint" value={agreement.deviceFingerprint ?? "—"} mono />
            {agreement.userAgent ? (
              <DetailField label="User agent" value={agreement.userAgent} mono className="sm:col-span-2" />
            ) : null}
            {agreement.consentCheckboxText ? (
              <DetailField label="Consent checkbox text" value={agreement.consentCheckboxText} className="sm:col-span-2" />
            ) : null}
          </dl>
          <p className="mt-6 pl-body text-xs pl-muted">
            Tamper-evident audit trail designed to support attribution and record retention. Review by
            qualified legal counsel recommended.
          </p>
        </GlassCard>

        <GlassCard>
          <p className="pl-label">Document snapshot</p>
          <p className="mt-2 pl-body text-xs pl-muted">
            Immutable text captured at signing — not regenerated from templates.
          </p>
          <div className="pl-scroll pl-snapshot-panel pl-body">{agreement.documentSnapshot}</div>
        </GlassCard>

        <GlassButton type="button" variant="outline" disabled className="opacity-50">
          Download PDF — coming soon
        </GlassButton>
      </div>
    </DashboardShell>
  );
}

export function SignedAgreementNotFound() {
  return (
    <DashboardShell sidebar={null} bottomNav={null} header={<DashboardHeader title="Signed record" />}>
      <div className="mx-auto max-w-xl pl-page-container text-center">
        <p className="pl-body text-sm pl-error">Agreement not found.</p>
        <Link href="/dashboard/presenter/nda#tracker" className="pl-link mt-6 inline-block text-sm">
          ← NDA Tracker
        </Link>
      </div>
    </DashboardShell>
  );
}
