// lib/fetchSheetRaw.ts

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const API_KEY = process.env.GEMINI_API_KEY!;

if (!SHEET_ID || !API_KEY) {
  console.warn("Missing GOOGLE_SHEET_ID or GOOGLE_SHEETS_API_KEY");
}

export async function fetchSheetRaw(range: string) {
  if (!SHEET_ID || !API_KEY) throw new Error("Missing Google Sheets config");
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}?key=${API_KEY}`;
//    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Google Sheets fetch failed ${res.status} ${txt}`);
  }
  const json = await res.json();
  const rows: string[][] = json.values || [];
  return rows;
}
