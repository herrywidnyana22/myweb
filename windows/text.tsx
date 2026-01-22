'use client';

import Image from 'next/image';
import useWindowStore from '@/store/window';
import { WindowWrapper } from '@/hoc/windowWrapper';
import { WindowControls } from '@/components/windowControls';
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
      <div className='flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-400 select-none'>
        <div className='w-24'>
          <WindowControls target={'txtfile'} />
        </div>

        <div className='flex items-center gap-1'>
          {effectiveIcon && (
            <div className='size-4 overflow-hidden rounded-md'>
              <Image
                src={effectiveIcon}
                alt={typeof name === 'string' ? name : getText(name)}
                width={32}
                height={32}
                className='size-4 object-cover'
              />
            </div>
          )}

          <h2 className='text-center'>
            {typeof name === 'string' ? name : getText(name)}
          </h2>
        </div>

        <div className='w-24' />
      </div>

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
