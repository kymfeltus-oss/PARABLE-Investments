'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { InvestorAtmosphere } from '@/components/brand/InvestorAtmosphere';
import { ParableLogoMark } from '@/components/brand/ParableLogoMark';

type Props = {
  meetUrl: string;
  roomLabel: string;
  embedSrc: string | null;
};

const DURATIONS = [30, 45, 60] as const;

export function BookMeetingWizard({ meetUrl, roomLabel, embedSrc }: Props) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [durationMin, setDurationMin] = useState<number>(30);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{
    emailSent: boolean;
    icsBase64: string;
  } | null>(null);

  const timezone = useMemo(
    () => (typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC'),
    []
  );

  const canStep1 = name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit = canStep1 && date.length > 0 && time.length > 0;

  const downloadIcs = useCallback(() => {
    if (!done?.icsBase64) return;
    const blob = new Blob([Uint8Array.from(atob(done.icsBase64), (c) => c.charCodeAt(0))], {
      type: 'text/calendar;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'parable-investor-meeting.ics';
    a.click();
    URL.revokeObjectURL(url);
  }, [done]);

  const copyMeet = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(meetUrl);
    } catch {
      /* ignore */
    }
  }, [meetUrl]);

  const onSchedule = useCallback(async () => {
    if (!canSubmit || submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const local = new Date(`${date}T${time}:00`);
      if (Number.isNaN(local.getTime())) {
        setError('Invalid date or time.');
        setSubmitting(false);
        return;
      }
      const end = new Date(local.getTime() + durationMin * 60 * 1000);
      const res = await fetch('/api/meeting/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          startIso: local.toISOString(),
          endIso: end.toISOString(),
          timezone,
          notes: notes.trim() || undefined,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        ok?: boolean;
        emailSent?: boolean;
        icsBase64?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.error || 'Could not complete booking.');
        setSubmitting(false);
        return;
      }
      setDone({
        emailSent: Boolean(data.emailSent),
        icsBase64: data.icsBase64 ?? '',
      });
      setStep(3);
    } catch {
      setError('Network error. Try again.');
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, submitting, name, email, date, time, durationMin, timezone, notes]);

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
            Choose a time, add it to your calendar, and join the Parable video room when we meet.
          </p>
        </div>

        {/* Progress */}
        <div className="mt-10 flex justify-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-white/30">
          {['Prepare', 'Schedule', 'Confirm'].map((label, i) => (
            <span
              key={label}
              className={i + 1 <= step ? 'text-[#00f2ff]/90' : ''}
            >{`${i + 1}. ${label}`}</span>
          ))}
        </div>

        <div className="mt-10 space-y-12">
          {/* Embedded calendar (Cal.com etc.) */}
          {embedSrc ? (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/[0.12] bg-white/[0.03] p-4 shadow-[0_8px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-6"
            >
              <h2 className="text-xs font-black uppercase tracking-[0.28em] text-[#00f2ff]/85">Live calendar</h2>
              <p className="mt-2 text-sm text-white/50">
                Pick an open slot below. Your calendar provider will email a confirmation with the time. Keep the Parable
                video link on hand for the same time.
              </p>
              <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                <iframe
                  title="Schedule a meeting"
                  src={embedSrc}
                  className="h-[min(720px,80vh)] w-full border-0"
                  loading="lazy"
                />
              </div>
              <MeetLinkPanel meetUrl={meetUrl} roomLabel={roomLabel} onCopy={copyMeet} />
            </motion.section>
          ) : null}

          {/* Manual booking */}
          <section className="rounded-2xl border border-white/[0.12] bg-black/35 p-6 shadow-[0_8px_48px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-8">
            <h2 className="text-xs font-black uppercase tracking-[0.28em] text-[#00f2ff]/85">
              {embedSrc ? 'Or request a time (email + calendar invite)' : 'Request a time'}
            </h2>
            <p className="mt-2 text-sm text-white/50">
              {embedSrc
                ? 'If you prefer not to use the embedded calendar, tell us when to meet. We will email a confirmation with the video link and an .ics file you can add to your calendar.'
                : 'We will send a confirmation email with the LiveKit join link and attach a calendar file (.ics) you can open in Outlook, Google Calendar, or Apple Calendar.'}
            </p>

            <AnimatePresence mode="wait">
              {step < 3 ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-8 space-y-8"
                >
                  {step === 1 && (
                    <div className="space-y-4">
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
                        <span className="text-[10px] font-black uppercase tracking-wider text-white/40">Work email</span>
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          className="mt-2 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm outline-none focus:border-[#00f2ff]/45"
                          placeholder="you@firm.com"
                          autoComplete="email"
                        />
                      </label>
                      <button
                        type="button"
                        disabled={!canStep1}
                        onClick={() => setStep(2)}
                        className="w-full rounded-xl border border-[#00f2ff]/40 bg-[#00f2ff]/10 py-4 text-sm font-black uppercase tracking-[0.22em] text-[#00f2ff] transition hover:bg-[#00f2ff]/20 disabled:opacity-35"
                      >
                        Continue
                      </button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block text-left">
                          <span className="text-[10px] font-black uppercase tracking-wider text-white/40">Date</span>
                          <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm outline-none focus:border-[#00f2ff]/45"
                          />
                        </label>
                        <label className="block text-left">
                          <span className="text-[10px] font-black uppercase tracking-wider text-white/40">Start time</span>
                          <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm outline-none focus:border-[#00f2ff]/45"
                          />
                        </label>
                      </div>
                      <label className="block text-left">
                        <span className="text-[10px] font-black uppercase tracking-wider text-white/40">Duration</span>
                        <select
                          value={durationMin}
                          onChange={(e) => setDurationMin(Number(e.target.value))}
                          className="mt-2 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm outline-none focus:border-[#00f2ff]/45"
                        >
                          {DURATIONS.map((m) => (
                            <option key={m} value={m}>
                              {m} minutes
                            </option>
                          ))}
                        </select>
                      </label>
                      <p className="text-[11px] text-white/35">Timezone detected: {timezone}</p>
                      <label className="block text-left">
                        <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
                          Notes (optional)
                        </span>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                          className="mt-2 w-full resize-y rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm outline-none focus:border-[#00f2ff]/45"
                          placeholder="Topics, timezone constraints, dial-in needs…"
                        />
                      </label>
                      {error ? <p className="text-sm text-red-300/95">{error}</p> : null}
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-semibold uppercase tracking-wider text-white/70"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          disabled={!canSubmit || submitting}
                          onClick={onSchedule}
                          className="flex-1 rounded-xl border border-[#00f2ff]/40 bg-[#00f2ff]/10 py-4 text-sm font-black uppercase tracking-[0.2em] text-[#00f2ff] transition hover:bg-[#00f2ff]/20 disabled:opacity-35"
                        >
                          {submitting ? 'Sending…' : 'Confirm & send invite'}
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 space-y-6 text-center"
                >
                  <p className="font-serif text-xl text-white md:text-2xl">You&apos;re on the calendar</p>
                  {done?.emailSent ? (
                    <p className="text-sm text-white/55">
                      Check your inbox for <span className="text-[#00f2ff]/90">{email}</span> — we sent the video link and
                      an attached calendar file.
                    </p>
                  ) : (
                    <p className="text-sm text-white/55">
                      Add{' '}
                      <code className="text-[#00f2ff]/85">RESEND_API_KEY</code> and{' '}
                      <code className="text-[#00f2ff]/85">RESEND_FROM_EMAIL</code> on the server to enable automatic
                      emails. You can still download the calendar file below.
                    </p>
                  )}
                  <MeetLinkPanel meetUrl={meetUrl} roomLabel={roomLabel} onCopy={copyMeet} />
                  {done?.icsBase64 ? (
                    <button
                      type="button"
                      onClick={downloadIcs}
                      className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-white/90 hover:bg-white/10"
                    >
                      Download .ics calendar file
                    </button>
                  ) : null}
                  <Link href="/start" className="block text-xs uppercase tracking-[0.2em] text-white/35 hover:text-[#00f2ff]/80">
                    ← Back to choice hub
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>
    </div>
  );
}

function MeetLinkPanel({
  meetUrl,
  roomLabel,
  onCopy,
}: {
  meetUrl: string;
  roomLabel: string;
  onCopy: () => void;
}) {
  return (
    <div className="mt-6 rounded-xl border border-[#00f2ff]/20 bg-[#00f2ff]/[0.06] px-4 py-4 text-left">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#00f2ff]/75">Video room (LiveKit)</p>
      <p className="mt-2 break-all font-mono text-xs text-[#00f2ff]/90">{meetUrl}</p>
      <p className="mt-2 text-[11px] text-white/45">
        Room name: <span className="text-white/70">{roomLabel}</span> — open this link at the meeting time, enter your
        display name, then connect.
      </p>
      <button
        type="button"
        onClick={onCopy}
        className="mt-4 text-[11px] font-bold uppercase tracking-wider text-[#00f2ff] hover:underline"
      >
        Copy video link
      </button>
    </div>
  );
}
