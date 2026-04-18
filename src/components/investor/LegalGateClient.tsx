'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { InvestorAtmosphere } from '@/components/brand/InvestorAtmosphere';
import { ParableLogoMark } from '@/components/brand/ParableLogoMark';
import { computeBrowserFingerprint } from '@/lib/browser-fingerprint';
import {
  getInvestorAgreementBodyParagraphs,
  LEGAL_GATE_DISPLAY_TITLE,
} from '@/lib/investor-agreement-text';

export function LegalGateClient() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');

  const paragraphs = useMemo(() => getInvestorAgreementBodyParagraphs(), []);
  const [email, setEmail] = useState('');
  const [ack, setAck] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const canSubmit =
    ack && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && !submitting;

  const onAccess = useCallback(async () => {
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      const browserFingerprint = await computeBrowserFingerprint();
      const res = await fetch('/api/investor/legal-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          acknowledged: true,
          browserFingerprint,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }
      setDone(true);
    } catch {
      setError('Network error. Check your connection and try again.');
      setSubmitting(false);
    }
  }, [canSubmit, email]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <InvestorAtmosphere />

      {/* Cinematic vignette + film grain */}
      <div
        className="pointer-events-none fixed inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_55%,rgba(0,0,0,0.92)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-10 opacity-[0.07] [background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]"
        aria-hidden
      />

      <div className="relative z-20 mx-auto max-w-3xl px-4 py-12 pb-28 md:py-16 md:pb-32">
        <Link href="/" className="parable-eyebrow mb-10 inline-block hover:text-[#00f2ff]">
          ← Back to landing
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <ParableLogoMark className="mx-auto mb-10 max-w-[200px] opacity-95 md:max-w-xs" />
          <p className="parable-eyebrow mb-4 text-[#00f2ff]/80">Legal gate</p>
          <h1 className="mb-3 font-serif text-2xl font-light italic tracking-wide text-white/95 md:text-3xl md:leading-snug">
            Sanctuary access
          </h1>
          <p className="mx-auto max-w-xl text-sm text-white/45">
            Review the agreement, acknowledge, and verify your email to continue.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="mt-14 rounded-2xl border border-[#00f2ff]/25 bg-black/50 px-6 py-12 text-center shadow-[0_0_60px_rgba(0,242,255,0.08)] backdrop-blur-xl md:px-10"
            >
              <p className="font-serif text-xl text-white md:text-2xl">Verification sent</p>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/55">
                We emailed a secure magic link to <span className="text-[#00f2ff]/90">{email}</span>. Open it on this
                device to finish signing in and open the next step.
              </p>
              <p className="mt-6 text-xs text-white/35">Did not arrive? Check spam or promotions, then try again.</p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12"
            >
              <div className="rounded-2xl border border-white/[0.12] bg-white/[0.04] p-1 shadow-[0_8px_48px_rgba(0,0,0,0.55)] backdrop-blur-2xl md:p-1.5">
                <div className="rounded-[14px] bg-black/35 px-4 py-6 md:px-8 md:py-8">
                  <p className="text-center font-sans text-[13px] font-semibold leading-snug tracking-wide text-[#00f2ff]/95 md:text-sm">
                    {LEGAL_GATE_DISPLAY_TITLE}
                  </p>
                  <div className="mt-6 max-h-[min(48vh,440px)] overflow-y-auto border-t border-white/10 pt-6 pr-1 text-left text-[13px] leading-relaxed text-white/65 md:text-[14px] md:leading-[1.65]">
                    {paragraphs.map((block, i) => (
                      <p
                        key={i}
                        className={
                          block.startsWith('Disclaimer:')
                            ? 'mt-5 text-white/40'
                            : /^\d+\./.test(block)
                              ? 'mt-5 font-medium text-white/80'
                              : 'mt-4 first:mt-0'
                        }
                      >
                        {block}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/40">Email</span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3.5 text-sm text-white placeholder:text-white/25 focus:border-[#00f2ff]/45 focus:outline-none focus:ring-2 focus:ring-[#00f2ff]/15"
                  />
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-4">
                  <input
                    type="checkbox"
                    checked={ack}
                    onChange={(e) => setAck(e.target.checked)}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-[#00f2ff]/40 text-[#00f2ff] focus:ring-[#00f2ff]"
                  />
                  <span className="text-left text-sm text-white/65">
                    I have read and agree to the terms above. I understand that continuing will log my email, IP, and
                    browser fingerprint, and send a verification link to my inbox.
                  </span>
                </label>

                {(error || urlError) && (
                  <p className="rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-center text-sm text-red-200/90">
                    {error ||
                      (urlError === 'auth'
                        ? 'Sign-in link expired or is invalid. Request a new link from this page.'
                        : urlError === 'config'
                          ? 'Server configuration is incomplete.'
                          : 'Something went wrong.')}
                  </p>
                )}

                <motion.button
                  type="button"
                  disabled={!canSubmit}
                  onClick={onAccess}
                  whileHover={{ scale: canSubmit ? 1.01 : 1 }}
                  whileTap={{ scale: canSubmit ? 0.99 : 1 }}
                  className="w-full rounded-xl border border-[#00f2ff]/35 bg-gradient-to-b from-[#00f2ff]/15 to-[#00f2ff]/5 py-4 text-sm font-black uppercase tracking-[0.28em] text-[#00f2ff] shadow-[0_0_32px_rgba(0,242,255,0.15)] transition disabled:cursor-not-allowed disabled:opacity-35"
                >
                  {submitting ? 'Sending…' : 'Access sanctuary'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
