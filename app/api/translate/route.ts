// app/api/translate/route.ts
import { runTranslateAI } from "@/lib/runTranslateAI";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { targetLanguage } = body as { targetLanguage?: string };

    if (targetLanguage !== "en") {
      return NextResponse.json({ error: "Only 'en' supported" }, { status: 400 });
    }

    const translated = await runTranslateAI("en");

    return NextResponse.json(translated, { status: 200 });
  } catch (err) {
    console.error("Translate API error:", err);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
