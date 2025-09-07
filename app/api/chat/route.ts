import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import projects from '@/app/data/projects.json';
import profile from '@/app/data/profile.json';
import { buildPrompt } from '@/constants/promptTemplate';

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const prompt = buildPrompt(message, projects, profile);

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      // config: {
      //   systemInstruction: 'You are developer. Your name is Herry Widnyana.',
      // },
    });

    // Ambil raw text
    let responseText = response.text ?? '';

    // Bersihkan kalau masih ada ```json atau ```
    responseText = responseText.replace(/```json|```/g, '').trim();

    // Coba parse ke JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (err) {
      console.error('JSON parse error:', err, responseText);
      data = { text: responseText, cards: [] };
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
