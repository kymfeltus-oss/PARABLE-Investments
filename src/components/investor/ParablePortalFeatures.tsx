import type { ReactNode } from 'react';
import Link from 'next/link';

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
      id: 'calculator',
      title: 'Financial calculator',
      shortLabel: 'Financial Calculator',
      body: 'Sovereign yield modeler with adoption and recovery sliders—explore implied NOI and payback framing.',
      icon: <CalculatorIcon className="h-5 w-5" />,
      href: '/investor/financial-calculator',
    },
    {
      id: 'explore',
      title: 'Explore PARABLE app',
      shortLabel: 'Explore PARABLE app',
      body: 'With NEXT_PUBLIC_PARABLE_PROTOTYPE_URL set you get the real app embedded; otherwise a brand-matched in-browser preview.',
      icon: <AppGridIcon className="h-5 w-5" />,
      href: '/explore',
    },
  ];
}

const FULL_ICONS: Record<string, ReactNode> = {
  portal: <LayersIcon className="h-6 w-6" />,
  meet: <StreamIcon className="h-6 w-6" />,
  calculator: <CalculatorIcon className="h-6 w-6" />,
  explore: <AppGridIcon className="h-6 w-6" />,
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

/**
 * Highlights PARABLE product themes and what this investor site delivers.
 * **compact** (choice hub): thin top-style nav with icon + label; each item is a real link.
 * **full** (`/info`): card grid with longer copy.
 */
export function ParablePortalFeatures({ className = '', variant = 'full', meetHref = '/meet' }: Props) {
  const compact = variant === 'compact';
  const navItems = buildPortalItems(meetHref);
  const fullItems = navItems.map((item) => ({
    ...item,
    icon: FULL_ICONS[item.id] ?? item.icon,
  }));

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
                className="flex min-w-[5.5rem] max-w-[9.5rem] flex-col items-center gap-1 rounded-lg border border-white/[0.08] bg-black/40 px-2 py-2 text-center transition hover:border-[#00f2ff]/35 hover:bg-[#00f2ff]/10 sm:min-w-[6.5rem] sm:max-w-[11rem] sm:px-2.5"
              >
                <span className="text-[#00f2ff]/90">{item.icon}</span>
                <span className="text-[8px] font-bold uppercase leading-snug tracking-[0.04em] text-white/90 sm:text-[9px]">
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
        Jump to the investor portal, your scheduled video room, the financial modeler, or the interactive Parable app
        preview—all from this site.
      </p>

      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {fullItems.map((item) => (
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
