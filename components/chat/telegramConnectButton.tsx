"use client";

import { useChatMode } from "@/context/ChatModeContext";

export default function TelegramConnectButton() {
  const { setMode } = useChatMode();

  return (
    <button
      onClick={() => setMode("telegram")}
      className="mt-2 px-4 py-2 rounded-lg bg-[#0088cc] text-white font-medium shadow-sm hover:bg-[#0077b5] transition"
    >
      Terhubung via Telegram
    </button>
  );
}
