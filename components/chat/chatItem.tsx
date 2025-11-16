'use client';

import { memo } from 'react';
import { parseHighlight } from '@/utils/parseHighlight';
import { ChatLoader } from './chatLoader';
import { Avatar } from '../avatar';
import { useApp } from '@/context/AppContextProps';
import { Forward, MousePointer2 } from 'lucide-react';

export const ChatItem = memo(({ role, text, isStreaming, isLoading }: ChatResponseProps) => {
  const isUser = role === 'user';
  const isTelegram = role === 'herry_telegram';
  const { chatMode } = useApp();

  const wrapperClass = `flex items-start gap-2 sm:gap-3 pb-2 sm:pb-3 ${
    isUser ? 'justify-end' : 'justify-start'
  }`;

  const bubbleColor = isTelegram
    ? "bg-telegram text-white telegram-bubble-bot"
    : (isUser ? 'bg-primary-hover text-white whatsapp-bubble-user' : 'bg-white border text-slate-900 whatsapp-bubble-bot');

  const bubbleClass = [
    'relative z-20',
    'max-w-[85%] sm:max-w-[70%]',
    'px-3 py-2 sm:px-4 sm:py-2.5',
    'rounded-3xl',
    'text-sm md:text-base',
    'leading-relaxed  font-normal tracking-normal',
    'transition-all duration-300',
    bubbleColor,
  ].join(' ');

  // ============================================================
  // RENDER TEXT SESUAI MODE DAN ROLE
  // ============================================================
  const renderText = () => {
    // Case 1: Default mode
    if (chatMode === "default") {
      return (
        <div className="whitespace-pre-wrap">
          {parseHighlight(text || '')}
        </div>
      );
    }

    // Case 2: Mode telegram, message dari BOT
    if (chatMode === "telegram" && role === "bot_telegram") {
      return (
        <div className="whitespace-pre-wrap flex flex-col gap-3">
          <div className="flex gap-2 items-center italic">
            <Forward size={16} />
            <p className="text-xs">Diteruskan ke @herrywidnyana</p>
          </div>
          {parseHighlight(text || '')}
        </div>
      );
    }

    // Case 3: Mode telegram, message dari TELEGRAM (Herry)
    if (chatMode === "telegram" && role === "herry_telegram") {
      return (
        <div className="whitespace-pre-wrap flex flex-col gap-3">
          <div className="flex gap-2 items-center italic">
            <MousePointer2 size={16} className="rotate-90" />
            <p className="text-xs">@herrywidnyana</p>
          </div>
          {parseHighlight(text || '')}
        </div>
      );
    }

    // fallback (should rarely happen, but safe)
    return (
      <div className="whitespace-pre-wrap">
        {parseHighlight(text || '')}
      </div>
    );
  }

  console.log({role})
  console.log({chatMode})

  return (
    <div className={wrapperClass}>
      {/* Bot Avatar */}
      {!isUser && (
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full ring-1 ring-white/30" />
          <Avatar
            src="/images/profile.webp"
            alt="Bot"
            className="rounded-full size-8 sm:size-9 object-cover relative z-10 transition-all duration-300"
          />
        </div>
      )}

      {/* Chat Bubble */}
      <div className={bubbleClass}>
        {isLoading ? (
          <ChatLoader />
        ) : isStreaming ? (
          <div className="whitespace-pre-wrap">
            {parseHighlight(text || '')}
            <span className="ml-1 animate-pulse text-gray-500 dark:text-gray-300 select-none">▋</span>
          </div>
        ) : (
          renderText()
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="rounded-full size-8 sm:size-10 bg-white/30 p-1 flex items-center justify-center transition-all duration-300">
          <Avatar
            src="/icons/user.webp"
            alt="User"
            className="size-5 sm:size-6 object-contain"
          />
        </div>
      )}
    </div>
  );
});

ChatItem.displayName = 'ChatItem';
