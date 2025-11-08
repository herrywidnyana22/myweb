'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatHeader } from '@/components/chat/chatHeader';
import { ChatInput } from '@/components/chat/chatInput';
import { ChatItem } from '@/components/chat/chatItem';
import DialogConfirm from '../dialogConfirm';
import { Card } from '@/components/card/card';
import clsx from 'clsx';

export const Chat = ({
  messages: propMessages,
  setMessages: setPropMessages,
  isInputFocused,
  setIsInputFocused,
  setIsMinimized,
  isMinimized,
}: ChatProps) => {
  const [messages, setMessages] = useState<ChatResponseProps[]>(propMessages || []);
  const [input, setInput] = useState('');
  const [showConfirm, setShowConfirm] = useState(false)

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const onMinimize = useCallback(() => {
      setIsMinimized(prev => !prev)
    }, [setIsMinimized])

  // Scroll ke bawah otomatis
  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const sendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatResponseProps = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Tambahkan pesan bot loading
    setMessages((prev) => [
      ...prev,
      { role: 'bot', text: '', isStreaming: true, isLoading: true },
    ]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: input }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No stream reader');

      let aiText = '';
      const displayQueue: string[] = []; // antrian karakter
      let cards: DataItemProps[] = [];
      let started = false;

      // Baca stream dari Gemini
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        aiText += decoder.decode(value, { stream: true });

        // Matikan loader ketika stream pertama datang
        if (!started && aiText.length > 0) {
          started = true;
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.role === 'bot') {
              updated[updated.length - 1] = { ...last, isLoading: false, isStreaming: true };
            }
            return updated;
          });
        }

        // Tambahkan karakter baru ke antrian
        const nextChars = aiText.slice(displayQueue.length);
        displayQueue.push(...nextChars);
      }

      // Jalankan efek ngetik (per huruf)
      for (let i = 0; i < aiText.length; i++) {
        const partialText = aiText.slice(0, i + 1);
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === 'bot') {
            updated[updated.length - 1] = {
              ...last,
              text: partialText,
              isStreaming: true,
              isLoading: false,
            };
          }
          return updated;
        });

        await new Promise((r) => setTimeout(r, 25)); // kecepatan ngetik
      }

      // Setelah selesai, ambil cards dari header
      const cardsHeader = res.headers.get('X-Cards');
      if (cardsHeader) {
        try {
          cards = JSON.parse(cardsHeader);
        } catch {
          cards = [];
        }
      }

      // Final update: nonaktifkan streaming
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last && last.role === 'bot') {
          updated[updated.length - 1] = {
            ...last,
            text: aiText,
            cards,
            isStreaming: false,
            isLoading: false,
          };
        }
        return updated;
      });
    } catch (err) {
      console.error('Chat stream error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Maaf, terjadi kesalahan server.', isStreaming: false },
      ]);
    }
  }, [input]);


  // Simpan riwayat chat di localStorage
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
    setPropMessages(messages);
    scrollToBottom();
  }, [messages, scrollToBottom, setPropMessages]);

  // Load chat dari localStorage saat awal
  useEffect(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // Deteksi keyboard di HP
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <div
        className={clsx('relative z-50 w-full mx-auto transition-all duration-300 ease-in-out',
          isInputFocused 
          ? '-translate-y-8' 
          : 'translate-y-0'
        )}
      >
        <div className='w-full mx-auto rounded-3xl overflow-hidden shadow-2xl border border-gray-600/50 '>
            {/* Chat Header */}
            {messages.length > 0 && (
              <ChatHeader
                isMinimized={isMinimized}
                onClear={() => setShowConfirm(true)}
                onMinimize={onMinimize}
              />
            )}

              {!isMinimized && messages.length > 0 && (
              <div className='bg-gray-800/70 backdrop-blur-sm max-h-[65vh] sm:max-h-[60vh] overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4'>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={msg.role === 'user' ? 'text-right' : ''}
                  >
                    <ChatItem {...msg} />
                    {msg.cards && msg.cards.length > 0 && (
                      <div className='max-w-[80%] sm:max-w-[70%] grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 ml-10 sm:ml-13 mb-2'>
                        {msg.cards.map((proj, j) => (
                          <Card key={j} {...proj} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              <div ref={chatEndRef} />
            </div>
          )}

          <div className="bg-gray-900/90 border-t border-gray-700 p-3">
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
          onConfirm={() => {
            setMessages([]);
            localStorage.removeItem('chatHistory');
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
};
