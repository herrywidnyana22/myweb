// utils/getChange.ts

/**
 * 🧊 Save to localStorage
 */
export function setLS(key: string, value: any) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * 🔍 Read from localStorage
 */
export function getLS<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * 🕒 TTL Cache for Google Sheets
 */
export function setCache(key: string, value: any) {
  if (typeof window === "undefined") return;
  const wrapper = {
    value,
    updatedAt: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(wrapper));
}

export function getCache<T>(key: string, ttl: number): T | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    const age = Date.now() - parsed.updatedAt;

    if (age > ttl) return null;

    return parsed.value as T;
  } catch {
    return null;
  }
}

/**
 * 🔥 TTL for translate (universal)
 */
export function markUpdated(key: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${key}__updated`, String(Date.now()));
}

export function isExpired(key: string, ttl: number) {
  if (typeof window === "undefined") return true;

  const raw = localStorage.getItem(`${key}__updated`);
  if (!raw) return true;

  const updated = Number(raw);
  return Date.now() - updated > ttl;
}
