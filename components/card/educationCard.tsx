'use client';

import Image from 'next/image';
import { memo } from 'react';
import { parseHighlight } from '@/lib/utils/parseHighlight';
import { useLocalizedText } from '@/hooks/useLocalizedText';

const EducationCardComponent = (props: Education) => {
  const { getText } = useLocalizedText();

  return (
    <div className='flex items-center gap-4'>
      {props.schoolLogo && typeof props.schoolLogo === 'string' && (
        <Image
          src={props.schoolLogo}
          alt='school logo'
          height={32}
          width={32}
          className='size-10'
        />
      )}
      <div>
        <h3 className='text-primary text-sm font-semibold sm:text-base md:text-lg'>
          {parseHighlight(props.school ?? '')}
        </h3>
        <p className='text-xs text-gray-600 sm:text-sm'>
          {parseHighlight(getText(props.major) ?? '')}
        </p>
        <p className='text-[11px] text-gray-400 sm:text-xs'>
          {parseHighlight(props.startYear + ' - ' + props.endYear)}
        </p>
      </div>
    </div>
  );
};

export const EducationCard = memo(EducationCardComponent);
EducationCard.displayName = 'EducationCard';
