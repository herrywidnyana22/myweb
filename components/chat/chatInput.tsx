'use client';

import clsx from 'clsx';
import { SendHorizonal } from 'lucide-react';
import { memo, useEffect, useRef } from 'react';

export const ChatInput = memo(({ sendMessage, input, setInput, onFocus, onBlur, setIsMinimized }: ChatInputProps) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFocus = () => {
    setIsMinimized(false);
    onFocus?.();
  };

  // Handle Enter key (untuk mobile & desktop)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit(); // native submit trigger
    }
  }

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`; // max tinggi 160px
  }, [input])

  return (
    <form
      ref={formRef}
      onSubmit={sendMessage}
      className="flex items-center w-full px-3 pl-4 sm:px-4"
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Sini-sini kenalan sama aku..."
        onFocus={handleFocus}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        rows={1}
        className="
          flex-1 w-full resize-none bg-transparent text-white
          placeholder-gray-400 text-base
          py-3 pr-3
          outline-none focus:ring-0
          max-h-40 overflow-y-auto
          transition-all duration-150 ease-in-out
        "
        style={{
          lineHeight: '1.5',
          scrollbarWidth: 'none',
        }}
      />

      <button
        type="submit"
        disabled={input === ''}
        className={clsx('size-8 flex items-center justify-center rounded-full transition-colors', 
          input === ''
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-white hover:bg-primary-light cursor-pointer'
        )}
      >
        <SendHorizonal size={14} className="text-gray-800" />
      </button>
    </form>
  );
});

ChatInput.displayName = 'ChatInput';