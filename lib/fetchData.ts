interface CacheEntry<T> {
  data: T[];
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

const CACHE_TTL_MS = 1000 * 60 * 10; // 10 menit

export async function fetchSheetData<T>(sheetName: string): Promise<T[]> {
  const cached = cache.get(sheetName);
  const now = Date.now();

  // Jika cache masih valid dan isinya sesuai tipe
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data as T[];
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${sheetName}`, {
    next: { revalidate: 600 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${sheetName}`);
  }

  const data = (await res.json()) as T[];
  cache.set(sheetName, { data, timestamp: now });
  return data;
}
