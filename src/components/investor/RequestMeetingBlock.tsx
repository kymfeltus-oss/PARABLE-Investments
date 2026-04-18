'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const CONTACT =
  process.env.NEXT_PUBLIC_INVESTOR_CONTACT_EMAIL ?? 'investors@parableinvestments.com';

export function RequestMeetingBlock() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [message, setMessage] = useState('');

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent('Parable — meeting request');
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nOrganization: ${org}\n\nMessage:\n${message}\n`
    );
    return `mailto:${CONTACT}?subject=${subject}&body=${body}`;
  }, [name, email, org, message]);

  return (
    <div className="parable-glass-panel px-6 py-8 md:px-8 md:py-10">
      <h3 className="text-xs font-black uppercase tracking-[0.25em] text-[#00f2ff]/80">Request a meeting</h3>
      <p className="mt-3 text-sm leading-relaxed text-white/50">
        Book a slot with our live calendar, get email confirmation with the video room link, and add an{' '}
        <span className="text-white/65">.ics</span> file to yours—or send a quick note by email.
      </p>

      <Link
        href="/book"
        className="mt-6 flex w-full items-center justify-center rounded-xl border border-[#00f2ff]/40 bg-[#00f2ff]/10 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#00f2ff] shadow-[0_0_24px_rgba(0,242,255,0.12)] transition hover:bg-[#00f2ff]/20"
      >
        Open booking & calendar
      </Link>

      <p className="mt-6 text-center text-[10px] uppercase tracking-[0.2em] text-white/30">or</p>

      <div className="mt-6 space-y-4">
        <label className="block text-left">
          <span className="text-[10px] font-black uppercase tracking-wider text-white/40">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-[#00f2ff]/50"
            placeholder="Your name"
            autoComplete="name"
          />
        </label>
        <label className="block text-left">
          <span className="text-[10px] font-black uppercase tracking-wider text-white/40">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-[#00f2ff]/50"
            placeholder="you@firm.com"
            autoComplete="email"
          />
        </label>
        <label className="block text-left">
          <span className="text-[10px] font-black uppercase tracking-wider text-white/40">Organization (optional)</span>
          <input
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-[#00f2ff]/50"
            placeholder="Fund or company"
          />
        </label>
        <label className="block text-left">
          <span className="text-[10px] font-black uppercase tracking-wider text-white/40">Message</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="mt-2 w-full resize-y rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-[#00f2ff]/50"
            placeholder="Short note…"
          />
        </label>
      </div>

      <a
        href={mailtoHref}
        className="mt-6 flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 py-4 text-sm font-black uppercase tracking-[0.18em] text-white/90 transition hover:border-[#00f2ff]/35 hover:bg-white/10"
      >
        Send via email app
      </a>
      <p className="mt-3 text-center text-[10px] text-white/35">
        Opens mail to <span className="text-[#00f2ff]/80">{CONTACT}</span>
      </p>
    </div>
  );
}
