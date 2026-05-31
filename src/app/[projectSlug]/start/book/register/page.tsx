import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

/** Legacy URL — registration is inline on `/book` under the calendar. */
export default async function BookRegisterRedirectPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const fromProposal = sp.fromProposal === '1' || (Array.isArray(sp.fromProposal) && sp.fromProposal[0] === '1');
  redirect(fromProposal ? '/book?fromProposal=1' : '/book');
}
