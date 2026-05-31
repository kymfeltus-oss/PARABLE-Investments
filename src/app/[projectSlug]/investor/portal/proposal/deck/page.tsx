import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { LiveDeckViewport } from '@/components/pitchlock/LiveDeckViewport';
import { INVESTOR_SITE_URL } from '@/lib/investor-site';
import { resolveProjectId } from '@/lib/pitchlock/resolve-project';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ projectSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { projectSlug } = await params;
  const canonical = new URL(`/${projectSlug}/investor/portal/proposal/deck`, INVESTOR_SITE_URL);
  return {
    title: 'Executive Proposal Deck | PitchLock Secure Portal',
    description: 'Secure, high-fidelity investment deck review environment.',
    alternates: { canonical: canonical.href },
    robots: { index: false, follow: false },
  };
}

export default async function InvestorProposalDeckPage({ params }: Props) {
  const { projectSlug } = await params;

  let supabase;
  try {
    supabase = await createServerSupabaseClient();
  } catch {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect(`/${projectSlug}/investor`);
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    notFound();
  }

  const { projectId } = await resolveProjectId(admin, projectSlug);
  if (!projectId) {
    notFound();
  }

  const email = user.email.trim().toLowerCase();

  const { data: agreement } = await admin
    .from('investor_agreements')
    .select('id')
    .eq('email', email)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!agreement) {
    const deckPath = `/${projectSlug}/investor/portal/proposal/deck`;
    redirect(`/${projectSlug}/nda?next=${encodeURIComponent(deckPath)}`);
  }

  return <LiveDeckViewport />;
}
