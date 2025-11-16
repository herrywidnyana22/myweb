import { getLS, setLS } from "@/utils/getChange";

export const DATASETS = [
  "profile",
  "address",
  "projects",
  "contacts",
  "educations",
  "experiences",
  "highlight",
];

export async function translateAll(target: UILanguage) {
  for (const key of DATASETS) {
    const original = getLS(`sheet_${key}__id`);
    if (!original) continue;

    const res = await fetch("/api/translate/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key,
        data: original,
        target,
      }),
    });

    const json = await res.json();

    if (json.translated) {
      setLS(`sheet_${key}__${target}`, json.translated);
    }
  }
}
