"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { StudioShell } from "./StudioShell";
import styles from "./studio.module.css";

export function StudioField({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="pl-input-label" htmlFor={id}>
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {hint ? <p className={cn(styles.fieldHint, "mt-1")}>{hint}</p> : null}
    </div>
  );
}

type StudioModuleEditorProps = {
  title: string;
  subtitle: string;
  lead: string;
  children: React.ReactNode;
  onSave: () => void | Promise<void>;
  busy?: boolean;
  message?: string | null;
  error?: string | null;
  loading?: boolean;
};

export function StudioModuleEditor({
  title,
  subtitle,
  lead,
  children,
  onSave,
  busy = false,
  message = null,
  error = null,
  loading = false,
}: StudioModuleEditorProps) {

  return (
    <StudioShell
      title={title}
      subtitle={subtitle}
      actions={
        <Link href="/dashboard/presenter" className="pl-btn pl-btn-outline !py-2 !px-4">
          Studio home
        </Link>
      }
    >
      <div className={styles.editorPage}>
        <header className={styles.editorHeader}>
          <p className="pl-label">{subtitle}</p>
          <h1 className={styles.editorTitle}>{title}</h1>
          <p className={styles.editorLead}>{lead}</p>
        </header>

        {message ? <p className={styles.feedBanner}>{message}</p> : null}
        {error ? <p className={cn(styles.feedBanner, styles.feedBannerError)}>{error}</p> : null}

        <GlassCard className="!p-6 sm:!p-8">
          <form
            className={styles.editorForm}
            onSubmit={(e) => {
              e.preventDefault();
              void onSave();
            }}
          >
            {loading ? <p className="pl-muted text-sm">Loading…</p> : children}
            <div className={styles.editorActions}>
              <button type="submit" className="pl-btn pl-btn-primary" disabled={busy || loading}>
                {busy ? "Saving…" : "Save module"}
              </button>
              <Link href="/dashboard/presenter" className="pl-btn pl-btn-outline">
                Back to studio
              </Link>
            </div>
          </form>
        </GlassCard>
      </div>
    </StudioShell>
  );
}
