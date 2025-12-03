import { DATASETS } from "@/lib/constants/sheet";
import { setLS, getLS } from "@/lib/utils/getChange";

export async function preloadPortfolio() {
  // cek jika sudah pernah preload
  const alreadyLoaded = getLS("portfolio_loaded");
  if (alreadyLoaded) return;

  for (const sheet of DATASETS) {
    try {
      const res = await fetch(`/api/${sheet}`, { cache: "no-store" });
      if (!res.ok) continue;

      const json = await res.json();

      // simpan original (versi id)
      setLS(`sheet_${sheet}__id`, json);
    } catch (err) {
      console.error(`Failed loading sheet: ${sheet}`, err);
    }
  }

  setLS("portfolio_loaded", true);
}
