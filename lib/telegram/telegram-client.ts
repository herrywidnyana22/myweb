export async function sendToTelegram(message: string) {
    await fetch("/api/telegram/send", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
}
