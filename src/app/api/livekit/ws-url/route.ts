import { NextResponse } from 'next/server';
import { getLiveKitUrlFromEnv } from '@/lib/livekit-server-url';

/**
 * Exposes the LiveKit **WebSocket URL** (wss) for the meet UI. The URL is not secret; token minting
 * remains server-only (`/api/livekit/token`). Some deployments have `LIVEKIT_URL` only on the server
 * or RSC env reads fail — the client fetches this route so the meet page still connects.
 */
export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({ serverUrl: getLiveKitUrlFromEnv() });
}
