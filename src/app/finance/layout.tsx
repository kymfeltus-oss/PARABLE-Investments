import type { ReactNode } from 'react';

export default function FinanceSectionLayout({ children }: { children: ReactNode }) {
  return (
    <div className="theme-accounting min-h-dvh bg-parable-space text-[#F8FAFC]">{children}</div>
  );
}
