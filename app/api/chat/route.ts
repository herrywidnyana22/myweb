import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { buildPrompt } from '@/constants/promptTemplate';
import { fetchSheetData } from '@/lib/fetchData';

interface AIResponse {
  text: string
  cards: Partial<DataItemProps>[]
}

interface ApiResponse {
  text: string
  cards: DataItemProps[]
}

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
})

// Helper superkuat untuk normalisasi JSON
function sanitizeJSON(raw: string): string {
  if (!raw) return '{}'

  let text = raw
    .replace(/```json|```/gi, '') // hapus code block
    .replace(/<\/?(pre|code)[^>]*>/gi, '') // hapus tag HTML
    .replace(/[\r\n\t]+/g, ' ') // hapus newline & tab
    .replace(/\s{2,}/g, ' ') // rapikan spasi
    .replace(/[“”‘’]/g, '"') // ubah kutip miring ke kutip ganda
    .replace(/,\s*([}\]])/g, '$1') // hapus koma sebelum penutup
    .trim();

  // Tambahkan kutip ganda di key JSON yang tidak dikutip
  text = text.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');

  // Tangani kasus JSON diapit string (misalnya hasil `"{"text":"Hi"}"`)
  if (text.startsWith('"') && text.endsWith('"')) {
    text = text.slice(1, -1);
  }

  // Hapus karakter aneh non-ASCII
  text = text.replace(/[^\x20-\x7E]+/g, '');

  // Pastikan punya kurung JSON
  if (!text.startsWith('{')) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) text = match[0];
  }

  return text;
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

export async function POST(req: Request) {
  try {
    const { message } = (await req.json()) as { message: string };

    // Ambil data paralel
    const [profileData, addressData, projects, contacts, educations, experiences] =
      await Promise.all([
        fetchSheetData<ProfileProps>('profile'),
        fetchSheetData<AddressProps>('address'),
        fetchSheetData<ProjectProps>('projects'),
        fetchSheetData<ContactProps>('contacts'),
        fetchSheetData<EducationProps>('educations'),
        fetchSheetData<ExperienceProps>('experiences'),
      ]);

    const profile = Array.isArray(profileData) ? profileData[0] : profileData;
    const address = Array.isArray(addressData) ? addressData[0] : addressData;

    const prompt = buildPrompt({
      message,
      profile,
      address,
      projects,
      contacts,
      educations,
      experiences,
    });

    // Request ke Gemini
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const rawText = response.text ?? '';
    const cleanText = sanitizeJSON(rawText);

    let parsed: AIResponse | null = null;
    const data: ApiResponse = { text: '', cards: [] };

    try {
      parsed = JSON.parse(cleanText) as AIResponse;
    } catch (err) {
      console.warn('JSON parse failed once:', err);
      // Coba lagi dengan fallback regex ekstraksi isi { ... }
      const match = cleanText.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(sanitizeJSON(match[0]));
        } catch (err2) {
          console.warn('JSON parse failed twice:', err2);
        }
      }
    }

    // Fallback terakhir
    if (!parsed || typeof parsed.text !== 'string') {
      return NextResponse.json({
        text: rawText || 'Data tidak tersedia.',
        cards: [],
      });
    }

    data.text = parsed.text ?? 'Data tidak tersedia.';
    data.cards = Array.isArray(parsed.cards)
      ? parsed.cards.map(normalizeCard)
      : [];

    return NextResponse.json(data);
  } catch (err) {
    console.error('Chat API Error:', err);
    return NextResponse.json(
      { text: 'Terjadi kesalahan server.', cards: [] },
      { status: 500 }
    );
  }
}
