'use client';

import { useLayoutEffect, useRef } from 'react';

type Props = {
  /** Full iframe document URL (from `NEXT_PUBLIC_GAMMA_PROPOSAL_URL` / `GAMMA_EMBED_URL`, normalized on the server). */
  src: string;
  /** When true, the iframe fills a flex parent with `min-h-0` (e.g. deck route). */
  fillContainer?: boolean;
};

/**
 * Priority-loaded embed: preconnect runs before paint; iframe requests high fetch priority so the
 * browser schedules the subdocument early on the white-labeled origin.
 */
export function InvestorPortalClient({ src, fillContainer = false }: Props) {
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
    <div
      className={
        fillContainer
          ? /* flex-1 + min-h-0: iOS Safari often gives 0 height to h-full% inside nested column flex */
            'relative min-h-0 w-full min-w-0 flex-1 overflow-hidden'
          : 'relative w-full min-h-[22rem] flex-1 sm:min-h-[28rem]'
      }
      style={fillContainer ? undefined : { height: 'calc(100dvh - 12rem)' }}
    >
      <iframe
        ref={frameRef}
        src={src}
        className="absolute inset-0 box-border h-full min-h-0 w-full border-none"
        allow="fullscreen; clipboard-write"
        allowFullScreen
        title="PROJECT PARABLE"
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
