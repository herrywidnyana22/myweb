'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useLocalizedText } from '@/hooks/useLocalizedText';

export const Menu = ({
  items,
  title,
  activeLocation,
  onClick,
  className,
}: MenuProps) => {
  const { getText, getUIText } = useLocalizedText();

  return (
    <div>
      {title && (
        <h3 className='mb-1 text-xs font-medium text-gray-400'>
          {getUIText(title)}
        </h3>
      )}
      <ul className={clsx(className ?? className)}>
        {items.map(item => (
          <li
            key={item.id}
            onClick={() => onClick?.(item)}
            className={clsx(
              'flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 transition-colors',
              item.id === activeLocation?.id
                ? 'bg-primary-light text-primary-hover'
                : 'text-gray-700 hover:bg-gray-200'
            )}
          >
            <Image
              src={item.icon}
              alt={
                typeof item.name === 'string'
                  ? getUIText(item.name)
                  : getText(item.name)
              }
              width={64}
              height={64}
              className='size-4'
            />

            <p className='truncate text-xs font-medium md:text-sm'>
              {typeof item.name === 'string'
                ? getUIText(item.name)
                : getText(item.name)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
