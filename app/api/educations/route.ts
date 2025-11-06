import { safeParseJSON } from '@/utils';
import { NextResponse } from 'next/server';

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const API_KEY = process.env.GEMINI_API_KEY!;

const RANGE = 'educations!A2:F';

export async function GET() {
  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
    );

    if (!res.ok) throw new Error('Failed to fetch Google Sheet data');

    const data = await res.json();
    const rows = data.values || [];

    const educations = rows.map((row: string[]) => ({
      type: row[0],
      school: row[1],
      major: row[2],
      year: row[3],
      icon: row[4],
      subIcon: row[5],
    }));

    return NextResponse.json(educations);
  } catch (error) {
    console.error('Error fetching educations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch educations data' },
      { status: 500 }
    );
  }
}
