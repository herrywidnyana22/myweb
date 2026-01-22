'use client';

import Image from 'next/image';

import { Tooltip } from './tooltip';
import { useLocalizedText } from '@/hooks/useLocalizedText';

export const TelegramStatus = () => {
  const { getUIText } = useLocalizedText();

  return (
    <Tooltip label={getUIText('telegramStatus')}>
      <span className='flex cursor-pointer items-center justify-center gap-2 rounded-full p-1 text-xs shadow-sm transition hover:bg-gray-200'>
        <Image
          src={'/icons/telegram.png'}
          alt='telegram icon'
          height={32}
          width={32}
          className='size-4 object-cover'
        />
      </span>
    </Tooltip>
  );
};
