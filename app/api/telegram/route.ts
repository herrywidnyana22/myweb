import { NextResponse } from "next/server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_API!;
const MY_TELEGRAM_ID = process.env.TELEGRAM_USER_ID!;

// Kirim pesan ke chat web melalui sistem chat kamu
async function sendToWebUser(userId: string, message: string) {
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/from-telegram`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      message
    })
  });
}

// Webhook utama Telegram
export async function POST(req: Request) {
  const data = await req.json();

  const msg = data?.message;
  if (!msg) return NextResponse.json({ ok: true });

  const fromUserId = msg.from.id.toString();
  const text = msg.text || "";

  // Hanya proses bila yang mengirim adalah Herry
  if (fromUserId === MY_TELEGRAM_ID) {
    // Format pesan untuk user web:
    const payload = `Dari Herry:\n${text}`;

    // Di sini kamu harus mengambil user mana yang sedang "mode telegram"
    // Untuk sementara kita pakai userId dummy,
    // nanti kamu kasih tahu variable userId yang benar
    const targetUser = "activeUserId"; 

    await sendToWebUser(targetUser, payload);
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ status: "telegram webhook active" });
}
