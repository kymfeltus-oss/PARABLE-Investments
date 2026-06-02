"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PitchLockLogo } from "@/components/brand/PitchLockLogo";
import {
  DashboardBottomNav,
  DashboardHeader,
  DashboardShell,
  DashboardSidebar,
  type NavItem,
} from "@/components/layout/DashboardShell";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  NDA_COUNSEL_NOTE,
  US_STATE_OPTIONS,
  buildStandardNdaText,
} from "@/lib/nda-template-defaults";

const SIDEBAR_NAV: NavItem[] = [
  { href: "/dashboard/presenter", label: "Overview" },
  { href: "/dashboard/presenter/nda", label: "NDA" },
  { href: "/pitch", label: "Pitch Rooms" },
  { href: "/pricing", label: "Plans" },
];

type Template = {
  id: string;
  companyName: string;
  productName: string;
  presenterName: string | null;
  presenterEmail: string | null;
  governingState: string;
  agreementVersion: string;
  status: string;
  isActive: boolean;
  activeForPresenter: boolean;
  signingUrl: string | null;
};

type Agreement = {
  id: string;
  investorName: string;
  investorEmail: string;
  version: string;
  signedAt: string;
  emailStatus: string;
  companyName: string | null;
  productName: string | null;
  templateName: string;
  signedRecordUrl: string | null;
  documentHashShort: string;
};

type TrackerStats = {
  totalSigned: number;
  emailsSent: number;
  emailsFailed: number;
  emailsUnconfigured: number;
};

const DEFAULT_PRESENTER = "founder@pitchlock.test";

export function NdaPresenterHub({ presenterEmail }: { presenterEmail?: string }) {
  const email = presenterEmail?.trim().toLowerCase() || DEFAULT_PRESENTER;

  const [templates, setTemplates] = useState<Template[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [stats, setStats] = useState<TrackerStats>({
    totalSigned: 0,
    emailsSent: 0,
    emailsFailed: 0,
    emailsUnconfigured: 0,
  });
  const [draftId, setDraftId] = useState<string | null>(null);
  const [lastFinalizedId, setLastFinalizedId] = useState<string | null>(null);

  const [companyName, setCompanyName] = useState("Your Company");
  const [productName, setProductName] = useState("Pitch Lock");
  const [presenterName, setPresenterName] = useState("");
  const [presenterEmailField, setPresenterEmailField] = useState(email);
  const [governingState, setGoverningState] = useState("Texas");

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const activeTemplate = useMemo(
    () =>
      templates.find((t) => t.status === "finalized" && t.isActive && t.activeForPresenter) ??
      templates.find((t) => t.status === "finalized" && t.isActive) ??
      null,
    [templates]
  );

  const activeSigningUrl = activeTemplate?.signingUrl ?? null;

  const previewText = useMemo(
    () =>
      buildStandardNdaText({
        companyName,
        productName,
        presenterName,
        presenterEmail: presenterEmailField,
        governingState,
      }),
    [companyName, productName, presenterName, presenterEmailField, governingState]
  );

  const load = useCallback(async () => {
    const [tRes, trackerRes] = await Promise.all([
      fetch(`/api/nda-templates?presenterEmail=${encodeURIComponent(email)}`),
      fetch(`/api/nda-tracker?presenterEmail=${encodeURIComponent(email)}`),
    ]);
    const tJson = (await tRes.json()) as { templates?: Template[] };
    const trackerJson = (await trackerRes.json()) as {
      agreements?: Agreement[];
      stats?: TrackerStats;
    };

    setTemplates(tJson.templates ?? []);
    setAgreements(trackerJson.agreements ?? []);
    setStats(
      trackerJson.stats ?? {
        totalSigned: trackerJson.agreements?.length ?? 0,
        emailsSent: 0,
        emailsFailed: 0,
        emailsUnconfigured: 0,
      }
    );

    const draft = (tJson.templates ?? []).find((t) => t.status === "draft") ?? null;
    if (draft) {
      setDraftId(draft.id);
      setCompanyName(draft.companyName);
      setProductName(draft.productName);
      setPresenterName(draft.presenterName ?? "");
      setPresenterEmailField(draft.presenterEmail ?? email);
      setGoverningState(draft.governingState);
    } else {
      setPresenterEmailField(email);
    }

    const finalized = (tJson.templates ?? []).filter((t) => t.status === "finalized");
    setLastFinalizedId(finalized[0]?.id ?? null);
  }, [email]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (activeTemplate?.id) void loadQr(activeTemplate.id);
  }, [activeTemplate?.id]);

  async function saveDraft() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/nda-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          productName,
          presenterName,
          presenterEmail: presenterEmailField,
          governingState,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; template?: Template; error?: string };
      if (!data.ok || !data.template) {
        setMessage(data.error ?? "Could not save draft");
        return;
      }
      setDraftId(data.template.id);
      setMessage("Draft saved.");
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function finalizeNda() {
    const targetId = draftId ?? lastFinalizedId;
    if (!targetId) {
      setMessage("Save a draft first.");
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/nda-templates/${targetId}/finalize`, { method: "POST" });
      const data = (await res.json()) as { ok?: boolean; templateId?: string; error?: string };
      if (!data.ok) {
        setMessage(data.error ?? "Could not finalize");
        return;
      }
      setLastFinalizedId(data.templateId ?? targetId);
      setMessage("NDA finalized. Set it as active when ready.");
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function activateNda(templateId: string) {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/nda-templates/${templateId}/activate`, { method: "POST" });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!data.ok) {
        setMessage(data.error ?? "Could not activate");
        return;
      }
      setMessage("Active NDA updated.");
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function loadQr(templateId: string) {
    const res = await fetch(`/api/nda-templates/${templateId}/qr`);
    const data = (await res.json()) as { ok?: boolean; qrCodeDataUrl?: string; error?: string };
    if (data.ok) setQrDataUrl(data.qrCodeDataUrl ?? null);
  }

  function copySigningLink() {
    if (!activeSigningUrl) return;
    void navigator.clipboard.writeText(activeSigningUrl);
    setMessage("Link copied.");
  }

  function downloadQr() {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = "pitch-lock-nda-qr.png";
    a.click();
  }

  const activateTargetId =
    draftId && templates.find((t) => t.id === draftId)?.status === "finalized"
      ? draftId
      : lastFinalizedId;

  return (
    <DashboardShell
      sidebar={
        <DashboardSidebar
          title="Presenter"
          subtitle="NDA"
          navItems={SIDEBAR_NAV}
          footer={
            <Link href="/dashboard/presenter" className="block text-center text-xs pl-muted pl-hover-text">
              ← Overview
            </Link>
          }
        />
      }
      bottomNav={<DashboardBottomNav navItems={SIDEBAR_NAV} />}
      header={
        <DashboardHeader
          title="NDA"
          badge={<p className="mt-1 text-sm pl-muted">{email}</p>}
        />
      }
    >
      <div className="pl-mobile-logo-bar lg:hidden">
        <PitchLockLogo size="sm" />
      </div>

      <div className="mx-auto max-w-3xl space-y-10 pl-page-container">
        {message ? (
          <p className="pl-body text-sm pl-text">{message}</p>
        ) : null}

        <div id="qr" className="scroll-mt-24">
        <GlassCard glow={Boolean(activeTemplate)}>
          <p className="pl-label">Active NDA</p>
          {activeTemplate ? (
            <div className="mt-6 space-y-8">
              <dl className="grid gap-5 pl-body text-sm sm:grid-cols-2">
                <div>
                  <dt className="pl-label">Version</dt>
                  <dd className="mt-1 font-mono text-xs pl-text">{activeTemplate.agreementVersion}</dd>
                </div>
                <div>
                  <dt className="pl-label">Governing state</dt>
                  <dd className="mt-1 pl-text">{activeTemplate.governingState}</dd>
                </div>
                <div>
                  <dt className="pl-label">Company</dt>
                  <dd className="mt-1 pl-text">{activeTemplate.companyName}</dd>
                </div>
                <div>
                  <dt className="pl-label">Product</dt>
                  <dd className="mt-1 pl-text">{activeTemplate.productName}</dd>
                </div>
                <div>
                  <dt className="pl-label">Presenter</dt>
                  <dd className="mt-1 pl-text">{activeTemplate.presenterName ?? "—"}</dd>
                </div>
                <div>
                  <dt className="pl-label">Presenter email</dt>
                  <dd className="mt-1 pl-text">{activeTemplate.presenterEmail ?? email}</dd>
                </div>
              </dl>

              {activeSigningUrl ? (
                <div className="space-y-4 border-t border-[var(--pl-border)] pt-6">
                  <p className="pl-label">Signing link</p>
                  <p className="break-all text-xs pl-muted">{activeSigningUrl}</p>
                  <div className="flex flex-wrap gap-3">
                    <GlassButton type="button" variant="ghost" onClick={copySigningLink}>
                      Copy link
                    </GlassButton>
                    <GlassButton type="button" variant="outline" onClick={() => void loadQr(activeTemplate.id)}>
                      Generate QR
                    </GlassButton>
                  </div>
                  {qrDataUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qrDataUrl}
                        alt="Active NDA QR code"
                        className="mx-auto max-w-[200px] rounded-[var(--pl-radius)] border border-[var(--pl-border)] bg-[var(--pl-text)] p-4"
                      />
                      <GlassButton type="button" variant="ghost" onClick={downloadQr}>
                        Download QR
                      </GlassButton>
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : (
            <p className="mt-6 text-sm pl-muted">
              Finalize and activate an NDA to assign investors to your version.
            </p>
          )}
        </GlassCard>
        </div>

        <GlassCard>
          <p className="pl-label">Setup</p>
          <p className="mt-4 text-xs leading-relaxed pl-muted">{NDA_COUNSEL_NOTE}</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <label className="pl-input-label">Company</label>
              <input className="pl-input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div>
              <label className="pl-input-label">Product</label>
              <input className="pl-input" value={productName} onChange={(e) => setProductName(e.target.value)} />
            </div>
            <div>
              <label className="pl-input-label">Presenter name</label>
              <input className="pl-input" value={presenterName} onChange={(e) => setPresenterName(e.target.value)} />
            </div>
            <div>
              <label className="pl-input-label">Presenter email</label>
              <input
                className="pl-input"
                type="email"
                value={presenterEmailField}
                onChange={(e) => setPresenterEmailField(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="pl-input-label">Governing state</label>
              <select className="pl-input" value={governingState} onChange={(e) => setGoverningState(e.target.value)}>
                {US_STATE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <GlassCard className="!mt-8 !p-6 pl-scroll max-h-40 overflow-y-auto whitespace-pre-wrap text-xs leading-relaxed pl-muted">
            {previewText}
          </GlassCard>
          <GlassButton type="button" disabled={busy} className="mt-8" onClick={() => void saveDraft()}>
            Save draft
          </GlassButton>
        </GlassCard>

        <GlassCard>
          <p className="pl-label">Finalize</p>
          <p className="mt-4 text-sm pl-muted">
            Finalize locks this version. Activation applies it to new signatures only.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <GlassButton type="button" variant="outline" disabled={busy || !draftId} onClick={() => void finalizeNda()}>
              Finalize NDA
            </GlassButton>
            <GlassButton
              type="button"
              disabled={busy || !activateTargetId}
              onClick={() => activateTargetId && void activateNda(activateTargetId)}
            >
              Set as active
            </GlassButton>
          </div>
        </GlassCard>

        <div id="tracker" className="scroll-mt-24">
          <GlassCard>
            <p className="pl-label">NDA Tracker</p>

            <div className="pl-metrics-row">
              <div className="pl-metric-hero">
                <p className="pl-metric-value">{stats.totalSigned}</p>
                <p className="pl-label">Total signed</p>
              </div>
              <div>
                <p className="pl-metric-value">{stats.emailsSent}</p>
                <p className="pl-label">Emails sent</p>
              </div>
              <div>
                <p className="pl-metric-value">{stats.emailsFailed + stats.emailsUnconfigured}</p>
                <p className="pl-label">Delivery pending</p>
              </div>
            </div>

            {agreements.length === 0 ? (
              <p className="mt-8 pl-body text-sm pl-muted">No signatures yet.</p>
            ) : (
              <div className="mt-8 overflow-x-auto pl-scroll">
                <table className="pl-table">
                  <thead>
                    <tr>
                      <th>Investor</th>
                      <th>Version</th>
                      <th>Signed</th>
                      <th>Email</th>
                      <th>Record</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agreements.map((a) => (
                      <tr key={a.id}>
                        <td>
                          <p className="pl-text">{a.investorName}</p>
                          <p className="pl-mono pl-muted">{a.investorEmail}</p>
                        </td>
                        <td className="pl-mono pl-text-secondary">{a.version}</td>
                        <td className="pl-body text-xs">
                          {new Date(a.signedAt).toLocaleDateString()}
                        </td>
                        <td className="pl-body text-xs capitalize">{a.emailStatus}</td>
                        <td>
                          <Link
                            href={`/dashboard/presenter/nda/signed/${a.id}`}
                            className="pl-link text-xs"
                          >
                            View record
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </DashboardShell>
  );
}
