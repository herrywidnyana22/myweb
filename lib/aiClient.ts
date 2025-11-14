import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

// 3 Level fallback
const MODEL_PRIORITY: string[] = [
  "gemini-2.5-flash",  // utama
  "gemini-1.5-flash",  // fallback 1
  "gemini-pro"         // fallback 2
];

// Retry wrapper (503 handling)
async function retryRequest(fn: () => Promise<any>, retries = 4) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      const code = err?.error?.code ?? err?.status;

      // hanya retry untuk 503 overload
      if (code === 503 && i < retries - 1) {
        await new Promise(r => setTimeout(r, 400 * (i + 1))); // exponential backoff
        continue;
      }

      // selain 503 → langsung lempar
      throw err;
    }
  }
}

// MAIN WRAPPER — coba model utama → fallback
export async function safeGenerateContent(prompt: string) {
  let lastError: any = null;

  for (const model of MODEL_PRIORITY) {
    try {
      const result = await retryRequest(() =>
        client.models.generateContent({
          model,
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        })
      );

      return {
        success: true,
        model,
        response: result,
      };
    } catch (err) {
      lastError = err;
      console.warn(`Model gagal: ${model}, mencoba fallback berikutnya...`);
    }
  }

  return {
    success: false,
    model: null,
    error: lastError,
  };
}
