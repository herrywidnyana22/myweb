import { translationUIRules } from "@/constants/promptRule";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { base, target } = await req.json();

    const prompt = `
        ${translationUIRules}
        Translate UI text only to: ${target}
        Return ONLY JSON.
        ${JSON.stringify(base, null, 2)}
    `;

    const result = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const output = result.text;
    const clean = output?.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean || '');

    return NextResponse.json({ translated: parsed });
  } catch (err) {
    console.error("Translate UI Error:", err);
    return NextResponse.json({ error: "Translate UI failed" }, { status: 500 });
  }
}
