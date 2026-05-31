import { redirect } from 'next/navigation';

/** Legacy bookmark — intro now lives at `/`. */
export default function InfoIntroRedirectPage() {
  redirect('/');
}
