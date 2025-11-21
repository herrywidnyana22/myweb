'use client';

import clsx from 'clsx';

import { PLACEHOLDERS } from '@/constants/placeholder';
import { useApp } from '@/context/AppContextProps';
import { SendHorizonal } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';

export const ChatInput = memo(({
  sendMessage,
  input,
  setInput,
  onFocus,
  onBlur,
  isActive,
  setIsMinimized,
  disabled
}: ChatInputProps) => {

  const [needsFade, setNeedsFade] = useState(false);

  const formRef = useRef<HTMLFormElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);


  const { language, ui } = useApp();

  // Typewriter state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedText, setTypedText] = useState("");

  const placeholders = PLACEHOLDERS[language] ?? PLACEHOLDERS["en"]
  
  /*
    TYPEWRITER JALAN HANYA KETIKA:
    - isMinimized = false
    - input kosong
  */
  useEffect(() => {
    if (!isActive) return;     
    if (input.length > 0) return;

    setTypedText("");

    let i = 0;
    const text = placeholders[currentIndex];

    const typing = setInterval(() => {
      setTypedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(typing);
    }, 40);

    const rotate = setTimeout(
      () => setCurrentIndex((prev) => (prev + 1) % placeholders.length),
      3000
    );

    return () => {
      clearInterval(typing);
      clearTimeout(rotate);
    };
  }, [currentIndex, input, isActive, language]);


  /* ============================================================
      AUTO HEIGHT
  ============================================================ */
  // useEffect(() => {
  //   const el = textareaRef.current;
  //   if (!el) return;
  //   el.style.height = "auto";
  //   el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  // }, [input]);


  const handleFocus = () => {
    setIsMinimized(false);
    onFocus?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const placeholderText =
    isActive
      ? typedText           
      : ui.sendPlaceholder
      
  useEffect(() => {
    if (!isActive) return;
    if (input.length > 0) return;

    setTypedText("");

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

    setTimeout(checkOverflow, 50)

    return () => {
      clearInterval(typing);
      clearTimeout(rotate);
    };
  }, [currentIndex, input, isActive, language]);


  return (
    <form
      ref={formRef}
      onSubmit={sendMessage}
      className="relative flex items-center w-full px-3 pl-4 sm:px-4"
    >
      {input.length === 0 && (
        <div
          className="
            absolute left-6 top-1/2 -translate-y-1/2
            pointer-events-none select-none
            text-gray-400 text-sm
            max-w-[calc(100%-75px)]  
            overflow-hidden          
            whitespace-nowrap
          "
          style={{
            maskImage: needsFade
              ? "linear-gradient(to right, black 80%, transparent)"
              : "none",
          }}
        >
          {placeholderText}
        </div>
      )}

      {/* TEXTAREA */}
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder=" "
        onFocus={handleFocus}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        rows={1}
        disabled={disabled}
        className="
          flex-1 w-full resize-none bg-transparent text-white
          placeholder-transparent
          py-3 pl-2 pr-3
          outline-none focus:ring-0
          max-h-40 overflow-y-auto
        "
        style={{ 
          lineHeight: "1.5", 
          scrollbarWidth: "none" 
        }}
      />

      {/* SEND BUTTON */}
      <button
        type="submit"
        disabled={input === "" || disabled}
        className={clsx(
          "size-8 flex items-center justify-center rounded-full transition-colors",
          input === ""
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-primary-light cursor-pointer"
        )}
      >
        <SendHorizonal size={14} className="text-gray-800" />
      </button>
    </form>
  );
});

ChatInput.displayName = "ChatInput";
