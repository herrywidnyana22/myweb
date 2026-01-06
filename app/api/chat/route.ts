import { NextResponse } from 'next/server';
import { buildPrompt } from '@/lib/constants/promptTemplate';
import { sendToTelegram } from '@/lib/telegram/telegram-server';
import { sanitizeJSON } from '@/lib/utils';
import { generatePrompt } from '@/lib/gemini/generatePrompt';
import prisma from '@/lib/prisma';

let cachedPortfolio: PortfolioCache;
const CACHE_TTL_MS = 1000 * 60 * 10; // 10 menit

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
     const { message, memory, history, language, chatMode, actionMode } = (await req.json()) as {
      message: string;
      memory?: Record<string, string>;
      history?: { role: string; text: string }[];
      language: UILanguage,
      chatMode: ChatMode
      actionMode: Action
    }

    const now = Date.now();
    if (!cachedPortfolio || now - cachedPortfolio.timestamp > CACHE_TTL_MS) {
      // Query database dengan Prisma (jauh lebih efisien dari fetchSheetData)
      const [profiles, projects, contacts, educations, experiences] = await Promise.all([
        prisma.profile.findMany({
          include: { items: true },
          orderBy: { createdAt: 'asc' }
        }),
        prisma.project.findMany({
          include: { 
            entries: true,
            category: true 
          },
          orderBy: { name: 'asc' }
        }),
        prisma.contact.findMany({
          include: { category: true },
          orderBy: { title: 'asc' }
        }),
        prisma.education.findMany({
          include: { 
            category: true 
          },
          orderBy: { startYear: 'desc' }
        }),
        prisma.experience.findMany({
          include: { 
            category: true 
          },
          orderBy: { start: 'desc' }
        }),
      ]);

      const firstProfile = profiles[0] || null

      // Transform ke format yang dibutuhkan prompt
      cachedPortfolio = { 
        profile: firstProfile as Profile,
        // Address sudah bagian dari Profile model (address, lat, lng, mapURL)
        address: firstProfile 
          ? {
              address: firstProfile.address,
              lat: firstProfile.lat,
              lng: firstProfile.lng,
              mapURL: firstProfile.mapURL,
            } as Address 
          : null, 
        projects: projects as Project[],
        contacts: contacts as DefaultCardData[],
        educations: educations as Education[],
        experiences: experiences as Experience[],
        timestamp: now,
      };
    }

    const lastMessages = history?.slice(-4) || []; // ambil 4 pesan terakhir

    const contextText = lastMessages
      .map((m) => `${m.role === 'user' ? 'User' : 'AI'}: ${m.text}`)
      .join('\n');

    // Tambahkan memory ke prompt
    const prompt = buildPrompt({
      message: `${contextText}\nUser: ${message}`,
      memory,
      profile: cachedPortfolio.profile,
      address: cachedPortfolio.address,
      projects: cachedPortfolio.projects,
      contacts: cachedPortfolio.contacts,
      educations: cachedPortfolio.educations,
      experiences: cachedPortfolio.experiences,
      language,
      chatMode,
      action: actionMode
    })

    if (chatMode === "telegram") {
      // Kirim pesan user ke Herry via Telegram
      await sendToTelegram(message);
      
      return NextResponse.json(
        { 
          role: '',
          text: message, 
          cards: [] 
        }
      );
    }

    const response = await generatePrompt(prompt)
    const rawText = response || '';
    const cleanText = sanitizeJSON(rawText);

    let parsed: AIResponse | null = null;
    const data: AIResponse = { text: '', cards: [] };

    try {
      parsed = JSON.parse(cleanText) as AIResponse;
    } catch {
      const match = cleanText.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(sanitizeJSON(match[0]));
      }
    }

    data.text = parsed?.text ?? cleanText;
    data.cards = Array.isArray(parsed?.cards)
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
