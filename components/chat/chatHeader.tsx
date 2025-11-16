// components/chat/chatHeader.tsx
"use client";

import TelegramStatus from "./telegramStatus";

import { Minimize2, Trash2 } from "lucide-react";
import { useApp } from "@/context/AppContextProps";
import { Avatar } from "../avatar";

export const ChatHeader= ({ onMinimize, onClear }: ChatHeaderProps) => {
  const { chatMode, t } = useApp();
  
  return (
    <div className="flex items-center justify-between p-3 border-b bg-gray-900/80">
      <div className="flex items-center gap-3">
        <div className="rounded-full size-9 inset-0 bg-white/10 flex items-center justify-center">
          <Avatar
            src='/images/profile.webp'
            alt='Bot'
            className='rounded-full size-8 sm:size-10 object-cover relative z-10 transition-all duration-300'
          />
        </div>
        <div>
          <div className="text-sm font-semibold">Herry Widnyana</div>
          <div className="text-xs text-gray-400">Fullstack Developer</div>
        </div>
      </div>

      {
        chatMode === 'telegram' && (
          <TelegramStatus />
        )
      }

      <div className="flex gap-2">
        <button onClick={onMinimize} title={t.minimize} className="p-2 rounded-md hover:bg-white/5">
          <Minimize2 size={16} />
        </button>
        <button onClick={onClear} title={t.clear} className="p-2 rounded-md hover:bg-white/5">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
