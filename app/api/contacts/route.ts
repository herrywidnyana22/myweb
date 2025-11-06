import { NextResponse } from 'next/server';

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const API_KEY = process.env.GEMINI_API_KEY!;

const RANGE = 'contacts!A2:E';

export async function GET() {
  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
    );

    if (!res.ok) throw new Error('Failed to fetch Google Sheet data');

    const data = await res.json();
    const rows = data.values || [];
    
    const contacts = rows.map((row: string[]) => ({
      type: row[0],
      title: row[1],
      description: row[2],
      icon: row[3],
      href: row[4],
    }));

    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact data' },
      { status: 500 }
    );
  }
}
