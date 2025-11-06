'use client';

import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

import { ProjectCard } from './projectCard';
import { ContactCard } from './contactCard';
import { memo } from 'react';

const CardComponent = (card: DataItemProps) => {
  switch (card.type) {
    case 'project':
      return <ProjectCard {...card} />;
    case 'contact':
      return <ContactCard {...card} />;
    case 'education':
      return (
        <div>
          <h3 className="font-semibold text-base sm:text-lg">{card.school}</h3>
          <p className="text-sm text-gray-600">{card.major}</p>
          <p className="text-xs text-gray-400">{card.year}</p>
        </div>
      );
    case 'experience':
      return (
        <div className='flex flex-col gap-2'>
          <div className='flex gap-3 items-center'>

          {
            card.icon && typeof card.icon === 'string' && (
              <Image
                src={card.icon}
                alt='company logo'
                height={32}
                width={32}
              />
            )
          }
          <div>
            <h3 className="font-semibold text-base sm:text-lg">{card.company}</h3>
            <p className="text-sm text-gray-700">
                {card.role}
            </p>
            <p className="text-xs text-gray-400 mt-2">{card.year}</p>
          </div>
          
          </div>
          <p className="text-sm mt-1">{card.description}</p>

        </div>
      );
    case 'address':
      return (
        <div>
          <h3 className="font-semibold">{card.address}</h3>
          {card.mapUrl && (
            <iframe
              src={`${card.mapUrl}&output=embed`}
              width="100%"
              height="200"
              style={{ border: 0, borderRadius: '8px', marginTop: '8px' }}
              loading="lazy"
            />
          )}
        </div>
      );
    default:
      return (
        <div>
          <h3 className="font-semibold text-base sm:text-lg">{card.title}</h3>
          <div className="text-sm text-gray-600">
            <ReactMarkdown>{card.description}</ReactMarkdown>
          </div>
        </div>
      );
  }
};

export const Card = memo(({ ...card }: DataItemProps) => (
  <div
    className="flex flex-col gap-3 border p-4 rounded-2xl shadow-sm 
    bg-white text-neutral-800 w-full sm:max-w-[450px] transition hover:shadow-md"
  >
    <CardComponent {...card} />
  </div>
))

Card.displayName = 'Card'
