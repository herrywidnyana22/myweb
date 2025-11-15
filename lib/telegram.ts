export async function sendToTelegram(message: string) {
  const token = process.env.TELEGRAM_BOT_API!;
  const userId = process.env.TELEGRAM_USER_ID!;

  return await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: userId,
        text: message
      })
    }
  );
}
