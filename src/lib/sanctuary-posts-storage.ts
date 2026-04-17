export type SanctuaryPostAspect = "1x1" | "4x5";

export type SanctuaryPost = {
  id: string;
  caption: string;
  imageDataUrl: string;
  createdAt: number;
  aspect: SanctuaryPostAspect;
};

const PREFIX = "parable:sanctuary-posts:";
const DEVICE_FALLBACK_KEY = "parable:sanctuary-storage-device-id";
const IDB_NAME = "parable-sanctuary-posts";
const IDB_STORE = "postsByUser";
const IDB_VERSION = 1;

let memoryStorageUserId: string | null = null;
let pendingDeviceIdForStorage: string | null = null;

export function resolveSanctuaryStorageUserId(
  userIdFromPage: string,
  authUserId: string | null | undefined,
): string {
  const a = userIdFromPage.trim();
  if (a) return a;
  const b = authUserId != null ? String(authUserId).trim() : "";
  if (b) return b;
  if (typeof window === "undefined") return "";
  try {
    let id = window.localStorage.getItem(DEVICE_FALLBACK_KEY) ?? pendingDeviceIdForStorage;
    if (!id) {
      id = `local-${crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`}`;
      pendingDeviceIdForStorage = id;
      queueMicrotask(() => {
        try {
          window.localStorage.setItem(DEVICE_FALLBACK_KEY, id!);
        } catch {
          /* ignore */
        }
      });
    }
    return id;
  } catch {
    if (!memoryStorageUserId) {
      memoryStorageUserId = `mem-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    }
    return memoryStorageUserId;
  }
}

function keyForUser(userId: string) {
  return `${PREFIX}${userId}`;
}

export function isSanctuaryPostImageDataUrl(s: unknown): s is string {
  return typeof s === "string" && s.length > 22 && /^data:image\//i.test(s);
}

export function isSanctuaryPostImageSource(s: unknown): s is string {
  if (typeof s !== "string" || s.length < 12) return false;
  if (/^data:image\//i.test(s)) return true;
  if (/^https:\/\//i.test(s) && s.includes("/storage/v1/") && s.includes("/object/public/")) return true;
  return false;
}

function normalizePost(p: Partial<SanctuaryPost> & { id?: string }): SanctuaryPost | null {
  if (!p || typeof p.id !== "string" || !isSanctuaryPostImageSource(p.imageDataUrl)) return null;
  const aspect: SanctuaryPostAspect = p.aspect === "4x5" ? "4x5" : "1x1";
  const caption = typeof p.caption === "string" ? p.caption : "";
  const createdAt = typeof p.createdAt === "number" && Number.isFinite(p.createdAt) ? p.createdAt : Date.now();
  return {
    id: p.id,
    caption,
    imageDataUrl: p.imageDataUrl,
    createdAt,
    aspect,
  };
}

function parsePosts(raw: string | null): SanctuaryPost[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const out: SanctuaryPost[] = [];
    for (const item of parsed) {
      const n = normalizePost(item as Partial<SanctuaryPost>);
      if (n) out.push(n);
    }
    return out.sort((a, b) => b.createdAt - a.createdAt).slice(0, 80);
  } catch {
    return [];
  }
}

function openIdb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === "undefined") return Promise.resolve(null);
  return new Promise((resolve) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onerror = () => resolve(null);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
  });
}

async function idbGet(userKey: string): Promise<string | null> {
  const db = await openIdb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, "readonly");
      const req = tx.objectStore(IDB_STORE).get(userKey);
      req.onsuccess = () => {
        const v = req.result;
        resolve(typeof v === "string" ? v : null);
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbSet(userKey: string, value: string): Promise<boolean> {
  const db = await openIdb();
  if (!db) return false;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, "readwrite");
      const store = tx.objectStore(IDB_STORE);
      const req = store.put(value, userKey);
      req.onerror = () => resolve(false);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
      tx.onabort = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

async function idbDelete(userKey: string): Promise<void> {
  const db = await openIdb();
  if (!db) return;
  await new Promise<void>((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, "readwrite");
      tx.objectStore(IDB_STORE).delete(userKey);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    } catch {
      resolve();
    }
  });
}

async function idbListAllKeys(): Promise<string[]> {
  const db = await openIdb();
  if (!db) return [];
  return new Promise((resolve) => {
    const out: string[] = [];
    try {
      const tx = db.transaction(IDB_STORE, "readonly");
      const req = tx.objectStore(IDB_STORE).openKeyCursor();
      req.onsuccess = () => {
        const cursor = req.result;
        if (!cursor) {
          resolve(out);
          return;
        }
        if (typeof cursor.key === "string") out.push(cursor.key);
        cursor.continue();
      };
      req.onerror = () => resolve(out);
    } catch {
      resolve([]);
    }
  });
}

function collectFallbackIds(getKey: (i: number) => string | null, length: number): string[] {
  const ids: string[] = [];
  try {
    for (let i = 0; i < length; i++) {
      const k = getKey(i);
      if (!k?.startsWith(PREFIX)) continue;
      const uid = k.slice(PREFIX.length);
      if (isDeviceFallbackSanctuaryKey(uid)) ids.push(uid);
    }
  } catch {
    /* ignore */
  }
  return ids;
}

export function isDeviceFallbackSanctuaryKey(id: string): boolean {
  return id.startsWith("local-") || id.startsWith("mem-");
}

function dispatchUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("parable:sanctuary-posts-updated"));
  }
}

export function loadSanctuaryPosts(userId: string): SanctuaryPost[] {
  if (typeof window === "undefined" || !userId.trim()) return [];
  try {
    const raw = localStorage.getItem(keyForUser(userId));
    return parsePosts(raw);
  } catch {
    return [];
  }
}

export async function loadSanctuaryPostsAsync(userId: string): Promise<SanctuaryPost[]> {
  if (typeof window === "undefined" || !userId.trim()) return [];
  const k = keyForUser(userId);
  const fromLs = parsePosts(localStorage.getItem(k));
  if (fromLs.length > 0) return fromLs;
  const fromIdb = parsePosts(await idbGet(k));
  if (fromIdb.length > 0) return fromIdb;
  try {
    return parsePosts(sessionStorage.getItem(k));
  } catch {
    return [];
  }
}

async function mergeOrphanFallbackBucketsInto(accountUserId: string): Promise<void> {
  const candidates = new Set<string>();
  for (const id of collectFallbackIds((i) => localStorage.key(i), localStorage.length)) {
    candidates.add(id);
  }
  for (const id of collectFallbackIds((i) => sessionStorage.key(i), sessionStorage.length)) {
    candidates.add(id);
  }
  try {
    const d = localStorage.getItem(DEVICE_FALLBACK_KEY);
    if (d && isDeviceFallbackSanctuaryKey(d)) candidates.add(d);
  } catch {
    /* ignore */
  }
  for (const k of await idbListAllKeys()) {
    if (!k.startsWith(PREFIX)) continue;
    const uid = k.slice(PREFIX.length);
    if (isDeviceFallbackSanctuaryKey(uid)) candidates.add(uid);
  }

  for (const fromId of candidates) {
    if (!fromId.trim() || fromId === accountUserId) continue;
    const chunk = await loadSanctuaryPostsAsync(fromId);
    if (chunk.length === 0) continue;
    await mergeSanctuaryPostsStorage(fromId, accountUserId);
  }
}

export async function loadSanctuaryPostsAsyncWithRecovery(accountUserId: string): Promise<SanctuaryPost[]> {
  if (!accountUserId.trim()) return [];
  let primary = await loadSanctuaryPostsAsync(accountUserId);
  if (primary.length > 0) return primary;

  let deviceId: string | null = null;
  try {
    deviceId = window.localStorage.getItem(DEVICE_FALLBACK_KEY);
  } catch {
    /* ignore */
  }
  if (deviceId && deviceId !== accountUserId) {
    const orphan = await loadSanctuaryPostsAsync(deviceId);
    if (orphan.length > 0) {
      const ok = await mergeSanctuaryPostsStorage(deviceId, accountUserId);
      if (ok) primary = await loadSanctuaryPostsAsync(accountUserId);
    }
  }

  if (primary.length > 0) return primary;

  await mergeOrphanFallbackBucketsInto(accountUserId);
  return loadSanctuaryPostsAsync(accountUserId);
}

export async function clearSanctuaryPostsStorage(userId: string): Promise<void> {
  if (typeof window === "undefined" || !userId.trim()) return;
  const k = keyForUser(userId);
  try {
    localStorage.removeItem(k);
  } catch {
    /* ignore */
  }
  try {
    sessionStorage.removeItem(k);
  } catch {
    /* ignore */
  }
  await idbDelete(k);
}

export async function mergeSanctuaryPostsStorage(fromUserId: string, toUserId: string): Promise<boolean> {
  if (!fromUserId.trim() || !toUserId.trim() || fromUserId === toUserId) return true;
  const from = await loadSanctuaryPostsAsync(fromUserId);
  if (from.length === 0) {
    await clearSanctuaryPostsStorage(fromUserId);
    return true;
  }
  const to = await loadSanctuaryPostsAsync(toUserId);
  const map = new Map<string, SanctuaryPost>();
  for (const p of to) map.set(p.id, p);
  for (const p of from) map.set(p.id, p);
  const merged = Array.from(map.values())
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 80);
  if (!(await saveSanctuaryPostsAsync(toUserId, merged)).ok) return false;
  await clearSanctuaryPostsStorage(fromUserId);
  dispatchUpdated();
  return true;
}

export function saveSanctuaryPosts(userId: string, posts: SanctuaryPost[]): boolean {
  if (typeof window === "undefined" || !userId.trim()) return false;
  const k = keyForUser(userId);
  const run = () => {
    try {
      const json = JSON.stringify(posts);
      localStorage.setItem(k, json);
      dispatchUpdated();
    } catch {
      /* ignore */
    }
  };
  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(run, { timeout: 2000 });
  } else {
    setTimeout(run, 0);
  }
  return true;
}

export type SanctuarySaveResult = {
  ok: boolean;
  backend: "localStorage" | "indexedDB" | "sessionStorage" | "none";
  reason?: "quota" | "unavailable" | "serialize" | "unknown";
};

function isQuotaDomError(e: unknown): boolean {
  return e instanceof DOMException && (e.name === "QuotaExceededError" || e.code === 22);
}

function isStorageUnavailableError(e: unknown): boolean {
  return e instanceof DOMException && (e.name === "SecurityError" || e.name === "InvalidAccessError");
}

export type SaveSanctuaryPostsOptions = {
  notifyListeners?: boolean;
  deferPersistence?: boolean;
};

export const SANCTUARY_POST_IMAGE_MAX_BYTES = 500 * 1024;

function approxDataUrlDecodedBytes(dataUrl: string): number {
  const comma = dataUrl.indexOf(",");
  if (comma < 0) return 0;
  const b64 = dataUrl.slice(comma + 1).replace(/\s/g, "");
  return Math.floor((b64.length * 3) / 4);
}

export async function enforceSanctuaryImageDataUrlMaxBytes(
  dataUrl: string,
  maxBytes = SANCTUARY_POST_IMAGE_MAX_BYTES,
): Promise<string | null> {
  if (!dataUrl.startsWith("data:image/")) return null;
  let current = dataUrl;
  if (approxDataUrlDecodedBytes(current) <= maxBytes) return current;

  const steps: { dim: number; q: number }[] = [
    { dim: 960, q: 0.72 },
    { dim: 800, q: 0.66 },
    { dim: 640, q: 0.6 },
    { dim: 512, q: 0.55 },
    { dim: 420, q: 0.5 },
    { dim: 360, q: 0.45 },
    { dim: 320, q: 0.42 },
  ];
  for (const { dim, q } of steps) {
    const shrunk = await shrinkDataUrlForStorage(current, dim, q);
    if (shrunk) current = shrunk;
    if (approxDataUrlDecodedBytes(current) <= maxBytes) return current;
  }
  return approxDataUrlDecodedBytes(current) <= maxBytes ? current : null;
}

export function runDeferredStorageWork<T>(fn: () => T | Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const run = () => {
      Promise.resolve()
        .then(fn)
        .then(resolve)
        .catch(reject);
    };
    if (typeof requestIdleCallback !== "undefined") {
      requestIdleCallback(run, { timeout: 2500 });
    } else {
      setTimeout(run, 0);
    }
  });
}

export async function saveSanctuaryPostsAsync(
  userId: string,
  posts: SanctuaryPost[],
  options?: SaveSanctuaryPostsOptions,
): Promise<SanctuarySaveResult> {
  if (typeof window === "undefined" || !userId.trim()) {
    return { ok: false, backend: "none", reason: "unavailable" };
  }
  const notify = options?.notifyListeners !== false;
  const deferPersistence = options?.deferPersistence !== false;
  const k = keyForUser(userId);

  const persist = (): Promise<SanctuarySaveResult> => {
    return new Promise((resolve) => {
      const schedule =
        typeof requestIdleCallback !== "undefined"
          ? (cb: () => void) => requestIdleCallback(cb, { timeout: 2500 })
          : (cb: () => void) => setTimeout(cb, 0);

      schedule(() => {
        void (async () => {
          let json: string;
          try {
            json = JSON.stringify(posts);
          } catch {
            resolve({ ok: false, backend: "none", reason: "serialize" });
            return;
          }

          try {
            localStorage.setItem(k, json);
            if (notify) dispatchUpdated();
            void idbSet(k, json).catch(() => {});
            resolve({ ok: true, backend: "localStorage" });
          } catch (eFirst) {
            let sawQuota = isQuotaDomError(eFirst);
            const idbOk = await idbSet(k, json);
            if (idbOk) {
              if (notify) dispatchUpdated();
              resolve({ ok: true, backend: "indexedDB" });
              return;
            }
            try {
              sessionStorage.setItem(k, json);
              if (notify) dispatchUpdated();
              resolve({ ok: true, backend: "sessionStorage" });
            } catch (eSess) {
              if (isQuotaDomError(eSess)) sawQuota = true;
              if (sawQuota) resolve({ ok: false, backend: "none", reason: "quota" });
              else if (isStorageUnavailableError(eFirst) || isStorageUnavailableError(eSess)) {
                resolve({ ok: false, backend: "none", reason: "unavailable" });
              } else {
                resolve({ ok: false, backend: "none", reason: "unknown" });
              }
            }
          }
        })();
      });
    });
  };

  if (deferPersistence) {
    return runDeferredStorageWork(persist);
  }
  return persist();
}

export function shrinkDataUrlForStorage(
  dataUrl: string,
  maxDim = 960,
  quality = 0.72,
): Promise<string | null> {
  if (typeof window === "undefined" || !dataUrl.startsWith("data:image/")) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
        const w = Math.max(1, Math.round(img.naturalWidth * scale));
        const h = Math.max(1, Math.round(img.naturalHeight * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

export async function compressImageToDataUrl(file: File, maxDim = 1024, quality = 0.72): Promise<string | null> {
  if (typeof window === "undefined") return null;
  let candidate: string | null = null;
  try {
    const imageCompression = (await import("browser-image-compression")).default;
    const compressed = await imageCompression(file, {
      maxSizeMB: 0.48,
      maxWidthOrHeight: maxDim,
      useWebWorker: true,
      initialQuality: quality,
      fileType: "image/jpeg",
    });
    candidate = await new Promise<string | null>((resolve) => {
      const fr = new FileReader();
      fr.onload = () => resolve(typeof fr.result === "string" && fr.result.startsWith("data:image/") ? fr.result : null);
      fr.onerror = () => resolve(null);
      fr.readAsDataURL(compressed);
    });
  } catch {
    /* fall through */
  }
  if (!candidate) return null;
  return enforceSanctuaryImageDataUrlMaxBytes(candidate, SANCTUARY_POST_IMAGE_MAX_BYTES);
}
