

// export function safeParseJSON(value: string | undefined) {
//   if (!value) return [];
//   try {
//     return JSON.parse(value);
//   } catch {
//     console.warn('Invalid JSON in Google Sheet cell:', value);
//     return [];
//   }
// }

export const getColor = (value: number) => {
  if (value > 80) return '#059669' // bg-emerald-600
  if (value > 50) return '#EA580C' // bg-orange-600
  return '#E11D48'                 // bg-rose-600
}

// Helper untuk rapikan JSON
export function sanitizeJSON (raw: string): string {
  if (!raw) return '{}';
  let text = raw
    .replace(/```json|```/gi, '')
    .replace(/<\/?(pre|code)[^>]*>/gi, '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/[“”‘’]/g, '"')
    .replace(/,\s*([}\]])/g, '$1')
    .trim()

  text = text.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')

  const match = text.match(/\{[\s\S]*\}/)
  if (match) text = match[0]
  
  return text;
}


// ===============================
// STRICT JSON PARSER (untuk /api/translate)
// ===============================
export function safeParseJSONStrict(raw: string) {
  if (!raw) return null;

  // bersihkan Markdown / formatting
  let clean = raw
    .replace(/```json|```/gi, "")
    .replace(/<\/?(pre|code)[^>]*>/gi, "")
    .replace(/[“”‘’]/g, '"')
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s{2,}/g, " ");

  // ekstrak blok { ... }
  const match = clean.match(/\{[\s\S]*\}/);
  if (!match) return null;

  let jsonString = match[0];

  // Perbaiki trailing comma dan missing quotes
  jsonString = jsonString
    .replace(/,\s*([}\]])/g, "$1")
    .replace(/([{,]\s*)([A-Za-z0-9_]+)\s*:/g, '$1"$2":');

  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.warn("safeParseJSONStrict() failed:", e);
    return null;
  }
}


// utils/parseHelpers.ts
export function safeParseJSON<T = any>(value: string | undefined, fallback: T = [] as unknown as T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    try {
      const fixed = value
        .replace(/[\r\n]+/g, " ")
        .replace(/,\s*([}\]])/g, "$1")
        .replace(/([{,]\s*)([A-Za-z0-9_]+)\s*:/g, '$1"$2":');
      return JSON.parse(fixed) as T;
    } catch (e) {
      console.warn("safeParseJSON failed:", e);
      return fallback;
    }
  }
}

/** parse rows to string array safely */
export function safeParseRowsCell(cell: string | undefined) {
  if (!cell) return "";
  return cell;
}


