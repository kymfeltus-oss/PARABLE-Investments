import Link from 'next/link';
import { InvestorAtmosphere } from '@/components/brand/InvestorAtmosphere';
import { ParableLogoMark } from '@/components/brand/ParableLogoMark';
import { InvestorPage2Actions } from '@/components/investor/InvestorPage2Actions';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function InvestorPage2() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <InvestorAtmosphere />
      <div className="relative z-20 mx-auto max-w-2xl px-4 py-14 pb-28 md:py-20">
        <ParableLogoMark className="mx-auto mb-10 max-w-[180px] opacity-90" />
        <p className="parable-eyebrow mb-3 text-center text-[#00f2ff]/80">Verified</p>
        <h1 className="mb-4 text-center text-2xl font-black uppercase tracking-[0.14em] text-white md:text-3xl">
          Welcome in
        </h1>
        <p className="mb-2 text-center text-sm text-white/50">
          Signed in as <span className="text-white/80">{user?.email ?? 'your account'}</span>
        </p>
        <p className="mx-auto mb-10 max-w-md text-center text-sm leading-relaxed text-white/45">
          You passed the legal gate. Continue to the full NDA step and investor hub when you are ready.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/nda?next=/start"
            className="rounded-xl border border-[#00f2ff]/40 bg-[#00f2ff]/10 px-6 py-3.5 text-center text-sm font-black uppercase tracking-[0.2em] text-[#00f2ff] transition hover:bg-[#00f2ff]/20"
          >
            Continue to NDA
          </Link>
          <Link
            href="/start"
            className="rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-center text-sm font-semibold uppercase tracking-[0.18em] text-white/75 transition hover:bg-white/10"
          >
            Skip to hub
          </Link>
        </div>

        <div className="mt-12 flex justify-center border-t border-white/10 pt-10">
          <InvestorPage2Actions />
        </div>

        <p className="mt-10 text-center text-[10px] text-white/25">
          <Link href="/" className="hover:text-white/40">
            Home
          </Link>
        </p>
      </div>
    </div>
  );
}
