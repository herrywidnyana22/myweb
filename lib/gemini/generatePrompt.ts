import { client } from "./client";
import { rateLimit, retry } from "./rateLimit";


export async function generatePrompt(prompt: string) {
  await rateLimit();

  return retry(async () => {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }]}],
    });

    return response.text
  });
}
