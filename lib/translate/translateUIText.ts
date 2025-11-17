import { getLS, setLS } from "@/utils/local";
import { baseUIText } from "./baseUIText";

export async function loadUI(language: string) {
  // default 'id'
  if (language === "id") {
    setLS("ui_id", baseUIText);
    return baseUIText;
  }

  // cek cache
  const cached = getLS(`ui_${language}`);
  if (cached) return cached;

  // fetch ke API translator
  const res = await fetch("/api/translate/ui", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ base: baseUIText, target: language }),
  });

  const json = await res.json();

  if (json.translated) {
    setLS(`ui_${language}`, json.translated);
    return json.translated;
  }

  return baseUIText; // fallback
}
