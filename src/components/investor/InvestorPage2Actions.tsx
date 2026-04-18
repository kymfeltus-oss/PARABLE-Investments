'use client';

import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export function InvestorPage2Actions() {
  const router = useRouter();

  async function signOut() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon) {
      router.push('/investor');
      return;
    }
    const supabase = createBrowserClient(url, anon);
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
