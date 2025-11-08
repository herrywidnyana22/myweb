'use client';

import Image from 'next/image';
import { memo } from 'react';
import { parseHighlight } from '@/utils/parseHighlight';
import { ChatLoader } from '@/components/chat/chatLoader'; // pastikan path sesuai proyekmu

export const ChatItem = memo(({ role, text, isStreaming, isLoading }: ChatResponseProps) => {
  const isUser = role === 'user';

  return (
    <div
      className={`flex items-start gap-2 sm:gap-3 pb-2 sm:pb-3 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Avatar Bot */}
      {!isUser && (
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full ring-1 ring-white/30" />
          <Image
            src="/images/profile.webp"
            alt="Bot"
            height={40}
            width={40}
            className="rounded-full size-8 sm:size-10 object-cover relative z-10"
          />
        </div>
      )}

      {/* Chat Bubble */}
      <div
        className={`relative max-w-[85%] sm:max-w-[70%] px-3 py-2 sm:px-4 sm:py-3 rounded-2xl sm:rounded-3xl text-sm sm:text-base leading-relaxed
        ${
          isUser
            ? 'bg-blue-500 text-white rounded-tr-none'
            : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
        }`}
      >
        {/* === Kondisi isi bubble === */}
        {isLoading ? (
          // Loader aktif
          <div className="flex items-center justify-start py-1">
            <ChatLoader />
          </div>
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

      {/* Avatar User */}
      {isUser && (
        <div className="rounded-full size-8 sm:size-10 bg-white/30 p-1 flex items-center justify-center">
          <Image
            src="/icons/user.webp"
            alt="User"
            height={24}
            width={24}
            className="object-contain"
          />
        </div>
      )}
    </div>
  );
});

ChatItem.displayName = 'ChatItem';
