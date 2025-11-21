import { NextResponse } from "next/server";
import { translationDataRules } from "@/constants/promptRule";
import { generatePrompt } from "@/lib/gemini/generatePrompt";

export async function POST(req: Request) {
  try {
    const { data, target } = await req.json();

    const prompt = `
      Terjemahkan field text berikut ke bahasa ${target}.
      Gunakan aturan berikut:

      ${translationDataRules}

      Berikut data yang harus diterjemahkan (format JSON):
      ${JSON.stringify(data, null, 2)}
    `.trim();

    const result = await generatePrompt(prompt)

    const output = result || ''
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
