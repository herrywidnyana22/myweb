export async function sendToTelegram(message: string) {
    const token = process.env.TELEGRAM_BOT_API;
    const chatId = process.env.TELEGRAM_USER_ID;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            chat_id: chatId,
            text: message,
        }),
    });

    return await res.json();
}
