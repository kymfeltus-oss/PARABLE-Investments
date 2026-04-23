import { createHmac, timingSafeEqual } from 'crypto';

/** Matches `createWebhookSignature` in Cal.com (HMAC-SHA256 of the raw body, hex digest). */
export function verifyCalcomWebhookSignature(rawBody: string, receivedHeader: string | null, secret: string): boolean {
  if (!secret || !receivedHeader) return false;
  const expected = createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
  if (expected.length !== receivedHeader.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(receivedHeader, 'utf8'));
  } catch {
    return false;
  }
}
