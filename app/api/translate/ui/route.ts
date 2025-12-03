import { translationUIRules } from "@/lib/constants/promptRule";
import { generatePrompt } from "@/lib/gemini/generatePrompt";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const { base, target } = await req.json();

    const prompt = `
        ${translationUIRules}
        Translate UI text only to: ${target}
        Return ONLY JSON.
        ${JSON.stringify(base, null, 2)}
    `;

    const result = await generatePrompt(prompt)

    const output = result || '';
    const clean = output?.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean || '');

    return NextResponse.json({ translated: parsed });
  } catch (err) {
    console.error("Translate UI Error:", err);
    return NextResponse.json({ error: "Translate UI failed" }, { status: 500 });
  }
}
