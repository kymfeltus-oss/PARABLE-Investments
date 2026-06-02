"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ModuleCard } from "@/components/layout/DashboardShell";

type TemplateSummary = {
  companyName: string;
  agreementVersion: string;
  isActive: boolean;
  activeForPresenter: boolean;
};

type NdaSummary = {
  activeTemplate: TemplateSummary | null;
  totalSigned: number;
};

export function NdaModuleSummary({ presenterEmail }: { presenterEmail?: string }) {
  const email = presenterEmail ?? "founder@pitchlock.test";
  const [summary, setSummary] = useState<NdaSummary | null>(null);

  useEffect(() => {
    void Promise.all([
      fetch(`/api/nda-templates?presenterEmail=${encodeURIComponent(email)}`),
      fetch(`/api/pitch-access/agreements?presenterEmail=${encodeURIComponent(email)}`),
    ]).then(async ([tRes, aRes]) => {
      const templates = ((await tRes.json()) as { templates?: TemplateSummary[] }).templates ?? [];
      const agreements = ((await aRes.json()) as { agreements?: unknown[] }).agreements ?? [];
      const active =
        templates.find((t) => t.isActive && t.activeForPresenter) ??
        templates.find((t) => t.isActive) ??
        null;
      setSummary({
        activeTemplate: active,
        totalSigned: agreements.length,
      });
    });
  }, [email]);

  const desc = summary?.activeTemplate
    ? `Active: ${summary.activeTemplate.companyName} · v${summary.activeTemplate.agreementVersion}`
    : "Customize fields, activate a version, and track signed records.";

  return (
    <div className="space-y-4">
      <ModuleCard
        title="NDA"
        description={desc}
        href="/dashboard/presenter/nda"
        badge={summary && summary.totalSigned > 0 ? `${summary.totalSigned} signed` : undefined}
      />
      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/presenter/nda" className="pl-btn pl-btn-outline !px-5 !py-2.5">
          Manage
        </Link>
        <Link href="/dashboard/presenter/nda#tracker" className="pl-btn pl-btn-outline !px-5 !py-2.5">
          Tracker
        </Link>
        <Link href="/dashboard/presenter/nda#qr" className="pl-btn pl-btn-outline !px-5 !py-2.5">
          QR Code
        </Link>
      </div>
    </div>
  );
}
