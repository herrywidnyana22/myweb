import { readdir } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    const files = await readdir(imagesDir);
    const images = files.map(f => `/images/${f}`);
    return NextResponse.json(images);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read images' }, { status: 500 });
  }
}
