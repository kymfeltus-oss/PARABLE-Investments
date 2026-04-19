import { AccessToken } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';

/** Room names must start with this prefix (e.g. investor-jan-2026). */
const ROOM_PREFIX = 'investor-';

export async function POST(req: NextRequest) {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  if (!apiKey || !apiSecret) {
    return NextResponse.json(
      { error: 'LiveKit is not configured. Set LIVEKIT_API_KEY and LIVEKIT_API_SECRET on the server.' },
      { status: 503 }
    );
  }

  let body: { roomName?: string; participantName?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Expected JSON body' }, { status: 400 });
  }

  const roomName = typeof body.roomName === 'string' ? body.roomName.trim() : '';
  const participantName =
    typeof body.participantName === 'string' && body.participantName.trim()
      ? body.participantName.trim().slice(0, 80)
      : 'Guest';

  if (!roomName || roomName.length > 128) {
    return NextResponse.json({ error: 'roomName is required' }, { status: 400 });
  }

  if (!roomName.startsWith(ROOM_PREFIX)) {
    return NextResponse.json(
      {
        error: `Room must start with "${ROOM_PREFIX}" (e.g. investor-team-call).`,
      },
      { status: 400 }
    );
  }

  if (!/^investor-[a-zA-Z0-9_-]+$/.test(roomName)) {
    return NextResponse.json(
      { error: 'Room name may only contain letters, numbers, hyphens, and underscores after the prefix.' },
      { status: 400 }
    );
  }

  const token = new AccessToken(apiKey, apiSecret, {
    identity: `inv-${crypto.randomUUID()}`,
    name: participantName,
  });

  token.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    /** Lets clients update display name / metadata from the meeting (e.g. profile thumbnail in settings). */
    canUpdateOwnMetadata: true,
  });

  const jwt = await token.toJwt();
  return NextResponse.json({ token: jwt });
}
