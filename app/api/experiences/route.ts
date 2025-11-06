import { NextResponse } from 'next/server';

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const API_KEY = process.env.GEMINI_API_KEY!;

const RANGE = 'experiences!A2:H';

export async function GET() {
  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
    );

    if (!res.ok) throw new Error('Failed to fetch Google Sheet data');

    const data = await res.json();
    const rows = data.values || [];

    const experiences = rows.map((row: string[]) => ({
      type: row[0],
      company: row[1],
      role: row[2],
      location: row[3],
      year: row[4],
      jobdesk: row[5],
      description: row[6],
      icon: row[7]
    }));

    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiences data' },
      { status: 500 }
    );
  }
}
