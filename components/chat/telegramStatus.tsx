"use client";

import { useApp } from "@/context/AppContextProps";
import Image from "next/image";
import { Tooltip } from "../tooltip";

export default function TelegramStatus() {
  const { setChatMode } = useApp()

  return (
    <Tooltip label="Terhubung ke Telegram Herry, klik untuk memutuskan koneksi">
      <button
        onClick={() => setChatMode("default")}
        className="flex items-center justify-center gap-2 p-1 rounded-full text-white text-xs shadow-sm hover:bg-telegram-secondary transition cursor-pointer"
      >
        <Image
          src={'/icons/telegram.png'}
          alt="telegram icon"
          height={32}
          width={32}
          className="object-cover size-4"
        />
      </button>

    </Tooltip>
  );
}
