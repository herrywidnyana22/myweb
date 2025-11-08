// lib/fetchData.ts
import { getCached } from './cache';

export async function fetchSheetData<T>(endpoint: string): Promise<T[]> {
  return getCached(endpoint, async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/${endpoint}`, {
        cache: 'no-store', // tetap no-store supaya fetch ini tidak di-cache oleh Next
      });

      if (!res.ok) {
        console.error(`Failed to fetch /api/${endpoint}`, res.status);
        return [];
      }

      const data = await res.json();
      return data as T[];
    } catch (err) {
      console.error(`Error fetching /api/${endpoint}:`, err);
      return [];
    }
  });
}
