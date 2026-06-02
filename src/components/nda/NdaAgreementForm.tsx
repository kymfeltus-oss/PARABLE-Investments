"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type UIEvent,
} from "react";
import { PitchLockLogo } from "@/components/brand/PitchLockLogo";
import { MarketingShell } from "@/components/layout/MarketingShell";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { CONSENT_CHECKBOX_TEXT, getEmailStatusMessage } from "@/lib/nda-template-defaults";
import {
  pitchAccessFieldsAreValid,
  validatePitchAccessAgreementFields,
} from "@/lib/pitch-access-validation";
import {
  setInvestorSession,
  setPitchAccessSignedFlag,
  setLastEmailStatus,
} from "@/lib/pitch-access-storage";
import { resolveSafeRedirectPath } from "@/lib/safe-redirect";

type AgreementContext = {
  companyName: string | null;
  productName: string | null;
  presenterName: string | null;
  presenterEmail: string | null;
  governingState: string | null;
  agreementVersion: string | null;
  source: string | null;
};

function NdaAgreementFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pitchId = searchParams.get("pitchId")?.trim() || undefined;
  const presenterEmail = searchParams.get("presenterEmail")?.trim() || undefined;
  const templateId = searchParams.get("templateId")?.trim() || undefined;
  const ndaSlug = searchParams.get("nda")?.trim() || undefined;
  const nextPath = resolveSafeRedirectPath(searchParams.get("next"));

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);

  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [context, setContext] = useState<AgreementContext | null>(null);
  const [consentText, setConsentText] = useState(CONSENT_CHECKBOX_TEXT);
  const [templateLoading, setTemplateLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const [investorName, setInvestorName] = useState("");
  const [investorEmail, setInvestorEmail] = useState("");
  const [signature, setSignature] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showFieldErrors, setShowFieldErrors] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    if (max <= 8) {
      setScrollProgress(100);
      setScrolledToBottom(true);
      return;
    }
    const ratio = el.scrollTop / max;
    setScrollProgress(Math.min(100, Math.round(ratio * 100)));
    setScrolledToBottom(ratio >= 0.98 || el.scrollTop + el.clientHeight >= el.scrollHeight - 4);
  }, []);

  const loadAgreement = useCallback(async () => {
    setTemplateLoading(true);
    setScrolledToBottom(false);
    setScrollProgress(0);

    const params = new URLSearchParams();
    if (pitchId) params.set("pitchId", pitchId);
    if (templateId) params.set("templateId", templateId);
    if (ndaSlug) params.set("nda", ndaSlug);

    try {
      const qs = params.toString();
      const res = await fetch(`/api/nda-templates/resolve${qs ? `?${qs}` : ""}`);
      const data = (await res.json()) as {
        ok?: boolean;
        paragraphs?: string[];
        agreementVersion?: string;
        companyName?: string | null;
        productName?: string | null;
        presenterName?: string | null;
        presenterEmail?: string | null;
        governingState?: string | null;
        consentCheckboxText?: string;
        source?: string;
      };

      if (data.ok && data.paragraphs?.length) {
        setParagraphs(data.paragraphs);
        setContext({
          companyName: data.companyName ?? null,
          productName: data.productName ?? null,
          presenterName: data.presenterName ?? null,
          presenterEmail: data.presenterEmail ?? null,
          governingState: data.governingState ?? null,
          agreementVersion: data.agreementVersion ?? null,
          source: data.source ?? null,
        });
        if (data.consentCheckboxText) setConsentText(data.consentCheckboxText);
      }
    } finally {
      setTemplateLoading(false);
    }
  }, [pitchId, templateId, ndaSlug]);

  useEffect(() => {
    void loadAgreement();
  }, [loadAgreement]);

  useEffect(() => {
    if (templateLoading) return;
    updateScrollState();
  }, [templateLoading, paragraphs, updateScrollState]);

  useEffect(() => {
    const root = scrollRef.current;
    const sentinel = bottomSentinelRef.current;
    if (!root || !sentinel || templateLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setScrolledToBottom(true);
          setScrollProgress(100);
        }
      },
      { root, threshold: 0.5 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [templateLoading, paragraphs]);

  function onAgreementScroll(e: UIEvent<HTMLDivElement>) {
    updateScrollState();
    void e;
  }

  const fieldErrors = useMemo(
    () =>
      validatePitchAccessAgreementFields({
        investorName,
        investorEmail,
        signature,
        agreed,
      }),
    [investorName, investorEmail, signature, agreed]
  );

  const canSubmit =
    scrolledToBottom &&
    pitchAccessFieldsAreValid({ investorName, investorEmail, signature, agreed }) &&
    !busy;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setShowFieldErrors(true);
    setError(null);
    setSuccessMessage(null);

    if (!scrolledToBottom) {
      setError("Please scroll through the full agreement before signing.");
      return;
    }

    if (!pitchAccessFieldsAreValid({ investorName, investorEmail, signature, agreed })) {
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/pitch-access/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pitchId,
          presenterEmail,
          templateId,
          nda: ndaSlug,
          investorName: investorName.trim(),
          investorEmail: investorEmail.trim().toLowerCase(),
          signature: signature.trim(),
          consentCheckboxText: consentText,
        }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        debug?: string;
        emailStatus?: string;
        emailMessage?: string;
        emailError?: string | null;
      };

      if (!res.ok || !data.ok) {
        const detail =
          process.env.NODE_ENV === "development" && data.debug
            ? ` (${data.debug})`
            : "";
        setError(
          (data.error ?? "Could not save your agreement. Please try again.") + detail
        );
        return;
      }

      const msg = data.emailMessage ?? getEmailStatusMessage(data.emailStatus);
      setSuccessMessage(msg);
      // localStorage is UX-only; signed server record is source of truth.
      setPitchAccessSignedFlag();
      setInvestorSession(investorName.trim(), investorEmail.trim());
      setLastEmailStatus(data.emailStatus ?? "unknown", data.emailError);

      window.setTimeout(() => {
        router.push(nextPath);
      }, 2200);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  const showContext = Boolean(
    context?.companyName ||
      context?.productName ||
      context?.presenterName ||
      context?.agreementVersion ||
      context?.governingState
  );

  return (
    <MarketingShell showCta={false}>
      <div className="pl-app-content-safe mx-auto w-full max-w-xl flex-1 py-10 sm:py-16">
        <div className="mb-10 text-center pl-animate-in">
          <PitchLockLogo size="sm" className="justify-center" />
          <p className="pl-label mt-10">Secure Access Portal</p>
          <h1 className="pl-display mt-4 text-lg sm:text-xl">Pitch Access Agreement</h1>
          <p className="mt-3 pl-body text-sm">
            Review the agreement in full before accessing confidential materials.
          </p>
        </div>

        {showContext ? (
          <GlassCard className="mb-6 !p-5">
            <dl className="grid gap-4 pl-body text-sm sm:grid-cols-2">
              {context?.companyName ? (
                <div>
                  <dt className="pl-label">Company</dt>
                  <dd className="mt-1 pl-text">{context.companyName}</dd>
                </div>
              ) : null}
              {context?.productName ? (
                <div>
                  <dt className="pl-label">Product</dt>
                  <dd className="mt-1 pl-text">{context.productName}</dd>
                </div>
              ) : null}
              {context?.presenterName ? (
                <div>
                  <dt className="pl-label">Presenter</dt>
                  <dd className="mt-1 pl-text">{context.presenterName}</dd>
                </div>
              ) : null}
              {context?.presenterEmail ? (
                <div>
                  <dt className="pl-label">Presenter email</dt>
                  <dd className="mt-1 pl-text">{context.presenterEmail}</dd>
                </div>
              ) : null}
              {context?.agreementVersion ? (
                <div>
                  <dt className="pl-label">NDA version</dt>
                  <dd className="mt-1 font-mono text-xs pl-text">{context.agreementVersion}</dd>
                </div>
              ) : null}
              {context?.governingState ? (
                <div>
                  <dt className="pl-label">Governing state</dt>
                  <dd className="mt-1 pl-text">{context.governingState}</dd>
                </div>
              ) : null}
            </dl>
          </GlassCard>
        ) : null}

        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="pl-label">Agreement</p>
          <p className="text-xs pl-muted">{scrollProgress}% read</p>
        </div>
        <div className="pl-progress-track mb-3">
          <div className="pl-progress-fill" style={{ width: `${scrollProgress}%` }} />
        </div>

        <GlassCard className="!p-0 overflow-hidden">
          <div
            ref={scrollRef}
            onScroll={onAgreementScroll}
            className="pl-scroll max-h-[40vh] overflow-y-auto p-6 sm:p-8 pl-body text-sm"
          >
            {templateLoading ? (
              <p className="pl-muted">Loading agreement…</p>
            ) : (
              <>
                {paragraphs.map((p, i) => (
                  <p key={i} className={i > 0 ? "mt-5" : undefined}>
                    {p}
                  </p>
                ))}
                <div ref={bottomSentinelRef} className="h-px w-full" aria-hidden />
              </>
            )}
          </div>
        </GlassCard>

        {!scrolledToBottom && !templateLoading ? (
          <p className="mt-3 text-xs pl-muted">Scroll to the bottom to enable signing.</p>
        ) : null}

        {successMessage ? (
          <GlassCard className="mt-8">
            <p className="pl-body text-sm pl-text">{successMessage}</p>
            <p className="mt-2 text-xs pl-muted">Redirecting…</p>
          </GlassCard>
        ) : (
          <GlassCard className="mt-8">
            <form onSubmit={onSubmit} className="space-y-6" noValidate>
              <div>
                <label className="pl-input-label" htmlFor="investorEmail">
                  Email
                </label>
                <input
                  id="investorEmail"
                  type="email"
                  required
                  autoComplete="email"
                  value={investorEmail}
                  onChange={(e) => setInvestorEmail(e.target.value)}
                  placeholder="you@firm.com"
                  className="pl-input disabled:opacity-50"
                  disabled={busy}
                />
                {showFieldErrors && fieldErrors.investorEmail ? (
                  <p className="mt-1 text-xs pl-error">{fieldErrors.investorEmail}</p>
                ) : null}
              </div>
              <div>
                <label className="pl-input-label" htmlFor="investorName">
                  Full legal name
                </label>
                <input
                  id="investorName"
                  type="text"
                  required
                  autoComplete="name"
                  value={investorName}
                  onChange={(e) => setInvestorName(e.target.value)}
                  placeholder="Your legal name"
                  className="pl-input disabled:opacity-50"
                  disabled={busy}
                />
                {showFieldErrors && fieldErrors.investorName ? (
                  <p className="mt-1 text-xs pl-error">{fieldErrors.investorName}</p>
                ) : null}
              </div>
              <div>
                <label className="pl-input-label" htmlFor="signature">
                  Signature
                </label>
                <input
                  id="signature"
                  type="text"
                  required
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Must match your full legal name"
                  className="pl-input disabled:opacity-50"
                  disabled={busy}
                />
                {showFieldErrors && fieldErrors.signature ? (
                  <p className="mt-1 text-xs pl-error">{fieldErrors.signature}</p>
                ) : null}
              </div>
              <label className="flex cursor-pointer items-start gap-3 pl-body text-sm">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 accent-[var(--pl-cyan)]"
                  disabled={busy || !scrolledToBottom}
                />
                <span>{consentText}</span>
              </label>
              {showFieldErrors && fieldErrors.agreed ? (
                <p className="text-xs pl-error">{fieldErrors.agreed}</p>
              ) : null}
              {error ? <p className="pl-body text-sm pl-error">{error}</p> : null}
              <GlassButton type="submit" disabled={!canSubmit} className="w-full">
                {busy ? "Signing…" : "I Agree"}
              </GlassButton>
            </form>
          </GlassCard>
        )}
      </div>
    </MarketingShell>
  );
}

export function NdaAgreementForm() {
  return (
    <Suspense fallback={null}>
      <NdaAgreementFormInner />
    </Suspense>
  );
}
