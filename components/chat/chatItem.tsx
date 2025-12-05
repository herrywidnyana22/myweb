'use client';

import { memo } from 'react';
import { parseHighlight } from '@/lib/utils/parseHighlight';
import { ChatLoader } from './chatLoader';
import { Avatar } from '../avatar';
import { useApp } from '@/context/AppContextProps';
import { Forward, MousePointer2 } from 'lucide-react';
import { ChatItemTelegram } from './chatItemTelegram';

export const ChatItem = memo(({ role, text, isStreaming, isLoading }: ChatResponseProps) => {

  const { chatMode, ui } = useApp();
  console.log({chatMode})
  console.log({ role, text, isStreaming, isLoading })

  const isUser = role === 'user';
  const isTelegram = role === 'herry_telegram';

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
    'rounded-2xl',
    'text-sm md:text-base',
    'leading-relaxed  font-normal tracking-normal',
    'transition-all duration-300',
    bubbleColor,
  ].join(' ');

  // RENDER TEXT SESUAI MODE DAN ROLE
  const renderText = () => {
    // Mode telegram, message dari BOT
    if (role === "bot_telegram") {
      return (
        <ChatItemTelegram 
          headerText={`${ui.forwarding} @herrywidnyana`}
          message={text || ''}
          icon={Forward}
        />
      );
    }

    // Case 3: Mode telegram, message dari TELEGRAM (Herry)
    if (chatMode === "telegram" && isTelegram) {
      return (
        <ChatItemTelegram 
          headerText='@herrywidnyana'
          message={text || ''}
          icon={MousePointer2}
          className='py-1 px-1.5 bg-telegram-secondary rounded-lg'
        />
      );
    }

    // fallback (should rarely happen, but safe)
    return (
      <div className="whitespace-pre-wrap">
        {parseHighlight(text || '')}
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      {/* Bot Avatar */}
      {(role === 'bot' || role === 'bot_telegram') && (
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full ring-1 ring-white/30" />
          <Avatar
            src="/images/profile.webp"
            alt="Bot"
            className="rounded-full size-8 sm:size-9 object-cover relative z-10 transition-all duration-300"
          />
        </div>
      )}

      {isTelegram && (
        <div className="rounded-full bg-linear-to-tr from-primary to-primary-light w-9 h-9 flex items-center justify-center text-white">
          H
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
