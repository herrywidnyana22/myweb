
import { useCallback, useEffect, useRef, useState } from 'react';
import { Card } from '@/components/card';
import { ChatHeader } from '@/components/chatHeader';
import { ChatInput } from '@/components/input';
import { ChatLoader } from '@/components/chatLoader';
import { ChatItem } from '@/components/chatItem';

import DialogConfirm from './dialogConfirm';

export const Chat = ({
    messages: propMessages,
    setMessages: setPropMessages,
    setIsInputFocused,
    setIsMinimized,
    isMinimized,
}:ChatProps) => {
    const [messages, setMessages] = useState<ChatResponseProps[]>(() => {
        if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('chatHistory');
        if (saved) return JSON.parse(saved);
        }
        return propMessages || [];
    })
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false) // untuk konfirmasi clear

    const chatEndRef = useRef<HTMLDivElement | null>(null)

    const onMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    const onConfirmClear = () => {
        setMessages([]);
        localStorage.removeItem('chatHistory')
        setShowConfirm(false);
    }

    const onCancelClear = () => {
        setShowConfirm(false);
    }

     const scrollToBottom = useCallback(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const sendMessage = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault()

        if (!input.trim()) return

        setIsLoading(true);

        const newMessages: ChatResponseProps[] = [
            ...messages,
            { role: 'user', text: input },
        ];
        setMessages(newMessages)
        setInput('')

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify({ message: input }),
            });

            const data = await res.json();

            setMessages((prev: ChatResponseProps[]) => [
                ...prev,
                {
                    role: 'bot',
                    text: data.text || 'Data tidak tersedia.',
                    cards: data.cards?.length ? data.cards : [],
                },
            ])

        } catch {
            setMessages((prev: ChatResponseProps[]) => [
                ...prev,
                { role: 'bot', text: '⚠️ Sorry, something went wrong.', cards: [] },
            ]);

        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setPropMessages(messages);
        localStorage.setItem('chatHistory', JSON.stringify(messages));
        scrollToBottom();
    }, [messages, setPropMessages, scrollToBottom]);
    
    return ( 
    <>
        {/* Chat Window */}
        <div className='relative z-1000 w-full mx-auto transition'>
          <div className='w-full mx-auto rounded-3xl overflow-hidden shadow-2xl border border-gray-600/50 '>
            {/* Chat Header */}
            {messages.length > 0 && (
              <ChatHeader
                isMinimized={isMinimized}
                onClear={() => setShowConfirm(true)}
                onMinimize={onMinimize}
              />
            )}

            {/* Chat Body */}
            {!isMinimized && messages.length > 0 && (
              <div className='bg-gray-800/70 backdrop-blur-sm max-h-[65vh] sm:max-h-[60vh] overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4'>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={msg.role === 'user' ? 'text-right' : ''}
                  >
                    <ChatItem role={msg.role} text={msg.text} />

                    {msg.cards && msg.cards.length > 0 && (
                      <div className='max-w-[80%] sm:max-w-[70%] grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 ml-13 mb-2'>
                        {msg.cards.map((proj, j) => (
                          <Card key={j} {...proj} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <ChatItem role='bot'>
                    <ChatLoader />
                  </ChatItem>
                )}
                <div ref={chatEndRef} />
              </div>
            )}

            {/* Footer / Input Area */}
            <div className='bg-gray-900/90 border-t border-gray-700 p-3'>
              <ChatInput
                input={input}
                setInput={setInput}
                sendMessage={sendMessage}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
              />
            </div>
          </div>
        </div>

        {/* Konfirmasi Clear */}
        {showConfirm && (
            <DialogConfirm
                text='Yakin ingin menghapus semua chat ini?'
                onConfirm={onConfirmClear}
                onCancel={onCancelClear}
            />
        )}
    </>
    );
}