'use client'

import Image from 'next/image';
import Link from 'next/link';
import { parseHighlight } from '@/lib/utils/parseHighlight';
import { useLocalizedText } from '@/hooks/useLocalizedText';

export const ContactCard = (card: Contact) => {
  const { getText } = useLocalizedText();
  const localizedDescription = getText(card.description);
  const localizedTooltip = getText(card.tooltipText);

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

        {card.contactURL ? (
          <Link
            title={localizedTooltip || localizedDescription}
            href={card.contactURL}
            target="_blank"
            rel="noopener noreferrer"
            className="
              text-sky-600 hover:underline truncate
              text-sm
            "
          >
            {parseHighlight(localizedDescription)}
          </Link>
        ) : (
          <span
            title={localizedTooltip || localizedDescription}
            className="
              text-gray-600 truncate
              text-sm
            "
          >
            {parseHighlight(localizedDescription)}
          </span>
        )}
      </div>
    </div>
  );
};
