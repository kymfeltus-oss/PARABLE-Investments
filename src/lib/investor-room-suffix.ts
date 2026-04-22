import { randomBytes } from 'crypto';

/**
 * New `meeting_nda_evidence` row: random suffix (12 hex chars, no `investor-` prefix).
 * Server-only — do not import from client components (uses Node `crypto`).
 */
export function generateInvestorRoomSuffix(): string {
  return randomBytes(6).toString('hex');
}
