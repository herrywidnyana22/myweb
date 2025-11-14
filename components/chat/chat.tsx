'use client';

import clsx from 'clsx';
import DialogConfirm from '@/components/dialogConfirm';

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { ChatHeader } from '@/components/chat/chatHeader';
import { ChatInput } from '@/components/chat/chatInput';
import { ChatItem } from '@/components/chat/chatItem';
import { Card } from '@/components/card/card';
import { useLang } from '@/context/LanguageContext';

type ChatAction =
  | { type: 'ADD'; payload: ChatResponseProps }
  | { type: 'UPDATE_LAST'; payload: Partial<ChatResponseProps> }
  | { type: 'RESET' };

function chatReducer(state: ChatResponseProps[], action: ChatAction): ChatResponseProps[] {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'UPDATE_LAST':
      return state.map((msg, i) => (i === state.length - 1 ? { ...msg, ...action.payload } : msg));
    case 'RESET':
      return [];
    default:
      return state;
  }
}

export const Chat = ({
  messages: propMessages,
  setMessages: setPropMessages,
  isInputFocused,
  setIsInputFocused,
  isMinimized,
  setIsMinimized,
}: ChatProps) => {

  const [messages, dispatch] = useReducer(chatReducer, propMessages || []);
  const [input, setInput] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const hasLoadedRef = useRef(false);

  const { language, setLanguage, t } = useLang();

  // memory helper
  const getMemory = useCallback((): ChatMemory => {
    try {
      return JSON.parse(localStorage.getItem('chatMemory') || '{}');
    } catch {
      return {};
    }
  }, []);

  const saveMemory = useCallback((newData: Partial<ChatMemory>) => {
    const memory = getMemory();
    const updated = { ...memory, ...newData };
    localStorage.setItem('chatMemory', JSON.stringify(updated));
  }, [getMemory]);

  const detectUserName = useCallback(
    (msg: string): string | null => {
      const match = msg.match(/\b(namaku|aku|saya)\s*(adalah|:)?\s*([A-Za-zÀ-ÖØ-öø-ÿ]+)/i);
      if (match) {
        const name = match[3].trim();
        saveMemory({ name });
        return name;
      }
      return null;
    },
    [saveMemory]
  );

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const clearChat = useCallback(() => {
    dispatch({ type: 'RESET' });
    localStorage.removeItem('chatHistory');
    localStorage.removeItem('chatMemory');
    setShowConfirm(false);
    setPropMessages([]);
  }, [setPropMessages])

  const onMinimize = useCallback(() => setIsMinimized((p) => !p), [setIsMinimized]);


  const onSwitchLang = (lang: UILanguage, action: 'yes' | 'no') => {
    // 1. Hapus confirm card dari pesan bot terakhir
    dispatch({
      type: "UPDATE_LAST",
      payload: { cards: [] }
    });

    if (action === "yes") {
      setLanguage(lang);

      // 2. Push system confirmation text
      dispatch({
        type: "ADD",
        payload: {
          role: "bot",
          text: lang === "en" ? t.langSwitchedEN : t.langSwitchedID,
          isStreaming: false,
          isLoading: false,
        }
      })

      Object.keys(localStorage)
        .filter(k => k.startsWith("portfolio_"))
        .forEach(k => localStorage.removeItem(k))
        
    } else {
      dispatch({
        type: "ADD",
        payload: {
          role: "bot",
          text: lang === "en" ? t.langCanceledEN : t.langCanceledID,
          isStreaming: false,
          isLoading: false,
        }
      });
    }
  }

  const sendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;

      // push user message
      const userMessage: ChatResponseProps = { role: 'user', text: input };
      dispatch({ type: 'ADD', payload: userMessage });
      setInput('');

      // detect name & save
      detectUserName(input);

      // push bot loader
      dispatch({ type: 'ADD', payload: { role: 'bot', text: '', isLoading: true } });

      try {
        // send last 6 messages as context
        const history = messages.slice(-6).map(({ role, text }) => ({ role, text: text ?? '' }));

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: input, memory: getMemory(), history, language }),
        });

        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }

        const data: AIResponse = await res.json();
        const fullText = data.text ?? '';
        const cards = data.cards ?? [];


        // replace loader -> streaming flag
        dispatch({ 
          type: 'UPDATE_LAST', 
          payload: { isLoading: false, isStreaming: true, text: '' } 
        });

        // typewriter (text only)
        let typed = "";
        for (const ch of fullText) {
          typed += ch;

          dispatch({
            type: "UPDATE_LAST",
            payload: { text: typed, isStreaming: true }
          });

          // slowdown on punctuation
          if (".!?".includes(ch)) {
            await new Promise((r) => setTimeout(r, 60));
          } else {
            await new Promise((r) => setTimeout(r, 12));
          }
        }

      dispatch({
        type: "UPDATE_LAST",
        payload: {
          text: fullText,
          cards,               // cards muncul di bawah teks
          isStreaming: false,
          isLoading: false
        }
      })

      } catch (err) {
        console.error('Chat error:', err);
        // remove loader last and push error
        dispatch({ 
          type: 'UPDATE_LAST', 
          payload: { 
            text: 'Maaf kak, chat lagi gangguan nih. Coba lagi sebentar ya 🙏', 
            isLoading: false, 
            isStreaming: false 
          } 
        })
      }
    },
    [input, messages, detectUserName, getMemory, language]
  );

  // load history once
  useEffect(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ChatResponseProps[];
        parsed.forEach((m) => dispatch({ type: 'ADD', payload: m }));
      } catch {
        // ignore
      }
    }
    hasLoadedRef.current = true;
  }, []);

  // save after loaded (debounced slight delay to avoid saving every keystroke during typing)
  useEffect(() => {
    if (!hasLoadedRef.current) return;

    localStorage.setItem('chatHistory', JSON.stringify(messages));

    const t = setTimeout(() => {
      setPropMessages(messages);
    }, 250); // small debounce to prevent too frequent parent updates

    scrollToBottom();
    return () => clearTimeout(t)

  }, [messages, setPropMessages, scrollToBottom]);

  // scroll when input focused (to avoid keyboard overlap)
  useEffect(() => {
    if (isInputFocused) {
      const timer = setTimeout(scrollToBottom, 120);
      return () => clearTimeout(timer);
    }
  }, [isInputFocused, scrollToBottom]);

  // visualViewport keyboard detection (mobile)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;
    const handle = () => {
      const visual = window.visualViewport;
      if (!visual) return;
      setIsInputFocused(visual.height < window.innerHeight - 100);
    };
    window.visualViewport.addEventListener('resize', handle);
    handle();
    return () => window.visualViewport?.removeEventListener('resize', handle);
  }, [setIsInputFocused])

  return (
    <>
      <div
        className={clsx(
          'relative z-50 w-full mx-auto transition-all duration-300 ease-in-out',
          isInputFocused ? '-translate-y-10' : 'translate-y-0'
        )}
      >
        <div className="w-full mx-auto rounded-3xl overflow-hidden shadow-2xl border border-gray-600/50">
          {messages.length > 0 && (
            <ChatHeader isMinimized={isMinimized} onClear={() => setShowConfirm(true)} onMinimize={onMinimize} />
          )}

          {!isMinimized && messages.length > 0 && (
            <div className="chat-container bg-gray-800/70 backdrop-blur-sm max-h-[65vh] sm:max-h-[60vh] overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={msg.role === 'user' ? 'text-right' : ''}>
                  <ChatItem {...msg} />

                  {!!msg.cards?.length && (
                    <div className="max-w-[80%] sm:max-w-[70%] grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 ml-10 sm:ml-13 mb-2">
                      {msg.cards.map((card, j) => (
                        <Card 
                          key={j} 
                          {...card} 
                          onSwitchLang={onSwitchLang}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          )}

          <div className="bg-gray-900/90 border-t border-gray-700">
            <ChatInput
              input={input}
              setInput={setInput}
              sendMessage={sendMessage}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              setIsMinimized={setIsMinimized}
            />
          </div>
        </div>
      </div>

      {showConfirm && (
        <DialogConfirm
          text="Yakin ingin menghapus semua chat ini?"
          onConfirm={clearChat}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
};
