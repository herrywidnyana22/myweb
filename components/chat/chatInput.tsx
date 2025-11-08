'use client';

import clsx from 'clsx';
import { SendHorizonal } from 'lucide-react';
import { memo, useRef } from 'react';

export const ChatInput = memo(({ sendMessage, input, setInput, onFocus, onBlur, setIsMinimized }: ChatInputProps) => {
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleFocus = () => {
    setIsMinimized(false);
    onFocus?.();
  };

  // Handle Enter key (untuk mobile & desktop)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit(); // native submit trigger
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={sendMessage}
      className="flex items-center w-full px-2 sm:px-4"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Sini-sini kenalan sama aku..."
        className="w-full bg-transparent text-white placeholder-white/50 text-sm sm:text-base focus:outline-none"
        onFocus={handleFocus}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        enterKeyHint="send"
        autoComplete="off"
      />

      <button
        type="submit"
        disabled={input === ''}
        className={clsx('size-7 sm:size-8 flex items-center justify-center rounded-full transition-colors', 
          input === ''
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-white hover:bg-gray-100 cursor-pointer'
        )}
      >
        <SendHorizonal size={14} className="text-gray-800" />
      </button>
    </form>
  );
});

ChatInput.displayName = 'ChatInput';
