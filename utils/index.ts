

export function safeParseJSON(value: string | undefined) {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    console.warn('Invalid JSON in Google Sheet cell:', value);
    return [];
  }
}

export const getColor = (value: number) => {
  if (value > 80) return '#059669' // bg-emerald-600
  if (value > 50) return '#EA580C' // bg-orange-600
  return '#E11D48'                 // bg-rose-600
};


