import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { buildPrompt } from '@/constants/promptTemplate';
import { fetchSheetData } from '@/lib/fetchData';

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

// ---------- Helpers ----------
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

    // 🔥 Ambil data langsung dari Google Sheet (via API route)
    const [profileData, addressData, projects, contacts, educations, experiences] = await Promise.all([
      fetchSheetData<any>('profile'),
      fetchSheetData<any>('address'),
      fetchSheetData<any>('projects'),
      fetchSheetData<any>('contacts'),
      fetchSheetData<any>('educations'),
      fetchSheetData<any>('experiences'),
    ]);

    // Ambil object tunggal untuk profile & address
    const profile = Array.isArray(profileData) ? profileData[0] : profileData;
    const address = Array.isArray(addressData) ? addressData[0] : addressData;

    // 🔧 Bangun prompt AI
    const prompt = buildPrompt({
      message,
      profile,
      address,
      projects,
      contacts,
      educations,
      experiences,
    });

    // 🔮 Kirim ke Gemini
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
  } catch (err) {
    console.error('Chat API Error:', err);
    return NextResponse.json(
      { text: 'Terjadi kesalahan server.', cards: [] },
      { status: 500 }
    );
  }
}
