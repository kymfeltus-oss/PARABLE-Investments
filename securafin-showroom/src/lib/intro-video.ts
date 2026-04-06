export type ParsedIntroVideo =
  | { mode: "youtube"; embedUrl: string }
  | { mode: "vimeo"; embedUrl: string }
  | { mode: "file"; src: string }
  | null;

function youtubeIdFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      return id || null;
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) {
        return u.pathname.replace("/embed/", "").split("/")[0] || null;
      }
      const v = u.searchParams.get("v");
      if (v) return v;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function vimeoIdFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("vimeo.com")) return null;
    const parts = u.pathname.split("/").filter(Boolean);
    const id = parts[parts.length - 1];
    if (id && /^\d+$/.test(id)) return id;
  } catch {
    /* ignore */
  }
  return null;
}

export function parseIntroVideoUrl(raw: string | undefined): ParsedIntroVideo {
  const url = raw?.trim();
  if (!url) return null;

  const yt = youtubeIdFromUrl(url);
  if (yt) {
    return {
      mode: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${yt}?rel=0`,
    };
  }

  const vm = vimeoIdFromUrl(url);
  if (vm) {
    return {
      mode: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vm}`,
    };
  }

  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url) || url.startsWith("/")) {
    return { mode: "file", src: url };
  }

  return null;
}
