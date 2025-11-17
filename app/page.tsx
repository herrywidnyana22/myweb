'use client';

import { Dock } from '@/components/dock';
import { PageTitle } from '@/components/pageTitle';
import { useCallback, useState } from 'react';
import { Widget } from '@/components/widget';
import { dockItems } from '@/components/dockItems';
import { Chat } from '@/components/chat/chat';
import clsx from 'clsx';
import { useChat } from '@/context/ChatContex';

export default function Home() {
  const {
    messages,
    isMinimized,
    isInputFocused,
  } = useChat();

  const [openById, setOpenById] = useState<Record<string, boolean>>({});
  const [targetById, setTargetById] = useState<Record<string, DOMRect | null>>({});

  const handleDockClick = useCallback((id: string, rect: DOMRect) => {
    setTargetById(prev => ({ ...prev, [id]: rect }));
    setOpenById(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  return (
    <main
      className="
        relative min-h-screen w-full overflow-x-hidden overflow-y-auto
        px-4 sm:px-8 md:px-16 lg:px-32 xl:px-64 
        py-4 sm:py-10
        pb-24 sm:pb-32
      "
    >
      {/* Background Layer */}
      <div className="absolute inset-0 bg-linear-to-b from-blue-900 via-purple-900 to-[--color-primary-hover] opacity-90 -z-10" />
      <div className="absolute inset-0 bg-black/20 -z-10" />

      {/* Overlay saat input aktif */}
      {isInputFocused && (
        <div className="absolute inset-0 z-50 backdrop-blur-sm bg-black/30 transition-opacity" />
      )}

      {/* Content Wrapper */}
      <div
        className="
          relative flex flex-col w-full
          space-y-2 sm:space-y-4 md:space-y-8
          max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto
        "
      >
        <PageTitle isWidgetOpen={Object.values(openById).every(v => !v)} isMinimize={isMinimized} />

        <Chat />

        {/* WIDGET */}
        <div
          className="
            w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 
            gap-3 sm:gap-4 lg:gap-6
          "
        >
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

      {/* DOCK */}
      <div
        className={clsx(
          'fixed bottom-0 left-1/2 -translate-x-1/2 z-50',
          isInputFocused ? 'hidden sm:block' : 'block'
        )}
      >
        <Dock
          items={dockItems}
          onIconClick={handleDockClick}
          isOpenById={openById}
        />
      </div>
    </main>
  );
}
