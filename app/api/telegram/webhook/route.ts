import { NextResponse } from "next/server";
import { telegramBus } from "@/lib/telegram/sse-bus";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.get("secret") !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const update = await req.json();

  const message = update?.message;
  if (!message) return NextResponse.json({ ok: true });

  const payload: TelegramPayload = {
    id: message.message_id,
    text: message.text ?? "",
    from: message.from?.username ?? "Telegram User",
  };

  telegramBus.emit("telegram-message", payload);

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
