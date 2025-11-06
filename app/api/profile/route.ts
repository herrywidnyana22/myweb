import { NextResponse } from 'next/server';

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const API_KEY = process.env.GEMINI_API_KEY!;

const RANGE = 'profile!A2:I';

export async function GET() {
  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
    );

    if (!res.ok) throw new Error('Failed to fetch Google Sheet data');

    const data = await res.json();
    const rows = data.values || [];

    const profile = rows.map((row: string[]) => ({
      type: row[0],
      name: row[1],
      fullName: row[2],
      jenisKelamin: row[3],
      role: row[4],
      summary: row[5],
      image: row[6],
      birth: { place: row[7], date: row[8] },
    }));

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile data' },
      { status: 500 }
    );
  }
}
