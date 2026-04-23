import type { ReactNode } from 'react';
import Link from 'next/link';
import { INVESTOR_FINANCIAL_CALCULATOR_PATH } from '@/lib/investor-site';
import { getInvestorScheduledMeetHref } from '@/lib/meeting-links';

function StreamIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12a8 8 0 018-8M4 4v4h4M20 12a8 8 0 01-8 8m8-4v4h-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LayersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3L3 7l9 4 9-4-9-4zM3 12l9 4 9-4M3 17l9 4 9-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AppGridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CalculatorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 19V5M4 19h16M8 15V9m4 8V7m4 6v-4m4 4v-8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 7V3m8 4V3M5 11h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EnvelopeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type PortalNavItem = {
  id: string;
  title: string;
  shortLabel: string;
  body: string;
  icon: ReactNode;
  /** Resolved client href (meet uses scheduled URL from parent). */
  href: string;
  /** `mailto` shortcuts render as `<a>` (compact + full). */
  kind?: 'route' | 'mailto';
};

export function buildPortalItems(meetHref: string): PortalNavItem[] {
  const contactEmail = process.env.NEXT_PUBLIC_INVESTOR_CONTACT_EMAIL?.trim() || 'investors@parableinvestments.com';
  const mailtoHref = `mailto:${contactEmail}?subject=${encodeURIComponent('PARABLE investor inquiry')}`;

  return [
    {
      id: 'portal',
      title: 'Investor Portal',
      shortLabel: 'Investor Portal',
      body: 'Welcome video, then the confidential strategic proposal deck embedded on this site.',
      icon: <LayersIcon className="h-5 w-5" />,
      href: '/investor/portal',
    },
    {
      id: 'meet',
      title: 'Join scheduled meeting',
      shortLabel: 'Join Scheduled Meeting',
      body: 'HD video with screen share, chat, and device controls—use the link from your calendar invite when a room is configured.',
      icon: <StreamIcon className="h-5 w-5" />,
      href: meetHref,
    },
    {
      id: 'book',
      title: 'Schedule meeting',
      shortLabel: 'Schedule Meeting',
      body: 'Open the calendar to pick a date and time, then request your Parable confirmation email with the room link. First time on this device? Use Register on that page to complete step 1.',
      icon: <CalendarIcon className="h-5 w-5" />,
      href: '/book',
    },
    {
      id: 'calculator',
      title: 'Financial calculator',
      shortLabel: 'Financial Calculator',
      body: 'Sovereign yield modeler with adoption and recovery sliders—explore implied NOI and payback framing.',
      icon: <CalculatorIcon className="h-5 w-5" />,
      href: INVESTOR_FINANCIAL_CALCULATOR_PATH,
    },
    {
      id: 'explore',
      title: 'Explore PARABLE app',
      shortLabel: 'Explore PARABLE app',
      body: 'With NEXT_PUBLIC_PARABLE_PROTOTYPE_URL set you get the real app embedded; otherwise a brand-matched in-browser preview.',
      icon: <AppGridIcon className="h-5 w-5" />,
      href: '/explore',
    },
    {
      id: 'contact',
      title: 'Contact us',
      shortLabel: 'Contact Us',
      body: `Email ${contactEmail} for investor questions—the same inbox used for booking confirmations when configured.`,
      icon: <EnvelopeIcon className="h-5 w-5" />,
      href: mailtoHref,
      kind: 'mailto',
    },
  ];
}

const FULL_ICONS: Record<string, ReactNode> = {
  portal: <LayersIcon className="h-6 w-6" />,
  meet: <StreamIcon className="h-6 w-6" />,
  book: <CalendarIcon className="h-6 w-6" />,
  calculator: <CalculatorIcon className="h-6 w-6" />,
  explore: <AppGridIcon className="h-6 w-6" />,
  contact: <EnvelopeIcon className="h-6 w-6" />,
};

type Props = {
  className?: string;
  variant?: 'full' | 'compact';
  /**
   * Live meeting URL for the “Meet” shortcut (`/meet?join=scheduled` + optional room).
   * Defaults to {@link getInvestorScheduledMeetHref} when omitted.
   */
  meetHref?: string;
};

/**
 * Highlights PARABLE product themes and what this investor site delivers.
 * **compact** (choice hub): thin top-style nav with icon + label; each item is a real link.
 * **full** (`/info`): card grid with longer copy.
 */
export function ParablePortalFeatures({
  className = '',
  variant = 'full',
  meetHref = getInvestorScheduledMeetHref(),
}: Props) {
  const compact = variant === 'compact';
  const navItems = buildPortalItems(meetHref);
  const fullItems = navItems.map((item) => ({
    ...item,
    icon: FULL_ICONS[item.id] ?? item.icon,
  }));

  const shortcutTileClass =
    'flex h-full min-h-[5.35rem] w-full min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-white/[0.1] bg-black/45 px-1.5 py-2 text-center transition active:scale-[0.98] hover:border-[#00f2ff]/40 hover:bg-[#00f2ff]/10 sm:min-h-[5.85rem] sm:gap-1.5 sm:rounded-2xl sm:px-2.5 sm:py-3 md:min-h-[6.25rem] md:gap-2 md:px-3 md:py-3.5 lg:min-h-[6.5rem]';

  const shortcutIconClass =
    'text-[#00f2ff]/90 [&_svg]:h-5 [&_svg]:w-5 sm:[&_svg]:h-6 sm:[&_svg]:w-6 md:[&_svg]:h-7 md:[&_svg]:w-7 lg:[&_svg]:h-8 lg:[&_svg]:w-8';

  const shortcutLabelClass =
    'max-w-[11.5rem] text-pretty text-[9px] font-bold uppercase leading-snug tracking-[0.04em] text-white/90 sm:max-w-none sm:text-[10px] sm:tracking-[0.05em] md:text-[11px] lg:text-xs';

  if (compact) {
    return (
      <nav
        className={`rounded-2xl border border-[#00f2ff]/25 bg-black/35 px-3 py-4 shadow-[0_0_32px_rgba(0,242,255,0.08)] backdrop-blur-sm sm:px-5 sm:py-5 md:px-7 md:py-6 ${className}`}
        aria-label="Portal shortcuts"
      >
        <p className="text-center text-[10px] font-black uppercase tracking-[0.26em] text-[#00f2ff]/70 sm:text-[11px] sm:tracking-[0.28em] md:text-xs md:tracking-[0.3em]">
          PARABLE · This portal — jump to
        </p>
        <ul className="mt-4 grid grid-cols-2 auto-rows-fr gap-2 sm:mt-5 sm:grid-cols-3 sm:gap-2.5 md:mt-6 md:gap-3 lg:grid-cols-6">
          {navItems.map((item) => (
            <li key={item.id} className="min-w-0">
              {item.kind === 'mailto' ? (
                <a
                  href={item.href}
                  title={`${item.title}: ${item.body}`}
                  className={shortcutTileClass}
                >
                  <span className={shortcutIconClass}>{item.icon}</span>
                  <span className={shortcutLabelClass}>{item.shortLabel}</span>
                </a>
              ) : (
                <Link
                  href={item.href}
                  title={`${item.title}: ${item.body}`}
                  className={shortcutTileClass}
                >
                  <span className={shortcutIconClass}>{item.icon}</span>
                  <span className={shortcutLabelClass}>{item.shortLabel}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-3.5 text-center text-[11px] leading-snug text-white/45 sm:mt-4 sm:text-xs md:text-[13px]">
          Tap a shortcut for details (long-press on mobile). Use the cards below for full descriptions.
        </p>
      </nav>
    );
  }

  return (
    <section
      className={`parable-glass-panel px-6 py-8 md:px-10 md:py-10 ${className}`}
      aria-labelledby="parable-portal-features-heading"
    >
      <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#00f2ff]/75">PARABLE · This portal</p>
      <h2
        id="parable-portal-features-heading"
        className="mt-3 text-lg font-black uppercase tracking-[0.14em] text-[#00f2ff] drop-shadow-[0_0_16px_rgba(0,242,255,0.18)] md:text-xl"
      >
        What you can do here
      </h2>
      <p className="mt-3 text-pretty text-sm leading-relaxed text-white/50 md:text-[15px]">
        Jump to the investor portal, live or scheduled meetings, calendar booking, the financial modeler, the app preview,
        or email the team—all from this site.
      </p>

      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {fullItems.map((item) => (
          <li
            key={item.id}
            className="flex gap-4 rounded-xl border border-white/[0.07] bg-black/30 px-4 py-4 md:px-5 md:py-5"
          >
            <div className="shrink-0 text-[#00f2ff]/85">{item.icon}</div>
            <div className="min-w-0">
              {item.kind === 'mailto' ? (
                <a href={item.href} className="group block">
                  <h3 className="text-sm font-bold tracking-tight text-white/95 underline decoration-[#00f2ff]/25 decoration-1 underline-offset-4 transition group-hover:text-[#00f2ff] group-hover:decoration-[#00f2ff]/50">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-white/55 sm:text-sm">{item.body}</p>
                </a>
              ) : (
                <>
                  <h3 className="text-sm font-bold tracking-tight text-white/95">{item.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-white/55 sm:text-sm">{item.body}</p>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
