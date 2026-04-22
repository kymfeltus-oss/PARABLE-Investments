'use client';

import { useLayoutEffect, useRef } from 'react';

type Props = {
  /** Full iframe document URL (from `NEXT_PUBLIC_GAMMA_PROPOSAL_URL` / `GAMMA_EMBED_URL`, normalized on the server). */
  src: string;
};

/**
 * Priority-loaded embed: preconnect runs before paint; iframe requests high fetch priority so the
 * browser schedules the subdocument early on the white-labeled origin.
 */
export function InvestorPortalClient({ src }: Props) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useLayoutEffect(() => {
    const el = frameRef.current;
    if (el) {
      type IframePriority = HTMLIFrameElement & { fetchPriority?: string };
      (el as IframePriority).fetchPriority = 'high';
    }
    if (!src) return;
    let origin: string;
    try {
      origin = new URL(src).origin;
    } catch {
      return;
    }
    const marker = `data-proposal-embed="${origin}"`;
    if (document.head.querySelector(`link[rel="preconnect"][${marker}]`)) return;
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = origin;
    preconnect.crossOrigin = 'anonymous';
    preconnect.setAttribute('data-proposal-embed', origin);
    document.head.appendChild(preconnect);
    const prefetch = document.createElement('link');
    prefetch.rel = 'dns-prefetch';
    prefetch.href = origin;
    prefetch.setAttribute('data-proposal-embed', origin);
    document.head.appendChild(prefetch);
  }, [src]);

  return (
    <div className="relative w-full min-h-[22rem] flex-1 sm:min-h-[28rem]" style={{ height: 'calc(100dvh - 12rem)' }}>
      <iframe
        ref={frameRef}
        src={src}
        className="absolute inset-0 h-full w-full border-none"
        allow="fullscreen; clipboard-write"
        allowFullScreen
        title="PROJECT PARABLE"
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
