"use client";

import { useSidebarLayout } from "@/contexts/SidebarLayoutContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const IS_STUDY_AI = process.env.NEXT_PUBLIC_APP_VARIANT === "parable-study-ai";

export default function AppShellMain({ children }: { children: React.ReactNode }) {
  const { sidebarWidthPx } = useSidebarLayout();
  const isLg = useMediaQuery("(min-width: 1024px)");

  const padLeft = isLg === true && !IS_STUDY_AI ? sidebarWidthPx : 0;

  return (
    <div
      className="flex min-h-screen min-w-0 flex-1 justify-center transition-[padding] duration-300 ease-out"
      style={{ paddingLeft: padLeft }}
    >
      <div
        className="relative w-full min-w-0 overflow-x-hidden border-x border-white/[0.07] bg-[#050506] shadow-[0_0_80px_rgba(0,0,0,0.55)] max-w-[430px] md:max-w-[480px] lg:max-w-none lg:border-x-0 lg:shadow-none"
        data-parable-app-shell
      >
        {children}
      </div>
    </div>
  );
}
