"use client";

import { useApp } from "@/context/AppContextProps";
import Image from "next/image";
import { Tooltip } from "../tooltip";

export default function TelegramStatus() {

  return (
      <span
        className="flex items-center justify-center gap-2 p-1 rounded-full text-white text-xs shadow-sm hover:bg-telegram-secondary transition cursor-pointer"
      >
        <Image
          src={'/icons/telegram.png'}
          alt="telegram icon"
          height={32}
          width={32}
          className="object-cover size-4"
        />
      </span>
  );
}
