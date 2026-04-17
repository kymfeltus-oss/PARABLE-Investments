/**
 * Liveness simulation — vocabulary: Creator, Influencer, Studio, Community (no religious terms).
 */

export const LIVENESS_STORAGE_KEY = "parable:liveness-sim";

/** Dev default on; production requires NEXT_PUBLIC_LIVENESS_SIMULATION=1 */
export function getDefaultLivenessEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_LIVENESS_SIMULATION === "1") return true;
  if (process.env.NEXT_PUBLIC_LIVENESS_SIMULATION === "0") return false;
  return process.env.NODE_ENV === "development";
}

const HANDLES = [
  "@Studio_Creator",
  "@NeonInfluencer",
  "@FilmRunner_X",
  "@PixelNorth",
  "@UrbanFrame",
  "@LensTheory",
  "@QuietUnit",
  "@CitySceneLab",
  "@Investor_Pro",
  "@StreamHost_K",
  "@IndieDirector",
  "@AudioGrid_Mai",
];

const CITIES = [
  "Los Angeles",
  "Atlanta",
  "Chicago",
  "Toronto",
  "London",
  "Berlin",
  "Tokyo",
  "Sydney",
  "Nairobi",
  "Mexico City",
];

const CREATOR_NAMES = [
  "@Studio_Pro",
  "@CreatorMia",
  "@Influencer_J",
  "@FrameRunner",
  "@Showrunner_Lee",
];

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

function randInt(min: number, max: number, seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return min + Math.floor((x - Math.floor(x)) * (max - min + 1));
}

let seq = 0;
export function nextLivenessSeed() {
  seq += 1;
  return Date.now() + seq;
}

export type LivenessEventKind = "live" | "short" | "investment" | "toast";

export function formatLivenessTickerLine(seed = nextLivenessSeed()): string {
  const r = randInt(0, 2, seed);
  if (r === 0) {
    const h = pick(HANDLES, seed);
    return `User ${h} just started a Live Stream`;
  }
  if (r === 1) {
    const city = pick(CITIES, seed + 1);
    return `New Short uploaded in ${city}`;
  }
  const amt = [5, 10, 15, 20, 25, 50, 100][randInt(0, 6, seed + 2)];
  const cr = pick(CREATOR_NAMES, seed + 3);
  return `Investment of $${amt} made to Creator ${cr}`;
}

export function formatPaymentToast(seed = nextLivenessSeed()): string {
  const amt = [8, 12, 20, 35, 50][randInt(0, 4, seed)];
  const labels = ["Super-Like", "Studio Boost", "Community Tip"][randInt(0, 2, seed + 1)];
  return `@Investor_Pro just sent a $${amt} ${labels}!`;
}

export const LIVE_EMOJI_POOL = ["❤️", "🔥", "💯", "✨", "⚡", "🎬", "💎", "👏"] as const;

export function shouldShowLiveEmojiPath(pathname: string | null): boolean {
  if (!pathname) return false;
  const p = pathname.split("?")[0];
  return (
    p === "/parables" ||
    p === "/streamers" ||
    p === "/live-studio" ||
    p.startsWith("/gaming")
  );
}
