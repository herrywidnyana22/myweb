import { NextResponse } from 'next/server';

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const API_KEY = process.env.GEMINI_API_KEY!;

const RANGE = 'address!A2:E';

export async function GET() {
  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
    );

    if (!res.ok) throw new Error('Failed to fetch Google Sheet data');

    const data = await res.json();
    const rows = data.values || [];

    const address = rows.map((row: string[]) => ({
      type: row[0],
      address: row[1],
      lat: row[2],
      lng: row[3],
      mapUrl: row[4],
    }));

    return NextResponse.json(address);
  } catch (error) {
    console.error('Error fetching address:', error);
    return NextResponse.json(
      { error: 'Failed to fetch address data' },
      { status: 500 }
    );
  }
}
