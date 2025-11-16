import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { translationDataRules } from "@/constants/promptRule";

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { key, data, target } = await req.json();

    const prompt = `
      Terjemahkan field text berikut ke bahasa ${target}.
      Gunakan aturan berikut:

      ${translationDataRules}

      Berikut data yang harus diterjemahkan (format JSON):
      ${JSON.stringify(data, null, 2)}
    `.trim();

    const result = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const output = result.text;
    const clean = output?.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean || '');

    return NextResponse.json({
      translated: parsed,
    });
  } catch (err) {
    console.error("Translate API Error:", err);
    return NextResponse.json({ error: "Translate failed" }, { status: 500 });
  }
}
