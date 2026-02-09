'use client';

import clsx from 'clsx';

import { SendHorizonal } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import { useChatStore } from '@/store/chat';
import { useLocalizedText } from '@/hooks/useLocalizedText';
import { PLACEHOLDERS } from '@/lib/constants/languages';

export const ChatInput = memo(
  ({ sendMessage, input, setInput, isActive, disabled }: ChatInputProps) => {
    const [needsFade, setNeedsFade] = useState(false);

    const formRef = useRef<HTMLFormElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const placeholderRef = useRef<HTMLDivElement>(null);

    const { setIsMinimized, setIsInputFocused } = useChatStore();
    const { getUIText, currentLanguage } = useLocalizedText();

    // Typewriter state
    const [currentIndex, setCurrentIndex] = useState(0);
    const [typedText, setTypedText] = useState('');

    const placeholders = PLACEHOLDERS[currentLanguage] ?? PLACEHOLDERS['id'];

    /*
    TYPEWRITER JALAN HANYA KETIKA:
    - isMinimized = false
    - input kosong
  */
    useEffect(() => {
      if (!isActive) return;
      if (input.length > 0) return;

      setTypedText('');

      let i = 0;
      const text = placeholders[currentIndex];

      const typing = setInterval(() => {
        setTypedText(text.slice(0, i));
        i++;
        if (i > text.length) clearInterval(typing);
      }, 40);

      const rotate = setTimeout(
        () => setCurrentIndex(prev => (prev + 1) % placeholders.length),
        3000
      );

      return () => {
        clearInterval(typing);
        clearTimeout(rotate);
      };
    }, [currentIndex, input, isActive, currentLanguage, placeholders]);

    const handleFocus = () => {
      setIsMinimized(false);
      setIsInputFocused(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };

    const placeholderText = isActive ? typedText : getUIText('sendPlaceholder');

    useEffect(() => {
      if (!isActive) return;
      if (input.length > 0) return;

      setTypedText('');

      let i = 0;
      const text = placeholders[currentIndex];

      const typing = setInterval(() => {
        setTypedText(text.slice(0, i));
        i++;
        if (i > text.length) clearInterval(typing);
      }, 40);

      const rotate = setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % placeholders.length);
      }, 3000);

      //  DETECT OVERFLOW (AUTO)
      const checkOverflow = () => {
        const el = placeholderRef.current;
        if (!el) return;
        setNeedsFade(el.scrollWidth > el.clientWidth);
      };

      setTimeout(checkOverflow, 50);

      return () => {
        clearInterval(typing);
        clearTimeout(rotate);
      };
    }, [currentIndex, input, isActive, currentLanguage, placeholders]);

    return (
      <form
        ref={formRef}
        onSubmit={sendMessage}
        className='relative flex w-full items-center px-3 pl-4 sm:px-4'
      >
        {input.length === 0 && (
          <div
            className='pointer-events-none absolute top-1/2 left-6 max-w-[calc(100%-75px)] -translate-y-1/2 overflow-hidden text-sm whitespace-nowrap text-gray-400 select-none'
            style={{
              maskImage: needsFade
                ? 'linear-gradient(to right, black 80%, transparent)'
                : 'none',
            }}
          >
            {placeholderText}
          </div>
        )}

        {/* TEXTAREA */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder=' '
          onFocus={handleFocus}
          onBlur={() => setIsInputFocused(false)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
          className='max-h-40 w-full flex-1 resize-none overflow-y-auto bg-transparent py-3 pr-3 pl-2 text-white placeholder-transparent outline-none focus:ring-0'
          style={{
            lineHeight: '1.5',
            scrollbarWidth: 'none',
          }}
        />

        {/* SEND BUTTON */}
        <button
          type='submit'
          disabled={input === '' || disabled}
          className={clsx(
            'flex size-8 items-center justify-center rounded-full transition-colors',
            input === ''
              ? 'cursor-not-allowed bg-gray-400'
              : 'hover:bg-primary-light cursor-pointer bg-white'
          )}
        >
          <SendHorizonal size={14} className='text-gray-800' />
        </button>
      </form>
    );
  }
);

ChatInput.displayName = 'ChatInput';
