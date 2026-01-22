'use client';

import Image from 'next/image';
import useDataStore from '@/store/data';
import { Tooltip } from '../tooltip';
import { useLocalizedText } from '@/hooks/useLocalizedText';

export const Education = () => {
  const { educations, isLoading, error } = useDataStore();
  const { getText, getUIText } = useLocalizedText();

  // Skeleton loader
  if (isLoading) {
    return (
      <div className='grid grid-cols-2 place-items-center gap-4 p-4 sm:flex sm:flex-row sm:gap-6 sm:p-6'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className='flex animate-pulse flex-col items-center gap-2'
          >
            <div className='relative flex size-14 items-center justify-center rounded-full bg-gray-300 sm:size-16' />
            <div className='h-2 w-20 rounded bg-gray-300' />
            <div className='h-2 w-16 rounded bg-gray-200' />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className='p-4 text-center text-red-400'>
        {getUIText('dataLoadFailed')}
      </p>
    );
  }

  if (!educations?.length) {
    return (
      <p className='p-4 text-center text-gray-100'>{getUIText('dataEmpty')}</p>
    );
  }

  return (
    <div className='relative w-full overflow-x-hidden sm:overflow-x-auto'>
      <div className='grid grid-cols-2 items-start justify-center gap-2 p-3 sm:flex sm:flex-row sm:gap-4 sm:px-6 sm:py-8 xl:gap-10'>
        {educations.map((edu, i) => (
          <Tooltip key={i} label={edu.school}>
            <div className='relative flex w-full flex-col items-center text-center sm:w-auto'>
              {/* Icon utama */}
              <div className='relative flex size-14 items-center justify-center rounded-2xl border-2 border-orange-400 bg-white shadow-md sm:size-16'>
                {typeof edu.schoolLogo === 'string' && (
                  <Image
                    src={edu.schoolLogo}
                    alt={edu.school}
                    width={36}
                    height={36}
                    className='size-8 object-contain sm:size-10'
                  />
                )}
                {typeof edu.icon === 'string' && (
                  <Image
                    src={edu.icon}
                    alt='graduation'
                    width={16}
                    height={16}
                    className='absolute right-0 bottom-0 size-4 object-contain sm:size-5'
                  />
                )}
              </div>

              {/* Garis penghubung (Desktop only) */}
              {i < educations.length - 1 && (
                <div className='from-primary absolute top-8 left-[calc(100%-2rem)] hidden h-0.5 w-20 bg-linear-to-r to-yellow-400 sm:left-[calc(100%-2.5rem)] sm:block sm:w-24 xl:left-[calc(100%-3rem)]' />
              )}

              {/* Info pendidikan */}
              <div className='mt-0 w-36 sm:mt-3 sm:w-44'>
                <h3 className='text-primary hidden text-xs leading-tight font-bold uppercase sm:block sm:text-sm md:text-base'>
                  {edu.school}
                </h3>
                <p className='mt-1 hidden text-xs leading-snug text-white sm:block'>
                  {getText(edu.major)}
                </p>
                <p className='mt-1 text-[10px] text-white sm:text-xs'>
                  {edu.startYear} - {edu.endYear}
                </p>
              </div>
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};
