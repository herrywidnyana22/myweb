'use client';

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { ChatHeader } from '@/components/chat/chatHeader';
import { ChatInput } from '@/components/chat/chatInput';
import { ChatItem } from '@/components/chat/chatItem';
import { Card } from '@/components/card/card';
import DialogConfirm from '../dialogConfirm';
import clsx from 'clsx';
import { useApp } from '@/context/AppContextProps';
import { sendToTelegram } from '@/lib/telegram/telegram-client';
import { ChatNotice } from './chatNotice';
import { translateAll } from '@/lib/translate/app-data';

// =============== REDUCER ===============
type ChatAction =
  | { type: 'ADD'; payload: ChatResponseProps }
  | { type: 'UPDATE_LAST'; payload: Partial<ChatResponseProps> }
  | { type: 'RESET' };

function chatReducer(state: ChatResponseProps[], action: ChatAction): ChatResponseProps[] {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'UPDATE_LAST':
      return state.map((msg, i) =>
        i === state.length - 1 ? { ...msg, ...action.payload } : msg
      );
    case 'RESET':
      return [];
    default:
      return state;
  }
}

// =============== COMPONENT ===============
export const Chat = ({
  setMessages: setPropMessages,
  isInputFocused,
  setIsInputFocused,
  isMinimized,
  setIsMinimized,
}: ChatProps) => {
  const [messages, dispatch] = useReducer(chatReducer, []);
  const [input, setInput] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const hasLoadedRef = useRef(false);

  const { language, setLanguage, setChatMode, chatMode, t } = useApp()

  // ========== MEMORY ==========
  const getMemory = useCallback((): ChatMemory => {
    try {
      return JSON.parse(localStorage.getItem('chatMemory') || '{}');
    } catch {
      return {};
    }
  }, []);

  const saveMemory = useCallback(
    (newData: Partial<ChatMemory>) => {
      const memory = getMemory();
      const updated = { ...memory, ...newData };
      localStorage.setItem('chatMemory', JSON.stringify(updated));
    },
    [getMemory]
  );

  const detectUserName = useCallback( (msg: string): string | null => {
    const patterns = [
      /\b(?:nama saya|nama aku|namaku)\s+(adalah\s+)?([A-Za-zÀ-ÖØ-öø-ÿ]+)/i,
      /\bpanggil aku\s+([A-Za-zÀ-ÖØ-öø-ÿ]+)/i,
    ];

    for (const p of patterns) {
      const match = msg.match(p);
      if (match) {
        const name = match[2] ?? match[1];
        if (name) {
          saveMemory({ name });
          return name.trim();
        }
      }
    }

    return null;
  }, [saveMemory]);


  // ========== UTIL ==========
  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const clearChat = () => {
    dispatch({ type: 'RESET' });
    localStorage.removeItem('chatHistory');
    localStorage.removeItem('chatMemory');
    setShowConfirm(false)

    setChatMode('default')
  };

  const onMinimize = useCallback(() => setIsMinimized((p) => !p), [setIsMinimized]);

  // ========== SEND MESSAGE ==========
  const sendMessage = useCallback(async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;

      const userMessage: ChatResponseProps = { role: 'user', text: input };
      dispatch({ type: 'ADD', payload: userMessage });
      setInput('');

      detectUserName(input);

      // pilih role placeholder bot berdasarkan chatMode
      const botRole: ChatRole = chatMode === 'telegram' ? 'bot_telegram' : 'bot';

      dispatch({
        type: 'ADD',
        payload: { role: botRole, text: '', isLoading: true },
      });

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: input,
            memory: getMemory(),
            history: messages.slice(-6).map(({ role, text }) => ({ role, text })),
            chatMode,
            language
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          console.log(`HTTP ${res.status}: ${errText}`);
        }

        const data: AIResponse = await res.json();
        const text = data.text ?? 'Data tidak tersedia.';
        const cards = data.cards ?? [];

        // Update last placeholder -> stop loading -> streaming
        dispatch({
          type: 'UPDATE_LAST',
          payload: { isLoading: false, isStreaming: true, text: '' },
        });

        let typed = '';
        for (const char of text) {
          typed += char;
          dispatch({
            type: 'UPDATE_LAST',
            payload: { text: typed, isStreaming: true },
          });
          await new Promise((r) => setTimeout(r, 15));
        }

        // Final text + cards (role sudah sesuai karena placeholder dipilih di atas)
        dispatch({
          type: 'UPDATE_LAST',
          payload: { text, cards, isStreaming: false },
        });
      } catch (err) {
        console.error('Chat API Error:', err);
        dispatch({
          type: 'UPDATE_LAST',
          payload: {
            text: 'Maaf kak, chat lagi gangguan nih. Coba lagi sebentar ya 🙏',
            isLoading: false,
            isStreaming: false,
          },
        });
      }
    },
    [input, detectUserName, getMemory, messages, chatMode] // tambahkan chatMode di dep list
  );

  const onConfirmActionCard = async(action: 'yes' | 'no', typeAction:Action, targetLang?: UILanguage ) => {
    // Hapus confirm card dari pesan bot terakhir
    dispatch({
      type: "UPDATE_LAST",
      payload: { cards: [] }
    });

    if (action === "yes") {
      
      if (typeAction === 'language' && targetLang){
        setLanguage(targetLang);

        await translateAll(targetLang);

        dispatch({
          type: "ADD",
          payload: {
            role: "bot",
            text: `Ok, aku juga mengubah bahasa semua konten`,
            isStreaming: false,
            isLoading: false,
        }})
        
      } else {
        setChatMode('telegram')
        // kirim pesan ke Herry setelah mode switched
        await sendToTelegram("User baru masuk mode Telegram dari website.")

        // Push system confirmation text
        dispatch({
          type: "ADD",
          payload: {
            role: "bot_telegram",
            text: `Sekarang chat kamu akan saya teruskan langsung ke <mark data-type="telegram">telegramnya Herry Widnyana</mark>`,
            isStreaming: false,
            isLoading: false,
          }
        })
      }

      // TODO:CHAT translate
        
    } else {
      dispatch({
        type: "ADD",
        payload: {
          role: "bot",
          text: "Ok, request saya batalkan",
          isStreaming: false,
          isLoading: false,
        }
      });
    }
  }

  // ========== STORAGE ==========
  // Load once
  useEffect(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      const parsed = JSON.parse(saved) as ChatResponseProps[];
      parsed.forEach((m) => dispatch({ type: 'ADD', payload: m }));
    }
    hasLoadedRef.current = true;
  }, []);

  // Save after loaded
  useEffect(() => {
    if (!hasLoadedRef) return;
    localStorage.setItem('chatHistory', JSON.stringify(messages));

    const timeout = setTimeout(() => {
      setPropMessages((prev: ChatResponseProps[]) => {
        if (prev.length !== messages.length) return messages;
        return prev;
      });
    }, 300); // delay 300ms biar gak ikut tiap karakter typewriter

    scrollToBottom();

    return () => clearTimeout(timeout);
  }, [messages, scrollToBottom, setPropMessages, hasLoadedRef]);

  // Scroll ke bawah saat input difokus
  useEffect(() => {
    if (isInputFocused) {
      const timer = setTimeout(scrollToBottom, 500);
      return () => clearTimeout(timer);
    }
  }, [isInputFocused, scrollToBottom]);

  // Keyboard handler untuk HP
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;
    const handleResize = () => {
      const visual = window.visualViewport;
      if (!visual) return;
      setIsInputFocused(visual.height < window.innerHeight - 100);
    };
    window.visualViewport.addEventListener('resize', handleResize);
    handleResize();
    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, [setIsInputFocused]);


  // TELEGRAM
  useEffect(() => {
    const es = new EventSource("/api/telegram/sse");

    es.addEventListener("message", (e) => {
      const data = JSON.parse(e.data);

      dispatch({
        type: "ADD",
        payload: {
          role: "herry_telegram",
          text: data.text,
          isLoading: false,
          isStreaming: false,
        },
      });
    });

    return () => es.close();
  }, []);



  // ========== RENDER ==========
  return (
    <>
      <div
        className={clsx(
          'relative z-50 w-full mx-auto transition-all duration-300 ease-in-out',
          isInputFocused ? '-translate-y-12 sm:-translate-y-26' : 'translate-y-0'
        )}
      >
        <div className="w-full mx-auto rounded-3xl overflow-hidden shadow-2xl border border-gray-600/50">
          {messages.length > 0 && (
            <ChatHeader
              isMinimized={isMinimized}
              onClear={() => setShowConfirm(true)}
              onMinimize={onMinimize}
            />
          )}

          {!isMinimized && messages.length > 0 && (
            <div className="bg-gray-800/70 backdrop-blur-sm max-h-[65vh] sm:max-h-[60vh] overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={msg.role === 'user' ? 'text-right' : ''}>
                  <ChatItem {...msg} />
                  {!!msg.cards?.length && (
                    <div className="max-w-[80%] sm:max-w-[70%] grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 ml-10 sm:ml-13 mb-2">
                      {msg.cards.map((card, j) => (
                        <Card 
                          key={j} 
                          {...card} 
                          onConfirm={onConfirmActionCard}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {chatMode === 'telegram' && (
                <ChatNotice />
              )}

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
