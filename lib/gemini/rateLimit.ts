// ===== RATE LIMIT (Throttle) =====
let lastCall = 0;
const MIN_INTERVAL = 300; // 0.3 sec antara request

export async function rateLimit() {
  const now = Date.now();

  if (now - lastCall < MIN_INTERVAL) {
    await new Promise(res => setTimeout(
      res, MIN_INTERVAL - (now - lastCall)
    ));
  }

  lastCall = Date.now();
}

// ===== RETRY (503 Overloaded) =====
export async function retry<T>(fn: () => Promise<T>, tries = 3): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    const overloaded =
      err?.error?.code === 503 ||
      err?.error?.status === "UNAVAILABLE" ||
      String(err).includes("overloaded");

    if (tries > 0 && overloaded) {
      console.warn("⚠️ Gemini overloaded ⇒ retry...");
      await new Promise(res => setTimeout(res, 500));
      return retry(fn, tries - 1);
    }

    throw err;
  }
}
