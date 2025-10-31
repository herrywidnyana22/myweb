import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { buildPrompt } from '@/constants/promptTemplate';

import projects from '@/app/data/projects.json';
import profile from '@/app/data/profile.json';
import address from '@/app/data/address.json';
import contacts from '@/app/data/contacts.json';
import educations from '@/app/data/educations.json';
import experiences from '@/app/data/experiences.json';

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Build prompt
    const prompt = buildPrompt({
      message,
      profile,
      address,
      projects,
      contacts,
      educations,
      experiences,
    });

    // Generate AI content
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let rawText = response.text ?? '';

    // Bersihkan pembungkus umum (markdown, code, HTML, label Bot)
    rawText = rawText
      .replace(/```json|```/g, '')
      .replace(/<\/?(pre|code)[^>]*>/gi, '')
      .replace(/^\s*Bot\s*/i, '')
      .trim();

    // Parsing JSON pertama yang valid
    let data: { text: string; cards: any[] } = { text: '', cards: [] };
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        data.text = parsed.text ?? '';
        data.cards = Array.isArray(parsed.cards) ? parsed.cards : [];
      } else {
        // fallback jika bukan JSON
        data.text = rawText;
        data.cards = [];
      }
    } catch (err) {
      console.error('JSON parse error:', err, rawText);
      data.text = rawText;
      data.cards = [];
    }

    // Pastikan setiap card punya type
    data.cards = data.cards.map((card: any) => {
      if (!card.type) {
        // bisa menebak type berdasarkan properti unik
        if ('progressValue' in card) card.type = 'project';
        else if ('school' in card) card.type = 'education';
        else if ('company' in card) card.type = 'experience';
        else if ('address' in card) card.type = 'address';
        else card.type = 'default';
      }
      return card;
    });

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
