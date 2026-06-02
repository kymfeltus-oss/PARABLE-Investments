import { createHash } from "crypto";

/** SHA-256 hex digest of UTF-8 text. Server-only — never accept hashes from clients. */
export function sha256Hex(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

/** document_hash = sha256(document_snapshot) */
export function computeDocumentHash(documentSnapshot: string): string {
  return sha256Hex(documentSnapshot);
}

/**
 * record_hash = sha256(agreementId + investorEmail + signedAtUtc + documentHash + signature)
 * Pipe-delimited payload for stable server-side recomputation.
 */
export function computeRecordHash(params: {
  agreementId: string;
  investorEmail: string;
  signedAtUtc: string;
  documentHash: string;
  signature: string;
}): string {
  const payload = [
    params.agreementId,
    params.investorEmail.trim().toLowerCase(),
    params.signedAtUtc,
    params.documentHash,
    params.signature.trim(),
  ].join("|");
  return sha256Hex(payload);
}

export function shortHash(hash: string | null | undefined, length = 8): string {
  if (!hash?.trim()) return "—";
  return hash.slice(0, length);
}
