import type { SupabaseClient } from "@supabase/supabase-js";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_DIM = 2048;

export type CompressUploadResult =
  | { ok: true; publicUrl: string }
  | { ok: false; error: string; compressedBlob?: Blob };

function extFromType(t: string): string {
  if (t.includes("png")) return "png";
  if (t.includes("webp")) return "webp";
  if (t.includes("gif")) return "gif";
  return "jpg";
}

/**
 * Compress in-browser, then upload to `posts` bucket under `{userId}/…`.
 */
export async function compressAndUploadImage(
  supabase: SupabaseClient,
  file: File,
): Promise<CompressUploadResult> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const uid = session?.user?.id;
  if (!uid) {
    return { ok: false, error: "Sign in to upload photos to the cloud." };
  }

  let blob: Blob = file;
  try {
    const imageCompression = (await import("browser-image-compression")).default;
    blob = await imageCompression(file, {
      maxSizeMB: MAX_UPLOAD_BYTES / (1024 * 1024),
      maxWidthOrHeight: MAX_DIM,
      useWebWorker: true,
      initialQuality: 0.82,
      fileType: "image/jpeg",
    });
  } catch {
    /* use original if library fails */
  }

  if (blob.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "Image is still too large after compression.", compressedBlob: blob };
  }

  const ext = extFromType(blob.type || file.type || "image/jpeg");
  const path = `${uid}/sanctuary-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

  const { error } = await supabase.storage.from("posts").upload(path, blob, {
    cacheControl: "3600",
    upsert: false,
    contentType: blob.type || "image/jpeg",
  });

  if (error) {
    return { ok: false, error: error.message || "Upload failed.", compressedBlob: blob };
  }

  const { data } = supabase.storage.from("posts").getPublicUrl(path);
  const publicUrl = data?.publicUrl;
  if (!publicUrl) {
    return { ok: false, error: "Could not get public URL for upload." };
  }

  return { ok: true, publicUrl };
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(typeof fr.result === "string" ? fr.result : "");
    fr.onerror = () => reject(new Error("read"));
    fr.readAsDataURL(blob);
  });
}
