export function getLS<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setLS(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}
