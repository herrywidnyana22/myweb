export async function fetchSheetData<T>(endpoint: string): Promise<T[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/${endpoint}`, {
      cache: 'no-store',
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
}