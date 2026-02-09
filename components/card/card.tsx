'use client';

import { memo } from 'react';
import { ProjectCard } from './projectCard';
import { ContactCard } from './contactCard';
import { EducationCard } from './educationCard';
import { ExperienceCard } from './experienceCard';
import { AddressCard } from './addressCard';
import { DefaultCard } from './defaultCard';
import { ConfirmCard } from './confirmCard';

type CardProps = DataItemProps & {
  onConfirm: (
    action: ConfirmAction,
    actionType: Action,
    targetLang?: UILanguage
  ) => void;
};

const CardComponent = (card: CardProps) => {
  console.log({ card });

  switch (card.category) {
    case 'project':
      return <ProjectCard {...card} />;

    case 'contact':
      return <ContactCard {...card} />;

    case 'education':
      return <EducationCard {...card} />;

    case 'experience':
      return <ExperienceCard {...card} variant='chat' />;

    case 'address':
      return <AddressCard {...card} />;

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

    default:
      return <DefaultCard {...card} />;
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
