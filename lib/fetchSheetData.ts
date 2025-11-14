import { fetchFullPorto } from "./fetchFullPorto";
import { runTranslateAI } from "./runTranslateAI";

/**
 * fetchSheetData(sheetName, lang)
 * - sheetName: profile | address | projects | contacts | educations | experiences
 * - lang: 'id' | 'en'
 */
export async function fetchSheetData<T>(sheetName: string, lang: "id" | "en" = "id"): Promise<T[]> {
  if (lang === "id") {
    const full = await fetchFullPorto();
    switch (sheetName) {
      case "profile": return [full.profile] as unknown as T[];
      case "address": return [full.address] as unknown as T[];
      case "projects": return full.projects as unknown as T[];
      case "contacts": return full.contacts as unknown as T[];
      case "educations": return full.educations as unknown as T[];
      case "experiences": return full.experiences as unknown as T[];
      default: return [] as unknown as T[];
    }
  } else {
    // lang === 'en'
    const translated = await runTranslateAI("en");
    switch (sheetName) {
      case "profile": return [translated.profile] as unknown as T[];
      case "address": return [translated.address] as unknown as T[];
      case "projects": return translated.projects as unknown as T[];
      case "contacts": return translated.contacts as unknown as T[];
      case "educations": return translated.educations as unknown as T[];
      case "experiences": return translated.experiences as unknown as T[];
      default: return [] as unknown as T[];
    }
  }
}
