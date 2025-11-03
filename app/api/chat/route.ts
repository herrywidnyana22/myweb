import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { buildPrompt } from '@/constants/promptTemplate';

import projects from '@/app/data/projects.json';
import profile from '@/app/data/profile.json';
import address from '@/app/data/address.json';
import contacts from '@/app/data/contacts.json';
import educations from '@/app/data/educations.json';
import experiences from '@/app/data/experiences.json';

// ---------- Types ----------
interface AIResponse {
  text: string;
  cards: Partial<DataItemProps>[];
}

interface ApiResponse {
  text: string;
  cards: DataItemProps[];
}

// ---------- Gemini Client ----------
const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

// ---------- Helper ----------
function sanitizeJSON(raw: string): string {
  return raw
    .replace(/```json|```/g, '')
    .replace(/<\/?(pre|code)[^>]*>/gi, '')
    .replace(/,\s*([}\]])/g, '$1')
    .replace(/[“”]/g, '"')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\\(?!["\\/bfnrtu])/g, '\\\\')
    .trim();
}

function normalizeCard(card: Partial<DataItemProps>): DataItemProps {
  let type = card.type;

  if (!type) {
    if ('progressValue' in card) type = 'project';
    else if ('school' in card) type = 'education';
    else if ('company' in card) type = 'experience';
    else if ('address' in card) type = 'address';
    else if ('href' in card) type = 'contact';
    else type = 'default';
  }

  return { ...card, type } as DataItemProps;
}

// ---------- Main Handler ----------
export async function POST(req: Request) {
  try {
    const { message } = (await req.json()) as { message: string };

    const prompt = buildPrompt({
      message,
      profile,
      address,
      projects,
      contacts,
      educations,
      experiences,
    });

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let rawText = response.text ?? '';
    rawText = sanitizeJSON(rawText);

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const data: ApiResponse = { text: '', cards: [] };

    if (jsonMatch) {
      const jsonStr = sanitizeJSON(jsonMatch[0]);

      let parsed: AIResponse | null = null;
      try {
        parsed = JSON.parse(jsonStr) as AIResponse;
      } catch (err) {
        console.warn('JSON parse error, attempting fallback:', err);
        const safe = jsonStr.replace(/[^\x20-\x7E]+/g, '');
        parsed = JSON.parse(safe) as AIResponse;
      }

      data.text = parsed.text ?? 'Data tidak tersedia.';
      data.cards = Array.isArray(parsed.cards)
        ? parsed.cards.map(normalizeCard)
        : [];
    } else {
      data.text = rawText || 'Data tidak tersedia.';
      data.cards = [];
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('API Error:', err.message);
    } else {
      console.error('Unknown API Error:', err);
    }

    const fallback: ApiResponse = {
      text: 'Terjadi kesalahan server.',
      cards: [],
    };

    return NextResponse.json(fallback, { status: 200 });
  }
}
