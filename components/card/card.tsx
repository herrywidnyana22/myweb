'use client';

import Image from 'next/image';
import { memo } from 'react';
import { ProjectCard } from './projectCard';
import { ContactCard } from './contactCard';
import { parseHighlight } from '@/utils/parseHighlight';

const CardComponent = (card: DataItemProps) => {
  switch (card.type) {
    case 'project':
      return <ProjectCard {...card} />;
    case 'contact':
      return <ContactCard {...card} />;
    case 'education':
      return (
        <div className='flex items-center gap-4'>
          {card.icon && typeof card.icon === 'string' && (
              <Image
                src={card.icon}
                alt="company logo"
                height={32}
                width={32}
                className="size-10"
              />
            )}
          <div>
            <h3 className="font-semibold text-primary text-sm sm:text-base md:text-lg">{parseHighlight(card.school || '')}</h3>
            <p className="text-xs sm:text-sm text-gray-600">{parseHighlight(card.major || '')}</p>
            <p className="text-[11px] sm:text-xs text-gray-400">{parseHighlight(card.year || '')}</p>
          </div>
        </div>
      );
    case 'experience':
      return (
        <div className="flex flex-col gap-1 sm:gap-2">
          <div className="flex gap-2 sm:gap-3 items-center">
            {card.icon && typeof card.icon === 'string' && (
              <Image
                src={card.icon}
                alt="company logo"
                height={28}
                width={28}
                className="sm:h-8 sm:w-8"
              />
            )}
            <div>
              <h3 className="font-semibold text-primary text-sm sm:text-base md:text-lg">
                {parseHighlight(card.company || '')}
              </h3>
              <p className="text-xs sm:text-sm text-gray-700">
                {parseHighlight(card.role || '')}
              </p>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
                {parseHighlight(card.year || '')}
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm mt-1 sm:mt-2">{parseHighlight(card.description || '')}</p>
        </div>
      );
    case 'address':
      return (
        <div>
          <h3 className="font-semibold text-sm sm:text-base">{parseHighlight(card.address || '')}</h3>
          {card.mapUrl && (
            <iframe
              src={`${card.mapUrl}&output=embed`}
              width="100%"
              height="160"
              className="rounded-lg sm:rounded-xl mt-2 sm:mt-3"
              loading="lazy"
            />
          )}
        </div>
      );
    default:
      return (
        <div>
          <h3 className="text-sm sm:text-md text-gray-600">{parseHighlight(card.title || '')}</h3>
          <div className="font-semibold text-sm sm:text-base md:text-md">
            <p>{parseHighlight(card.description || '')}</p>
          </div>
        </div>
      );
  }
};

export const Card = memo(({ ...card }: DataItemProps) => (
  <div
    className="
      flex flex-col gap-2 sm:gap-3 
      border p-3 sm:p-4
      rounded-xl sm:rounded-2xl 
      shadow-sm bg-white text-neutral-800 
      w-full sm:max-w-[450px] 
      transition hover:shadow-md
    "
  >
    <CardComponent {...card} />
  </div>
));

Card.displayName = 'Card';
