import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

type Props = {
  params: Promise<{ projectSlug: string }>;
};

export default async function TenantLandingPage({ params }: Props) {
  const { projectSlug } = await params;
  const admin = getSupabaseAdmin();

  if (!admin) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center font-mono text-sm text-red-400">
        System initialization fault — database is not configured.
      </div>
    );
  }

  const { data: project } = await admin
    .from('pitchlock_projects')
    .select('project_name, presenter_name, headline_suffix, tagline, value_statement, footer_left, footer_right')
    .eq('slug', projectSlug)
    .maybeSingle();

  if (!project) return notFound();

  const presenter = project.presenter_name || project.project_name;
  const headline = project.headline_suffix || project.project_name;
  const tagline = project.tagline || 'The future of faith has a platform.';
  const valueStatement =
    project.value_statement || 'Building the infrastructure layer of the global faith economy.';
  const footerLeft = project.footer_left || 'Faith. Finance. Technology.';
  const footerRight = project.footer_right || 'United For Kingdom Impact.';

  return (
    <div className="app-background relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 select-none">
      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center glass-card p-12 text-center shadow-2xl">
        <div className="mb-8 space-y-2">
          <h2 className="type-section-label text-[var(--color-accent)]">
            {presenter} Presents
          </h2>
          <h1 className="type-hero text-[var(--text-baseline)]">
            {headline}
          </h1>
          <p className="type-section-label mt-4 italic text-[var(--color-accent)]">
            &ldquo;{tagline}&rdquo;
          </p>
        </div>

        <div className="mb-8 h-[2px] w-16 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent" />

        <p className="type-body mb-12 max-w-md text-lg text-[var(--text-baseline)]/80">
          {valueStatement}
        </p>

        <div className="flex w-full max-w-sm flex-col space-y-4">
          <Link
            href={`/${projectSlug}/gate`}
            className="primary-button type-nav text-[var(--bg-canvas)] shadow-xl shadow-[var(--color-accent)]/20 hover:scale-[1.03] active:scale-[0.98]"
          >
            Enter Secure Portal
          </Link>

          <div className="type-nav flex items-center justify-center space-x-6 pt-4 text-[var(--text-baseline)]/40">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-accent)]" />
              Stream
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
              Give
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
              Account
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-0 left-0 z-10 space-x-4 text-center type-nav text-[11px] text-[var(--text-baseline)]/30">
        <span>{footerLeft}</span>
        <span>|</span>
        <span className="text-[var(--color-accent)]/50">{footerRight}</span>
      </div>
    </div>
  );
}
