"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { NdaPresenterHub } from "@/components/presenter/NdaPresenterHub";

function NdaPageInner() {
  const searchParams = useSearchParams();
  const presenterEmail = searchParams.get("presenterEmail")?.trim() || undefined;
  return <NdaPresenterHub presenterEmail={presenterEmail} />;
}

export default function PresenterNdaPage() {
  return (
    <Suspense fallback={null}>
      <NdaPageInner />
    </Suspense>
  );
}
