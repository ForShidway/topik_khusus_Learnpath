import { Redis } from "@upstash/redis";

/**
 * Singleton Upstash Redis client.
 * Konfigurasikan di .env.local:
 *   UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
 *   UPSTASH_REDIS_REST_TOKEN=AXXXxxxxxx
 */

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.warn(
    "[Redis] UPSTASH_REDIS_REST_URL atau UPSTASH_REDIS_REST_TOKEN belum diset di .env.local — Redis caching dinonaktifkan."
  );
}

// Buat singleton agar tidak ada multiple client di hot-reload Next.js
declare global {
  // eslint-disable-next-line no-var
  var _redisClient: Redis | null;
}

function createRedisClient(): Redis | null {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

const redis: Redis | null =
  global._redisClient ?? createRedisClient();

if (process.env.NODE_ENV !== "production") {
  global._redisClient = redis;
}

export default redis;

// ── Helper: cache-get-or-set ─────────────────────────────────────────
/**
 * Ambil data dari cache Redis. Jika tidak ada, jalankan `fetcher`,
 * simpan hasilnya ke cache, lalu kembalikan.
 *
 * @param key   Kunci cache Redis
 * @param ttl   Waktu expired dalam detik (default: 60 detik)
 * @param fetcher  Fungsi async yang mengambil data dari sumber asli
 */
export async function getCached<T>(
  key: string,
  ttl: number = 60,
  fetcher: () => Promise<T>
): Promise<T> {
  if (!redis) {
    // Jika Redis tidak tersedia, langsung ambil dari sumber asli
    return fetcher();
  }

  try {
    const cached = await redis.get<T>(key);
    if (cached !== null && cached !== undefined) {
      return cached;
    }
  } catch (err) {
    console.error("[Redis] Gagal membaca cache:", err);
  }

  const fresh = await fetcher();

  try {
    await redis.set(key, JSON.stringify(fresh), { ex: ttl });
  } catch (err) {
    console.error("[Redis] Gagal menyimpan cache:", err);
  }

  return fresh;
}

// ── Helper: hapus satu atau banyak key ──────────────────────────────
export async function invalidateCache(...keys: string[]): Promise<void> {
  if (!redis || keys.length === 0) return;
  try {
    await redis.del(...keys);
  } catch (err) {
    console.error("[Redis] Gagal menghapus cache:", err);
  }
}
