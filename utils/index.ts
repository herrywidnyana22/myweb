import { LANGUAGE_COUNTRY_MAP } from "@/constants/languageCountry";

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


// Helper untuk rapikan JSON
export function sanitizeJSON(raw: string): string {
  if (!raw) return '{}';
  let text = raw
    .replace(/```json|```/gi, '')
    .replace(/<\/?(pre|code)[^>]*>/gi, '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/[“”‘’]/g, '"')
    .replace(/,\s*([}\]])/g, '$1')
    .trim();

  text = text.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
  const match = text.match(/\{[\s\S]*\}/);
  if (match) text = match[0];
  return text;
}

/** Safely extract JSON object from dirty LLM text */
export function safeJson(raw: string) {
  if (!raw) throw new Error("Empty AI response");

  let txt = raw.trim();

  // Remove Markdown ```json fences
  txt = txt.replace(/```json/gi, "")
           .replace(/```/g, "")
           .trim();

  // Extract JSON object only
  const match = txt.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in AI output");

  const jsonString = match[0];

  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("Safe JSON parse failed:", err, "\nRAW:", jsonString);
    throw new Error("Invalid JSON from AI");
  }
}

export function languageToFlagCode(lang: string): string {
  if (!lang) return "unknown";

  lang = lang.toLowerCase();

  // Case: en-US, zh-CN
  if (lang.includes("-")) {
    return lang.split("-")[1].toLowerCase(); // country code langsung
  }

  // Check dictionary mapping
  if (LANGUAGE_COUNTRY_MAP[lang]) {
    return LANGUAGE_COUNTRY_MAP[lang];
  }

  // Fallback → pakai 2 huruf pertama
  return lang.slice(0, 2);
}





