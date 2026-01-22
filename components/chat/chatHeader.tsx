'use client';

import { Avatar } from '../avatar';
import { Minimize2, Trash2 } from 'lucide-react';
import { TelegramStatus } from '../telegramStatus';
import { useCallback } from 'react';
import { useAppStore } from '@/store/app';
import { useLocalizedText } from '@/hooks/useLocalizedText';

export const ChatHeader = ({ onClear }: ChatHeaderProps) => {
  const { chatMode, setIsMinimized, setIsInputFocused } = useAppStore();
  const onMinimize = useCallback(() => {
    setIsMinimized(p => !p);
    setIsInputFocused(false);
  }, [setIsMinimized]);

  const { getUIText } = useLocalizedText();

  return (
    <div className='flex items-center justify-between border-b bg-gray-900/80 p-3'>
      <div className='flex items-center gap-3'>
        <div className='inset-0 flex size-9 items-center justify-center rounded-full bg-white/10'>
          <Avatar
            src='/images/profile.webp'
            alt='Bot'
            className='relative z-10 size-8 rounded-full object-cover transition-all duration-300 sm:size-10'
          />
        </div>
        <div>
          <div className='text-sm font-semibold'>Herry Widnyana</div>
          <div className='text-xs text-gray-400'>Fullstack Developer</div>
        </div>
      </div>

      {chatMode === 'telegram' && <TelegramStatus />}

      <div className='flex gap-2'>
        <button
          onClick={onMinimize}
          title={getUIText('minimize')}
          className='rounded-md p-2 hover:bg-white/5'
        >
          <Minimize2 size={16} />
        </button>
        <button
          onClick={onClear}
          title={getUIText('clear')}
          className='rounded-md p-2 hover:bg-white/5'
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
