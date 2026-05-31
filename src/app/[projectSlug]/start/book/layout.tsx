import type { ReactNode } from 'react';

/** Book-a-meeting / giving-adjacent flows — premium, low-glow palette. */
export default function BookSectionLayout({ children }: { children: ReactNode }) {
  return (
    <div className="theme-giving min-h-dvh bg-parable-space text-[var(--white-soft)]">{children}</div>
  );
}
