// components/chat/chatHeader.tsx
"use client";

import { Minimize2, Trash2 } from "lucide-react";
import { useApp } from "@/context/AppContextProps";
import { Avatar } from "../avatar";
import { Tooltip } from "../tooltip";
import { TelegramStatus } from "../telegramStatus";
import { FlagIcon } from "../flagIcon";

export const ChatHeader= ({ onMinimize, onClear }: ChatHeaderProps) => {
  const { language, chatMode, ui } = useApp();

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

      <span>
        <Tooltip label={ui.langStatus}>
          <FlagIcon code={language} size={20} />
        </Tooltip>
        {
          chatMode === 'telegram' && (
            <TelegramStatus />
          )
        }
      </span>

      <div className="flex gap-2">
        <button onClick={onMinimize} title={ui.minimize} className="p-2 rounded-md hover:bg-white/5">
          <Minimize2 size={16} />
        </button>
        <button onClick={onClear} title={ui.clear} className="p-2 rounded-md hover:bg-white/5">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
