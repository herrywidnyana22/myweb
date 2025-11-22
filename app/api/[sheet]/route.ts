import { safeParseJSON } from "@/utils";
import { NextResponse } from "next/server";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const API_KEY = process.env.GEMINI_API_KEY!;

const SHEET_MAP: Record<string, string> = {
  contacts: "contacts!A1:E",
  projects: "projects!A1:H",
  experiences: "experiences!A1:H",
  educations: "educations!A1:F",
  profile: "profile!A1:I",
  address: "address!A1:E",
  highlight: "highlight!A1:C",
};

export async function GET(
  req: Request,
  context: { params: Promise<{ sheet: string }> }
) {
  try {
    const { sheet } = await context.params;

    if (!sheet || !(sheet in SHEET_MAP)) {
      return NextResponse.json({ error: "Invalid sheet" }, { status: 400 });
    }

    const range = SHEET_MAP[sheet];
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) {
      const errText = await res.text();
      console.error("Sheets error:", errText);
      return NextResponse.json({ error: "Sheet fetch failed" }, { status: 500 });
    }

    const data = await res.json();
    const rows: string[][] = data.values || [];

    if (rows.length < 2) return NextResponse.json([]);

    const header = rows[0];

    const formatted = rows.slice(1).map((row) => {
      const obj: Record<string, unknown> = {}; // FIXED: no any

      header.forEach((key, i) => {
        const value = row[i];

        // Auto JSON parse for array or object
        if (
          typeof value === "string" &&
          (value.startsWith("[") || value.startsWith("{"))
        ) {
          obj[key] = safeParseJSON(value);
        } else {
          obj[key] = value ?? "";
        }
      });

      return obj;
    });

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("API ERROR:", err);
    return NextResponse.json(
      { error: "Server failed" },
      { status: 500 }
    );
  }
}
