import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const DEFAULT_SLUG = 'parable-seed';

/** Top-level legacy segments that must be forwarded into the scoped tenant tree. */
const LEGACY_TOP_SEGMENTS = ['investor', 'nda', 'start', 'explore', 'book', 'meet'];
/** These were reparented under /start/* in the multi-tenant layout. */
const REPARENTED_UNDER_START = ['explore', 'book', 'meet'];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const { pathname, search } = request.nextUrl;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    if (pathname.includes('/investor/page-2')) {
      return NextResponse.redirect(new URL(`/${DEFAULT_SLUG}/investor`, request.url));
    }
    return supabaseResponse;
  }

  const segments = pathname.split('/').filter(Boolean);
  const topSegment = segments[0] ?? '';

  // 1. Forward un-scoped legacy paths to the default tenant (308), preserving query strings.
  if (LEGACY_TOP_SEGMENTS.includes(topSegment)) {
    const rewritten = REPARENTED_UNDER_START.includes(topSegment) ? `/start${pathname}` : pathname;
    return NextResponse.redirect(new URL(`/${DEFAULT_SLUG}${rewritten}${search}`, request.url), 308);
  }

  // 2. Cookie-bound SSR session (refreshes auth cookies).
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. Lightweight session gate on the scoped presentation view only.
  if (pathname.includes('/investor/page-2') && !user) {
    const activeSlug = segments[0] || DEFAULT_SLUG;
    return NextResponse.redirect(new URL(`/${activeSlug}/investor`, request.url));
  }

  return supabaseResponse;
}
