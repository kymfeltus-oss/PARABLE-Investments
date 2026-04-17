"use client";

import { usePathname } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import AppShellMain from "@/components/navigation/AppShellMain";
import DesktopSidebar from "@/components/navigation/DesktopSidebar";
import { SidebarLayoutProvider } from "@/contexts/SidebarLayoutContext";

type Props = {
  children: React.ReactNode;
};

export default function ClientRootLayout({ children }: Props) {
  const pathname = usePathname();
  const instagramHomeShell = pathname === "/my-sanctuary";

  return (
    <SidebarLayoutProvider>
      <div className="min-h-screen bg-[#070708]">
        <DesktopSidebar />
        <AppShellMain>{children}</AppShellMain>
      </div>
      {!instagramHomeShell ? <BottomNav /> : null}
    </SidebarLayoutProvider>
  );
}
