'use client';

import { memo } from 'react';
import { parseHighlight } from '@/lib/utils/parseHighlight';
import { useLocalizedText } from '@/hooks/useLocalizedText';

type AddressCardProps = Address;

const AddressCardComponent = (props: AddressCardProps) => {
  const { getText } = useLocalizedText();

  return (
    <div>
      <h3 className='text-sm font-semibold sm:text-base'>
        {parseHighlight(getText(props.address) ?? '')}
      </h3>
      {props.mapURL && (
        <iframe
          src={`${props.mapURL}&output=embed`}
          width='100%'
          height='160'
          className='mt-2 rounded-lg sm:mt-3 sm:rounded-xl'
          loading='lazy'
        />
      )}
    </div>
  );
};

export const AddressCard = memo(AddressCardComponent);
AddressCard.displayName = 'AddressCard';
