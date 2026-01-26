'use client';

import Image from 'next/image';
import useWindowStore from '@/store/window';
import { WindowWrapper } from '@/hoc/windowWrapper';
import { WindowHeader } from '@/components/windowHeader';
import { getEffectiveIcon } from '@/lib/utils';
import { useLocalizedText } from '@/hooks/useLocalizedText';

const TextWindow = () => {
  const { windows } = useWindowStore();
  const data = windows.txtfile?.data as LocationValue | undefined;
  const { getText } = useLocalizedText();

  if (!data) return null;

  const { name, image, imageUrl, icon, subtitle, description, fileType } = data;
  const effectiveIcon = getEffectiveIcon(icon, fileType);

  return (
    <div className='overflow-hidden rounded-xl shadow-2xl drop-shadow-2xl'>
      <WindowHeader
        target='txtfile'
        icon={effectiveIcon}
        title={typeof name === 'string' ? name : getText(name)}
      />

      <div className='max-w-3xl min-w-md bg-white p-6 text-black'>
        {(image || imageUrl) && (
          <Image
            src={image || imageUrl}
            alt={name}
            width={180}
            height={180}
            className='mb-4 rounded-4xl object-cover'
          />
        )}

        {subtitle && (
          <p className='mb-4 text-sm text-gray-600'>{getText(subtitle)}</p>
        )}

        <div className='space-y-3'>
          {Array.isArray(description) &&
            description.map((p: string, idx: number) => (
              <p key={idx} className='leading-7 text-gray-800'>
                {p}
              </p>
            ))}
          {!Array.isArray(description) && description && (
            <p className='leading-7 text-gray-800'>{getText(description)}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const Text = WindowWrapper(TextWindow, 'txtfile');
