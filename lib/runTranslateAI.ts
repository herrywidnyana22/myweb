// lib/runTranslateAI.ts

import { sanitizeJSON } from "@/utils";
import { safeGenerateContent } from "./aiClient";
import { fetchFullPorto } from "./fetchFullPorto";
import { readDiskCacheData, writeDiskCache } from "./translateCache";
import { translationChatRules, translationDataRules } from "@/constants/promptRule";

export async function runTranslateAI(target: "en") {
    const cached = readDiskCacheData();
    if (cached) return cached;

    const portfolio = await fetchFullPorto();

    const prompt = `
        ${translationChatRules}
        ${translationDataRules}

        TARGET: ${target}

        DATA:
        ${JSON.stringify(portfolio, null, 2)}
    `;

    const aiResult = await safeGenerateContent(prompt)
  
    if (!aiResult.success) {
        console.error("Semua model gagal:", aiResult.error);
        throw new Error("Translation failed: " + JSON.stringify(aiResult.error))
    }
  
    const raw = (aiResult.response as any).text ?? "";
    const clean = sanitizeJSON(raw);
    const parsed = JSON.parse(clean);

    writeDiskCache(parsed);

    return parsed;
}
