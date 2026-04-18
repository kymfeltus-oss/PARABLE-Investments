'use client';

import { Suspense, useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { InvestorAtmosphere } from '@/components/brand/InvestorAtmosphere';
import { ParableLogoMark } from '@/components/brand/ParableLogoMark';
import {
  getInvestorNdaAccepted,
  sanitizeNextPath,
  setInvestorNdaAccepted,
} from '@/lib/investor-nda-storage';

function NdaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = sanitizeNextPath(searchParams.get('next'));
  const [agreed, setAgreed] = useState(() => getInvestorNdaAccepted());

  const onContinue = useCallback(() => {
    if (!agreed) return;
    setInvestorNdaAccepted();
    router.push(nextPath);
  }, [agreed, nextPath, router]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <InvestorAtmosphere />
      <div className="relative z-20 mx-auto max-w-2xl px-4 py-10 pb-24 md:py-14 md:pb-28">
        <Link href="/" className="parable-eyebrow mb-8 inline-block hover:text-[#00f2ff]">
          ← Back to landing
        </Link>

        <ParableLogoMark className="mx-auto mb-8 max-w-xs opacity-90 md:max-w-sm" />

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="parable-eyebrow mb-3 text-center">Step 2 of 3</p>
          <h1 className="mb-2 text-center text-xl font-black uppercase tracking-[0.18em] text-[#00f2ff] md:text-2xl md:tracking-[0.22em]">
            Non-disclosure agreement
          </h1>
          <p className="mb-10 text-center text-sm text-white/45">
            Please read and accept before accessing investor materials or sessions.
          </p>
        </motion.div>

        <div className="parable-glass-panel max-h-[min(52vh,480px)] overflow-y-auto px-5 py-6 text-left text-sm leading-relaxed text-white/65 md:px-8 md:py-8 md:text-[15px]">
          <p className="font-semibold text-white/90">Mutual confidentiality (summary)</p>
          <p className="mt-4">
            Parable (“Discloser”) may share confidential information—including product plans, financial projections,
            metrics, and roadmap details—with you (“Recipient”) solely so you can evaluate a potential investment or
            strategic relationship.
          </p>
          <p className="mt-4">
            Recipient agrees to hold all non-public information in strict confidence, use it only for that evaluation,
            not disclose it to third parties without prior written consent, and protect it with reasonable care. This
            obligation survives even if no investment occurs.
          </p>
          <p className="mt-4">
            Information is not confidential if it was already public through no fault of Recipient, was rightfully known
            beforehand, or is independently developed. Recipient may share with professional advisors who are bound by
            confidentiality.
          </p>
          <p className="mt-4 text-white/45">
            This summary is for convenience. A full definitive agreement may supersede it where signed. Consult your
            counsel; by proceeding you confirm you understand these obligations.
          </p>
        </div>

        <label className="mt-8 flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-4 md:px-5">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 rounded border-[#00f2ff]/40 text-[#00f2ff] focus:ring-[#00f2ff]"
          />
          <span className="text-left text-sm text-white/70">
            I have read and agree to treat Parable’s shared information as confidential under the terms described above.
          </span>
        </label>

        <button
          type="button"
          disabled={!agreed}
          onClick={onContinue}
          className="mt-8 w-full rounded-xl border border-[#00f2ff]/40 bg-[#00f2ff]/10 py-4 text-sm font-black uppercase tracking-[0.25em] text-[#00f2ff] shadow-[0_0_24px_rgba(0,242,255,0.12)] transition hover:bg-[#00f2ff]/20 disabled:cursor-not-allowed disabled:opacity-35"
        >
          Agree &amp; continue
        </button>

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
