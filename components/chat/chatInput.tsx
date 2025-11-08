'use client';

import { SendHorizonal } from 'lucide-react';
import { memo } from 'react';

export const ChatInput = memo(({ sendMessage, input, setInput, onFocus, onBlur, setIsMinimized }: ChatInputProps) => {
    const handleFocus = () => {
      setIsMinimized(false)
      onFocus?.();
      // setTimeout(() => {
      //   window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      // }, 200);
    };

    return (
      <form onSubmit={sendMessage} className="flex items-center w-full px-2 sm:px-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Sini-sini kenalan sama aku..."
          className="w-full bg-transparent text-white placeholder-white/50 text-sm sm:text-base focus:outline-none"
          onFocus={handleFocus}
          onBlur={onBlur}
        />
        <button
          type="submit"
          disabled={input === ''}
          className={`size-7 sm:size-8 flex items-center justify-center rounded-full transition-colors ${
            input === ''
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-white hover:bg-gray-100 cursor-pointer'
          }`}
        >
          <SendHorizonal size={14} className="text-gray-800" />
        </button>
      </form>
    );
  }
);

ChatInput.displayName = 'ChatInput';
