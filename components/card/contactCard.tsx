'use client';

import Image from 'next/image';
import Link from 'next/link';
import { parseHighlight } from '@/lib/utils/parseHighlight';
import { useLocalizedText } from '@/hooks/useLocalizedText';

export const ContactCard = (card: Contact) => {
  const { getText } = useLocalizedText();
  const localizedDescription = getText(card.description);
  const localizedTooltip = getText(card.tooltipText);

  return (
    <div className='flex w-full items-center gap-2 rounded-lg p-1.5 transition sm:gap-4 sm:rounded-xl sm:p-2'>
      {card.icon && typeof card.icon === 'string' && (
        <div
          style={{ backgroundColor: card.bgColor }}
          className='flex size-10 items-center justify-center rounded-xl p-1.5 shadow-sm sm:size-12 sm:p-2'
        >
          <Image
            src={card.icon}
            alt={card.title}
            width={36}
            height={36}
            className='size-8 object-contain sm:size-10'
          />
        </div>
      )}

      <div className='flex min-w-0 flex-col'>
        <span className='truncate text-sm font-medium text-gray-700 capitalize'>
          {parseHighlight(card.title || '')}
        </span>

        {card.contactURL ? (
          <Link
            title={localizedTooltip || localizedDescription}
            href={card.contactURL}
            target='_blank'
            rel='noopener noreferrer'
            className='truncate text-sm text-sky-600 hover:underline'
          >
            {parseHighlight(localizedDescription)}
          </Link>
        ) : (
          <span
            title={localizedTooltip || localizedDescription}
            className='truncate text-sm text-gray-600'
          >
            {parseHighlight(localizedDescription)}
          </span>
        )}
      </div>
    </div>
  );
};
