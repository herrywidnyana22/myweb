import { NextResponse } from 'next/server';

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const API_KEY = process.env.GEMINI_API_KEY!;

const RANGE = 'highlight!A2:B';

export async function GET() {
  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
    );

    if (!res.ok) throw new Error('Failed to fetch Google Sheet data');

    const data = await res.json();
    const rows = data.values || [];

    const highlight = rows.map((row: string[]) => ({
      title: row[0],
      label: row[1],
    }));

    return NextResponse.json(highlight);
  } catch (error) {
    console.error('Error fetching highlight:', error);
    return NextResponse.json(
      { error: 'Failed to fetch highlight data' },
      { status: 500 }
    );
  }
}
