'use client';

import Link from 'next/link';
import { InvestorAtmosphere } from '@/components/brand/InvestorAtmosphere';
import { ParableInteractiveDemo } from '@/components/demo/ParableInteractiveDemo';
import { ExploreDemoFocusGuide } from '@/components/investor/ExploreDemoFocusGuide';

type Props = {
  /** Public URL of the Parable app prototype (from `NEXT_PUBLIC_PARABLE_PROTOTYPE_URL`). */
  prototypeUrl: string;
};

function GridIcon({ className }: { className?: string }) {
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

/**
 * Full-page shell for exploring the Parable app: **real product URL** (iframe) when configured; otherwise the
 * in-repo preview shell (`ParableInteractiveDemo`) that follows the same brand / hub language as the consumer app.
 */
export function ExplorePrototypeBody({ prototypeUrl }: Props) {
  const hasUrl = prototypeUrl.length > 0;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050506] text-white">
      <div
        className="pointer-events-none fixed inset-0 z-[5] bg-[radial-gradient(ellipse_90%_50%_at_50%_-10%,rgba(0,242,255,0.12),transparent_55%)]"
        aria-hidden
      />
      <InvestorAtmosphere sparkleCount={40} />

      <div className="relative z-20 mx-auto flex min-h-screen max-w-5xl flex-col px-5 pb-16 pt-10 sm:px-8 md:pb-20 md:pt-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/start"
            className="inline-flex items-center gap-2 rounded-full border border-[#00f2ff]/20 bg-black/40 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-[#00f2ff]/80 backdrop-blur-sm transition hover:border-[#00f2ff]/40 hover:text-[#00f2ff]"
          >
            <span aria-hidden>←</span> Choice hub
          </Link>
          <div className="flex flex-wrap items-center justify-end gap-4">
            {!hasUrl ? (
              <Link
                href="/parable-demo"
                className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55 hover:text-[#00f2ff]"
              >
                Full-page preview →
              </Link>
            ) : null}
            {hasUrl ? (
              <a
                href={prototypeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-black uppercase tracking-[0.22em] text-[#00f2ff]/80 hover:text-[#00f2ff]"
              >
                Open app in new tab →
              </a>
            ) : null}
          </div>
        </div>

        <div className="mt-10 md:mt-12">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.38em] text-[#00f2ff]/65">
            {hasUrl ? 'Live product' : 'App preview'}
          </p>
          <h1 className="mt-3 text-center text-balance text-xl font-black uppercase tracking-[0.12em] text-[#00f2ff] drop-shadow-[0_0_20px_rgba(0,242,255,0.2)] sm:text-2xl sm:tracking-[0.14em]">
            {hasUrl ? 'Parable app (staging / demo)' : 'Explore the Parable app'}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-center text-sm leading-relaxed text-white/55">
            {hasUrl ? (
              <>
                Below is the <strong className="font-semibold text-white/75">real Parable product</strong> embedded from your
                configured URL—same UI and behavior as users get. Use “Open in new tab” if the host blocks iframes or you
                want fullscreen. The checklist still applies as you navigate.
              </>
            ) : (
              <>
                This repository ships the investor portal only. The preview below walks the <strong className="font-semibold text-white/75">five pillars</strong> in a phone-frame shell (logo, hub atmosphere, bottom nav). For <strong className="font-semibold text-white/75">pixel-identical</strong> parity, point{' '}
                <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-[11px] text-[#00f2ff]/85">
                  NEXT_PUBLIC_PARABLE_PROTOTYPE_URL
                </code>{' '}
                at your deployed Parable app and redeploy—then the live product embed appears here automatically.
              </>
            )}
          </p>
        </div>

        <ExploreDemoFocusGuide />

        {hasUrl ? (
          <section className="mt-10 md:mt-12" aria-labelledby="live-app-heading">
            <h2 id="live-app-heading" className="sr-only">
              Embedded Parable application
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={prototypeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-[#00f2ff]/45 bg-[#00f2ff]/12 px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-[#00f2ff] shadow-[0_0_28px_rgba(0,242,255,0.12)] transition hover:bg-[#00f2ff]/20"
              >
                Open Parable app in new tab
              </a>
            </div>
            <div className="parable-glass-panel mt-6 overflow-hidden p-0 md:mt-8">
              <div className="border-b border-[#00f2ff]/15 bg-black/40 px-4 py-2.5 text-center text-[10px] uppercase tracking-[0.2em] text-white/45">
                Live embed — if blank, open in new tab (CSP may block cross-origin frames)
              </div>
              <iframe
                title="Parable application"
                src={prototypeUrl}
                className="h-[min(88dvh,920px)] w-full min-h-[480px] bg-[#070708]"
                loading="lazy"
                allow="fullscreen; clipboard-read; clipboard-write; microphone; camera"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </section>
        ) : null}

        {!hasUrl ? (
          <div className="parable-glass-panel mt-10 overflow-hidden p-0 md:mt-12">
            <div className="border-b border-[#00f2ff]/15 bg-black/40 px-4 py-2.5 text-center text-[10px] uppercase tracking-[0.2em] text-white/45">
              Five-pillar preview — Live · Hybrid · Studio · Gather · Money (not the deployed app)
            </div>
            <div className="p-4 md:p-6">
              <ParableInteractiveDemo previewBadge />
            </div>
          </div>
        ) : (
          <details className="group mt-10 rounded-xl border border-white/[0.08] bg-black/30 p-4 md:mt-12">
            <summary className="cursor-pointer list-none text-center text-[11px] font-black uppercase tracking-[0.2em] text-white/50 outline-none marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">Offline UI preview (tap)</span>
              <span className="hidden group-open:inline">Hide offline UI preview</span>
            </summary>
            <p className="mx-auto mt-3 max-w-xl text-center text-[12px] leading-relaxed text-white/40">
              Use this only if you need a quick interactive walkthrough without the hosted app—same shell patterns, local demo
              data.
            </p>
            <div className="mt-6 flex justify-center">
              <ParableInteractiveDemo previewBadge />
            </div>
          </details>
        )}

        {!hasUrl ? (
          <p className="mx-auto mt-8 max-w-2xl text-pretty text-center text-[11px] leading-relaxed text-white/35 md:mt-10">
            Deployed app: set{' '}
            <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-[10px] text-[#00f2ff]/80">NEXT_PUBLIC_PARABLE_PROTOTYPE_URL</code>{' '}
            (HTTPS). Allow this origin in <code className="font-mono text-[10px]">frame-ancestors</code> for embedding.
          </p>
        ) : null}
      </div>
    </div>
  );
}

/** Icon for choice-hub cards linking to `/explore`. */
export function ExplorePrototypeIcon({ className }: { className?: string }) {
  return <GridIcon className={className} />;
}
