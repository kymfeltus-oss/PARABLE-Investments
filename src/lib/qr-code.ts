import QRCode from "qrcode";

export async function generateQrCodeDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 320,
    color: { dark: "#050508", light: "#ffffff" },
  });
}

/** @deprecated Use generateQrCodeDataUrl */
export async function generateNdaSigningQrCodeDataUrl(signingUrl: string): Promise<string> {
  return generateQrCodeDataUrl(signingUrl);
}

export function buildNdaSigningUrl(input: {
  siteUrl: string;
  templateId?: string;
  publicSigningSlug?: string | null;
}): string {
  const base = input.siteUrl.replace(/\/$/, "");
  if (input.publicSigningSlug?.trim()) {
    return `${base}/nda?nda=${encodeURIComponent(input.publicSigningSlug.trim())}`;
  }
  if (input.templateId?.trim()) {
    return `${base}/nda?templateId=${encodeURIComponent(input.templateId.trim())}`;
  }
  return `${base}/nda`;
}

export function buildPitchNdaSigningUrl(siteUrl: string, pitchId: string): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}/nda?pitchId=${encodeURIComponent(pitchId.trim())}`;
}

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}
