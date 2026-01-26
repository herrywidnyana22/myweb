'use client';

import Image from 'next/image';
import useWindowStore from '@/store/window';
import { WindowWrapper } from '@/hoc/windowWrapper';
import { WindowHeader } from '@/components/windowHeader';
import { Icon } from '@/components/icon';
import { ProgressCircle } from '@/components/charts/circleProgress';
import { useLocalizedText } from '@/hooks/useLocalizedText';

const ProjectInfoWindow = () => {
  const { windows } = useWindowStore();
  const { getText, getUIText } = useLocalizedText();
  const projects = windows.projectInfo?.data as LocationValue | undefined;

  if (!projects) return null;

  console.log({ projects, windows });

  return (
    <div className='overflow-hidden rounded-xl shadow-2xl drop-shadow-2xl'>
      <WindowHeader
        target='projectInfo'
        icon={projects.subIcon}
        title={getText(projects.name)}
      />

      <div className='max-w-3xl min-w-md space-y-4 bg-white p-6 text-black'>
        <div className='absolute top-16 right-12 sm:float-right sm:ml-3'>
          <ProgressCircle
            value={projects.progress as number}
            label={getUIText('progress')}
          />
        </div>
        <div className='mb-4 flex items-center gap-3'>
          {projects.subIcon && (
            <Image
              src={projects.subIcon}
              alt={`${getText(projects.name)} icon`}
              width={128}
              height={128}
              className='size-20'
            />
          )}

          <p className='font-semibold'>{getText(projects.subtitle)}</p>
        </div>

        <div className='space-y-3'>
          <p className='leading-7 text-gray-800'>
            {getText(projects.description)}
          </p>
        </div>
        <div className='flex flex-wrap gap-2 sm:gap-3'>
          {projects.techStack &&
            projects.techStack.map((icon: TechStack, idx: number) => (
              <Icon
                key={idx}
                tooltipLabel={icon.label}
                src={icon.techIcon}
                size={18}
                className='rounded-full border border-white/10 bg-gray-900/10 p-0.5 sm:bg-gray-900/20 sm:p-1'
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export const ProjectInfo = WindowWrapper(ProjectInfoWindow, 'projectInfo');
