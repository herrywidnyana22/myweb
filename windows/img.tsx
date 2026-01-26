'use client';

import Image from 'next/image';
import useWindowStore from '@/store/window';

import { WindowWrapper } from '@/hoc/windowWrapper';
import { WindowHeader } from '@/components/windowHeader';
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
      <WindowHeader
        target='imgfile'
        icon={effectiveIcon}
        title={getText(name)}
      />

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
