import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();

  const token = process.env.TELEGRAM_BOT_API!;
  const chatId = process.env.TELEGRAM_USER_ID!;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
  });

  const data = await res.json();
  return NextResponse.json({ ok: true, data });
}
