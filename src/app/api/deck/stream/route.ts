import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

/** Local deck asset — add `parable-seed-deck.pdf` under `src/assets/decks/`. */
const DECK_ASSET_PATH = path.join(process.cwd(), 'src/assets/decks/parable-seed-deck.pdf');

export async function GET() {
  const admin = getSupabaseAdmin();

  let supabase;
  try {
    supabase = await createServerSupabaseClient();
  } catch {
    return new NextResponse('Supabase is not configured.', { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return new NextResponse('Unauthorized — sign in to view the deck.', { status: 401 });
  }

  if (!admin) {
    return new NextResponse('Server storage is not configured.', { status: 503 });
  }

  const { data: signature } = await admin
    .from('investor_agreements')
    .select('id')
    .eq('email', user.email.trim().toLowerCase())
    .limit(1)
    .maybeSingle();

  if (!signature) {
    return new NextResponse('Forbidden — signed NDA required before viewing the deck.', { status: 403 });
  }

  if (!fs.existsSync(DECK_ASSET_PATH)) {
    return new NextResponse('Presentation file not found on server.', { status: 404 });
  }

  const binaryBuffer = fs.readFileSync(DECK_ASSET_PATH);

  return new NextResponse(binaryBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="parable-executive-presentation.pdf"',
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      Pragma: 'no-cache',
    },
  });
}
