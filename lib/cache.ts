// lib/cache.ts
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour for localStorage

export function readCache<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const { data, timestamp } = JSON.parse(item);
    const now = Date.now();

    // Check if cache has expired
    if (now - timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(key);
      return null;
    }

    return data as T;
  } catch (error) {
    console.error(`Error reading cache for key "${key}":`, error);
    return null;
  }
}

export function writeCache<T>(key: string, data: T): void {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.error(`Error writing cache for key "${key}":`, error);
  }
}
