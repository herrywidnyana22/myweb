import { safeParseJSON } from '@/utils';
import { NextResponse } from 'next/server';

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const API_KEY = process.env.GEMINI_API_KEY!;

const RANGE = 'projects!A2:H';

export async function GET() {
  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
    );

    if (!res.ok) throw new Error('Failed to fetch Google Sheet data');

    const data = await res.json();
    const rows = data.values || [];

    const projects = rows.map((row: string[]) => ({
      type: row[0],
      title: row[1],
      description: row[2],
      icon: row[3],
      iconCategory: safeParseJSON(row[4]),
      progressValue: Number(row[5] || 0),
      demoLink: row[6],
      githubLink: row[7]
    }));

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects data' },
      { status: 500 }
    );
  }
}
