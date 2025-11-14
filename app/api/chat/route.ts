// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { buildPrompt } from "@/constants/promptTemplate";
import { safeGenerateContent } from "@/lib/aiClient";
import { fetchSheetData } from "@/lib/fetchSheetData";
import { sanitizeJSON } from "@/utils";

function normalizeCard(card: Partial<DataItemProps>): DataItemProps {
  let type = (card as any).type;
  if (!type) {
    if ("progressValue" in card) type = "project";
    else if ("school" in card) type = "education";
    else if ("company" in card) type = "experience";
    else if ("address" in card) type = "address";
    else if ("href" in card) type = "contact";
    else type = "default";
  }
  return { ...(card as any), type } as DataItemProps;
}

export async function POST(req: Request) {
  try {
    const { message, memory, history, language } = (await req.json()) as {
      message: string; memory?: Record<string,string>; history?: { role:string; text?:string }[]; language?: "id"|"en";
    };

    const lang = language === "en" ? "en" : "id";

    const [profileArr, addressArr, projects, contacts, educations, experiences] = await Promise.all([
      fetchSheetData<ProfileProps>("profile", language),
        fetchSheetData<AddressProps>("address", language),
        fetchSheetData<ProjectProps>("projects", language),
        fetchSheetData<ContactProps>("contacts", language),
        fetchSheetData<EducationProps>("educations", language),
        fetchSheetData<ExperienceProps>("experiences", language),
    ]);

    const profile = Array.isArray(profileArr) ? profileArr[0] : profileArr;
    const address = Array.isArray(addressArr) ? addressArr[0] : addressArr;

    const lastMessages = history?.slice(-4) || [];
    const contextText = lastMessages.map(m => `${m.role === "user" ? "User" : "AI"}: ${m.text ?? ""}`).join("\n");

    const prompt = buildPrompt({
      message: `${contextText}\nUser: ${message}`,
      memory,
      profile,
      address,
      projects,
      contacts,
      educations,
      experiences,
      language: lang,
    });

    const aiResult = await safeGenerateContent(prompt);

    if (!aiResult.success) {
      console.error("Chat AI fail", aiResult.error);
      return NextResponse.json({ text: "Maaf, model sedang sibuk. Coba lagi sebentar.", cards: [] }, { status: 503 });
    }

    const rawResponse = (aiResult.response as any);
    const rawText = rawResponse.text ?? rawResponse.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    const clean = sanitizeJSON(rawText);
    let parsed: AIResponse | null = null;
    try {
      parsed = JSON.parse(clean) as AIResponse;
    } catch {
      const m = clean.match(/\{[\s\S]*\}/);
      if (m) {
        try { parsed = JSON.parse(sanitizeJSON(m[0])); } catch { parsed = null; }
      }
    }

    const result: AIResponse = {
      text: parsed?.text ?? (typeof rawText === "string" ? rawText : ""),
      cards: Array.isArray(parsed?.cards) ? parsed.cards.map(normalizeCard) : [],
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("chat route error", err);
    return NextResponse.json({ text: "Terjadi kesalahan server.", cards: [] }, { status: 500 });
  }
}
