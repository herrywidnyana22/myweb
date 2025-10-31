import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { Tooltip } from './tooltip';
import { memo } from 'react';

const CardComponent = (card: DataItemProps) => {
  const renderContent = () => {
    switch (card.type) {
      case 'project':
        return (
          <>
            <h3 className="font-bold text-base sm:text-lg">{card.title}</h3>
            <div className="text-sm text-gray-600">
              <ReactMarkdown>{card.description}</ReactMarkdown>
            </div>
            {card.iconCategory && card.iconCategory.length > 0 && (
              <div className="flex gap-1 items-center mt-2">
                {card.iconCategory.map((icon: IconCategoryProps, idx: number) => (
                  <Tooltip key={idx} label={icon.label}>
                    <Image
                      src={icon.src}
                      alt={icon.label}
                      width={20}
                      height={20}
                    />
                  </Tooltip>
                ))}

              </div>
            )}
          </>
        );

      case 'education':
        return (
          <>
            <h3 className="font-bold text-base sm:text-lg">{card.school}</h3>
            <p className="text-sm text-gray-600">{card.major}</p>
            <p className="text-xs text-gray-400">{card.year}</p>
          </>
        );

      case 'experience':
        return (
          <>
            <h3 className="font-bold text-base sm:text-lg">{card.company}</h3>
            <p className="text-sm">{card.role} - {card.location}</p>
            <p className="text-xs text-gray-400">{card.year}</p>
            <div className="text-sm">{card.jobdesk}</div>
          </>
        );

      case 'address':
        return (
          <>
            <h3 className="font-bold">{card.address}</h3>
            {card.mapUrl && (
              <iframe
                src={`${card.mapUrl}&output=embed`}
                width="100%"
                height="250"
                style={{ border: 0, borderRadius: '8px' }}
                loading="lazy"
              />
            )}
          </>
        );

      case 'default':
      default:
        return (
          <>
            <h3 className="font-bold text-base sm:text-lg">{card.title}</h3>
            <div className="text-sm text-gray-600">
              <ReactMarkdown>{card.description}</ReactMarkdown>
            </div>
          </>
        );
    }
  };

  return (
    <div
      className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border p-4 rounded-3xl shadow-md bg-white text-left text-neutral-800 cursor-pointer"
    >
      {card.icon && typeof card.icon === 'string' && (
        <Image
          src={card.icon}
          alt={'icon'}
          width={40}
          height={40}
          className="inline-block object-contain"
        />
      )}
      <div className="flex-1">{renderContent()}</div>
    </div>
  );
};

export const Card = memo(CardComponent);
Card.displayName = 'Card';
