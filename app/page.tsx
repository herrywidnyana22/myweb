'use client';

import { Dock } from '@/components/dock';
import { PageTitle } from '@/components/pageTitle';
import { useCallback, useState } from 'react';
import { Widget } from '@/components/widget';
import { dockItems } from '@/constants';
import { Chat } from '@/components/chat/chat';

export default function Home() {
  const [messages, setMessages] = useState<ChatResponseProps[]>([]);
  const [isMinimized, setIsMinimized] = useState(false); // untuk toggle minimize
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [openById, setOpenById] = useState<Record<string, boolean>>({});
  const [targetById, setTargetById] = useState<Record<string, DOMRect | null>>({});

  const handleDockClick = useCallback((id: string, rect: DOMRect) => {
    setTargetById(prev => ({ ...prev, [id]: rect }))
    setOpenById(prev => ({ ...prev, [id]: !prev[id] }))
  }, [])

  return (
    <main className='h-screen relative px-4 sm:px-8 md:px-16 lg:px-32 xl:px-64 py-4 sm:py-10 md:py-16 lg:py-20 overflow-hidden'>
      {/* Gradient Background */}
      <div className='absolute inset-0 bg-linear-to-b from-blue-900 via-purple-900 to-orange-600 opacity-90' />
      <div className='absolute inset-0 bg-black/20' />

      {/* Backdrop overlay when input is focused */}
      {isInputFocused && (
        <div className='absolute inset-0 z-50 backdrop-blur-sm bg-black/30 transition-opacity' />
      )}

      <div className='relative w-full h-full  flex flex-col space-y-8 sm:space-y-10 lg:space-y-12 max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto'>
        {/* Header  */}
        <PageTitle isWidgetOpen={Object.values(openById).every(v => !v)}/>

        {/* Chat */}
        <Chat
          messages={messages}
          setMessages={setMessages}
          setIsInputFocused={setIsInputFocused}
          isMinimized={isMinimized}
          setIsMinimized={setIsMinimized}
        />

        {/* Widget */}
        <div className='w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4 lg:gap-6'>
          {dockItems.map(item => (
            <Widget
              key={item.id}
              dockTarget={targetById[item.id] ?? null}
              isOpen={!!openById[item.id]}
              isChatMaximized={!isMinimized && messages.length > 0}
              className={item.className}
            >
              {item.children}
            </Widget>
          ))}
        </div>
      </div>

      <Dock
        items={dockItems}
        onIconClick={handleDockClick}
        isOpenById={openById}
      />
    </main>
  );
}
