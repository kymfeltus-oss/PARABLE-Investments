import type { CSSProperties, ReactNode } from 'react';
import { PITCHLOCK_FLAGSHIP_THEME } from '@/lib/brand';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

type Props = {
  children: ReactNode;
  params: Promise<{ projectSlug: string }>;
};

const FALLBACK_TOKENS = {
  theme_bg: PITCHLOCK_FLAGSHIP_THEME.theme_bg,
  theme_panel: PITCHLOCK_FLAGSHIP_THEME.theme_panel,
  theme_border: PITCHLOCK_FLAGSHIP_THEME.theme_border,
  theme_accent: PITCHLOCK_FLAGSHIP_THEME.theme_accent,
  theme_success: PITCHLOCK_FLAGSHIP_THEME.theme_success,
  theme_text: PITCHLOCK_FLAGSHIP_THEME.theme_text,
};

export default async function ScopedTenantLayout({ children, params }: Props) {
  const { projectSlug } = await params;
  const admin = getSupabaseAdmin();

  let tokens = { ...FALLBACK_TOKENS };

  if (admin) {
    try {
      const { data: project } = await admin
        .from('pitchlock_projects')
        .select('theme_bg, theme_panel, theme_border, theme_accent, theme_success, theme_text')
        .eq('slug', projectSlug)
        .maybeSingle();

      if (project) {
        tokens = {
          theme_bg: project.theme_bg || tokens.theme_bg,
          theme_panel: project.theme_panel || tokens.theme_panel,
          theme_border: project.theme_border || tokens.theme_border,
          theme_accent: project.theme_accent || tokens.theme_accent,
          theme_success: project.theme_success || tokens.theme_success,
          theme_text: project.theme_text || tokens.theme_text,
        };
      }
    } catch {
      /* DB/env hiccup — fall back to flagship tokens rather than crash the route. */
    }
  }

  const dynamicStyles = {
    '--bg-canvas': tokens.theme_bg,
    '--bg-panel': tokens.theme_panel,
    '--border-grid': tokens.theme_border,
    '--color-accent': tokens.theme_accent,
    '--color-success': tokens.theme_success,
    '--text-baseline': tokens.theme_text,
  } as CSSProperties;

  return (
    <div
      style={dynamicStyles}
      data-tenant-slug={projectSlug}
      className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-baseline)] transition-colors duration-150"
    >
      {children}
    </div>
  );
}
