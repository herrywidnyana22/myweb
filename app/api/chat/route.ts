import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { buildPrompt } from '@/constants/promptTemplate';
import { fetchSheetData } from '@/lib/fetchData';

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Cache sederhana
let cachedPortfolio: PortfolioCache | null = null;
const CACHE_TTL_MS = 1000 * 60 * 10; // 10 menit

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Ambil data (pakai cache biar cepat)
    const now = Date.now();
    if (!cachedPortfolio || now - cachedPortfolio.timestamp > CACHE_TTL_MS) {
      const [profile, address, projects, contacts, educations, experiences] = await Promise.all([
        fetchSheetData<ProfileProps>('profile'),
        fetchSheetData<AddressProps>('address'),
        fetchSheetData<ProjectProps>('projects'),
        fetchSheetData<ContactProps>('contacts'),
        fetchSheetData<EducationProps>('educations'),
        fetchSheetData<ExperienceProps>('experiences'),
      ]);

      cachedPortfolio = {
        profile: Array.isArray(profile) ? profile[0] : profile,
        address: Array.isArray(address) ? address[0] : address,
        projects,
        contacts,
        educations,
        experiences,
        timestamp: now,
      };
    }

    // Siapkan prompt sesuai aturan kamu
    const prompt = buildPrompt({
      message,
      profile: cachedPortfolio.profile,
      address: cachedPortfolio.address,
      projects: cachedPortfolio.projects,
      contacts: cachedPortfolio.contacts,
      educations: cachedPortfolio.educations,
      experiences: cachedPortfolio.experiences,
    });

    // Kirim prompt ke Gemini dan stream hasilnya
    const response = await client.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const encoder = new TextEncoder();
    let buffer = '';
    let cards: DataItemProps[] = [];

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const piece = chunk?.text ?? '';
          if (!piece) continue;

          buffer += piece;

          // Cek apakah sudah ada JSON lengkap
          const match = buffer.match(/\{[\s\S]*\}/);
          if (match) {
            try {
              const json = JSON.parse(match[0]);
              if (json.text) controller.enqueue(encoder.encode(json.text));
              if (json.cards) cards = json.cards;
              buffer = '';
            } catch {
              // JSON belum lengkap
            }
          }
        }
        controller.close();
      },
    });

    // kirim text stream + cards di header
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Cards': JSON.stringify(cards),
      },
    });
  } catch (err) {
    console.error('Chat stream error:', err);
    return NextResponse.json({ text: 'Terjadi kesalahan server.', cards: [] }, { status: 500 });
  }
}
