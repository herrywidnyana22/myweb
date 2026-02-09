'use client';

import { memo } from 'react';
import { parseHighlight } from '@/lib/utils/parseHighlight';
import { useLocalizedText } from '@/hooks/useLocalizedText';

type DefaultCardProps = DefaultCardData;

const DefaultCardComponent = (props: DefaultCardProps) => {
  const { getText } = useLocalizedText();

  return (
    <div>
      <h3 className='sm:text-md text-sm text-gray-600'>
        {parseHighlight(props.title ?? '')}
      </h3>
      <div className='md:text-md text-sm font-semibold sm:text-base'>
        <p>{parseHighlight(getText(props.description) ?? '')}</p>
      </div>
    </div>
  );
};

export const DefaultCard = memo(DefaultCardComponent);
DefaultCard.displayName = 'DefaultCard';
