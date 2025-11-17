'use client'

import Image from 'next/image';
import Link from 'next/link';

import { useMemo } from 'react';
import { parseHighlight } from '@/utils/parseHighlight';

export const ContactCard = (card: ContactProps) => {

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
          className="object-contain size-8 sm:size-10"
        />
      )}

      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-gray-700 capitalize truncate">
          {parseHighlight(card.title || '')}
        </span>

        {card.href ? (
          <Link
            title={card.description}
            href={card.href}
            target="_blank"
            rel="noopener noreferrer"
            className="
              text-sky-600 hover:underline truncate
              text-sm
            "
          >
            {parseHighlight(card.description || '')}
          </Link>
        ) : (
          <span
            title={card.description}
            className="
              text-gray-600 truncate
              text-sm
            "
          >
            {parseHighlight(card.description || '')}
          </span>
        )}
      </div>
    </div>
  );
};
