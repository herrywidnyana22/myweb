'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

export const ContactCard = (card: ContactProps) => {

  const fontSizeStyle = useMemo(() => {
    const len = card.description?.length || 0;
    const size =
      len > 45 ? 12 : len > 25 ? 14 : 16
    return { fontSize: `${size}px`, transition: 'font-size 0.2s ease' };
  }, [card.description])

  return (
    <div className="w-full flex items-center gap-4 hover:bg-gray-100 rounded-xl transition p-1">
      {card.icon && typeof card.icon === 'string' && (
        <Image
          src={card.icon}
          alt={card.title}
          width={32}
          height={32}
          className="object-contain"
        />
      )}
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-gray-700 capitalize truncate">
          {card.title}
        </span>

        {card.href ? (
          <Link
            title={card.description}
            href={card.href}
            target="_blank"
            rel="noopener noreferrer"
            style={fontSizeStyle} 
            className={' text-sky-600 hover:underline truncate'}
          >
            {card.description}
          </Link>
        ) : (
          <span 
            title={card.description}
            style={fontSizeStyle} 
            className="text-gray-600 truncate" 
          >
            {card.description}
          </span>
        )}
      </div>
    </div>
  );
};
