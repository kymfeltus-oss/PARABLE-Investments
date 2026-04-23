import Link from 'next/link';
import { InvestorAtmosphere } from '@/components/brand/InvestorAtmosphere';
import { ParableLogoMark } from '@/components/brand/ParableLogoMark';

const CONTACT = process.env.NEXT_PUBLIC_INVESTOR_CONTACT_EMAIL?.trim() || 'investors@parableinvestments.com';

const section = 'mb-10 md:mb-12';
const h2 = 'mb-4 text-[10px] font-black uppercase tracking-[0.32em] text-[#00f2ff]/85';
const p = 'text-sm leading-relaxed text-white/60 md:text-[15px]';
const ul = 'ml-1 list-outside list-decimal space-y-3 pl-4 text-sm leading-relaxed text-white/60 marker:text-[#00f2ff]/70 md:pl-5 md:text-[15px]';
const kbd = 'inline rounded border border-white/15 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[12px] text-white/75';

export const metadata = {
  title: 'First-time site guide | Parable investor',
  description:
    'How to use the Parable investor site: NDA, investor hub, portal, booking a call, and joining the live room.',
};

export default function FirstTimeSiteGuidePage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#030304] text-white">
      <div
        className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_100%_70%_at_50%_-20%,rgba(0,242,255,0.14),transparent_55%)]"
        aria-hidden
      />
      <InvestorAtmosphere sparkleCount={48} />

      <div className="relative z-20 mx-auto min-h-screen max-w-2xl px-4 py-8 pb-24 sm:px-6 md:max-w-3xl md:px-8 md:py-12">
        <header className="mb-10 border-b border-white/[0.08] pb-8 text-center">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00f2ff]/25 bg-black/50 px-3 py-2 text-[9px] font-black uppercase tracking-[0.26em] text-[#00f2ff]/85 backdrop-blur-md transition hover:border-[#00f2ff]/45"
          >
            <span aria-hidden>←</span> Landing
          </Link>
          <div className="mt-2 flex flex-col items-center">
            <ParableLogoMark className="w-full max-w-[10rem] opacity-95" />
            <p className="mt-3 text-[10px] font-black uppercase tracking-[0.4em] text-[#00f2ff]/75">Investor</p>
            <h1 className="mt-2 text-balance text-2xl font-black uppercase leading-tight tracking-tight sm:text-3xl">
              First-time visitor guide
            </h1>
            <p className="mt-3 max-w-lg text-pretty text-sm text-white/45">
              A short, practical path through this site. Nothing here replaces the NDA or the team’s instructions;
              use it to orient yourself before and after clearance.
            </p>
            <p className="mt-2 text-sm text-amber-200/80">
              Tip: use the <strong className="font-semibold text-amber-100/95">same email</strong> for NDA, meeting
              registration, and the live call when possible.
            </p>
          </div>
        </header>

        <article>
          <section className={section} aria-labelledby="g-quick">
            <h2 id="g-quick" className={h2}>
              At a glance
            </h2>
            <ol className={ul}>
              <li>
                Land on the site → continue to the <strong className="text-white/80">NDA &amp; acknowledgment</strong> when
                you are ready.
              </li>
              <li>
                After you are cleared → you will land on the <Link className="text-[#00f2ff] underline-offset-2 hover:underline" href="/start">investor hub (choice hub)</Link> at <span className={kbd}>/start</span>.
              </li>
              <li>
                From <span className={kbd}>/start</span> → open the <strong className="text-white/80">Investor portal</strong>{' '}
                for the strategic deck, or <strong className="text-white/80">book a time</strong>, or{' '}
                <strong className="text-white/80">enter the live Parable room</strong> at meeting time.
              </li>
            </ol>
          </section>

          <section className={section} aria-labelledby="g-nda">
            <h2 id="g-nda" className={h2}>
              NDA &amp; access
            </h2>
            <p className={p}>
              The confidential path begins with the electronic <strong className="text-white/80">NDA and acknowledgment</strong>
              : complete it in one sitting when you are authorized to. Afterward, the site can take you to the post-clearance
              hub. Keep your <strong className="text-white/80">name and email consistent</strong> with what you share on
              calls and in the booking flow.
            </p>
          </section>

          <section className={section} aria-labelledby="g-start">
            <h2 id="g-start" className={h2}>
              The investor hub (<span className="font-mono">/start</span>)
            </h2>
            <p className={p + ' mb-3'}>After clearance, the hub groups the main next steps, including:</p>
            <ul className="ml-1 list-outside list-disc space-y-2.5 pl-4 text-sm leading-relaxed text-white/60 marker:text-[#00f2ff]/60 md:pl-5 md:text-[15px]">
              <li>
                <strong className="text-white/80">Open the strategic deck</strong> in the <strong>Investor portal</strong> — the
                primary read for materials hosted on this site.
              </li>
              <li>
                <strong className="text-white/80">Book a conversation</strong> (scheduler on <span className={kbd}>/book</span> when available)
                — register, confirm acknowledgments, then choose a time if the calendar is embedded.
              </li>
              <li>
                <strong className="text-white/80">Enter the live meeting</strong> when the team has scheduled a Parable video
                room — you will also use the link in your confirmation or calendar where provided.
              </li>
              <li>
                Optional tools: <strong className="text-white/80">yield model</strong>, and an <strong className="text-white/80">in-app explore</strong> when configured.
              </li>
            </ul>
          </section>

          <section className={section} aria-labelledby="g-book">
            <h2 id="g-book" className={h2}>
              Booking a meeting
            </h2>
            <p className={p}>
              On <span className={kbd}>/book</span>, follow the on-page steps: the calendar (if present), your contact details,
              and the acknowledgment tied to the investor NDA. If the site offers to send a <strong className="text-white/80">Parable
              confirmation email</strong> after you pick a time, you may do so there. Check <strong className="text-white/80">inbox, Promotions,
              and spam</strong> for that message. Your calendar app may send a separate notice with a different
              &quot;where&quot; or video line — for the <strong className="text-white/80">Parable room</strong>, use the
              <strong className="text-white/80"> link in the Parable email</strong> when in doubt, unless the team has told
              you otherwise.
            </p>
          </section>

          <section className={section} aria-labelledby="g-meet">
            <h2 id="g-meet" className={h2}>
              Joining the live video call
            </h2>
            <p className={p}>
              Open the <strong className="text-white/80">Parable video room</strong> link you received (often under{' '}
              <span className={kbd}>/meet</span> with a scheduled join and room). On the room page, choose the path that
              matches your role — typically <strong className="text-white/80">Investor</strong> and the <strong className="text-white/80">same email
              you registered</strong>. If something does not connect, try another browser, disable blockers for this
              site, and confirm the time in your calendar.
            </p>
          </section>

          <section className={section} aria-labelledby="g-help">
            <h2 id="g-help" className={h2}>
              Need help?
            </h2>
            <p className={p}>
              If a page is blank, refresh once; for embedded content, ensure <strong className="text-white/80">third-party
              or ad blockers are off</strong> for this domain. For access or email issues, email the team at{' '}
              <a
                href={`mailto:${CONTACT}?subject=${encodeURIComponent('PARABLE investor – site help')}`}
                className="text-[#00f2ff] underline-offset-2 hover:underline"
              >
                {CONTACT}
              </a>
              and describe the page and what you expected to see.
            </p>
          </section>

          <section className={section} aria-labelledby="g-legal">
            <h2 id="g-legal" className={h2}>
              Confidentiality
            </h2>
            <p className={p}>
              Treat all portal materials, links, and meeting details as <strong className="text-white/80">confidential
              to Parable</strong> in line with the NDA you accept. This guide is for navigation only; it is not legal advice.
            </p>
          </section>
        </article>

        <footer className="mt-12 border-t border-white/[0.08] pt-8 text-center">
          <Link
            href="/start"
            className="inline-flex min-h-11 min-w-[12rem] items-center justify-center rounded-2xl border border-[#00f2ff]/40 bg-[#00f2ff]/10 px-6 py-2.5 text-sm font-black uppercase tracking-[0.2em] text-[#00f2ff] transition hover:bg-[#00f2ff]/20"
          >
            Go to investor hub →
          </Link>
        </footer>
      </div>
    </div>
  );
}
