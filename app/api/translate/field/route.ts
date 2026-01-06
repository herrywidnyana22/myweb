import { NextResponse } from "next/server";
import { generatePrompt } from "@/lib/gemini/generatePrompt";
import { fieldTranslationRules } from "@/lib/constants/promptRule";

export async function POST(req: Request) {
  try {
    const { text, targetLanguages, sourceLanguage = 'id' } = await req.json();

    if (!text || !targetLanguages || targetLanguages.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: text and targetLanguages" },
        { status: 400 }
      );
    }

    // Create language mapping for readability
    const languageNames: Record<string, string> = {
      en: 'English',
      id: 'Indonesian',
      ja: 'Japanese',
      zh: 'Chinese',
      ko: 'Korean',
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      ar: 'Arabic',
      pt: 'Portuguese',
    };

    const targetLangNames = targetLanguages
      .map((code: string) => languageNames[code] || code)
      .join(', ');

    const prompt = `
${fieldTranslationRules}

TRANSLATION TASK:

Source Language: ${languageNames[sourceLanguage] || sourceLanguage}
Target Languages: ${targetLangNames}

Source Text:
"${text}"

Return ONLY this JSON structure (no markdown, no explanations):
{
  "source": "${text}",
  ${targetLanguages.map((code: string) => `"${code}": "translated text in ${languageNames[code] || code}"`).join(',\n  ')}
}
`.trim();

    const result = await generatePrompt(prompt);

    if (!result) {
      throw new Error('No response from AI');
    }

    // Clean the response - remove markdown code blocks if present
    let cleanResult = result.trim();
    cleanResult = cleanResult.replace(/```json\n?/g, '');
    cleanResult = cleanResult.replace(/```\n?/g, '');
    cleanResult = cleanResult.trim();

    // Parse JSON
    const translations = JSON.parse(cleanResult);

    // Validate response has required fields
    if (!translations.source) {
      translations.source = text;
    }

    // Ensure all target languages are present
    for (const langCode of targetLanguages) {
      if (!translations[langCode]) {
        throw new Error(`Missing translation for language: ${langCode}`);
      }
    }

    return NextResponse.json({
      success: true,
      translations,
    });

  } catch (err) {
    console.error("Translation API Error:", err);
    const errorMessage = err instanceof Error ? err.message : 'Translation failed';
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(err) : undefined
      },
      { status: 500 }
    );
  }
}
