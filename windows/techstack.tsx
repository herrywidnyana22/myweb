'use client';

import Image from 'next/image';
import useWindowStore from '@/store/window';

import { WindowHeader } from '@/components/windowHeader';
import { WindowWrapper } from '@/hoc/windowWrapper';
import { Check, Flag } from 'lucide-react';
import { getEffectiveIcon } from '@/lib/utils';
import { useLocalizedText } from '@/hooks/useLocalizedText';

const TechstackWindow = () => {
  const { windows } = useWindowStore();
  const { getText, getUIText } = useLocalizedText();

  const data = windows.techstack?.data as LocationValue | undefined;

  if (!data) return null;

  const { name, projectName, icon, techStack, fileType } = data;
  const dataLength = techStack.length;
  const effectiveIcon = getEffectiveIcon(icon, fileType);

  return (
    <div className='overflow-hidden rounded-xl font-mono shadow-2xl drop-shadow-2xl'>
      <WindowHeader
        target='techstack'
        icon={effectiveIcon}
        title={getText(name)}
      />

      {/* BODY */}
      <div className='space-y-4 bg-white p-5'>
        <p className='text-gray-600'>
          <span className='font-semibold text-black'>
            {typeof projectName === 'string'
              ? projectName
              : getText(projectName)}
          </span>
          {getUIText('techstack')}
        </p>

        {/* TABLE HEADER */}
        <div className='grid grid-cols-[220px_1fr] pt-3 text-sm font-semibold text-gray-700'>
          <p className='ml-6'>{getUIText('category')}</p>
          <p className='ml-2'>{getUIText('technologies')}</p>
        </div>

        <hr className='my-2 border-dashed border-gray-400' />

        {/* TABLE CONTENT */}
        <div className='space-y-2'>
          {techStack.map((tech: any, i: number) => (
            <div
              key={i}
              className='grid grid-cols-[220px_1fr] items-start gap-2'
            >
              <div className='flex items-center gap-2 font-semibold text-green-600'>
                <Check size={16} />
                {tech.category}
              </div>

              <p className='text-sm text-gray-800'>{tech.items.join(', ')}</p>
            </div>
          ))}
        </div>

        <hr className='my-3 border-dashed border-gray-400' />

        {/* FOOTER STATUS */}
        <div className='mt-4 space-y-2 text-sm'>
          <p className='flex items-center gap-2 text-green-600'>
            <Check size={16} />
            {`${dataLength} of ${dataLength} ${getUIText('stackLoaded')} (100%)`}
          </p>

          <p className='flex items-center gap-2 text-black'>
            <Flag size={14} fill='black' />
            {getUIText('renderTime')}
          </p>
        </div>
      </div>
    </div>
  );
};

export const TechStack = WindowWrapper(TechstackWindow, 'techstack');
