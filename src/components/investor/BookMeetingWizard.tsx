'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { InvestorAtmosphere } from '@/components/brand/InvestorAtmosphere';
import { ParableLogoMark } from '@/components/brand/ParableLogoMark';
import { INVESTOR_AGREEMENT_VERSION } from '@/lib/investor-agreement-text';
import { isValidInvestorEmail } from '@/lib/investor-agreement-validation';
import { writeBookMeetingSession } from '@/lib/book-meeting-session';

export function BookMeetingWizard() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [ack, setAck] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canRegister =
    name.trim().length >= 2 && isValidInvestorEmail(email.trim()) && ack && !submitting;

  const onRegister = async () => {
    if (!canRegister) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/meeting/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          acknowledged: true,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        supabaseCode?: string;
        ok?: boolean;
        emailSent?: boolean;
        emailStatus?: 'sent' | 'unconfigured' | 'failed';
        resendErrorMessage?: string | null;
        roomLabel?: string;
        roomSuffix?: string;
        meetUrl?: string;
      };
      if (!res.ok || !data.ok) {
        setError(
          [data.error || 'Something went wrong. Try again.', data.supabaseCode ? `Supabase/Postgres: ${data.supabaseCode}` : null]
            .filter(Boolean)
            .join('\n\n'),
        );
        setSubmitting(false);
        return;
      }
      const status = data.emailStatus ?? (data.emailSent ? 'sent' : 'unconfigured');
      writeBookMeetingSession({
        emailStatus: status,
        resendErrorMessage: typeof data.resendErrorMessage === 'string' ? data.resendErrorMessage : null,
        roomLabel: typeof data.roomLabel === 'string' && data.roomLabel ? data.roomLabel : null,
        roomSuffix: typeof data.roomSuffix === 'string' && data.roomSuffix ? data.roomSuffix : null,
        meetUrl: typeof data.meetUrl === 'string' && data.meetUrl ? data.meetUrl : null,
      });
      router.push('/book/finish');
    } catch {
      setError('Network error. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <InvestorAtmosphere />
      <div className="pointer-events-none fixed inset-0 z-10 bg-[radial-gradient(ellipse_at_top,rgba(0,242,255,0.06)_0%,transparent_50%,rgba(0,0,0,0.85)_100%)]" />

      <div className="relative z-20 mx-auto max-w-3xl px-4 py-10 pb-28 md:py-14">
        <Link href="/start" className="parable-eyebrow mb-8 inline-block hover:text-[#00f2ff]">
          ← Choice hub
        </Link>

        <ParableLogoMark className="mx-auto mb-8 max-w-[200px] opacity-95 md:max-w-xs" />

        <div className="text-center">
          <p className="parable-eyebrow mb-2 text-[#00f2ff]/85">Investor relations</p>
          <h1 className="text-2xl font-black uppercase tracking-[0.18em] text-white md:text-3xl md:tracking-[0.22em]">
            Book a meeting
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/45">
            Register below (NDA on file). We will take you to the next step on this site to <strong className="text-white/60">choose a time</strong> in the
            calendar and to review your room details.
          </p>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 rounded-2xl border border-white/[0.12] bg-black/40 p-6 shadow-[0_8px_48px_rgba(0,0,0,0.4)] backdrop-blur-xl md:p-8"
        >
          <h2 className="text-xs font-black uppercase tracking-[0.28em] text-[#00f2ff]/85">Step 1 — Register</h2>
          <p className="mt-2 text-sm text-white/50">
            We store this with NDA version <span className="text-white/70">{INVESTOR_AGREEMENT_VERSION}</span> for our
            records, then send you to <strong className="text-white/60">Finish booking</strong> on this same website.
          </p>
          <div className="mt-6 space-y-4">
            <label className="block text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40">Full name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm outline-none focus:border-[#00f2ff]/45"
                placeholder="Jane Investor"
                autoComplete="name"
              />
            </label>
            <label className="block text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm outline-none focus:border-[#00f2ff]/45"
                placeholder="you@firm.com"
                autoComplete="email"
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
                I confirm this investor meeting request is subject to the same confidentiality obligations as my Parable
                NDA / electronic acknowledgment (version {INVESTOR_AGREEMENT_VERSION}). I understand Parable will retain
                this registration as supplemental evidence.
              </span>
            </label>
            {error ? <p className="whitespace-pre-line text-sm text-red-300/95">{error}</p> : null}
            <button
              type="button"
              disabled={!canRegister}
              onClick={onRegister}
              className="w-full rounded-xl border border-[#00f2ff]/40 bg-[#00f2ff]/10 py-4 text-sm font-black uppercase tracking-[0.2em] text-[#00f2ff] transition hover:bg-[#00f2ff]/20 disabled:cursor-not-allowed disabled:opacity-35"
            >
              {submitting ? 'Saving…' : 'Confirm & go to finish booking'}
            </button>
          </div>
        </motion.section>

        <p className="mt-8 text-center text-xs text-white/30">
          After we save your registration, you are taken to the next page on this site to choose a time in the calendar.
        </p>
      </div>
    </div>
  );
}
