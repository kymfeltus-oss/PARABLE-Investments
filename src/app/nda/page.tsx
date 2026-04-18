'use client';

import { Suspense, useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { InvestorAtmosphere } from '@/components/brand/InvestorAtmosphere';
import { ParableLogoMark } from '@/components/brand/ParableLogoMark';
import { getInvestorAgreementPlainText } from '@/lib/investor-agreement-text';
import {
  ndaFieldsAreValid,
  validateNdaFields,
  type NdaFieldErrors,
} from '@/lib/investor-agreement-validation';
import {
  getInvestorNdaAccepted,
  sanitizeNextPath,
  setInvestorNdaAccepted,
} from '@/lib/investor-nda-storage';

function subscribeNdaStorage() {
  return () => {};
}

function NdaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = sanitizeNextPath(searchParams.get('next'));
  const alreadySigned = useSyncExternalStore(
    subscribeNdaStorage,
    () => getInvestorNdaAccepted(),
    () => false
  );
  const [agreed, setAgreed] = useState(false);
  const [printedName, setPrintedName] = useState('');
  const [signature, setSignature] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFieldErrors, setShowFieldErrors] = useState(false);

  const paragraphs = useMemo(() => {
    return getInvestorAgreementPlainText()
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
  }, []);

  const fieldErrors = useMemo((): NdaFieldErrors => {
    return validateNdaFields(printedName.trim(), signature.trim(), email.trim());
  }, [printedName, signature, email]);

  const canSubmit = agreed && ndaFieldsAreValid(printedName.trim(), signature.trim(), email.trim());

  const onContinue = useCallback(async () => {
    setShowFieldErrors(true);
    if (!agreed) {
      setError('Please confirm that you have read and agree to the terms.');
      return;
    }
    if (!ndaFieldsAreValid(printedName.trim(), signature.trim(), email.trim())) {
      setError(null);
      return;
    }
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/investor/agreement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          printedName: printedName.trim(),
          signature: signature.trim(),
          email: email.trim().toLowerCase(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        fields?: NdaFieldErrors;
      };
      if (!res.ok) {
        setShowFieldErrors(true);
        setError(data.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }
      setInvestorNdaAccepted();
      router.push(nextPath);
    } catch {
      setError('Network error. Check your connection and try again.');
      setSubmitting(false);
    }
  }, [agreed, submitting, printedName, signature, email, nextPath, router]);

  useEffect(() => {
    if (alreadySigned) {
      router.replace(nextPath);
    }
  }, [alreadySigned, nextPath, router]);

  if (alreadySigned) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-black text-white" suppressHydrationWarning>
        <InvestorAtmosphere />
        <div className="relative z-20 flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center text-sm text-white/50">
          <p>NDA already on file for this browser—continuing…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white" suppressHydrationWarning>
      <InvestorAtmosphere />
      <div className="relative z-20 mx-auto max-w-2xl px-4 py-10 pb-24 md:py-14 md:pb-28">
        <Link href="/" className="parable-eyebrow mb-8 inline-block hover:text-[#00f2ff]">
          ← Back to landing
        </Link>

        <ParableLogoMark className="mx-auto mb-8 max-w-xs opacity-90 md:max-w-sm" />

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="parable-eyebrow mb-3 text-center">Step 2 of 3</p>
          <h1 className="mb-2 text-center text-xl font-black uppercase tracking-[0.18em] text-[#00f2ff] md:text-2xl md:tracking-[0.22em]">
            Confidentiality &amp; non-compete
          </h1>
          <p className="mb-10 text-center text-sm text-white/45">
            Read the terms, print and sign electronically below, then continue to investor materials.
          </p>
        </motion.div>

        <div className="parable-glass-panel max-h-[min(56vh,520px)] overflow-y-auto px-5 py-6 text-left text-sm leading-relaxed text-white/65 md:px-8 md:py-8 md:text-[15px]">
          {paragraphs.map((block, i) => (
            <p key={i} className={block.startsWith('Disclaimer:') ? 'mt-4 text-white/45' : i === 0 ? 'font-semibold text-white/90' : 'mt-4'}>
              {block}
            </p>
          ))}
        </div>

        <div className="mt-8 space-y-4 rounded-xl border border-white/10 bg-black/40 px-4 py-5 md:px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Your acknowledgment</p>
          <label className="block">
            <span className="mb-1.5 block text-xs text-white/55">Full legal name (print)</span>
            <input
              type="text"
              name="printedName"
              autoComplete="name"
              value={printedName}
              onChange={(e) => setPrintedName(e.target.value)}
              placeholder="Jane Q. Investor"
              aria-invalid={showFieldErrors && Boolean(fieldErrors.printedName)}
              className={`w-full rounded-lg border bg-black/60 px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 ${
                showFieldErrors && fieldErrors.printedName
                  ? 'border-red-400/50 focus:border-red-400/60 focus:ring-red-400/20'
                  : 'border-white/15 focus:border-[#00f2ff]/50 focus:ring-[#00f2ff]/30'
              }`}
            />
            {showFieldErrors && fieldErrors.printedName ? (
              <p className="mt-1.5 text-xs text-red-300/95">{fieldErrors.printedName}</p>
            ) : null}
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs text-white/55">Electronic signature (type your full legal name)</span>
            <input
              type="text"
              name="signature"
              autoComplete="off"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Must match printed name exactly (spacing and capitalization can differ)"
              aria-invalid={showFieldErrors && Boolean(fieldErrors.signature)}
              className={`w-full rounded-lg border bg-black/60 px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 ${
                showFieldErrors && fieldErrors.signature
                  ? 'border-red-400/50 focus:border-red-400/60 focus:ring-red-400/20'
                  : 'border-white/15 focus:border-[#00f2ff]/50 focus:ring-[#00f2ff]/30'
              }`}
            />
            {showFieldErrors && fieldErrors.signature ? (
              <p className="mt-1.5 text-xs text-red-300/95">{fieldErrors.signature}</p>
            ) : null}
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs text-white/55">Email address</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              aria-invalid={showFieldErrors && Boolean(fieldErrors.email)}
              className={`w-full rounded-lg border bg-black/60 px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 ${
                showFieldErrors && fieldErrors.email
                  ? 'border-red-400/50 focus:border-red-400/60 focus:ring-red-400/20'
                  : 'border-white/15 focus:border-[#00f2ff]/50 focus:ring-[#00f2ff]/30'
              }`}
            />
            {showFieldErrors && fieldErrors.email ? (
              <p className="mt-1.5 text-xs text-red-300/95">{fieldErrors.email}</p>
            ) : null}
          </label>
        </div>

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-4 md:px-5">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 rounded border-[#00f2ff]/40 text-[#00f2ff] focus:ring-[#00f2ff]"
          />
          <span className="text-left text-sm text-white/70">
            I have read and agree to the confidentiality, restricted use, and non-competition terms above, including
            electronic signature and record-keeping, and I confirm I have authority to enter this acknowledgment.
          </span>
        </label>

        {error ? (
          <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-center text-sm text-red-200/90">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          disabled={submitting}
          onClick={onContinue}
          className={`mt-8 w-full rounded-xl border border-[#00f2ff]/40 bg-[#00f2ff]/10 py-4 text-sm font-black uppercase tracking-[0.25em] text-[#00f2ff] shadow-[0_0_24px_rgba(0,242,255,0.12)] transition hover:bg-[#00f2ff]/20 disabled:cursor-not-allowed disabled:opacity-35 ${
            !canSubmit && !submitting ? 'opacity-55' : ''
          }`}
        >
          {submitting ? 'Saving…' : 'Sign & continue'}
        </button>

        <p className="mt-4 text-center text-[10px] leading-relaxed text-white/30">
          Submissions are stored securely for our records. This template is not legal advice—have counsel review. Server
          storage requires Supabase env vars in production.
        </p>

        <p className="mt-6 text-center text-[10px] uppercase tracking-[0.2em] text-white/25">
          Step 3 — your choices (meeting, materials, requests)
        </p>
      </div>
    </div>
  );
}

export default function NdaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black text-white/50 text-sm">
          Loading…
        </div>
      }
    >
      <NdaForm />
    </Suspense>
  );
}
