'use client';

import Image from 'next/image';

import { memo } from 'react';
import { parseHighlight } from '@/utils/parseHighlight';
import { ChatLoader } from './chatLoader';
import { useChatMode } from "@/context/ChatModeContext";

export const ChatItem = memo(({ role, text, isStreaming, isLoading }: ChatResponseProps) => {
  const isUser = role === 'user';

  const wrapperClass = `flex items-start gap-2 sm:gap-3 pb-2 sm:pb-3 ${
    isUser ? 'justify-end' : 'justify-start'
  }`;


  const { mode } = useChatMode();

  const isTelegram = mode === "telegram";

  const bubbleColor = isTelegram
    ? (isUser ? "bg-[#0088cc] text-white whatsapp-bubble-user" : "bg-[#5ab5e8] text-slate-900 whatsapp-bubble-bot")
    : (isUser ? 'bg-primary-hover text-white whatsapp-bubble-user' : 'bg-white border text-slate-900 whatsapp-bubble-bot');

  const bubbleClass = [
    'relative z-20',
    'max-w-[85%] sm:max-w-[70%]',
    'px-3 py-2 sm:px-4 sm:py-2.5',
    'rounded-3xl',
    'text-xs sm:text-sm md:text-base',
    'leading-relaxed sm:leading-7 font-normal tracking-normal',
    'transition-all duration-300',
    bubbleColor,
  ].join(' ');

  const avatar = (src: string, alt: string, className: string) => (
    <Image src={src} alt={alt} height={240} width={240} className={className} />
  );

  return (
    <div className={wrapperClass}>
      {/* Bot Avatar */}
      {!isUser && (
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full ring-1 ring-white/30" />
          {avatar(
            '/images/profile.webp',
            'Bot',
            'rounded-full size-8 sm:size-10 object-cover relative z-10 transition-all duration-300'
          )}
        </div>
      )}

      {/* Chat Bubble */}
      <div className={bubbleClass}>
        {isLoading ? (
          // Loader aktif
          <ChatLoader />
        ) : isStreaming ? (
          // Efek mengetik (streaming)
          <div className="whitespace-pre-wrap">
            {parseHighlight(text || '')}
            <span className="ml-1 animate-pulse text-gray-500 dark:text-gray-300 select-none">▋</span>
          </div>
        ) : (
          // Teks final
          <div className="whitespace-pre-wrap">
            {parseHighlight(text || '')}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="rounded-full size-8 sm:size-10 bg-white/30 p-1 flex items-center justify-center transition-all duration-300">
          {avatar('/icons/user.webp', 'User', 'size-5 sm:size-6 object-contain')}
        </div>
      )}
    </div>
  );
});

ChatItem.displayName = 'ChatItem';
