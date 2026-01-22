'use client';

import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { parseHighlight } from '@/lib/utils/parseHighlight';
import { useLocalizedText } from '@/hooks/useLocalizedText';

export const ExperienceCard = (exp: Experience) => {
  const { getText } = useLocalizedText();

  return (
    <div className='flex h-full w-full overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 sm:rounded-2xl'>
      {/* Left Area */}
      <div className='from-primary to-primary-hover flex w-3 shrink-0 items-center justify-center bg-linear-to-br' />

      {/*Right Content Section */}
      <div className='flex w-full flex-col gap-1 p-3 sm:gap-2 sm:p-5 md:p-6'>
        {/* Header: Company + Year */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center justify-center gap-3'>
            {exp.icon && typeof exp.icon === 'string' && (
              <Image
                src={exp.icon}
                alt={exp.company}
                width={24}
                height={24}
                className='object-contain opacity-90 sm:h-6 sm:w-6'
              />
            )}
            <div className='flex flex-col justify-center'>
              <h3 className='text-primary text-sm leading-tight font-extrabold uppercase sm:text-base md:text-lg'>
                {parseHighlight(exp.company || '')}
              </h3>
              <p className='text-xs font-semibold text-gray-500 sm:text-sm'>
                {parseHighlight(getText(exp.role) || '')}
              </p>
            </div>
          </div>
          <span className='text-[10px] font-semibold whitespace-nowrap text-gray-400 uppercase sm:text-xs'>
            {exp.start} - {exp.end}
          </span>
        </div>

        {/* Job Title + Description */}
        <div className='mt-1 flex flex-col gap-1 sm:gap-1.5'>
          <span className='text-xs leading-snug text-gray-500 sm:text-sm'>
            {parseHighlight(getText(exp.description) || '')}
          </span>

          {/* Location */}
          <div className='mt-2 flex items-center gap-1 text-gray-500 sm:gap-1.5'>
            <MapPin size={12} className='rotate-10 sm:size-4' />
            <span className='truncate text-[10px] italic sm:text-xs'>
              {parseHighlight(exp.location || '')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
