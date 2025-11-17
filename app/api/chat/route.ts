import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { buildPrompt } from '@/constants/promptTemplate';
import { fetchSheetData } from '@/lib/fetchData';
import { sendToTelegram } from '@/lib/telegram/telegram-server';
import { sanitizeJSON } from '@/utils';
import { generatePrompt } from '@/lib/gemini/generatePrompt';

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
let cachedPortfolio: PortfolioCache | null = null;
const CACHE_TTL_MS = 1000 * 60 * 10;

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
