import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import projects from '@/app/data/projects.json';
import profile from '@/app/data/profile.json';
import address from '@/app/data/address.json';
import contacts from '@/app/data/contacts.json';
import educations from '@/app/data/educations.json';
import experiences from '@/app/data/experiences.json';
import { buildPrompt } from '@/constants/promptTemplate';

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const prompt = buildPrompt({message, profile, address, projects, contacts, educations, experiences});

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are developer. Your name is Herry.',
      },
    });

    // Ambil raw text
    let responseText = response.text ?? '';

    // Normalisasi output model: hapus pembungkus yang umum (markdown/HTML)
    responseText = responseText
      // strip fenced code blocks
      .replace(/```json|```/g, '')
      // strip possible HTML code/pre wrappers
      .replace(/<\/?(pre|code)[^>]*>/gi, '')
      // strip leading labels like "Bot" or similar
      .replace(/^\s*Bot\s*/i, '')
      .trim();

    // Usahakan ekstrak objek JSON pertama bila ada noise di sekitarnya
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    let data;
    try {
      if (jsonMatch) {
        data = JSON.parse(jsonMatch[0]);
      } else {
        data = JSON.parse(responseText);
      }
    } catch (err) {
      console.error('JSON parse error:', err, responseText);
      // fallback: kirim sebagai text polos
      data = { text: responseText, cards: [] };
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
