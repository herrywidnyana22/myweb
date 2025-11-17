'use client'

import Image from 'next/image';
import Link from 'next/link';

import { useMemo } from 'react';
import { parseHighlight } from '@/utils/parseHighlight';

export const ContactCard = (card: ContactProps) => {
  const fontSizeStyle = useMemo(() => {
    const len = card.description?.length || 0;
    const size = len > 45 ? 11 : len > 25 ? 12 : 14;
    return {
      fontSize: `${size}px`,
      transition: 'font-size 0.2s ease',
    };
  }, [card.description]);

  return (
    <div
      className="
        w-full flex items-center 
        gap-2 sm:gap-4 
        rounded-lg sm:rounded-xl 
        transition 
        p-1.5 sm:p-2
      "
    >
      {card.icon && typeof card.icon === 'string' && (
        <Image
          src={card.icon}
          alt={card.title}
          width={36}
          height={36}
          className="object-contain sm:w-12 sm:h-12"
        />
      )}

      <div className="flex flex-col min-w-0">
        <span className="text-xs sm:text-sm font-medium text-gray-700 capitalize truncate">
          {parseHighlight(card.title || '')}
        </span>

        {card.href ? (
          <Link
            title={card.description}
            href={card.href}
            target="_blank"
            rel="noopener noreferrer"
            style={fontSizeStyle}
            className="
              text-sky-600 hover:underline truncate
              text-[11px] sm:text-[13px] md:text-[15px]
            "
          >
            {parseHighlight(card.description || '')}
          </Link>
        ) : (
          <span
            title={card.description}
            style={fontSizeStyle}
            className="
              text-gray-600 truncate
              text-[11px] sm:text-[13px] md:text-[15px]
            "
          >
            {parseHighlight(card.description || '')}
          </span>
        )}
      </div>
    </div>
  );
};
