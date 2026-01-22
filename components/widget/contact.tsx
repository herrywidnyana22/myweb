'use client';

import Image from 'next/image';
import Link from 'next/link';
import useDataStore from '@/store/data';
import { Tooltip } from '../tooltip';
import { useLocalizedText } from '@/hooks/useLocalizedText';

export const Contact = () => {
  const { contacts, isLoading } = useDataStore();
  const { getText, getUIText } = useLocalizedText();

  if (isLoading) {
    return (
      <div className='grid grid-cols-2 place-items-center gap-2 p-3 sm:gap-3 sm:p-6'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className='flex flex-col items-center'>
            <div className='relative flex flex-col items-center justify-center gap-2'>
              <div className='flex size-12 animate-pulse items-center justify-center rounded-xl bg-gray-700 sm:size-16' />
              <div className='mt-2 h-2 w-10 animate-pulse rounded bg-gray-600 sm:w-12' />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!contacts?.length) {
    return (
      <p className='p-4 text-center text-gray-100'>{getUIText('dataEmpty')}</p>
    );
  }

  return (
    <div className='grid grid-cols-2 place-items-center gap-3 p-3 sm:p-6'>
      {contacts?.map((item, i) => (
        <Tooltip
          key={item.id || i}
          label={getText(item.description)}
          bgColor={item.bgColor}
          textColor='text-white'
        >
          <Link
            href={item.contactURL || '#'}
            target='_blank'
            rel='noopener noreferrer'
            className='flex flex-col items-center'
          >
            <div className='relative flex cursor-pointer flex-col items-center justify-center gap-1 transition-transform duration-300 hover:scale-105 sm:hover:scale-110'>
              <div
                style={{ backgroundColor: item.bgColor }}
                className='flex size-13 items-center justify-center rounded-xl p-1.5 shadow-sm sm:size-12 sm:p-2'
              >
                {item.icon && typeof item.icon === 'string' && (
                  <Image
                    src={item.icon}
                    alt='contact icon'
                    height={60}
                    width={60}
                    className='size-10 object-contain sm:size-14'
                  />
                )}
              </div>

              <p className='truncate text-center text-xs text-white capitalize md:w-14 lg:w-full'>
                {item.title}
              </p>
            </div>
          </Link>
        </Tooltip>
      ))}
    </div>
  );
};
