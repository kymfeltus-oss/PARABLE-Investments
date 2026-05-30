import type { ReactNode } from 'react';

/** Shared shell for ministry finance routes (e.g. SOA assistant, fund analysis). */
export default function MinistryFinanceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="theme-accounting min-h-dvh bg-parable-space text-[#F8FAFC]">{children}</div>
  );
}
