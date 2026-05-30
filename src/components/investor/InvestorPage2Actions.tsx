'use client';

import { useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

export function InvestorPage2Actions() {
  const router = useRouter();

  async function signOut() {
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      router.push('/investor');
      return;
    }
    await supabase.auth.signOut();
    router.push('/investor');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void signOut()}
      className="text-xs uppercase tracking-[0.22em] text-white/35 underline-offset-4 transition hover:text-white/55 hover:underline"
    >
      Sign out
    </button>
  );
}
