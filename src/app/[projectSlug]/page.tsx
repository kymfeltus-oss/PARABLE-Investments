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
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 select-none">
      {/* Neon glow accents */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)]/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-purple-600/10 blur-[100px]" />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center rounded-2xl border border-[var(--border-grid)] bg-[var(--bg-panel)] p-12 text-center shadow-2xl">
        <div className="mb-8 space-y-2">
          <h2 className="font-mono text-xs font-semibold tracking-[0.3em] text-[var(--color-accent)] uppercase">
            {presenter} Presents
          </h2>
          <h1 className="text-4xl font-black tracking-tight text-[var(--text-baseline)] uppercase sm:text-5xl">
            {headline}
          </h1>
          <p className="mt-4 font-mono text-sm tracking-wide text-[var(--color-accent)] italic">
            &ldquo;{tagline}&rdquo;
          </p>
        </div>

        <div className="mb-8 h-[2px] w-16 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent" />

        <p className="mb-12 max-w-md text-lg leading-relaxed font-medium text-[var(--text-baseline)]/80">
          {valueStatement}
        </p>

        <div className="flex w-full max-w-sm flex-col space-y-4">
          <Link
            href={`/${projectSlug}/investor`}
            className="w-full rounded-xl bg-gradient-to-r from-[var(--color-accent)] to-purple-600 py-4 text-center text-sm font-bold tracking-wide text-[var(--bg-canvas)] uppercase shadow-xl shadow-[var(--color-accent)]/10 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Enter Secure Portal
          </Link>

          <div className="flex items-center justify-center space-x-6 pt-4 font-mono text-[10px] tracking-widest text-[var(--text-baseline)]/40 uppercase">
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

      <div className="absolute bottom-8 right-0 left-0 z-10 space-x-4 text-center font-mono text-[11px] text-[var(--text-baseline)]/30">
        <span>{footerLeft}</span>
        <span>|</span>
        <span className="text-[var(--color-accent)]/50">{footerRight}</span>
      </div>
    </div>
  );
}
