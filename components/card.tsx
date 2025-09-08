import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export const Card = (cards: DataItemProps) => {
  console.log({ cards });
  return (
    <Link
      href={cards.link || '#'}
      target='_blank'
      rel='noopener noreferrer'
      className='flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between border p-4 rounded-3xl shadow-md bg-white text-left text-neutral-800 cursor-pointer'
    >
      <div className='flex flex-col sm:flex-row gap-3 items-start sm:items-center'>
        {cards.icon && (
          <Image
            width={85}
            height={85}
            src={cards.icon}
            alt={cards.title}
            className='inline-block size-10 sm:size-12 object-contain'
          />
        )}
        <div className='space-y-1 w-full'>
          <h3 className='font-bold text-base sm:text-lg'>{cards.title}</h3>
          <div className='text-sm text-gray-600'>
            <ReactMarkdown>{cards.description}</ReactMarkdown>
          </div>
          {cards.tech && (
            <div className='flex gap-1 items-center mt-2'>
              {cards.icon2 && (
                <Image
                  alt='icon'
                  src={cards.icon2}
                  height={85}
                  width={85}
                  className='inline-block size-3'
                />
              )}
              <p className='text-xs text-gray-400'>{cards.tech.join(', ')}</p>
            </div>
          )}
          {cards.mapUrl && (
            <iframe
              src={`${cards.mapUrl}&output=embed`}
              width='100%'
              height='250'
              style={{ border: 0, borderRadius: '8px' }}
              loading='lazy'
            />
          )}
        </div>
      </div>
    </Link>
  );
};
