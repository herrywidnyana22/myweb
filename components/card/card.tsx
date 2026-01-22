'use client';

import Image from 'next/image';
import { memo } from 'react';
import { ProjectCard } from './projectCard';
import { ContactCard } from './contactCard';
import { parseHighlight } from '@/lib/utils/parseHighlight';
import { ConfirmCard } from './confirmCard';
import { useLocalizedText } from '@/hooks/useLocalizedText';

type CardProps = DataItemProps & {
  onConfirm: (
    action: ConfirmAction,
    actionType: Action,
    targetLang?: UILanguage
  ) => void;
};

const CardComponent = (card: CardProps) => {
  const { getText } = useLocalizedText();

  switch (card.type) {
    case 'project':
      return <ProjectCard {...card} />;

    case 'contact':
      return <ContactCard {...card} />;

    case 'action':
      return (
        <ConfirmCard
          {...card}
          onConfirm={() =>
            card.onConfirm('yes', card.action, card.targetLanguage)
          }
          onCancel={() =>
            card.onConfirm('no', card.action, card.targetLanguage)
          }
        />
      );

    case 'education':
      return (
        <div className='flex items-center gap-4'>
          {card.icon && typeof card.icon === 'string' && (
            <Image
              src={card.icon}
              alt='company logo'
              height={32}
              width={32}
              className='size-10'
            />
          )}
          <div>
            <h3 className='text-primary text-sm font-semibold sm:text-base md:text-lg'>
              {parseHighlight(card.school ?? '')}
            </h3>
            <p className='text-xs text-gray-600 sm:text-sm'>
              {parseHighlight(getText(card.major) ?? '')}
            </p>
            <p className='text-[11px] text-gray-400 sm:text-xs'>
              {' '}
              {parseHighlight(card.startYear + ' - ' + card.endYear)}
            </p>
          </div>
        </div>
      );
    case 'experience':
      return (
        <div className='flex flex-col gap-1 sm:gap-2'>
          <div className='flex items-center gap-2 sm:gap-3'>
            {card.icon && typeof card.icon === 'string' && (
              <Image
                src={card.icon}
                alt='company logo'
                height={28}
                width={28}
                className='sm:h-8 sm:w-8'
              />
            )}
            <div>
              <h3 className='text-primary text-sm font-semibold sm:text-base md:text-lg'>
                {parseHighlight(card.company ?? '')}
              </h3>
              <p className='text-xs text-gray-700 sm:text-sm'>
                {parseHighlight(getText(card.role) ?? '')}
              </p>
              <p className='mt-1 text-[11px] text-gray-500 sm:text-xs'>
                {parseHighlight(card.start + ' - ' + card.end)}
              </p>
            </div>
          </div>
          <p className='mt-1 text-xs sm:mt-2 sm:text-sm'>
            {parseHighlight(getText(card.description) ?? '')}
          </p>
        </div>
      );
    case 'address':
      return (
        <div>
          <h3 className='text-sm font-semibold sm:text-base'>
            {parseHighlight(getText(card.address) ?? '')}
          </h3>
          {card.mapURL && (
            <iframe
              src={`${card.mapURL}&output=embed`}
              width='100%'
              height='160'
              className='mt-2 rounded-lg sm:mt-3 sm:rounded-xl'
              loading='lazy'
            />
          )}
        </div>
      );

    default:
      return (
        <div>
          <h3 className='sm:text-md text-sm text-gray-600'>
            {parseHighlight(card.title ?? '')}
          </h3>
          <div className='md:text-md text-sm font-semibold sm:text-base'>
            <p>{parseHighlight(getText(card.description) ?? '')}</p>
          </div>
        </div>
      );
  }
};

export const Card = memo((props: CardProps) => {
  return (
    <div className='flex w-full flex-col gap-2 rounded-xl border bg-white p-3 text-neutral-800 shadow-sm transition hover:shadow-md sm:max-w-112.5 sm:gap-3 sm:p-4'>
      <CardComponent {...props} />
    </div>
  );
});

Card.displayName = 'Card';
