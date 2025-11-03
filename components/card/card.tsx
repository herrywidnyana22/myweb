'use client';

import ReactMarkdown from 'react-markdown';
import { ProjectCard } from './ProjectCard';
import { ContactCard } from './ContactCard';
import { memo } from 'react';

const CardComponent = (card: DataItemProps) => {
  console.log({card})
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
        <div>
          <h3 className="font-semibold text-base sm:text-lg">{card.company}</h3>
          <p className="text-sm text-gray-700">
            {card.role} - {card.location}
          </p>
          <p className="text-xs text-gray-400">{card.year}</p>
          <div className="text-sm mt-1">{card.jobdesk}</div>
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
