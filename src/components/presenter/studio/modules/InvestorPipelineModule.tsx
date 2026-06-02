"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DEMO_PRESENTER_EMAIL } from "@/lib/investor-experience";
import { GlassCard } from "@/components/ui/GlassCard";
import { StudioShell } from "../StudioShell";
import styles from "../studio.module.css";

type AgreementRow = {
  id: string;
  investorName: string;
  investorEmail: string;
  signedAtUtc?: string | null;
};

export function InvestorPipelineModule() {
  const [rows, setRows] = useState<AgreementRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetch(`/api/pitch-access/agreements?presenterEmail=${encodeURIComponent(DEMO_PRESENTER_EMAIL)}`)
      .then((r) => r.json())
      .then((data: { agreements?: AgreementRow[] }) => {
        setRows(data.agreements ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <StudioShell title="Investor Pipeline" subtitle="Signed & invited">
      <div className="max-w-2xl">
        <p className="mb-6 text-sm pl-muted leading-relaxed">
          Everyone who signed your Pitch Access Agreement — your live pipeline, not a spreadsheet.
        </p>
        <GlassCard className="!p-6">
          {loading ? (
            <p className="text-sm pl-muted">Loading pipeline…</p>
          ) : rows.length === 0 ? (
            <p className="text-sm pl-muted">No signed agreements yet. Share your NDA link to grow the pipeline.</p>
          ) : (
            <ul className={styles.pipelineList}>
              {rows.map((row) => (
                <li key={row.id} className={styles.pipelineRow}>
                  <div>
                    <p className="pl-text font-medium">{row.investorName}</p>
                    <p className="text-xs pl-muted">{row.investorEmail}</p>
                  </div>
                  <span className="pl-badge pl-badge-cyan">Verified</span>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/dashboard/presenter/nda#tracker" className="pl-btn pl-btn-outline">
            NDA tracker
          </Link>
          <Link href="/dashboard/presenter" className="pl-link text-sm self-center">
            ← Studio home
          </Link>
        </div>
      </div>
    </StudioShell>
  );
}
