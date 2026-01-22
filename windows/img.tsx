'use client';

import Image from 'next/image';
import useWindowStore from '@/store/window';

import { WindowWrapper } from '@/hoc/windowWrapper';
import { WindowControls } from '@/components/windowControls';
import { getEffectiveIcon } from '@/lib/utils';
import { useLocalizedText } from '@/hooks/useLocalizedText';

const ImageWindow = () => {
  const { windows } = useWindowStore();
  const { getText, getUIText } = useLocalizedText();

  const data = windows.imgfile?.data as LocationValue | undefined;

  if (!data) return null;

  const { name, imageUrl, icon, fileType } = data;
  const effectiveIcon = getEffectiveIcon(icon, fileType);

  return (
    <div className='overflow-hidden rounded-xl shadow-2xl drop-shadow-2xl'>
      <div className='flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-400 select-none'>
        <div className='controls-area w-24'>
          <WindowControls target={'imgfile'} />
        </div>

        <div className='flex items-center gap-1'>
          {effectiveIcon && (
            <div className='size-4 overflow-hidden rounded-md'>
              <Image
                src={effectiveIcon}
                alt={`${name} icon`}
                width={32}
                height={32}
                className='size-4 object-cover'
              />
            </div>
          )}

          <h2 className='text-center'>{getText(name)}</h2>
        </div>

        <div className='w-24' />
      </div>

      <div className='flex justify-center bg-white p-4 text-black'>
        {imageUrl ? (
          <div className='max-h-[70vh] overflow-hidden rounded-md'>
            <Image
              src={imageUrl}
              alt={getText(name)}
              width={900}
              height={600}
              className='rounded-md object-contain'
            />
          </div>
        ) : (
          <p className='text-gray-600'>{getUIText('emptyImage')}</p>
        )}
      </div>
    </div>
  );
};

export const Img = WindowWrapper(ImageWindow, 'imgfile');
