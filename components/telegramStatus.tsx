"use client";

import { useApp } from "@/context/AppContextProps";
import Image from "next/image";
import { Tooltip } from "./tooltip";

export const TelegramStatus = () =>{
  const {ui} = useApp()

  return (
    <Tooltip label={ui.telegramStatus}>
      <span
        className="flex items-center justify-center gap-2 p-1 rounded-full text-xs shadow-sm hover:bg-gray-200 transition cursor-pointer"
      >
        <Image
          src={'/icons/telegram.png'}
          alt="telegram icon"
          height={32}
          width={32}
          className="object-cover size-4"
        />
      </span>
    </Tooltip>
  );
}
