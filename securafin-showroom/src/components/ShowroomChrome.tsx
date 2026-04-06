"use client";

import SecurafinHeader from "@/components/SecurafinHeader";
import { SecurafinPersonaProvider } from "@/components/persona-context";

export default function ShowroomChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SecurafinPersonaProvider>
      <div className="securafin-showroom min-h-screen bg-[#050508] text-white">
        <SecurafinHeader />
        {children}
      </div>
    </SecurafinPersonaProvider>
  );
}
