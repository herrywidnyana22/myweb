// components/chat/chatHeader.tsx
"use client";
import React from "react";
import { Minimize2, Trash2 } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onMinimize, onClear, isMinimized }) => {
  const { t } = useLang();
  return (
    <div className="flex items-center justify-between p-3 border-b bg-gray-900/80">
      <div className="flex items-center gap-3">
        <div className="rounded-full size-9 bg-white/10 p-1.5 flex items-center justify-center">
          <img src="/images/profile.webp" alt="bot" className="h-8 w-8 rounded-full" />
        </div>
        <div>
          <div className="text-sm font-semibold">Herry Widnyana</div>
          <div className="text-xs text-gray-400">Fullstack Developer</div>
        </div>
      </div>

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
