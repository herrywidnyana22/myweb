import { telegramBus } from "@/lib/telegram/sse-bus";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface SSEController extends ReadableStreamDefaultController<Uint8Array> {
  cleanup?: () => void;
}

export async function GET() {
  const encoder = new TextEncoder();
  let closed = false;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const ctrl = controller as SSEController;

      const send = (data: string) => {
        if (closed) return;
        try {
          ctrl.enqueue(encoder.encode(data));
        } catch {
          // stream closed
          closed = true;
          ctrl.cleanup?.();
        }
      };

      // initial ping
      send("event: ping\ndata: connected\n\n");

      // telegram → website
      const handler = (payload: TelegramPayload) => {
        send(`event: message\ndata: ${JSON.stringify(payload)}\n\n`);
      };

      telegramBus.on("telegram-message", handler);

      // keepalive ping
      const interval = setInterval(() => {
        send("event: ping\ndata: keepalive\n\n");
      }, 15000);

      ctrl.cleanup = () => {
        telegramBus.off("telegram-message", handler);
        clearInterval(interval);
        closed = true;
      };
    },

    cancel() {
      const ctrl = this as SSEController;
      ctrl.cleanup?.();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
