import type { ReactNode } from 'react';
import Link from 'next/link';

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 7V5m8 2V5M5 11h14M5 21h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
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

export type PortalNavItem = {
  id: string;
  title: string;
  shortLabel: string;
  body: string;
  icon: ReactNode;
  /** Resolved client href (meet uses scheduled URL from parent). */
  href: string;
};

function buildPortalItems(meetHref: string): PortalNavItem[] {
  return [
    {
      id: 'access',
      title: 'Confidential investor access',
      shortLabel: 'Access',
      body: 'Electronic NDA, gated routes, and session links scoped for qualified conversations—not a public download site.',
      icon: <ShieldIcon className="h-5 w-5" />,
      href: '/info',
    },
    {
      id: 'meet',
      title: 'Live Parable meeting room',
      shortLabel: 'Meet',
      body: 'HD video with screen share, chat, and device controls. Scheduled joins can verify your booking email; open rooms use a shared investor room name.',
      icon: <StreamIcon className="h-5 w-5" />,
      href: meetHref,
    },
    {
      id: 'materials',
      title: 'Materials & narrative',
      shortLabel: 'Materials',
      body: 'Structured overview, welcome video, and objectives you can read before or after a live session—depth at your pace.',
      icon: <LayersIcon className="h-5 w-5" />,
      href: '/info/intro',
    },
    {
      id: 'book',
      title: 'Book follow-up time',
      shortLabel: 'Book',
      body: 'Request a dedicated conversation; confirmations align with your registration and the same portal experience.',
      icon: <CalendarIcon className="h-5 w-5" />,
      href: '#book-meeting',
    },
    {
      id: 'prototype',
      title: 'Interactive app prototype',
      shortLabel: 'Prototype',
      body: 'Open /explore: with NEXT_PUBLIC_PARABLE_PROTOTYPE_URL you get the real Parable app embedded; without it, a brand-matched phone preview runs locally.',
      icon: <AppGridIcon className="h-5 w-5" />,
      href: '/explore',
    },
  ];
}

const FULL_ICONS: Record<string, ReactNode> = {
  access: <ShieldIcon className="h-6 w-6" />,
  meet: <StreamIcon className="h-6 w-6" />,
  materials: <LayersIcon className="h-6 w-6" />,
  book: <CalendarIcon className="h-6 w-6" />,
  prototype: <AppGridIcon className="h-6 w-6" />,
};

type Props = {
  className?: string;
  variant?: 'full' | 'compact';
  /**
   * Live meeting URL for the “Meet” shortcut (e.g. `/meet?join=scheduled&room=…`).
   * Defaults to `/meet` when omitted.
   */
  meetHref?: string;
};

const FULL_ITEMS = buildPortalItems('/meet').map((item) => ({
  ...item,
  icon: FULL_ICONS[item.id] ?? item.icon,
}));

/**
 * Highlights PARABLE product themes and what this investor site delivers.
 * **compact** (choice hub): thin top-style nav with icon + label; each item is a real link.
 * **full** (`/info`): card grid with longer copy.
 */
export function ParablePortalFeatures({ className = '', variant = 'full', meetHref = '/meet' }: Props) {
  const compact = variant === 'compact';
  const navItems = buildPortalItems(meetHref);

  if (compact) {
    return (
      <nav
        className={`rounded-xl border border-[#00f2ff]/20 bg-black/35 px-2 py-3 shadow-[0_0_24px_rgba(0,242,255,0.06)] backdrop-blur-sm sm:px-3 ${className}`}
        aria-label="Portal shortcuts"
      >
        <p className="text-center text-[9px] font-black uppercase tracking-[0.28em] text-[#00f2ff]/65">
          PARABLE · This portal — jump to
        </p>
        <ul className="mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                title={`${item.title}: ${item.body}`}
                className="flex min-w-[4.5rem] flex-col items-center gap-1 rounded-lg border border-white/[0.08] bg-black/40 px-2.5 py-2 text-center transition hover:border-[#00f2ff]/35 hover:bg-[#00f2ff]/10 sm:min-w-[5.25rem] sm:px-3"
              >
                <span className="text-[#00f2ff]/90">{item.icon}</span>
                <span className="max-w-[5.5rem] text-[9px] font-bold uppercase leading-tight tracking-[0.06em] text-white/90 sm:max-w-none sm:text-[10px]">
                  {item.shortLabel}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-2.5 text-center text-[10px] leading-snug text-white/40">
          Hover a shortcut for details. Use the cards below for full descriptions.
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
        Parable is built around streaming, community, testimony, and live creation—this site is your confidential entry
        to sessions, materials, and next steps with the team.
      </p>

      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {FULL_ITEMS.map((item) => (
          <li
            key={item.id}
            className="flex gap-4 rounded-xl border border-white/[0.07] bg-black/30 px-4 py-4 md:px-5 md:py-5"
          >
            <div className="shrink-0 text-[#00f2ff]/85">{item.icon}</div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold tracking-tight text-white/95">{item.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/55 sm:text-sm">{item.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
