'use client';

import { Card } from '@/components/card';
import { ChatHeader } from '@/components/chatHeader';
import DialogConfirm from '@/components/dialogConfirm';
import { Dock } from '@/components/dock';
import { ChatInput } from '@/components/input';
import { ChatLoader } from '@/components/chatLoader';
import { ChatItem } from '@/components/chatItem';
import { PageTitle } from '@/components/pageTitle';
import { useEffect, useRef, useState } from 'react';
import { Profile } from '@/components/profile';
import { Widget } from '@/components/widget';
import { dockItems } from '@/constants';
import { Contact } from '@/components/contact';

export default function Home() {
  const [messages, setMessages] = useState<ChatResponseProps[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false); // ⬅️ untuk toggle minimize
  const [showConfirm, setShowConfirm] = useState(false); // ⬅️ untuk konfirmasi clear
  const [dockTarget, setDockTarget] = useState<DOMRect | null>(null);
  const [openWindowId, setOpenWindowId] = useState<string | null>(null);

  const handleDockClick = (id: string, rect: DOMRect) => {
    if (openWindowId === id) {
      setOpenWindowId(null); // minimize
    } else {
      setDockTarget(rect);
      setOpenWindowId(id); // maximize/open
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);

    const newMessages: ChatResponseProps[] = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      setMessages(prev => [...prev, { role: 'bot', text: data.text, cards: data.cards }]);
    } catch (err) {
      console.error('Error:', err);
      setMessages(prev => [
        ...prev,
        { role: 'bot', text: '⚠️ Sorry, something went wrong.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const onConfirmClear = () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
    setShowConfirm(false);
  };

  const onCancelClear = () => {
    setShowConfirm(false);
  };

  const onMinimize = () => {
    setIsMinimized(prev => !prev);
  };

  useEffect(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <main className='h-screen relative overflow-hidden px-64 py-20'>
      {/* Gradient Background */}
      <div className='absolute inset-0 bg-gradient-to-b from-blue-900 via-purple-900 to-orange-600 opacity-90' />
      <div className='absolute inset-0 bg-black/20' />

      <div className='relative z-10 flex flex-col space-y-12'>
        <PageTitle />

        {/* Chat Window */}
        <div className='relative w-full mx-auto transition'>
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
              <div className='bg-gray-800/70 backdrop-blur-sm max-h-[60vh] overflow-y-auto p-4 space-y-4'>
                {messages.map((msg, i) => (
                  <div key={i} className={msg.role === 'user' ? 'text-right' : ''}>
                    <ChatItem role={msg.role} text={msg.text} />
                    {msg.cards && (
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 ml-10'>
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
              <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} />
            </div>
          </div>
        </div>
      </div>

      {/* Konfirmasi Clear */}
      {showConfirm && (
        <DialogConfirm
          text='Yakin ingin menghapus semua chat sebelumnya?'
          onConfirm={onConfirmClear}
          onCancel={onCancelClear}
        />
      )}
      <Dock items={dockItems} onIconClick={handleDockClick} />
      <div className='grid grid-cols-6 gap-6"'>
        {dockItems.map(item => (
          <Widget
            key={item.id}
            dockTarget={dockTarget}
            isOpen={openWindowId === item.id}
            className={item.className}
          >
            {item.children}
          </Widget>
        ))}
      </div>
    </main>
  );
}
