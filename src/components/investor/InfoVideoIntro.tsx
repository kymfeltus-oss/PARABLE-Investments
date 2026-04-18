'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const VIDEO_SRC = '/videos/Welcome.mp4';
const STORAGE_KEY = 'parable_info_intro_v1';

type Props = {
  children: React.ReactNode;
};

/**
 * Full-screen intro video before `/info` main content. Skip ends early; onEnded continues automatically.
 * Same browser session: after you finish once, `/info` goes straight to content until the tab is closed.
 */
export function InfoVideoIntro({ children }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === '1') {
        setDone(true);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const finish = useCallback(() => {
    setDone(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
  }, []);

  if (!ready) {
    return <div className="min-h-screen bg-[#070708]" aria-hidden />;
  }

  if (done) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black">
      <div className="flex shrink-0 items-center justify-end gap-3 border-b border-white/10 px-4 py-3">
        <button
          type="button"
          onClick={finish}
          className="rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/80 transition hover:bg-white/10"
        >
          Skip
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center p-4">
        <video
          ref={videoRef}
          className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
          src={VIDEO_SRC}
          autoPlay
          playsInline
          muted
          preload="auto"
          onEnded={finish}
        />
      </div>
      <div className="shrink-0 border-t border-white/10 px-4 py-3 text-center">
        <button
          type="button"
          onClick={() => {
            const el = videoRef.current;
            if (el) el.muted = !el.muted;
          }}
          className="text-[11px] font-semibold uppercase tracking-wider text-[#00f2ff]/80 hover:text-[#00f2ff]"
        >
          Toggle sound
        </button>
      </div>
    </div>
  );
}
